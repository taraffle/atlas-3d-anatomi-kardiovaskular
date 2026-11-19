// Preprocessing: ambil HANYA mesh yang dipakai tiap praktikum dari @dagno/anatomy-model,
// lalu kemas jadi satu file biner terkompres per praktikum.
//
// Input : content/praktikum-*.json  (materi + daftar mesh)
// Output: public/data/praktikum-N.bin   (gzip: posisi int16 terkuantisasi + indeks uint16)
//         public/data/praktikum-N.json  (tabel mesh, kuantisasi, landmark, materi)
//         public/data/index.json        (daftar praktikum untuk halaman utama)
//
// Jalankan: npm run data

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { gunzipSync, gzipSync, constants } from 'node:zlib'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { buatGenerator } from './buatan.mjs'

const require = createRequire(import.meta.url)
const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const MODEL_DIR = dirname(require.resolve('@dagno/anatomy-model/model/atlas.json'))
const atlas = JSON.parse(readFileSync(join(MODEL_DIR, 'atlas.json'), 'utf8'))
const PARTS = new Map(atlas.parts.map((p) => [p.id, p]))
const OUT = join(ROOT, 'public', 'data')
mkdirSync(OUT, { recursive: true })

// ---------- membaca geometri asli ----------
const chunkCache = new Map()
function chunk(i) {
  if (!chunkCache.has(i)) {
    const c = atlas.chunks[i]
    const buf = gunzipSync(readFileSync(join(MODEL_DIR, c.gzip)))
    if (buf.length !== c.bytes) throw new Error(`chunk ${i}: ukuran ${buf.length} != ${c.bytes}`)
    chunkCache.set(i, buf)
  }
  return chunkCache.get(i)
}

const geomCache = new Map()
function geometry(id) {
  if (geomCache.has(id)) return geomCache.get(id)
  const p = PARTS.get(id)
  if (!p) throw new Error(`Mesh ${id} tidak ada di atlas.json`)
  const buf = chunk(p.chunk)
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  // positions: float32 xyz, indices: uint32 (offset byte dari atlas.json)
  const pos = new Float32Array(ab, p.positions, p.vertexCount * 3).slice()
  const idx = new Uint32Array(ab, p.indices, p.indexCount).slice()
  const g = { id, name: p.name, system: p.system, pos, idx }
  geomCache.set(id, g)
  return g
}

// ---------- utilitas geometri ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a) => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l] }
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const vtx = (g, i) => [g.pos[i * 3], g.pos[i * 3 + 1], g.pos[i * 3 + 2]]

function centroid(geoms) {
  let s = [0, 0, 0], n = 0
  for (const g of geoms) for (let i = 0; i < g.pos.length / 3; i++) { s = add(s, vtx(g, i)); n++ }
  return scale(s, 1 / n)
}

// Titik sampel permukaan (verteks + titik tengah sisi + centroid segitiga) supaya jarak "terdekat" lebih rapat.
function surfaceSamples(g) {
  const pts = []
  for (let i = 0; i < g.pos.length / 3; i++) pts.push(vtx(g, i))
  for (let t = 0; t < g.idx.length; t += 3) {
    const a = vtx(g, g.idx[t]), b = vtx(g, g.idx[t + 1]), c = vtx(g, g.idx[t + 2])
    pts.push(scale(add(add(a, b), c), 1 / 3), scale(add(a, b), 0.5), scale(add(b, c), 0.5), scale(add(a, c), 0.5))
  }
  return pts
}

