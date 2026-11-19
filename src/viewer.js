import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { loadPraktikum } from './data.js'
import { attributionLine } from './attribution.js'
import { progres } from './progress.js'
import { pasangTombolTema } from './theme.js'
import { judulLengkap } from './situs.js'

const BASE = import.meta.env.BASE_URL
const params = new URLSearchParams(location.search)
const PID = params.get('p') || '1'

// ---------- konstanta tampilan ----------
const ARAH = {
  depan: [0, 0, 1], belakang: [0, 0, -1], kiri: [1, 0, 0], kanan: [-1, 0, 0],
  atas: [0, 1, -0.02], bawah: [0, -1, 0.02],
}
const ARAH_LABEL = { depan: 'Depan', belakang: 'Blkg', kiri: 'Kiri', kanan: 'Kanan', atas: 'Atas', bawah: 'Bawah' }
const ARAH_TITLE = { depan: 'Lihat dari depan', belakang: 'Lihat dari belakang', kiri: 'Lihat dari kiri pasien', kanan: 'Lihat dari kanan pasien', atas: 'Lihat dari atas', bawah: 'Lihat dari bawah' }
// Sumbu model: +x = kiri pasien, +y = kranial, +z = anterior.
const SUMBU = [
  { v: new THREE.Vector3(1, 0, 0), t: 'Kiri pasien' }, { v: new THREE.Vector3(-1, 0, 0), t: 'Kanan pasien' },
  { v: new THREE.Vector3(0, 1, 0), t: 'Kepala' }, { v: new THREE.Vector3(0, -1, 0), t: 'Kaki' },
  { v: new THREE.Vector3(0, 0, 1), t: 'Depan' }, { v: new THREE.Vector3(0, 0, -1), t: 'Belakang' },
]
const SUMBU_DARI = ['kiri pasien', 'kanan pasien', 'atas (kepala)', 'bawah (kaki)', 'depan', 'belakang']
// Radius minimum framing (meter): struktur kecil tetap terlihat bersama sekitarnya.
const MIN_RADIUS = 0.04
const TULANG = ['hilang', 'tembus', 'utuh']
const TULANG_LABEL = { hilang: 'Tulang: hilang', tembus: 'Tulang: tembus', utuh: 'Tulang: utuh' }
const WARNA = {
  arterial: 0xc8373b, venous: 0x3c63c4, cardiac: 0xc9786a, valve: 0xf0e3c2, muscular: 0xa9554b,
  skeletal: 0xe6dfcf, cavityL: 0xe0484d, cavityR: 0x4d78dc, other: 0xb9a48f, highlight: 0xffc21a, sorot: 0x2ee6d6, saraf: 0xd7e66a, ligamen: 0xd9cfbd, kantong: 0xe8c3a0,
}
// Pembuluh paru: arteri membawa darah miskin O2 (biru), vena kaya O2 (merah), sesuai konvensi atlas.
const PULMONAL_BIRU = new Set(['FJ2966', 'FJ3019', 'FJ2924'])
const PULMONAL_MERAH = new Set(['FJ3020', 'FJ3040', 'FJ2925', 'FJ2933', 'FJ2944', 'FJ2950', 'FJ2955'])
const DINDING_JANTUNG = new Set(['FJ2439', 'FJ2438', 'VENT_R', 'VENT_L', 'FJ2428'])

function baseColor(p) {
  if (p.gaya === 'saraf') return WARNA.saraf
  if (p.gaya === 'ligamen') return WARNA.ligamen
  if (p.gaya === 'kantong') return WARNA.kantong
  if (PULMONAL_BIRU.has(p.id)) return WARNA.venous
  if (PULMONAL_MERAH.has(p.id)) return WARNA.arterial
  if (p.system === 'skeletal') return WARNA.skeletal
  if (/^Cavity of left/.test(p.name)) return WARNA.cavityL
  if (/^Cavity of right/.test(p.name)) return WARNA.cavityR
  if (/cusp|leaflet/i.test(p.name)) return WARNA.valve
  if (p.system === 'arterial') return WARNA.arterial
  if (p.system === 'venous') return WARNA.venous
  if (p.system === 'cardiac') return WARNA.cardiac
  if (p.system === 'muscular') return WARNA.muscular
  return WARNA.other
}

