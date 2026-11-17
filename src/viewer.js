import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { loadPraktikum } from './data.js'
import { attributionLine } from './attribution.js'

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
  skeletal: 0xe6dfcf, cavityL: 0xe0484d, cavityR: 0x4d78dc, other: 0xb9a48f, highlight: 0xffc21a,
}
// Pembuluh paru: arteri membawa darah miskin O2 (biru), vena kaya O2 (merah), sesuai konvensi atlas.
const PULMONAL_BIRU = new Set(['FJ2966', 'FJ3019', 'FJ2924'])
const PULMONAL_MERAH = new Set(['FJ3020', 'FJ3040', 'FJ2925', 'FJ2933', 'FJ2944', 'FJ2950', 'FJ2955'])
const DINDING_JANTUNG = new Set(['FJ2439', 'FJ2438', 'VENT_R', 'VENT_L', 'FJ2428'])

function baseColor(p) {
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
    <button class="icon-btn" id="btn-daftar" aria-label="Daftar struktur">☰</button>
  </header>
  <div id="stage">
    <canvas id="c"></canvas>
    <div id="labels"></div>
    <div class="dir dir-top" id="dir-top"></div>
    <div class="dir dir-bottom" id="dir-bottom"></div>
    <div class="dir dir-left" id="dir-left"></div>
    <div class="dir dir-right" id="dir-right"></div>
    <div class="dir-from" id="dir-from"></div>
    <div class="toolbar">
      <div class="views" id="views"></div>
      <div class="toggles">
        <button id="btn-tulang" class="chip"></button>
        <button id="btn-dalam" class="chip">Lihat dalam</button>
      </div>
    </div>
    <div id="toast" class="toast" hidden></div>
    <div id="loading" class="loading"><div>Memuat model 3D…</div><div class="bar"><span id="bar"></span></div><div class="muted small" id="loading-size"></div></div>
  </div>
  <section class="sheet" id="sheet">
    <button class="sheet-handle" id="sheet-handle" aria-label="Buka/tutup info"><span></span></button>
    <div class="sheet-head">
      <div class="muted small" id="grup"></div>
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
    <div class="drawer-head"><strong>Daftar struktur</strong><button class="icon-btn" id="btn-tutup">✕</button></div>
    <div class="drawer-body" id="daftar"></div>
  </div>
`

// ---------- three.js ----------
const canvas = $('#c'), stage = $('#stage')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x161b22)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(35, 1, 0.002, 20)
const labelRenderer = new CSS2DRenderer({ element: $('#labels') })
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.12
controls.rotateSpeed = 0.8
controls.minDistance = 0.02
controls.maxDistance = 4
scene.add(new THREE.HemisphereLight(0xffffff, 0x404050, 1.6))
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
  const step = steps[cur]
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
      visible = sel.has(id)
    } else {
      visible = true
    }

    if (!isBone && visible) {
      if (sel.has(id)) {
        if (!d.warnaAsli) color = WARNA.highlight
        emissive = d.warnaAsli ? 0x222222 : 0x553300
        opacity = isCavity ? 0.75 : 1
      } else if (ctx.has(id)) {
        opacity = dalam && DINDING_JANTUNG.has(id) ? 0.14 : 1
      } else {
        opacity = dalam && DINDING_JANTUNG.has(id) ? 0.06 : 0.1
      }
    }
    m.visible = !!visible
    mat.color.setHex(color)
    mat.emissive.setHex(emissive)
    mat.opacity = opacity
    mat.transparent = opacity < 1
    mat.depthWrite = opacity >= 1
    m.renderOrder = opacity < 1 ? 2 : 0
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
  ada: ['ok', 'Ada di model 3D'],
  terkait: ['warn', 'Ditunjukkan lewat struktur terkait'],
  'tidak-ada': ['none', 'Tidak ada di model 3D'],
}

function renderInfo() {
  const step = steps[cur], d = step.data
  $('#grup').textContent = step.grup
  $('#counter').textContent = `${cur + 1} / ${steps.length}`
  if (step.type === 'orientasi') {
    $('#latin').textContent = d.judul
    $('#indo').textContent = `Orientasi ${step.i + 1} dari ${meta.orientasi.length}`
    $('#badge').innerHTML = '<span class="badge info">Mode orientasi</span>'
    $('#body').innerHTML = `<p>${para(d.teks)}</p><p class="muted small">Kuning = struktur terpilih · merah = arteri · biru = vena · krem = tulang.</p>`
  } else {
    const [cls, txt] = BADGE[d.status]
    $('#latin').textContent = d.latin
    $('#indo').textContent = d.indonesia || ''
    $('#badge').innerHTML = `<span class="badge ${cls}">${txt}</span>`
    let h = ''
    if (d.catatanModel) h += `<div class="box note"><strong>Tentang model 3D</strong>${para(d.catatanModel)}</div>`
    if (d.ringkas) h += `<h3>Penjelasan</h3><p>${para(d.ringkas)}</p>`
    if (d.pertanyaan) h += `<div class="box q"><strong>Daftar tilik no. ${esc(d.pertanyaan.no)}</strong><div>${esc(d.pertanyaan.teks)}</div>
      <details><summary>Lihat jawaban</summary>${para(d.pertanyaan.jawaban)}</details></div>`
    if (d.klinis) h += `<h3>Makna klinis</h3><p>${para(d.klinis)}</p>`
    if (d.asalNama) h += `<h3>Asal-usul nama</h3><p>${para(d.asalNama)}</p>`
    if (d.funFact) h += `<h3>Tahukah kamu?</h3><p>${para(d.funFact)}</p>`
    if (d.jembatanKeledai) h += `<div class="box mnemo"><strong>Jembatan keledai</strong>${para(d.jembatanKeledai)}</div>`
    if (d.perluDicek?.length) h += `<div class="box check"><strong>PERLU DICEK</strong>${d.perluDicek.map((x) => `<div>• ${esc(x)}</div>`).join('')}</div>`
    $('#body').innerHTML = h
  }
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
  renderInfo()
  history.replaceState(null, '', `?p=${PID}#${step.type === 'item' ? d.key : 'orientasi-' + (step.i + 1)}`)
}