// Grid spasial sederhana untuk query jarak titik terdekat.
function makeGrid(points, cell = 0.004) {
  const map = new Map()
  const key = (x, y, z) => `${x},${y},${z}`
  for (const p of points) {
    const k = key(Math.floor(p[0] / cell), Math.floor(p[1] / cell), Math.floor(p[2] / cell))
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(p)
  }
  return {
    nearest(q, maxR = 0.08) {
      const cx = Math.floor(q[0] / cell), cy = Math.floor(q[1] / cell), cz = Math.floor(q[2] / cell)
      let best = Infinity, bestP = null
      for (let r = 0; r * cell <= maxR; r++) {
        for (let x = cx - r; x <= cx + r; x++) for (let y = cy - r; y <= cy + r; y++) for (let z = cz - r; z <= cz + r; z++) {
          if (Math.max(Math.abs(x - cx), Math.abs(y - cy), Math.abs(z - cz)) !== r) continue
          const list = map.get(key(x, y, z)); if (!list) continue
          for (const p of list) { const d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); if (d < best) { best = d; bestP = p } }
        }
        if (best <= r * cell) break
      }
      return { d: best, p: bestP }
    },
  }
}

// Ray-cast Möller–Trumbore; kembalikan titik tembus PALING LUAR (t terbesar).
function outermostHit(geoms, origin, dir) {
  let bestT = -1
  for (const g of geoms) {
    for (let t = 0; t < g.idx.length; t += 3) {
      const a = vtx(g, g.idx[t]), b = vtx(g, g.idx[t + 1]), c = vtx(g, g.idx[t + 2])
      const e1 = sub(b, a), e2 = sub(c, a), pv = cross(dir, e2), det = dot(e1, pv)
      if (Math.abs(det) < 1e-12) continue
      const inv = 1 / det, tv = sub(origin, a), u = dot(tv, pv) * inv
      if (u < 0 || u > 1) continue
      const qv = cross(tv, e1), v = dot(dir, qv) * inv
      if (v < 0 || u + v > 1) continue
      const tt = dot(e2, qv) * inv
      if (tt > bestT) bestT = tt
    }
  }
  if (bestT < 0) throw new Error('ray tidak mengenai mesh')
  return add(origin, scale(dir, bestT))
}

function extremeVertex(geoms, dir, from = [0, 0, 0]) {
  let best = -Infinity, bp = null
  for (const g of geoms) for (let i = 0; i < g.pos.length / 3; i++) {
    const v = vtx(g, i), s = dot(sub(v, from), dir)
    if (s > best) { best = s; bp = v }
  }
  return bp
}

function closestPairMidpoint(geomsA, geomsB) {
  const grid = makeGrid(geomsB.flatMap(surfaceSamples))
  let best = Infinity, mid = null
  for (const p of geomsA.flatMap(surfaceSamples)) {
    const { d, p: q } = grid.nearest(p, 0.05)
    if (q && d < best) { best = d; mid = scale(add(p, q), 0.5) }
  }
  return mid
}