// ---------- DOM ----------
const $ = (s) => document.querySelector(s)
document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <a class="icon-btn" href="${BASE}" aria-label="Kembali ke daftar praktikum">←</a>
    <div class="title"><div id="judul">Memuat…</div><div id="counter" class="muted"></div></div>
    <button class="icon-btn theme-btn" id="btn-tema"></button>
    <button class="icon-btn btn-kuis" id="btn-kuis" aria-label="Mode kuis">🎯 Kuis</button>
    <button class="icon-btn" id="btn-daftar" aria-label="Daftar struktur">☰</button>
    <div class="top-progress"><span id="top-progress"></span></div>
  </header>
  <div id="stage">
    <canvas id="c"></canvas>
    <div id="labels"></div>
    <div class="dir dir-top" id="dir-top"></div>
    <div class="dir dir-bottom" id="dir-bottom"></div>
    <div class="dir dir-left" id="dir-left"></div>
    <div class="dir dir-right" id="dir-right"></div>
    <div class="dir-from" id="dir-from"></div>
    <div class="attr-mini">Model: <a href="${BASE}atribusi.html">BodyParts3D, CC BY 4.0</a></div>
    <div class="toolbar">
      <div class="views" id="views"></div>
      <div class="toggles">
        <button id="btn-tulang" class="chip"></button>
        <button id="btn-dalam" class="chip">Lihat dalam</button>
      </div>
    </div>
    <div id="toast" class="toast" hidden></div>
    <div id="loading" class="loading"><div class="loading-emoji" id="loading-emoji">🩺</div><div class="loading-title">Menyiapkan model 3D…</div><div class="bar"><span id="bar"></span></div><div class="loading-tip" id="loading-tip"></div></div>
  </div>
  <section class="sheet" id="sheet">
    <button class="sheet-handle" id="sheet-handle" aria-label="Buka/tutup info"><span></span></button>
    <div id="quiz"></div>
    <div class="sheet-head">
      <span class="grup-chip" id="grup"></span>
      <h1 id="latin"></h1>
      <div id="indo" class="muted"></div>
      <div id="badge"></div>
    </div>
    <div class="nav">
      <button id="btn-prev" class="btn">◀ Kembali</button>
      <button id="btn-info" class="btn btn-ghost">Info</button>
      <button id="btn-next" class="btn btn-primary">Lanjut ▶</button>
    </div>
    <div class="sheet-body" id="body"></div>
    <footer class="attr small">${attributionLine(BASE)}</footer>
  </section>
  <div class="drawer" id="drawer" hidden>
    <div class="drawer-head"><div><strong>Daftar struktur</strong><div class="drawer-progress" id="drawer-progress"></div></div><button class="icon-btn" id="btn-tutup">✕</button></div>
    <div class="drawer-body" id="daftar"></div>
  </div>
  <div class="celebrate" id="celebrate" hidden><div class="celebrate-card" id="celebrate-card"></div></div>
