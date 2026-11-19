// Struktur ILUSTRASI BUATAN untuk bagian yang tidak ada di BodyParts3D
// (perikardium, ligamentum, saraf perifer, sebagian pembuluh).
// Bentuknya dibuat sendiri, tetapi letaknya dihitung dari mesh asli (titik acuan),
// supaya posisinya masuk akal. Di website & video selalu diberi label "ilustrasi buatan".
//
// Setiap generator mengembalikan { id, name, system, pos: Float32Array, idx: Uint32Array, buatan: true, gaya }
// gaya: 'saraf' | 'arteri' | 'vena' | 'ligamen' | 'kantong'

import * as THREE from 'three'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'

const V = (a) => new THREE.Vector3(...a)

export function buatGenerator({ geometry }) {
  // ---------- utilitas berbasis mesh asli ----------
  const verts = (id) => { const g = geometry(id), out = []; for (let i = 0; i < g.pos.length; i += 3) out.push(new THREE.Vector3(g.pos[i], g.pos[i + 1], g.pos[i + 2])); return out }
  const centroidOf = (ids) => { const c = new THREE.Vector3(); let n = 0; for (const id of ids) for (const v of verts(id)) { c.add(v); n++ } return c.divideScalar(n) }
  const bbox = (ids) => { const b = new THREE.Box3(); for (const id of ids) for (const v of verts(id)) b.expandByPoint(v); return b }
  const meshObj = (ids) => {
    const grp = new THREE.Group()
    for (const id of ids) {
      const g = geometry(id), bg = new THREE.BufferGeometry()
      bg.setAttribute('position', new THREE.BufferAttribute(g.pos, 3)); bg.setIndex(new THREE.BufferAttribute(g.idx, 1))
      grp.add(new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })))
    }
    grp.updateMatrixWorld(true); return grp
  }
  const ray = new THREE.Raycaster()
  // titik tembus terjauh / terdekat sepanjang sinar dari `from` ke arah `dir`
  const hit = (ids, from, dir, terjauh = true) => {
    ray.set(V(from), V(dir).normalize()); ray.far = 1
    const h = ray.intersectObject(meshObj(ids), true)
    if (!h.length) throw new Error(`sinar tidak mengenai ${ids}`)
    return (terjauh ? h[h.length - 1] : h[0]).point.clone()
  }
  // titik permukaan mesh terdekat ke titik p
  const nearest = (ids, p) => { let best = null, d = Infinity; for (const id of ids) for (const v of verts(id)) { const dd = v.distanceTo(p); if (dd < d) { d = dd; best = v } } return best.clone() }
  // titik-titik vertex mesh pada ketinggian y tertentu (±tol), rata-ratanya
  const pusatPadaY = (ids, y, tol = 0.004) => { const c = new THREE.Vector3(); let n = 0; for (const id of ids) for (const v of verts(id)) if (Math.abs(v.y - y) < tol) { c.add(v); n++ } if (!n) throw new Error(`tidak ada vertex ${ids} di y=${y}`); return c.divideScalar(n) }

  // ---------- pembuat geometri ----------
  const fromThree = (g, meta) => {
    const ng = g.index ? g : g.toNonIndexed()
    if (!ng.index) { const n = ng.attributes.position.count; ng.setIndex([...Array(n).keys()]) }
    return { ...meta, buatan: true, pos: Float32Array.from(ng.attributes.position.array), idx: Uint32Array.from(ng.index.array) }
  }
  const tabung = (titik, r, meta, seg = 80) => {
    const kurva = new THREE.CatmullRomCurve3(titik.map((p) => p.clone()), false, 'centripetal')
    return fromThree(new THREE.TubeGeometry(kurva, seg, r, 10, false), meta)
  }
  const geser = (titik, offset) => titik.map((p) => p.clone().add(V(offset)))

  // ---------- titik-titik acuan Praktikum 1 (semua dari mesh asli) ----------
  const DINDING = ['FJ2439', 'FJ2438', 'FJ2428']
  let _kantong = null
  const kantong = () => {
    if (_kantong) return _kantong
    // Titik dinding jantung + pangkal pembuluh besar yang berada di dalam perikardium.
    const pts = []
    for (const id of DINDING) pts.push(...verts(id))
    pts.push(...verts('FJ3413').filter((v) => v.y < 1.356))           // aorta ascendens (sampai sebelum arcus)
    pts.push(...verts('FJ2966').filter((v) => v.y < 1.364))           // truncus pulmonalis (sampai sebelum bifurkasio)
    pts.push(...verts('FJ3645').filter((v) => v.y < 1.372))           // separuh bawah VCS
    const la = verts('FJ2438')
    for (const id of ['FJ3020', 'FJ3040', 'FJ2925', 'FJ2933', 'FJ2944', 'FJ2950', 'FJ2955'])   // muara vv. pulmonales
      pts.push(...verts(id).filter((v) => la.some((w) => w.distanceTo(v) < 0.012)))
    pts.push(...verts('FJ3441').filter((v) => v.y > 1.255))           // ujung VCI
    const c = centroidOf(DINDING)
    const besar = pts.map((p) => p.clone().add(p.clone().sub(c).normalize().multiplyScalar(0.004)))  // 4 mm di luar jantung
    const g = new ConvexGeometry(besar)
    _kantong = fromThree(g, { id: 'X_PERIKARDIUM', name: 'Pericardium (ilustrasi buatan)', system: 'connective', gaya: 'kantong' })
    _kantong._obj = (() => { const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.BufferAttribute(_kantong.pos, 3)); bg.setIndex(new THREE.BufferAttribute(_kantong.idx, 1)); const m = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); m.updateMatrixWorld(true); return m })()
    return _kantong
  }
  // titik di permukaan luar kantong perikardium, dari pusat jantung ke arah dir
  const diKantong = (dir, dari, tambah = 0.0015) => {
    const k = kantong(); ray.set(dari.clone(), V(dir).normalize()); ray.far = 1
    const h = ray.intersectObject(k._obj, false); if (!h.length) throw new Error('kantong tidak kena')
    const p = h[h.length - 1].point; return p.add(V(dir).normalize().multiplyScalar(tambah))
  }
  const pusatJantung = () => centroidOf(DINDING)

  // N. phrenicus kanan: leher → antara a./v. subclavia → sisi lateral VCS & atrium kanan (di atas perikardium) → diafragma.
  const phrenicusKanan = () => {
    const ijv = centroidOf(['FJ3585'])
    const p0 = V([ijv.x - 0.010, 1.468, ijv.z - 0.008])
    const sa = centroidOf(['FJ3579']), sv = centroidOf(['FJ3587'])
    const p1 = V([-0.034, (sa.y + sv.y) / 2, (sa.z + sv.z) / 2])
    const vcs = centroidOf(['FJ3645'])
    const p2 = hit(['FJ3645'], vcs, [-1, 0, 0.1]).add(V([-0.005, 0, 0]))
    const ra = centroidOf(['FJ2439'])
    const p3 = diKantong([-1, 0, 0.15], V([ra.x, 1.315, ra.z]))
    const p4 = diKantong([-1, -0.35, 0.1], V([ra.x, 1.29, ra.z]))
    const p5 = hit(['FJ3131'], V([p4.x - 0.004, p4.y, p4.z]), [0, -1, 0], false)
    return [p0, p1, p2, p3, p4, p5]
  }
  // N. phrenicus kiri: leher → antara a./v. subclavia kiri → lateral arcus aortae → di atas ventrikel kiri → diafragma kiri.
  const phrenicusKiri = () => {
    const ijv = centroidOf(['FJ3485'])
    const p0 = V([ijv.x + 0.010, 1.466, ijv.z - 0.008])
    const sa = centroidOf(['FJ3479']), sv = centroidOf(['FJ3486'])
    const p1 = V([0.036, (sa.y + sv.y) / 2, (sa.z + sv.z) / 2])
    const arc = centroidOf(['FJ3411'])
    const p2 = hit(['FJ3411'], arc, [1, 0.1, 0.35]).add(V([0.005, 0, 0.002]))
    const lv = centroidOf(['FJ2422'])
    const p3 = diKantong([1, 0.1, 0.25], V([lv.x, 1.32, lv.z]))
    const p4 = diKantong([1, -0.3, 0.3], V([lv.x, 1.29, lv.z]))
    const p5 = hit(['FJ3131'], V([p4.x + 0.004, p4.y, p4.z]), [0, -1, 0], false)
    return [p0, p1, p2, p3, p4, p5]
  }
  // N. vagus kiri: leher (di antara a. carotis communis & v. jugularis interna, di belakangnya) → di depan arcus
  // → di belakang radix pulmonis sinistra → esofagus. N. laryngeus recurrens kiri melingkar di bawah arcus,
  // lateral dari lig. arteriosum, lalu naik di alur trakea–esofagus.
  const titikLig = () => {
    const arc = verts('FJ3411'), lpa = verts('FJ2924')
    let best = Infinity, a = null, b = null
    for (const p of lpa) for (const q of arc) { const d = p.distanceTo(q); if (d < best) { best = d; a = q; b = p } }
    return { arc: a.clone(), lpa: b.clone() }
  }
  const vagusKiri = () => {
    const cca = centroidOf(['FJ3483']), ijv = centroidOf(['FJ3485'])
    const p0 = V([(cca.x + ijv.x) / 2, 1.455, Math.min(cca.z, ijv.z) - 0.006])
    const arc = centroidOf(['FJ3411'])
    const p1 = hit(['FJ3411'], arc, [1, 0.35, 0.45]).add(V([0.003, 0.002, 0.002]))
    const { arc: la } = titikLig()
    const p2 = V([la.x + 0.010, la.y - 0.004, la.z - 0.004])
    const br = centroidOf(['FJ2450'])
    const p3 = V([br.x - 0.004, br.y - 0.012, br.z - 0.012])
    const es = pusatPadaY(['FJ2563'], 1.25, 0.006)
    const p4 = V([es.x + 0.004, 1.25, es.z + 0.007])
    const p5 = V([es.x + 0.002, 1.20, es.z + 0.006])
    return [p0, p1, p2, p3, p4, p5]
  }
  const recurrensKiri = () => {
    const v = vagusKiri(), { arc: la } = titikLig()
    const bawah = bbox(['FJ3411']).min.y
    const q0 = v[2].clone()
    const q1 = V([la.x + 0.006, bawah - 0.004, la.z - 0.010])
    const q2 = V([la.x - 0.004, bawah - 0.002, la.z - 0.020])
    const tr = pusatPadaY(['FJ2541'], 1.40, 0.006), es = pusatPadaY(['FJ2563'], 1.40, 0.008)
    const q3 = V([(tr.x + es.x) / 2 + 0.008, 1.40, (tr.z + es.z) / 2])
    const tr2 = pusatPadaY(['FJ2541'], 1.46, 0.006), es2 = pusatPadaY(['FJ2563'], 1.46, 0.008)
    const q4 = V([(tr2.x + es2.x) / 2 + 0.008, 1.46, (tr2.z + es2.z) / 2])
    return [q0, q1, q2, q3, q4]
  }


  // ---------- garis tengah pembuluh asli ----------
  // (1) principal curve: untuk arteri tanpa banyak cabang
  const garisTengah = (ids, n = 24, mulaiDekat = null) => {
    const pts = ids.flatMap(verts), c = pts.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(pts.length)
    let ax = new THREE.Vector3(1, 1, 1).normalize()
    for (let k = 0; k < 30; k++) { const nx = new THREE.Vector3(); for (const p of pts) { const d = p.clone().sub(c); nx.addScaledVector(d, d.dot(ax)) } ax = nx.normalize() }
    const urut = pts.map((p) => [p.clone().sub(c).dot(ax), p]).sort((a, b) => a[0] - b[0]).map((x) => x[1])
    let nodes = []
    for (let i = 0; i < n; i++) { const sl = urut.slice(Math.floor((i * urut.length) / n), Math.floor(((i + 1) * urut.length) / n)); nodes.push(sl.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(sl.length)) }
    for (let it = 0; it < 6; it++) {
      const sum = nodes.map(() => [new THREE.Vector3(), 0])
      for (const p of pts) { let bi = 0, bd = Infinity; nodes.forEach((q, i) => { const d = q.distanceToSquared(p); if (d < bd) { bd = d; bi = i } }); sum[bi][0].add(p); sum[bi][1]++ }
      nodes = nodes.map((q, i) => (sum[i][1] ? sum[i][0].divideScalar(sum[i][1]) : q))
      nodes = nodes.map((q, i) => (i === 0 || i === n - 1 ? q : q.clone().multiplyScalar(0.5).addScaledVector(nodes[i - 1], 0.25).addScaledVector(nodes[i + 1], 0.25)))
    }
    const balik = mulaiDekat ? nodes.at(-1).distanceTo(mulaiDekat) < nodes[0].distanceTo(mulaiDekat) : nodes.at(-1).y > nodes[0].y
    return balik ? nodes.reverse() : nodes
  }
  // (2) pelacakan per ketinggian: untuk vena panjang yang mesh-nya ikut memuat cabang
  const lacak = (ids, mulai, langkah = 0.01) => {
    const pts = ids.flatMap(verts), yMax = Math.max(...pts.map((p) => p.y)), yMin = Math.min(...pts.map((p) => p.y))
    const out = []; let prev = mulai ? mulai.clone() : null
    for (let y = yMax; y > yMin; y -= langkah) {
      const bin = pts.filter((p) => p.y <= y && p.y > y - langkah); if (!bin.length) continue
      if (!prev) prev = bin.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(bin.length)
      const dxz = (p) => Math.hypot(p.x - prev.x, p.z - prev.z)
      const dmin = Math.min(...bin.map(dxz)); if (dmin > 0.03) continue
      const dekat = bin.filter((p) => dxz(p) < dmin + 0.008)
      prev = dekat.reduce((a, p) => a.add(p), new THREE.Vector3()).divideScalar(dekat.length); out.push(prev.clone())
    }
    return haluskan(out)
  }
  const haluskan = (t, k = 2) => t.map((p, i) => { const s = t.slice(Math.max(0, i - k), i + k + 1); return s.reduce((a, q) => a.add(q), new THREE.Vector3()).divideScalar(s.length) })
  const potong = (t, a, b) => t.slice(Math.round(a * (t.length - 1)), Math.round(b * (t.length - 1)) + 1)
  const titikT = (t, u) => { const kurva = new THREE.CatmullRomCurve3(t); return kurva.getPointAt(Math.min(1, Math.max(0, u))) }
  const ujungArah = (ids, dir, yMaks = Infinity, yMin = -Infinity) => {    // vertex paling jauh ke arah dir (opsional dibatasi y)
    let best = null, bs = -Infinity; const d = V(dir).normalize()
    for (const id of ids) for (const v of verts(id)) if (v.y <= yMaks && v.y >= yMin) { const s = v.dot(d); if (s > bs) { bs = s; best = v } }
    return best.clone()
  }
  const gabung = (...gs) => {   // satukan beberapa tabung jadi satu mesh
    let n = 0; const pos = [], idx = []
    for (const g of gs) { pos.push(...g.pos); for (const i of g.idx) idx.push(i + n); n += g.pos.length / 3 }
    return { ...gs[0], pos: Float32Array.from(pos), idx: Uint32Array.from(idx) }
  }
  const M = (id, name, system, gaya) => ({ id, name: `${name} (ilustrasi buatan)`, system, gaya })


  const jalurThorSup = () => { const ax = garisTengah(['FJ2268'], 16, V([-0.077, 1.41, 0])), a = titikT(ax, 0.12); return [a, a.clone().add(V([0.005, -0.012, 0.008])), a.clone().add(V([0.012, -0.03, 0.012]))] }
  const jalurThorAcr = () => {
    const ax = garisTengah(['FJ2268'], 16, V([-0.077, 1.41, 0])), a = titikT(ax, 0.4), t = a.clone().add(V([0, 0.004, 0.013]))
    const akromion = ujungArah(['FJ3384'], [-1, 1, 0.4])
    return [[a, a.clone().lerp(t, 0.5), t],
      [t, t.clone().lerp(akromion, 0.5).add(V([0, 0.004, 0.01])), t.clone().lerp(akromion, 0.85)],   // r. acromialis
      [t, t.clone().add(V([-0.02, -0.02, 0.012])), t.clone().add(V([-0.035, -0.045, 0.012]))],         // r. deltoideus
      [t, t.clone().add(V([0.015, -0.02, 0.014])), t.clone().add(V([0.03, -0.045, 0.016]))],           // r. pectoralis
      [t, t.clone().add(V([0.012, 0.012, 0.006])), t.clone().add(V([0.025, 0.02, 0.004]))]]            // r. clavicularis
  }

  const polaM = () => {
    const ma = garisTengah(['FJ2286'], 14), puncak = titikT(ma, 0.08)          // ujung atas v. mediana antebrachii
    const cephY = nearest(['FJ2272'], puncak), basY = nearest(['FJ2270'], puncak)
    const garpu = cephY.clone().lerp(basY, 0.5); garpu.y = puncak.y + 0.008; garpu.z = Math.max(cephY.z, basY.z) + 0.002
    const ceph = nearest(['FJ2272'], garpu.clone().add(V([-0.03, 0.035, 0]))), bas = nearest(['FJ2270'], garpu.clone().add(V([0.03, 0.035, 0])))
    return { garpu, ceph, bas, puncak }
  }
  const GEN = {
    X_PERIKARDIUM: () => kantong(),
    // Di BodyParts3D arcus aortae dan a. pulmonalis sinistra hampir menempel (±0,6 mm), jadi ligamentum
    // digambar sebagai pita yang menjembatani keduanya di sisi kiri titik kontak, sedikit menonjol supaya terlihat.
    X_LIG_ARTERIOSUM: () => {
      const { arc, lpa } = titikLig(), c = arc.clone().add(lpa).multiplyScalar(0.5)
      return tabung([c.clone().add(V([0.0, 0.008, 0.001])), c.clone().add(V([0.006, 0.003, 0.002])), c.clone().add(V([0.006, -0.003, 0.002])), c.clone().add(V([0.0, -0.008, 0.001]))], 0.003,
        { id: 'X_LIG_ARTERIOSUM', name: 'Ligamentum arteriosum (ilustrasi buatan)', system: 'connective', gaya: 'ligamen' }, 24)
    },
    X_N_PHRENICUS_D: () => tabung(phrenicusKanan(), 0.0014, { id: 'X_N_PHRENICUS_D', name: 'N. phrenicus dexter (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),
    X_N_PHRENICUS_S: () => tabung(phrenicusKiri(), 0.0014, { id: 'X_N_PHRENICUS_S', name: 'N. phrenicus sinister (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),
    // a./v. pericardiacophrenica: menyertai n. phrenicus (mulai setinggi a. thoracica interna), sedikit di depan/belakangnya
    X_A_PCP_D: () => tabung(geser(phrenicusKanan().slice(2), [0, 0, 0.0036]), 0.0010, { id: 'X_A_PCP_D', name: 'A. pericardiacophrenica dextra (ilustrasi buatan)', system: 'arterial', gaya: 'arteri' }),
    X_V_PCP_D: () => tabung(geser(phrenicusKanan().slice(2), [0, 0, -0.0036]), 0.0011, { id: 'X_V_PCP_D', name: 'V. pericardiacophrenica dextra (ilustrasi buatan)', system: 'venous', gaya: 'vena' }),
    X_A_PCP_S: () => tabung(geser(phrenicusKiri().slice(2), [0, 0, 0.0036]), 0.0010, { id: 'X_A_PCP_S', name: 'A. pericardiacophrenica sinistra (ilustrasi buatan)', system: 'arterial', gaya: 'arteri' }),
    X_V_PCP_S: () => tabung(geser(phrenicusKiri().slice(2), [0, 0, -0.0036]), 0.0011, { id: 'X_V_PCP_S', name: 'V. pericardiacophrenica sinistra (ilustrasi buatan)', system: 'venous', gaya: 'vena' }),
    X_N_VAGUS_S: () => tabung(vagusKiri(), 0.0016, { id: 'X_N_VAGUS_S', name: 'N. vagus sinister (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),
    X_N_RECURRENS_S: () => tabung(recurrensKiri(), 0.0011, { id: 'X_N_RECURRENS_S', name: 'N. laryngeus recurrens sinister (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),

    // ===================== PRAKTIKUM 2 (ekstremitas superior kanan + leher) =====================
    // Kanan pasien = −x; medial (ke garis tengah) = +x; anterior = +z.
    X_A_CAROTIS_EXT: () => {
      const cca = garisTengah(['FJ3564'], 12), bif = cca[0].clone()   // ujung atas a. carotis communis = percabangan
      return tabung([bif, bif.clone().add(V([0.003, 0.018, 0.009])), bif.clone().add(V([0.001, 0.042, 0.016])), bif.clone().add(V([-0.006, 0.068, 0.018]))], 0.0022,
        M('X_A_CAROTIS_EXT', 'A. carotis externa dextra', 'arterial', 'arteri'))
    },
    X_V_JUG_EXT: () => {
      const angulus = ujungArah(['FJ3289'], [-1, -0.9, -0.4]).add(V([-0.004, -0.004, -0.002]))   // angulus mandibulae kanan
      const sv = garisTengah(['FJ3587'], 12, V([-0.02, 1.42, 0.02])), lat = titikT(sv, 0.7).add(V([0, 0.004, 0.002]))
      const tengah = angulus.clone().lerp(lat, 0.5).add(V([-0.012, 0, 0.008]))                      // menyilang permukaan m. sternocleidomastoideus
      return tabung([angulus, tengah, lat], 0.0022, M('X_V_JUG_EXT', 'V. jugularis externa dextra', 'venous', 'vena'))
    },
    X_A_THORACICA_SUP: () => tabung(jalurThorSup(), 0.0011, M('X_A_THORACICA_SUP', 'A. thoracica superior', 'arterial', 'arteri')),
    X_V_THORACICA_SUP: () => tabung(geser(jalurThorSup(), [0, -0.003, -0.002]), 0.0012, M('X_V_THORACICA_SUP', 'V. thoracica superior', 'venous', 'vena')),
    X_A_THORACOACROMIALIS: () => { const m = M('X_A_THORACOACROMIALIS', 'A. thoracoacromialis', 'arterial', 'arteri'); return gabung(...jalurThorAcr().map((c, i) => tabung(c, i ? 0.0011 : 0.0016, m))) },
    X_V_THORACOACROMIALIS: () => { const m = M('X_V_THORACOACROMIALIS', 'V. thoracoacromialis', 'venous', 'vena'); return gabung(...jalurThorAcr().map((c, i) => tabung(geser(c, [0, -0.0028, -0.002]), i ? 0.0012 : 0.0017, m))) },
    X_V_CX_HUMERI_POST: () => tabung(geser(garisTengah(['FJ2291', 'FJ2292'], 14, V([-0.14, 1.37, -0.02])), [0, -0.0028, 0]), 0.0013, M('X_V_CX_HUMERI_POST', 'V. circumflexa humeri posterior', 'venous', 'vena')),
    X_V_PROFUNDA_BRACHII: () => tabung(geser(garisTengah(['FJ2277'], 14), [0.0025, 0, -0.002]), 0.0014, M('X_V_PROFUNDA_BRACHII', 'V. profunda brachii', 'venous', 'vena')),
    // Variasi pola "M": v. mediana antebrachii bercabang dua DI TENGAH fossa cubiti,
    // cabang lateral ke v. cephalica, cabang medial ke v. basilica.
    X_V_MEDIANA_CEPHALICA: () => { const { garpu, ceph } = polaM(); return tabung([garpu, garpu.clone().lerp(ceph, 0.5).add(V([0, 0.004, 0.003])), ceph], 0.0017, M('X_V_MEDIANA_CEPHALICA', 'V. mediana cephalica (variasi pola "M")', 'venous', 'vena')) },
    X_V_MEDIANA_BASILICA: () => { const { garpu, bas, puncak } = polaM(); return tabung([puncak, garpu, garpu.clone().lerp(bas, 0.5).add(V([0, 0.004, 0.003])), bas], 0.0017, M('X_V_MEDIANA_BASILICA', 'V. mediana basilica (variasi pola "M")', 'venous', 'vena')) },
    // --- saraf lengan kanan ---
    X_N_AXILLARIS: () => {
      const ax = garisTengah(['FJ2268'], 16, V([-0.077, 1.41, 0])), mulai = titikT(ax, 0.8).add(V([0, -0.004, -0.009]))
      const pcha = garisTengah(['FJ2291', 'FJ2292'], 14, mulai)
      return tabung([mulai, ...geser(pcha, [0, 0.003, -0.002])], 0.0016, M('X_N_AXILLARIS', 'N. axillaris', 'nervous', 'saraf'))
    },
    X_N_RADIALIS: () => {
      const ax = garisTengah(['FJ2268'], 16, V([-0.077, 1.41, 0])), mulai = titikT(ax, 1).add(V([0, 0, -0.008]))
      const pb = garisTengah(['FJ2277'], 14)
      const epiLat = ujungArah(['FJ3368'], [-1, 0, 0.3], 1.16).add(V([0.006, 0.01, 0.012]))
      const ra = garisTengah(['FJ2294'], 18)
      return tabung([mulai, ...geser(pb, [0.003, 0.002, -0.002]), epiLat, ...geser(potong(ra, 0.05, 0.7), [-0.006, 0, 0.002])], 0.0018, M('X_N_RADIALIS', 'N. radialis', 'nervous', 'saraf'))
    },
    X_N_MEDIANUS: () => {
      const ax = garisTengah(['FJ2268'], 16, V([-0.077, 1.41, 0])), br = garisTengah(['FJ2271'], 18)
      const lengan = br.map((p, i) => { const u = i / (br.length - 1); return p.clone().add(V([u < 0.45 ? -0.005 : 0.006 * Math.min(1, (u - 0.45) / 0.3), 0, 0.002])) })
      const rad = ujungArah(['FJ3349'], [0, -1, 0]), uln = ujungArah(['FJ3391'], [0, -1, 0])
      const pergelangan = rad.clone().lerp(uln, 0.5).add(V([0, 0.02, 0.012]))
      const kapitatum = centroidOf(['FJ3361']).add(V([0, 0, 0.012]))
      const siku = lengan.at(-1).clone().add(V([0.004, -0.03, 0]))
      return tabung([titikT(ax, 0.85).add(V([-0.004, 0, 0.004])), ...lengan, siku, siku.clone().lerp(pergelangan, 0.5).add(V([0, 0, -0.004])), pergelangan, kapitatum], 0.0019, M('X_N_MEDIANUS', 'N. medianus', 'nervous', 'saraf'))
    },
    X_N_ULNARIS: () => {
      const ax = garisTengah(['FJ2268'], 16, V([-0.077, 1.41, 0])), br = garisTengah(['FJ2271'], 18)
      const epiMed = ujungArah(['FJ3368'], [1, 0, -0.2], 1.16).add(V([0.002, 0, -0.008]))   // di belakang epicondylus medialis
      const ul = garisTengah(['FJ2310'], 18)
      const pisi = centroidOf(['FJ3382']).add(V([-0.005, 0.004, 0.004]))
      return tabung([titikT(ax, 0.85).add(V([0.006, 0, -0.004])), ...geser(potong(br, 0, 0.55), [0.012, 0, -0.008]), epiMed, ...geser(potong(ul, 0.35, 0.95), [0.005, 0, -0.002]), pisi], 0.0018, M('X_N_ULNARIS', 'N. ulnaris', 'nervous', 'saraf'))
    },

    // ===================== PRAKTIKUM 3 (ekstremitas inferior kanan) =====================
    // pembuluh yang hilang: mengikuti vena pendampingnya yang ADA di model
    X_A_GLUTEA_SUP: () => tabung(geser(garisTengah(['FJ3616'], 14), [0, 0.0025, 0.002]), 0.0018, M('X_A_GLUTEA_SUP', 'A. glutea superior', 'arterial', 'arteri')),
    X_A_GLUTEA_INF: () => tabung(geser(garisTengah(['FJ3606'], 16), [0, 0.0025, 0.002]), 0.0016, M('X_A_GLUTEA_INF', 'A. glutea inferior', 'arterial', 'arteri')),
    X_A_PUDENDA_INT: () => tabung(geser(garisTengah(['FJ3610'], 16), [0, 0.0025, 0.002]), 0.0014, M('X_A_PUDENDA_INT', 'A. pudenda interna', 'arterial', 'arteri')),
    X_A_CX_FEM_MED: () => {
      const fa = garisTengah(['FJ2143'], 18), asal = titikT(fa, 0.12)
      const v = garisTengah(['FJ2202'], 10, asal)
      return tabung([asal, ...geser(v, [0, 0.0025, 0.002])], 0.0016, M('X_A_CX_FEM_MED', 'A. circumflexa femoris medialis', 'arterial', 'arteri'))
    },
    X_A_FIBULARIS: () => {
      const pt = garisTengah(['FJ2172'], 18), asal = titikT(pt, 0.08)
      const v = lacak(['FJ2200'], asal.clone().add(V([-0.01, -0.01, 0])))
      return tabung([asal, ...geser(v, [0.0025, 0, 0.0015])], 0.0016, M('X_A_FIBULARIS', 'A. fibularis', 'arterial', 'arteri'))
    },
    X_A_PROFUNDA_FEM: () => {
      const fa = garisTengah(['FJ2143'], 18), asal = titikT(fa, 0.11)
      const perf = garisTengah(['FJ2203'], 10)
      const p1 = asal.clone().add(V([-0.006, -0.015, -0.012]))
      return tabung([asal, p1, perf[0].clone().add(V([0.004, 0.02, 0.004])), ...perf], 0.0026, M('X_A_PROFUNDA_FEM', 'A. profunda femoris (batang)', 'arterial', 'arteri'))
    },
    X_A_CX_ILIUM_SUP: () => {
      const fa = garisTengah(['FJ2143'], 18), a = titikT(fa, 0.03), sias = ujungArah(['FJ3152'], [-1, 0.6, 1])
      return tabung([a, a.clone().lerp(sias, 0.4).add(V([0, 0, 0.008])), a.clone().lerp(sias, 0.75).add(V([0, 0, 0.008]))], 0.001, M('X_A_CX_ILIUM_SUP', 'A. circumflexa ilium superficialis', 'arterial', 'arteri'))
    },
    X_AA_PUDENDAE_EXT: () => {
      const fa = garisTengah(['FJ2143'], 18), a = titikT(fa, 0.05), pubis = ujungArah(['FJ3152'], [1, 0.1, 1])
      const meta = M('X_AA_PUDENDAE_EXT', 'Aa. pudendae externae', 'arterial', 'arteri')
      return gabung(tabung([a, a.clone().lerp(pubis, 0.5).add(V([0, 0, 0.006])), a.clone().lerp(pubis, 0.85).add(V([0, -0.004, 0.006]))], 0.001, meta),
                    tabung([titikT(fa, 0.08), titikT(fa, 0.08).lerp(pubis, 0.45).add(V([0, -0.01, 0])), titikT(fa, 0.08).lerp(pubis, 0.8).add(V([0, -0.02, 0]))], 0.001, meta))
    },
    // --- saraf tungkai kanan ---
    X_N_FEMORALIS: () => {
      const fa = garisTengah(['FJ2143'], 18), atas = titikT(fa, 0)
      const psoas = ujungArah(['FJ1431'], [-1, 0, 0], atas.y + 0.06, atas.y + 0.03)
      return tabung([psoas.add(V([-0.004, 0, 0])), atas.clone().add(V([-0.013, 0.015, 0])), ...geser(potong(fa, 0, 0.2), [-0.012, 0, 0.002])], 0.0028, M('X_N_FEMORALIS', 'N. femoralis', 'nervous', 'saraf'))
    },
    X_N_SAPHENUS: () => {
      const fa = garisTengah(['FJ2143'], 18)
      const gsv = lacak(['FJ2145'], null)
      const lutut = gsv.filter((p) => p.y < 0.46)
      return tabung([...geser(potong(fa, 0.18, 1), [0.004, 0, 0.004]), ...geser(lutut, [-0.003, 0, 0.002])], 0.0011, M('X_N_SAPHENUS', 'N. saphenus', 'nervous', 'saraf'))
    },
    X_N_ISCHIADICUS: () => {
      const vgi = garisTengah(['FJ3606'], 16), keluar = vgi[Math.round(vgi.length * 0.35)].clone().add(V([-0.016, -0.004, -0.004]))
      const fem = ['FJ3365'], belakang = (y) => { const p = ujungArah(fem, [0.2, 0, -1], y + 0.01, y - 0.01); return p.add(V([0.004, 0, -0.016])) }
      return tabung([keluar, belakang(0.82), belakang(0.72), belakang(0.62), belakang(0.55)], 0.004, M('X_N_ISCHIADICUS', 'N. ischiadicus', 'nervous', 'saraf'))
    },
    X_N_TIBIALIS: () => {
      const fem = ['FJ3365'], apex = ujungArah(fem, [0.2, 0, -1], 0.56, 0.54).add(V([0.004, 0, -0.016]))
      const pv = garisTengah(['FJ2171'], 16), pt = garisTengah(['FJ2172'], 18)
      const mm = ujungArah(['FJ3387'], [1, -0.3, -0.3]).add(V([0, 0.01, -0.012]))       // di belakang malleolus medialis
      return tabung([apex, ...geser(potong(pv, 0.15, 0.9), [0, 0, -0.006]), ...geser(potong(pt, 0.1, 0.9), [0.003, 0, -0.004]), mm], 0.0026, M('X_N_TIBIALIS', 'N. tibialis', 'nervous', 'saraf'))
    },
    X_N_FIBULARIS_COM: () => {
      const fem = ['FJ3365'], apex = ujungArah(fem, [0.2, 0, -1], 0.56, 0.54).add(V([0.004, 0, -0.016]))
      const kaputFib = ujungArah(['FJ3366'], [0, 1, 0]), leher = ujungArah(['FJ3366'], [-1, 0, 0.3], kaputFib.y - 0.03, kaputFib.y - 0.045).add(V([-0.004, 0, 0]))
      const at = garisTengah(['FJ2130'], 18)
      return tabung([apex, apex.clone().lerp(leher, 0.5).add(V([-0.01, 0, -0.006])), leher, leher.clone().add(V([0, -0.01, 0.01])), ...geser(potong(at, 0.08, 1), [-0.003, 0, 0.002])], 0.0021, M('X_N_FIBULARIS_COM', 'N. fibularis communis & n. fibularis profundus', 'nervous', 'saraf'))
    },
    X_N_SURALIS: () => {
      const ssv = lacak(['FJ2176'], null)
      return tabung(geser(ssv.filter((p) => p.y < 0.36), [-0.003, 0, -0.002]), 0.0011, M('X_N_SURALIS', 'N. suralis', 'nervous', 'saraf'))
    },
    X_N_GLUTEUS_SUP: () => tabung(geser(garisTengah(['FJ3616'], 14), [0, -0.003, -0.002]), 0.0016, M('X_N_GLUTEUS_SUP', 'N. gluteus superior', 'nervous', 'saraf')),
    X_N_PUDENDUS: () => tabung(geser(garisTengah(['FJ3610'], 16), [0.003, 0, -0.002]), 0.0014, M('X_N_PUDENDUS', 'N. pudendus', 'nervous', 'saraf')),
  }
  const cache = new Map()
  return (id) => {
    if (!GEN[id]) return null
    if (!cache.has(id)) { const g = { ...GEN[id]() }; delete g._obj; cache.set(id, g) }
    return cache.get(id)
  }
}