// ---------- pembagian dinding ventrikel (FJ2428) ----------
// Dinding ventrikel kanan & kiri adalah SATU mesh di BodyParts3D. Segitiga dibagi berdasarkan
// rongga ventrikel terdekat (FJ2423 kanan, FJ2422 kiri). Ini PERKIRAAN, bukan batas anatomis dari data.
// Catatan: FJ2428 hanya cangkang luar, tidak ada lembaran septum di dalamnya, jadi septum TIDAK dibuat dari
// mesh ini (lihat landmark septumInterventriculare).
let ventSplit = null
function splitVentricles() {
  if (ventSplit) return ventSplit
  const wall = geometry('FJ2428')
  const gR = makeGrid(surfaceSamples(geometry('FJ2423')))
  const gL = makeGrid(surfaceSamples(geometry('FJ2422')))
  const buckets = { VENT_R: [], VENT_L: [] }, labels = []
  for (let t = 0; t < wall.idx.length; t += 3) {
    const c = scale(add(add(vtx(wall, wall.idx[t]), vtx(wall, wall.idx[t + 1])), vtx(wall, wall.idx[t + 2])), 1 / 3)
    const k = gR.nearest(c).d < gL.nearest(c).d ? 'VENT_R' : 'VENT_L'
    labels.push(k)
  }
  // Haluskan: tiap segitiga ikut label mayoritas tetangganya (berbagi verteks), 4 putaran.
  // Tanpa ini, daerah septum tampak berbintik-bintik.
  const nTri = wall.idx.length / 3, vt = new Map()
  for (let t = 0; t < nTri; t++) for (let j = 0; j < 3; j++) { const v = wall.idx[t * 3 + j]; if (!vt.has(v)) vt.set(v, []); vt.get(v).push(t) }
  for (let it = 0; it < 4; it++) {
    const next = labels.slice()
    for (let t = 0; t < nTri; t++) {
      const cnt = {}
      for (let j = 0; j < 3; j++) for (const n of vt.get(wall.idx[t * 3 + j])) cnt[labels[n]] = (cnt[labels[n]] || 0) + 1
      next[t] = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0]
    }
    labels.splice(0, nTri, ...next)
  }
  labels.forEach((k, t) => buckets[k].push(wall.idx[t * 3], wall.idx[t * 3 + 1], wall.idx[t * 3 + 2]))
  const names = {
    VENT_R: 'Wall of ventricle — bagian kanan (hasil pembagian)',
    VENT_L: 'Wall of ventricle — bagian kiri (hasil pembagian)',
  }
  ventSplit = {}
  for (const [k, tris] of Object.entries(buckets)) {
    const remap = new Map(), pos = []
    const idx = tris.map((i) => {
      if (!remap.has(i)) { remap.set(i, remap.size); pos.push(...vtx(wall, i)) }
      return remap.get(i)
    })
    ventSplit[k] = { id: k, name: names[k], system: 'cardiac', pos: new Float32Array(pos), idx: new Uint32Array(idx), derivedFrom: 'FJ2428' }
  }
  console.log(`  Pembagian FJ2428: kanan ${buckets.VENT_R.length / 3}, kiri ${buckets.VENT_L.length / 3} segitiga`)
  return ventSplit
}

let buatan = null
function getGeom(id) {
  if (id.startsWith('VENT_')) return splitVentricles()[id]
  if (id.startsWith('X_')) {
    buatan ||= buatGenerator({ geometry })
    const g = buatan(id); if (!g) throw new Error(`Struktur buatan ${id} tidak dikenal`)
    return g
  }
  return geometry(id)
}

// ---------- landmark (titik penanda perkiraan), dihitung dari geometri asli ----------
const LANDMARKS = {
  // Apex: titik dinding ventrikel paling jauh ke arah kiri-bawah-depan (arah umum sumbu jantung).
  apex: () => extremeVertex([geometry('FJ2428')], norm([0.45, -0.75, 0.45])),
  septumInterventriculare: () => closestPairMidpoint([geometry('FJ2423')], [geometry('FJ2422')]),
  faciesSternocostalis: () => outermostHit([geometry('FJ2428'), geometry('FJ2439'), geometry('FJ2438')], centroid([geometry('FJ2428')]), [0, 0, 1]),
  faciesDiaphragmatica: () => outermostHit([geometry('FJ2428')], centroid([geometry('FJ2428')]), [0, -1, 0]),
  basis: () => outermostHit([geometry('FJ2438')], centroid([geometry('FJ2438')]), [0, 0, -1]),
  margoDexter: () => outermostHit([geometry('FJ2439')], centroid([geometry('FJ2439')]), [-1, 0, 0]),
  margoSinister: () => outermostHit([geometry('FJ2428')], centroid([geometry('FJ2422')]), [1, 0, 0]),
  margoInferior: () => outermostHit([geometry('FJ2428')], centroid([geometry('FJ2423')]), norm([0, -1, 0.55])),
  sinusTransversus: () => closestPairMidpoint([geometry('FJ3413'), geometry('FJ2966')], [geometry('FJ2438')]),
  sinusObliquus: () => add(outermostHit([geometry('FJ2438')], centroid([geometry('FJ2425')]), [0, 0, -1]), [0, -0.006, -0.006]),
  ligArteriosum: () => closestPairMidpoint([geometry('FJ3411')], [geometry('FJ2924')]),
  auriculaDextra: () => extremeVertex([geometry('FJ2439')], norm([0.5, 0.35, 1]), centroid([geometry('FJ2439')])),
  auriculaSinistra: () => extremeVertex([geometry('FJ2438')], norm([0.8, 0.2, 1]), centroid([geometry('FJ2438')])),
  septumInteratriale: () => {
    const grid = makeGrid(surfaceSamples(geometry('FJ2438')))
    const ra = geometry('FJ2439'); let s = [0, 0, 0], n = 0
    for (let i = 0; i < ra.pos.length / 3; i++) { const v = vtx(ra, i); if (grid.nearest(v, 0.01).d < 0.003) { s = add(s, v); n++ } }
    if (!n) throw new Error('septum interatriale: tidak ada daerah kontak')
    return scale(s, 1 / n)
  },
  ostiumSinusCoronarii: () => closestPairMidpoint([geometry('FJ2655')], [geometry('FJ2424')]),
  // Venaseksi: bagian v. saphena magna kanan setinggi ujung bawah tibia (depan malleolus medialis).
  venaseksiSaphena: () => {
    const g = geometry('FJ2145'), tib = PARTS.get('FJ3387').bounds
    const yLo = tib[0][1], yHi = yLo + 0.035
    const pts = []
    for (let i = 0; i < g.pos.length / 3; i++) { const v = vtx(g, i); if (v[1] >= yLo && v[1] <= yHi) pts.push(v) }
    return scale(pts.reduce(add, [0, 0, 0]), 1 / pts.length)
  },
  ostiumAVDextrum: () => centroid(['FJ2421', 'FJ2433', 'FJ2436'].map(geometry)),
  ostiumAVSinistrum: () => centroid(['FJ2420', 'FJ2432'].map(geometry)),
}