`
const TIPS = [
  '💡 Ketuk struktur mana pun di model untuk langsung membuka materinya.',
  '💡 Coba tombol "Tulang: tembus" untuk membayangkan letak organ di cadaver.',
  '💡 Selesai menelusuri? Uji dirimu dengan 🎯 Kuis!',
  '💡 Label "Kiri pasien" di tepi layar ikut berputar bersama model. Nggak bakal ketukar kiri-kanan lagi.',
  '💡 Jawaban daftar tilik disembunyikan dulu. Coba jawab sendiri sebelum membuka.',
]
document.querySelector('#loading-tip').textContent = TIPS[Math.floor(Math.random() * TIPS.length)]

// ---------- three.js ----------
const canvas = $('#c'), stage = $('#stage')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 0)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(35, 1, 0.002, 20)
const labelRenderer = new CSS2DRenderer({ element: $('#labels') })
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.12
controls.rotateSpeed = 0.8
controls.minDistance = 0.02
controls.maxDistance = 4
scene.add(new THREE.HemisphereLight(0xffffff, 0x8890a0, 1.5))
const headlight = new THREE.DirectionalLight(0xffffff, 1.8)
camera.add(headlight); headlight.position.set(0.3, 0.4, 1)
scene.add(camera)

let pinObj = null
const pinEl = document.createElement('div')
pinEl.className = 'pin'
pinEl.innerHTML = '<span class="pin-dot"></span><span class="pin-text"></span>'

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight
  renderer.setSize(w, h, false)
  labelRenderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
new ResizeObserver(resize).observe(stage)

// ---------- state ----------
let meta, meshes = new Map(), steps = [], cur = 0
let boneState = 'hilang', dalam = false
let anim = null
let sorotan = [] // [{ ids, label }]: struktur yang sedang disebut (dipakai video)
const labelSorot = []
let quiz = null // { pool, urutan, idx, q, opsi, dijawab, benar, streak }
const PANJANG_KUIS = 10

// Yang sedang ditampilkan: soal kuis (kalau mode kuis) atau langkah biasa.
const view = () => (quiz ? { type: 'item', data: quiz.q, grup: 'Kuis' } : steps[cur])

function buildSteps() {
  steps = []
  ;(meta.orientasi || []).forEach((o, i) => steps.push({ type: 'orientasi', i, data: o, grup: 'Orientasi' }))
  meta.grup.forEach((g) => g.item.forEach((it) => steps.push({ type: 'item', data: it, grup: g.judul })))
}

function itemSets(step) {
  const d = step.data
  if (step.type === 'orientasi') return { sel: new Set(), ctx: new Set(d.fokus), focus: d.fokus }
  return { sel: new Set(d.mesh), ctx: new Set(d.konteks), focus: d.mesh.length ? d.mesh : d.konteks }
}

// Satu fungsi yang menentukan tampilan SEMUA mesh. Selalu boolean untuk .visible.
function applyState() {
  const step = view()
  const { sel, ctx } = itemSets(step)
  const d = step.data
  const isOrient = step.type === 'orientasi'
  const hanyaDipilih = new Set(meta.hanyaSaatDipilih || [])
  for (const [id, m] of meshes) {
    const p = m.userData.part, mat = m.material
    const isBone = p.system === 'skeletal'
    const isCavity = /^Cavity of/.test(p.name)
    let visible, opacity = 1, color = m.userData.color, emissive = 0x000000

    if (isBone) {
      visible = boneState !== 'hilang'
      opacity = boneState === 'tembus' ? 0.22 : 1
    } else if (isCavity) {
      // Rongga hanya tampil bila memang dipilih sebagai struktur "rongga" (supaya tidak menutupi katup).
      visible = !isOrient && !!d.rongga && sel.has(id)
      opacity = 0.75
    } else if (hanyaDipilih.has(id)) {
      // Struktur tambahan (mis. perikardium ilustrasi) hanya tampil saat dipilih atau jadi konteks.
      visible = sel.has(id) || ctx.has(id)
    } else {
      visible = true
    }

    if (!isBone && visible) {
      if (sel.has(id)) {
        if (!d.warnaAsli) color = WARNA.highlight
        emissive = d.warnaAsli ? 0x222222 : 0x553300
        opacity = isCavity ? 0.75 : 1
      } else if (ctx.has(id)) {
        // konteksTransparan: struktur sekitar dibuat setengah tembus supaya struktur terpilih di baliknya terlihat
        opacity = dalam && DINDING_JANTUNG.has(id) ? 0.14 : d.konteksTransparan && p.system !== 'nervous' ? 0.32 : 1
      } else {
        opacity = dalam && DINDING_JANTUNG.has(id) ? 0.06 : 0.1
      }
    }
    // Kantong perikardium (ilustrasi) selalu transparan supaya jantung di dalamnya tetap terlihat.
    if (p.gaya === 'kantong' && visible) opacity = sel.has(id) ? 0.36 : ctx.has(id) ? 0.22 : 0.08
    m.visible = !!visible
    mat.color.setHex(color)
    mat.emissive.setHex(emissive)
    mat.opacity = opacity
    mat.transparent = opacity < 1
    mat.depthWrite = opacity >= 1
    m.renderOrder = opacity < 1 ? 2 : 0
  }
  for (const g of sorotan) for (const id of g.ids) {
    const m = meshes.get(id); if (!m) continue
    m.visible = true
    m.material.color.setHex(WARNA.sorot); m.material.emissive.setHex(0x0b4a44)
    m.material.opacity = 1; m.material.transparent = false; m.material.depthWrite = true; m.renderOrder = 0
  }
  updateToggles()
}

function updateToggles() {
  $('#btn-tulang').textContent = TULANG_LABEL[boneState]
  $('#btn-tulang').dataset.state = boneState
  $('#btn-dalam').classList.toggle('on', dalam)
}

// ---------- kamera ----------
function boundsOf(ids) {
  const box = new THREE.Box3()
  for (const id of ids) { const m = meshes.get(id); if (m) box.union(m.geometry.boundingBox) }
  return box
}

function arahVec(a) {
  const v = Array.isArray(a) ? a : ARAH[a] || ARAH.depan
  return new THREE.Vector3(...v).normalize()
}

function flyTo(ids, arah, extraPoint, instant = false, zoom = 1) {
  const box = boundsOf(ids)
  if (extraPoint) box.expandByPoint(extraPoint)
  if (box.isEmpty()) return
  const sphere = box.getBoundingSphere(new THREE.Sphere())
  const r = Math.max(sphere.radius, MIN_RADIUS)
  const vfov = THREE.MathUtils.degToRad(camera.fov)
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect)
  const dist = (r / Math.sin(Math.min(vfov, hfov) / 2)) * 1.08 * zoom
  const dir = arahVec(arah)
  const toPos = sphere.center.clone().addScaledVector(dir, dist)
  const toTarget = sphere.center.clone()
  if (instant) {
    anim = null
    camera.position.copy(toPos); controls.target.copy(toTarget); controls.update(); return
  }
  anim = { t0: performance.now(), dur: 750, fromPos: camera.position.clone(), fromTarget: controls.target.clone(), toPos, toTarget }
}

function stepAnim(now) {
  if (!anim) return
  const k = Math.min(1, (now - anim.t0) / anim.dur)
  const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
  // Interpolasi di sekitar target supaya kamera berputar halus, bukan menembus model.
  const target = anim.fromTarget.clone().lerp(anim.toTarget, e)
  const fromOff = anim.fromPos.clone().sub(anim.fromTarget), toOff = anim.toPos.clone().sub(anim.toTarget)
  const len = THREE.MathUtils.lerp(fromOff.length(), toOff.length(), e)
  const dir = fromOff.normalize().lerp(toOff.normalize(), e)
  if (dir.lengthSq() < 1e-6) dir.copy(toOff)
  dir.normalize()
  camera.position.copy(target).addScaledVector(dir, len)
  controls.target.copy(target)
  if (k >= 1) anim = null
}

// ---------- sorotan kedua + label nama (untuk video) ----------
function sorot(groups) {
  for (const o of labelSorot.splice(0)) scene.remove(o)
  sorotan = (groups || []).map((g) => ({ ids: g.ids.filter((id) => meshes.has(id)), label: g.label })).filter((g) => g.ids.length)
  applyState()
  for (const g of sorotan) {
    if (!g.label) continue
    const box = boundsOf(g.ids), el = document.createElement('div')
    el.className = 'tag-sorot'; el.textContent = g.label
    const o = new CSS2DObject(el); box.getCenter(o.position)
    scene.add(o); labelSorot.push(o)
  }
}
// Pose kamera untuk membingkai sekumpulan mesh, tanpa menggerakkan kamera.
function framePose(ids, arah, zoom = 1, extra) {
  const box = boundsOf(ids); if (extra) box.expandByPoint(new THREE.Vector3(...extra))
  if (box.isEmpty()) return null
  const sphere = box.getBoundingSphere(new THREE.Sphere()), r = Math.max(sphere.radius, MIN_RADIUS)
  const vfov = THREE.MathUtils.degToRad(camera.fov), hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect)
  const dist = (r / Math.sin(Math.min(vfov, hfov) / 2)) * 1.08 * zoom
  const pos = sphere.center.clone().addScaledVector(arahVec(arah), dist)
  return { pos: pos.toArray(), target: sphere.center.toArray() }
}

// ---------- label arah di tepi layar ----------
function updateDirLabels() {
  camera.updateMatrixWorld()
  const e = camera.matrixWorld.elements
  const right = new THREE.Vector3(e[0], e[1], e[2]), up = new THREE.Vector3(e[4], e[5], e[6])
  const back = new THREE.Vector3(e[8], e[9], e[10])
  const best = (v) => { let bi = 0, bd = -2; SUMBU.forEach((s, i) => { const d = s.v.dot(v); if (d > bd) { bd = d; bi = i } }); return { i: bi, d: bd } }
  const set = (el, v) => { const b = best(v); el.textContent = SUMBU[b.i].t; el.style.opacity = b.d > 0.55 ? 1 : 0.45 }
  set($('#dir-right'), right); set($('#dir-left'), right.clone().negate())
  set($('#dir-top'), up); set($('#dir-bottom'), up.clone().negate())
  const f = best(back)
  $('#dir-from').textContent = `Dilihat dari ${SUMBU_DARI[f.i]}`
}

// ---------- konten ----------
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const para = (s) => esc(s).split('\n').map((l) => `<div>${l}</div>`).join('')
const BADGE = {
  ada: ['ok', '✅ Ada di model 3D'],
  terkait: ['warn', '🔗 Lewat struktur terkait'],
  ilustrasi: ['ilus', '🎨 Ilustrasi buatan (bukan data asli)'],
  'tidak-ada': ['none', '📄 Tidak ada di model 3D (teks saja)'],
}
const LEGENDA = `<div class="legend-warna"><span><i style="background:#ffc21a"></i>terpilih</span><span><i style="background:#c8373b"></i>arteri</span><span><i style="background:#3c63c4"></i>vena</span><span><i style="background:#e6dfcf;border:1px solid #cbbfa8"></i>tulang</span></div>`
const BENAR = ['Mantap! 🎉', 'Tepat sekali! 💯', 'Keren, calon dokter! 🩺', 'Yes! Kamu hafal ini 😎', 'Betul! Lanjut terus 🚀']
const SALAH = ['Hampir! 💪', 'Belum tepat, tapi gapapa 🙂', 'Oops! Ingat-ingat lagi ya 🤔']
const acak = (arr) => arr[Math.floor(Math.random() * arr.length)]
function kocok(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

function renderInfo() {
  const step = steps[cur], d = step.data
  $('#grup').textContent = step.grup
  $('#counter').textContent = `${cur + 1} / ${steps.length}`
  if (step.type === 'orientasi') {
    $('#latin').textContent = d.judul
    $('#indo').textContent = `Orientasi ${step.i + 1} dari ${meta.orientasi.length}`
    $('#badge').innerHTML = `<span class="badge info">🧭 ${step.i === 0 ? 'Yuk kenalan dulu dengan letaknya' : 'Orientasi'}</span>`
    $('#body').innerHTML = `<p>${para(d.teks)}</p>${LEGENDA}`
  } else {
    const [cls, txt] = BADGE[d.status]
    $('#latin').textContent = d.latin
    $('#indo').textContent = d.indonesia || ''
    const sudah = seen.has(d.key) ? '<span class="badge seen">✓ sudah dilihat</span>' : ''
    $('#badge').innerHTML = `<span class="badge ${cls}">${txt}</span>${sudah}`
    let h = ''
    if (d.ringkas) h += `<h3>📖 Penjelasan</h3><p>${para(d.ringkas)}</p>`
    if (d.pertanyaan) h += `<div class="box q"><strong>📝 Daftar tilik no. ${esc(d.pertanyaan.no)}</strong><div>${esc(d.pertanyaan.teks)}</div>
      <details><summary>Coba jawab dulu, lalu lihat jawaban 👀</summary>${para(d.pertanyaan.jawaban)}</details></div>`
    if (d.jembatanKeledai) h += `<div class="box mnemo"><strong>🧠 Jembatan keledai</strong>${para(d.jembatanKeledai)}</div>`
    if (d.klinis) h += `<div class="box klinis"><strong>🏥 Makna klinis</strong>${para(d.klinis)}</div>`
    if (d.funFact) h += `<h3>💡 Tahukah kamu?</h3><p>${para(d.funFact)}</p>`
    if (d.asalNama) h += `<h3>🔤 Asal-usul nama</h3><p>${para(d.asalNama)}</p>`
    if (d.catatanModel) h += `<div class="box note"><strong>ℹ️ Tentang model 3D</strong>${para(d.catatanModel)}</div>`
    if (d.perluDicek?.length) h += `<div class="box check"><strong>⚠️ PERLU DICEK</strong>${d.perluDicek.map((x) => `<div>• ${esc(x)}</div>`).join('')}</div>`
    $('#body').innerHTML = h
  }
  if (posisiSheet === 'ringkas') requestAnimationFrame(() => aturSheet('ringkas'))
  $('#btn-prev').disabled = cur === 0
  $('#btn-next').disabled = cur === steps.length - 1
  document.querySelectorAll('#daftar .row').forEach((r) => r.classList.toggle('active', +r.dataset.i === cur))
}

function setPin(step) {
  if (pinObj) { scene.remove(pinObj); pinObj = null }
  const d = step.data
  if (step.type !== 'item' || !d.pin) return null
  const p = meta.landmarks[d.pin]
  if (!p) return null
  pinEl.querySelector('.pin-text').textContent = d.pinLabel || 'Perkiraan'
  pinObj = new CSS2DObject(pinEl)
  pinObj.position.set(...p)
  scene.add(pinObj)
  return new THREE.Vector3(...p)
}

function go(i, { instant = false, keepView = false } = {}) {
  cur = Math.max(0, Math.min(steps.length - 1, i))
  const step = steps[cur], d = step.data
  // Reset per struktur: status tulang & mode dalam selalu kembali ke bawaan struktur ini.
  boneState = d.tulang || 'hilang'
  dalam = d.mode === 'dalam'
  applyState()
  const pin = setPin(step)
  if (!keepView) {
    const { focus } = itemSets(step)
    flyTo(d.kamera?.fokusPin && pin ? [] : focus, d.kamera?.arah || 'depan', pin, instant, d.kamera?.zoom || 1)
  }
  catatDilihat(step)
  renderInfo()
  history.replaceState(null, '', `?p=${PID}#${step.type === 'item' ? d.key : 'orientasi-' + (step.i + 1)}`)
}