function buildList() {
  let h = '', lastGrup = null
  steps.forEach((s, i) => {
    if (s.grup !== lastGrup) { h += `<div class="grp">${esc(s.grup)}</div>`; lastGrup = s.grup }
    const icon = s.type === 'orientasi' ? '🧭' : { ada: '●', terkait: '◐', 'tidak-ada': '○' }[s.data.status]
    const name = s.type === 'orientasi' ? s.data.judul : s.data.latin
    h += `<button class="row" data-i="${i}"><span class="st st-${s.type === 'orientasi' ? 'o' : s.data.status}">${icon}</span><span>${esc(name)}</span></button>`
  })
  h += `<p class="muted small legend">● ada di model · ◐ lewat struktur terkait · ○ tidak ada di model (hanya teks)</p>`
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
  for (const status of ['ada', 'terkait']) {
    steps.forEach((s, i) => {
      if (s.type !== 'item' || s.data.status !== status || s.data.rongga) return
      for (const id of s.data.mesh) if (!meshToStep.has(id)) meshToStep.set(id, i)
    })
  }
}

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
let down = null
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() } })
canvas.addEventListener('pointerup', (e) => {
  if (!down) return
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y)
  const quick = performance.now() - down.t < 500
  down = null
  if (moved > 8 || !quick) return
  const r = canvas.getBoundingClientRect()
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  ray.setFromCamera(ndc, camera)
  const targets = [...meshes.values()].filter((m) => m.visible && m.material.opacity >= 0.2 && m.userData.part.system !== 'skeletal')
  const hit = ray.intersectObjects(targets, false)[0]
  if (!hit) return
  const id = hit.object.userData.part.id
  if (meshToStep.has(id)) {
    const i = meshToStep.get(id)
    if (i !== cur) go(i)
  } else {
    toast(`${hit.object.userData.part.name} (tidak ada di daftar tilik)`)
  }
})

$('#views').innerHTML = '<span class="views-lbl">Lihat dari</span>' + Object.keys(ARAH).map((k) => `<button class="chip" data-arah="${k}" title="${ARAH_TITLE[k]}" aria-label="${ARAH_TITLE[k]}">${ARAH_LABEL[k]}</button>`).join('')
$('#views').onclick = (e) => {
  const b = e.target.closest('[data-arah]'); if (!b) return
  const step = steps[cur]
  flyTo(step.data.kamera?.fokusPin && pinObj ? [] : itemSets(step).focus, b.dataset.arah, pinObj?.position, false, step.data.kamera?.zoom || 1)
}
$('#btn-tulang').onclick = () => { boneState = TULANG[(TULANG.indexOf(boneState) + 1) % 3]; applyState() }
$('#btn-dalam').onclick = () => { dalam = !dalam; applyState() }
$('#btn-prev').onclick = () => go(cur - 1)
$('#btn-next').onclick = () => go(cur + 1)
$('#btn-daftar').onclick = () => { $('#drawer').hidden = false; $('#daftar .row.active')?.scrollIntoView({ block: 'center' }) }
$('#btn-tutup').onclick = () => { $('#drawer').hidden = true }
const toggleSheet = () => document.body.classList.toggle('sheet-open')
$('#btn-info').onclick = toggleSheet
$('#sheet-handle').onclick = toggleSheet

// ---------- start ----------
function loop(now) {
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
    document.title = `${meta.judul} · Atlas 3D Praktikum Anatomi`
    $('#judul').textContent = meta.judul
    buildSteps(); buildList(); buildPickMap()
    const hash = decodeURIComponent(location.hash.slice(1))
    let start = steps.findIndex((s) => s.type === 'item' && s.data.key === hash)
    if (start < 0) { const m = hash.match(/^orientasi-(\d+)$/); start = m ? +m[1] - 1 : 0 }
    go(start, { instant: true })
    $('#loading').remove()
    window.__atlas = { ready: true, meshes, camera, controls, go: (i) => go(i, { instant: true }), steps: () => steps.map((s) => (s.type === 'item' ? s.data.key : `orientasi-${s.i + 1}`)), cur: () => cur }
  } catch (err) {
    console.error(err)
    $('#loading').innerHTML = `<div>Gagal memuat: ${esc(err.message)}</div><a class="btn" href="${BASE}">Kembali</a>`
  }
  requestAnimationFrame(loop)
}
main()