// ---------- membangun satu praktikum ----------
function expand(list, sets) {
  const out = []
  for (const id of list || []) {
    if (id.startsWith('@')) {
      const s = sets[id.slice(1)]
      if (!s) throw new Error(`Set ${id} tidak didefinisikan`)
      out.push(...expand(s, sets))
    } else out.push(id)
  }
  return out
}

function buildPraktikum(file) {
  const content = JSON.parse(readFileSync(file, 'utf8'))
  const sets = content.set || {}
  console.log(`\nPraktikum ${content.id}: ${content.judul}`)

  // Tulang: dipilih lewat pola nama (regex) dari sistem skeletal.
  const boneRe = (content.tulangPola || []).map((s) => new RegExp(s))
  const bones = atlas.parts.filter((p) => p.system === 'skeletal' && boneRe.some((r) => r.test(p.name))).map((p) => p.id)

  // Semua mesh organ yang dipakai: set "scene" + mesh/konteks di tiap item & langkah orientasi.
  const ids = new Set(expand(content.scene, sets))
  const items = []
  for (const g of content.grup) for (const it of g.item) {
    it.mesh = expand(it.mesh, sets); it.konteks = expand(it.konteks, sets)
    it.mesh.forEach((i) => ids.add(i)); it.konteks.forEach((i) => ids.add(i))
    items.push(it)
  }
  for (const o of content.orientasi || []) {
    o.fokus = expand(o.fokus, sets); o.fokus.forEach((i) => ids.add(i))
  }
  // Jangan kirim FJ2428 utuh kalau sudah dipakai versi terbaginya.
  if ([...ids].some((i) => i.startsWith('VENT_'))) ids.delete('FJ2428')
  bones.forEach((b) => ids.add(b))

  // Validasi: praktikum yang hanya menampilkan satu sisi tidak boleh memuat mesh sisi lain.
  if (content.sisi) {
    const lawan = content.sisi === 'kanan' ? /\bleft\b/i : /\bright\b/i
    for (const id of ids) { const p = PARTS.get(id); if (p && lawan.test(p.name)) throw new Error(`${id} (${p.name}) bukan sisi ${content.sisi}`) }
  }
  // Validasi: setiap item status "ada" harus punya mesh.
  for (const it of items) {
    if (it.status === 'ada' && !it.mesh.length) throw new Error(`${it.key}: status "ada" tapi mesh kosong`)
    if (!['ada', 'terkait', 'ilustrasi', 'tidak-ada'].includes(it.status)) throw new Error(`${it.key}: status tidak dikenal`)
    if (it.pin && !LANDMARKS[it.pin]) throw new Error(`${it.key}: landmark ${it.pin} tidak dikenal`)
  }

  const geoms = [...ids].map(getGeom)
  for (const g of geoms) if (g.pos.length / 3 > 65535) throw new Error(`${g.id}: verteks > 65535, tidak muat uint16`)

  // Kuantisasi: satu bounding box untuk seluruh praktikum, int16.
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (const g of geoms) for (let i = 0; i < g.pos.length; i++) {
    const a = i % 3; if (g.pos[i] < min[a]) min[a] = g.pos[i]; if (g.pos[i] > max[a]) max[a] = g.pos[i]
  }
  const step = [0, 1, 2].map((a) => (max[a] - min[a]) / 65534 || 1e-6)

  const parts = [], buffers = []
  let offset = 0
  for (const g of geoms) {
    const n = g.pos.length / 3
    const q = new Int16Array(n * 3)
    const bmin = [Infinity, Infinity, Infinity], bmax = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < g.pos.length; i++) {
      const a = i % 3
      q[i] = Math.round((g.pos[i] - min[a]) / step[a]) - 32767
      bmin[a] = Math.min(bmin[a], g.pos[i]); bmax[a] = Math.max(bmax[a], g.pos[i])
    }
    const idx = Uint16Array.from(g.idx)
    parts.push({
      id: g.id, name: g.name, system: bones.includes(g.id) ? 'skeletal' : g.system,
      vertexCount: n, indexCount: idx.length, posOffset: offset, idxOffset: offset + q.byteLength,
      bounds: [bmin, bmax].map((v) => v.map((x) => +x.toFixed(5))),
      ...(g.derivedFrom ? { derivedFrom: g.derivedFrom } : {}),
      ...(g.buatan ? { buatan: true, gaya: g.gaya } : {}),
    })
    buffers.push(Buffer.from(q.buffer), Buffer.from(idx.buffer))
    offset += q.byteLength + idx.byteLength
  }
  const raw = Buffer.concat(buffers)
  const gz = gzipSync(raw, { level: constants.Z_BEST_COMPRESSION })

  const landmarks = {}
  for (const it of items) if (it.pin && !landmarks[it.pin]) landmarks[it.pin] = LANDMARKS[it.pin]().map((x) => +x.toFixed(5))

  const meta = {
    id: content.id, judul: content.judul, topik: content.topik, ikon: content.ikon || '📘',
    quant: { min, step }, parts, landmarks, bones,
    orientasi: content.orientasi, grup: content.grup, hanyaSaatDipilih: content.hanyaSaatDipilih || [],
    sumber: { paket: '@dagno/anatomy-model@0.1.2', model: atlas.version },
  }
  writeFileSync(join(OUT, `praktikum-${content.id}.bin`), gz)
  writeFileSync(join(OUT, `praktikum-${content.id}.json`), JSON.stringify(meta))
  const tri = parts.reduce((s, p) => s + p.indexCount / 3, 0)
  console.log(`  ${parts.length} mesh (${bones.length} tulang), ${tri.toLocaleString('id')} segitiga`)
  console.log(`  biner: ${(raw.length / 1e6).toFixed(2)} MB → gzip ${(gz.length / 1e6).toFixed(2)} MB`)
  if (gz.length > 2e6) console.warn('  PERINGATAN: lebih dari 2 MB')
  return { id: content.id, judul: content.judul, topik: content.topik, ikon: content.ikon || '📘', warna: content.warna || '#ff7a59', warnaLatar: content.warnaLatar || '#fff1e4', jumlahStruktur: items.length, ukuranMB: +(gz.length / 1e6).toFixed(2) }
}

const files = readdirSync(join(ROOT, 'content')).filter((f) => /^praktikum-\d+\.json$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)))
const index = files.map((f) => buildPraktikum(join(ROOT, 'content', f)))
writeFileSync(join(OUT, 'index.json'), JSON.stringify(index, null, 2))
console.log('\nSelesai.')