// ---------- progres & perayaan ----------
let seen = new Set()
const semuaItem = () => steps.filter((s) => s.type === 'item')
function updateProgress() {
  const total = semuaItem().length, n = semuaItem().filter((s) => seen.has(s.data.key)).length
  $('#top-progress').style.width = `${(n / total) * 100}%`
  $('#drawer-progress').textContent = `${n} dari ${total} struktur sudah kamu lihat ${n === total ? '🏆' : '✨'}`
  document.querySelectorAll('#daftar .row').forEach((r) => {
    const s = steps[+r.dataset.i]
    r.querySelector('.seen-mark').textContent = s.type === 'item' && seen.has(s.data.key) ? '✓' : ''
  })
}
function catatDilihat(step) {
  if (step.type !== 'item') return
  if (!progres.tandaiDilihat(PID, step.data.key)) return
  seen.add(step.data.key)
  updateProgress()
  const grupItems = semuaItem().filter((s) => s.grup === step.grup)
  const total = semuaItem()
  if (total.every((s) => seen.has(s.data.key))) {
    if (progres.tandaiSelesai(PID)) setTimeout(() => rayakan(), 500)
  } else if (grupItems.every((s) => seen.has(s.data.key))) {
    toast(`✨ Subtopik "${step.grup}" selesai!`)
  }
}
function konfeti() {
  const em = ['🎉', '✨', '🫀', '⭐', '💖', '🩺']
  for (let i = 0; i < 26; i++) {
    const el = document.createElement('div')
    el.className = 'confetti'; el.textContent = acak(em)
    el.style.left = `${Math.random() * 100}vw`
    el.style.animationDuration = `${1.8 + Math.random() * 1.6}s`
    el.style.animationDelay = `${Math.random() * 0.4}s`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 4000)
  }
}
function tampilkanKartu(html, tombol) {
  $('#celebrate-card').innerHTML = html + tombol.map((t, i) => `<button class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}" data-i="${i}">${t.label}</button>`).join('')
  $('#celebrate').hidden = false
  $('#celebrate-card').onclick = (e) => {
    const b = e.target.closest('[data-i]'); if (!b) return
    $('#celebrate').hidden = true; tombol[+b.dataset.i].aksi?.()
  }
}
function rayakan() {
  konfeti()
  tampilkanKartu(`<div class="celebrate-emoji">🎉</div><h2>Hebat!</h2><p>Kamu sudah menelusuri <b>semua ${semuaItem().length} struktur</b> ${esc(meta.judul)}. Sekarang uji ingatanmu, yuk!</p>`,
    [{ label: '🎯 Coba kuis', aksi: mulaiKuis }, { label: 'Nanti saja' }])
}

// ---------- kuis ----------
function buatPool() {
  // Struktur yang benar-benar ada mesh-nya; satu entri per kumpulan mesh (hindari soal kembar).
  const tanda = new Set(), pool = []
  for (const s of semuaItem()) {
    const d = s.data
    if (d.status !== 'ada' || !d.mesh.length || d.rongga || d.warnaAsli) continue
    const sig = [...d.mesh].sort().join(',')
    if (tanda.has(sig)) continue
    tanda.add(sig); pool.push({ ...d, _grup: s.grup })
  }
  return pool
}
function mulaiKuis() {
  const pool = buatPool()
  if (pool.length < 4) { toast('Struktur di praktikum ini belum cukup untuk kuis'); return }
  quiz = { pool, urutan: kocok(pool).slice(0, Math.min(PANJANG_KUIS, pool.length)), idx: 0, benar: 0, streak: 0 }
  document.body.classList.add('quiz')
  $('#drawer').hidden = true
  soalKuis()
}
function keluarKuis() {
  quiz = null
  document.body.classList.remove('quiz')
  go(cur)
}
// Nama di pilihan kuis: tanpa keterangan dalam kurung, mis. "(dari ventrikel kanan)".
const namaKuis = (x) => x.latin.replace(/\s*\([^)]*\)\s*$/, '')
function soalKuis() {
  const q = quiz.urutan[quiz.idx]
  const nama = (x) => namaKuis(x)
  const lain = kocok(quiz.pool.filter((x) => x.key !== q.key && nama(x) !== nama(q)))
  const sama = lain.filter((x) => x._grup === q._grup), beda = lain.filter((x) => x._grup !== q._grup)
  const pengecoh = [...sama, ...beda].slice(0, 3)
  quiz.q = q; quiz.dijawab = false
  quiz.opsi = kocok([q, ...pengecoh])
  boneState = q.tulang || 'hilang'
  dalam = q.mode === 'dalam'
  applyState()
  if (pinObj) { scene.remove(pinObj); pinObj = null }
  flyTo(q.mesh, q.kamera?.arah || 'depan', null, false, q.kamera?.zoom || 1)
  renderKuis()
}
function renderKuis(pesan = '', pilihan = null) {
  const q = quiz.q
  const opsi = quiz.opsi.map((o, i) => {
    let cls = ''
    if (quiz.dijawab && o.key === q.key) cls = 'benar'
    else if (quiz.dijawab && i === pilihan) cls = 'salah'
    return `<button class="quiz-opt ${cls}" data-i="${i}" ${quiz.dijawab ? 'disabled' : ''}>${esc(namaKuis(o))}</button>`
  }).join('')
  const terakhir = quiz.idx === quiz.urutan.length - 1
  $('#quiz').innerHTML = `
    <div class="quiz-top"><span class="quiz-score">🎯 Soal ${quiz.idx + 1}/${quiz.urutan.length} · ⭐ ${quiz.benar}${quiz.streak >= 2 ? ` <span class="quiz-streak">🔥 ${quiz.streak} beruntun</span>` : ''}</span>
      <button class="btn btn-ghost" id="kuis-keluar" style="padding:6px 10px">✕ Keluar</button></div>
    <div class="quiz-q">Struktur <span class="hl">kuning</span> ini namanya apa?</div>
    <div class="quiz-hint">Putar dan zoom modelnya dulu kalau perlu 🔍</div>
    <div class="quiz-opts">${opsi}</div>
    ${pesan ? `<div class="quiz-feedback">${pesan}</div>` : ''}
    ${quiz.dijawab ? `<div class="quiz-actions"><button class="btn btn-ghost" id="kuis-materi">📖 Lihat materi</button><button class="btn btn-primary" id="kuis-lanjut">${terakhir ? 'Lihat hasil 🏁' : 'Soal berikutnya ▶'}</button></div>` : ''}`
  if (posisiSheet !== 'tutup') requestAnimationFrame(() => aturSheet(posisiSheet === 'buka' ? 'buka' : 'ringkas'))
  $('#kuis-keluar').onclick = keluarKuis
  $('#quiz .quiz-opts').onclick = (e) => {
    const b = e.target.closest('.quiz-opt'); if (!b || quiz.dijawab) return
    const i = +b.dataset.i, ok = quiz.opsi[i].key === q.key
    quiz.dijawab = true
    if (ok) { quiz.benar++; quiz.streak++ } else quiz.streak = 0
    renderKuis(ok ? acak(BENAR) : `${acak(SALAH)} Jawabannya <b>${esc(namaKuis(q))}</b>.`, i)
  }
  if (quiz.dijawab) {
    $('#kuis-lanjut').onclick = () => { if (terakhir) hasilKuis(); else { quiz.idx++; soalKuis() } }
    $('#kuis-materi').onclick = () => {
      const i = steps.findIndex((s) => s.type === 'item' && s.data.key === q.key)
      quiz = null; document.body.classList.remove('quiz'); go(i)
      aturSheet('buka')
    }
  }
}
function hasilKuis() {
  const n = quiz.benar, total = quiz.urutan.length
  const rekor = progres.simpanSkorKuis(PID, n)
  const r = n / total
  const [emoji, judul, teks] = r === 1 ? ['🏆', 'Sempurna!', 'Semua benar. Kamu siap praktikum!']
    : r >= 0.8 ? ['🌟', 'Hebat banget!', 'Tinggal sedikit lagi menuju sempurna.']
    : r >= 0.5 ? ['💪', 'Lumayan!', 'Ulangi sekali lagi biar makin lancar.']
    : ['📚', 'Gapapa, namanya juga belajar!', 'Telusuri lagi strukturnya, lalu coba lagi.']
  if (r >= 0.8) konfeti()
  quiz = null; document.body.classList.remove('quiz'); go(cur)
  tampilkanKartu(`<div class="celebrate-emoji">${emoji}</div><h2>${judul}</h2><p>Skor kamu <b>${n} dari ${total}</b>${rekor ? ' (rekor baru! 🎊)' : ''}. ${teks}</p>`,
    [{ label: '🔁 Main lagi', aksi: mulaiKuis }, { label: 'Kembali belajar' }])
}

function buildList() {
  let h = '', lastGrup = null
  steps.forEach((s, i) => {
    if (s.grup !== lastGrup) { h += `<div class="grp">${esc(s.grup)}</div>`; lastGrup = s.grup }
    const icon = s.type === 'orientasi' ? '🧭' : { ada: '●', terkait: '◐', ilustrasi: '◆', 'tidak-ada': '○' }[s.data.status]
    const name = s.type === 'orientasi' ? s.data.judul : s.data.latin
    h += `<button class="row" data-i="${i}"><span class="st st-${s.type === 'orientasi' ? 'o' : s.data.status}">${icon}</span><span>${esc(name)}</span><span class="seen-mark"></span></button>`
  })
  h += `<p class="muted small legend">● ada di model · ◐ lewat struktur terkait · ◆ ilustrasi buatan · ○ tidak ada di model (hanya teks) · ✓ sudah kamu lihat</p>`
  $('#daftar').innerHTML = h
  $('#daftar').onclick = (e) => {
    const b = e.target.closest('.row'); if (!b) return
    $('#drawer').hidden = true; go(+b.dataset.i)
  }
}

// ---------- interaksi ----------
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false
  clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true }, 2600)
}

const meshToStep = new Map()
function buildPickMap() {
  // Utamakan struktur yang memang "ada" di model; baru setelah itu yang "terkait".
  for (const status of ['ada', 'terkait', 'ilustrasi']) {
    steps.forEach((s, i) => {
      if (s.type !== 'item' || s.data.status !== status || s.data.rongga) return
      for (const id of s.data.mesh) if (!meshToStep.has(id)) meshToStep.set(id, i)
    })
  }
}

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
let down = null
// Struktur mana yang ada di titik layar (x, y)?
function pickAt(x, y) {
  const r = canvas.getBoundingClientRect()
  ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1)
  ray.setFromCamera(ndc, camera)
  // Semua struktur yang terlihat bisa diketuk, termasuk yang sedang diredupkan.
  // Pengecualian: tulang, dan dinding jantung yang dibuat transparan di mode "Lihat dalam"
  // (supaya katup/otot di dalamnya tetap bisa diketuk).
  const targets = [...meshes.values()].filter((m) => {
    if (!m.visible || m.userData.part.system === 'skeletal') return false
    if (dalam && DINDING_JANTUNG.has(m.userData.part.id) && m.material.opacity < 0.5) return false
    return true
  })
  const hits = ray.intersectObjects(targets, false)
  // Utamakan struktur yang jelas terlihat; struktur redup dipilih kalau tidak ada yang jelas di depannya.
  const jelas = hits.find((h) => h.object.material.opacity >= 0.5)
  const hit = jelas && hits[0].object.material.opacity < 0.5 && hits[0].distance < jelas.distance - 0.03 ? hits[0] : jelas || hits[0]
  return hit || null
}
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() } })
canvas.addEventListener('pointerup', (e) => {
  if (!down || quiz) { down = null; return }
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y)
  const quick = performance.now() - down.t < 500
  down = null
  if (moved > 8 || !quick) return
  const hit = pickAt(e.clientX, e.clientY)
  if (!hit) return
  const id = hit.object.userData.part.id
  if (meshToStep.has(id)) {
    const i = meshToStep.get(id)
    if (i !== cur) go(i)
  } else {
    toast(`🔎 ${hit.object.userData.part.name} (tidak ada di daftar tilik)`)
  }
})

$('#views').innerHTML = '<span class="views-lbl">Lihat dari</span>' + Object.keys(ARAH).map((k) => `<button class="chip" data-arah="${k}" title="${ARAH_TITLE[k]}" aria-label="${ARAH_TITLE[k]}">${ARAH_LABEL[k]}</button>`).join('')
$('#views').onclick = (e) => {
  const b = e.target.closest('[data-arah]'); if (!b) return
  const step = view()
  if (quiz) { flyTo(quiz.q.mesh, b.dataset.arah, null, false, quiz.q.kamera?.zoom || 1); return }
  flyTo(step.data.kamera?.fokusPin && pinObj ? [] : itemSets(step).focus, b.dataset.arah, pinObj?.position, false, step.data.kamera?.zoom || 1)
}
$('#btn-tulang').onclick = () => { boneState = TULANG[(TULANG.indexOf(boneState) + 1) % 3]; applyState() }
$('#btn-dalam').onclick = () => { dalam = !dalam; applyState() }
$('#btn-prev').onclick = () => go(cur - 1)
$('#btn-next').onclick = () => go(cur + 1)
$('#btn-daftar').onclick = () => { $('#drawer').hidden = false; $('#daftar .row.active')?.scrollIntoView({ block: 'center' }) }
$('#btn-tutup').onclick = () => { $('#drawer').hidden = true }
pasangTombolTema($('#btn-tema'))
$('#btn-kuis').onclick = () => (quiz ? keluarKuis() : mulaiKuis())
// ---------- panel bawah (HP/tablet tegak): bisa di-drag ke 3 posisi ----------
// tutup = hanya pegangan · ringkas = nama + tombol · buka = materi lengkap
const sheet = $('#sheet')
const layarLebar = window.matchMedia('(min-width: 900px)')
let posisiSheet = 'ringkas'
function tinggiSheet(pos) {
  const hTutup = $('#sheet-handle').offsetHeight + 6
  if (pos === 'tutup') return hTutup
  if (pos === 'buka') return Math.round(window.innerHeight * 0.68)
  // ringkas: tinggi alami semua bagian kecuali isi materi
  let h = 0
  for (const el of sheet.children) if (el.id !== 'body' && el.offsetParent !== null) h += el.offsetHeight
  return Math.min(h + 4, Math.round(window.innerHeight * 0.68))
}
function aturSheet(pos, animasi = true) {
  if (layarLebar.matches) { sheet.style.height = ''; document.body.classList.remove('sheet-tutup'); return }
  posisiSheet = pos
  sheet.style.transition = animasi ? 'height 0.25s ease' : 'none'
  sheet.style.height = `${tinggiSheet(pos)}px`
  document.body.classList.toggle('sheet-open', pos === 'buka')
  document.body.classList.toggle('sheet-tutup', pos === 'tutup')
}
const toggleSheet = () => aturSheet(posisiSheet === 'buka' ? 'ringkas' : 'buka')
$('#btn-info').onclick = toggleSheet
layarLebar.addEventListener?.('change', () => aturSheet(posisiSheet, false))
window.addEventListener('resize', () => aturSheet(posisiSheet, false))

let seret = null
function mulaiSeret(e) {
  if (layarLebar.matches || e.target.closest('button:not(.sheet-handle), a, summary')) return
  seret = { y: e.clientY, h: sheet.offsetHeight, t: performance.now(), gerak: false, id: e.pointerId }
  sheet.style.transition = 'none'
}
window.addEventListener('pointermove', (e) => {
  if (!seret || e.pointerId !== seret.id) return
  const dy = e.clientY - seret.y
  if (Math.abs(dy) > 4) seret.gerak = true
  if (!seret.gerak) return
  const h = Math.max(tinggiSheet('tutup'), Math.min(tinggiSheet('buka'), seret.h - dy))
  sheet.style.height = `${h}px`
  e.preventDefault()
}, { passive: false })
window.addEventListener('pointerup', (e) => {
  if (!seret || e.pointerId !== seret.id) return
  const s = seret; seret = null
  if (!s.gerak) { if (e.target.closest('.sheet-handle')) toggleSheet(); else aturSheet(posisiSheet); return }
  // Pilih posisi terdekat; usapan cepat langsung ke arah usapan.
  const h = sheet.offsetHeight, v = (e.clientY - s.y) / Math.max(1, performance.now() - s.t)
  const urutan = ['tutup', 'ringkas', 'buka']
  let pos = urutan.reduce((a, b) => (Math.abs(tinggiSheet(b) - h) < Math.abs(tinggiSheet(a) - h) ? b : a))
  if (Math.abs(v) > 0.6) {
    const i = urutan.indexOf(posisiSheet)
    pos = v > 0 ? urutan[Math.max(0, i - 1)] : urutan[Math.min(2, i + 1)]
  }
  aturSheet(pos)
})
$('#sheet-handle').addEventListener('pointerdown', mulaiSeret)
sheet.querySelector('.sheet-head').addEventListener('pointerdown', mulaiSeret)
$('#quiz').addEventListener('pointerdown', (e) => { if (!e.target.closest('.quiz-opts, button')) mulaiSeret(e) })

// ---------- start ----------
// Mode rekam (?video=1): dipakai script pembuat video. Loop otomatis dimatikan; kamera dan render
// dikendalikan frame per frame lewat window.__atlas.renderAt(). Tidak memengaruhi pengguna biasa.
const VIDEO = params.get('video') === '1'
if (VIDEO) document.body.classList.add('video')
function renderAt(pos, target) {
  camera.position.set(...pos); controls.target.set(...target); camera.lookAt(...target)
  updateDirLabels()
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}

function loop(now) {
  if (VIDEO) return
  stepAnim(now)
  controls.update()
  updateDirLabels()
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
  requestAnimationFrame(loop)
}

async function main() {
  resize()
  try {
    const res = await loadPraktikum(PID, BASE, (f) => { $('#bar').style.width = `${Math.round(f * 100)}%` })
    meta = res.meta
    for (const p of meta.parts) {
      const mat = new THREE.MeshStandardMaterial({ color: baseColor(p), roughness: 0.62, metalness: 0, side: THREE.DoubleSide })
      const m = new THREE.Mesh(res.geometries.get(p.id), mat)
      m.userData = { part: p, color: baseColor(p) }
      meshes.set(p.id, m); scene.add(m)
    }
    document.title = `${meta.judul} · ${judulLengkap}`
    $('#judul').textContent = `${meta.ikon || ''} ${meta.judul}`.trim()
    seen = progres.get(PID).seen
    buildSteps(); buildList(); buildPickMap(); updateProgress()
    const hash = decodeURIComponent(location.hash.slice(1))
    let start = steps.findIndex((s) => s.type === 'item' && s.data.key === hash)
    if (start < 0) { const m = hash.match(/^orientasi-(\d+)$/); start = m ? +m[1] - 1 : 0 }
    go(start, { instant: true })
    $('#loading').remove()
    window.__atlas = { ready: true, meshes, camera, controls, go: (i) => go(i, { instant: true }), kuis: () => mulaiKuis(), soal: () => quiz && { kunci: quiz.q.key, opsi: quiz.opsi.map((o) => o.key) }, steps: () => steps.map((s) => (s.type === 'item' ? s.data.key : `orientasi-${s.i + 1}`)), cur: () => cur, pose: () => ({ pos: camera.position.toArray(), target: controls.target.toArray() }), renderAt, meta: () => meta, pick: (x, y) => pickAt(x, y)?.object.userData.part.id ?? null, sorot, framePose, langkah: (i) => steps[i] }
  } catch (err) {
    console.error(err)
    $('#loading').innerHTML = `<div class="loading-emoji">😵</div><div class="loading-title">Waduh, gagal memuat</div><div class="loading-tip">${esc(err.message)}. Coba muat ulang halaman.</div><a class="btn btn-primary" href="${BASE}">Kembali</a>`
  }
  requestAnimationFrame(loop)
}
main()
