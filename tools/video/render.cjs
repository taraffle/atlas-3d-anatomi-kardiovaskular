// Rekam frame video dari viewer (mode ?video=1), untuk praktikum mana pun.
// Pakai: PRAKTIKUM=2 node render.cjs <worker> <jumlahWorker> [fps]
// Fitur: sorotan per kalimat, daftar tilik dengan animasi zoom + centang, kartu gambar (ilustrasi/foto cadaver),
//        animasi alat klinis 3D (jarum / skalpel / klem), hitung mundur, banner bab, subtitle.
const { chromium } = require('playwright')
const fs = require('fs'), path = require('path')

const P = process.env.PRAKTIKUM || '1'
const [W, NW, FPS] = [+process.argv[2], +process.argv[3], +(process.argv[4] || 15)]
const WORK = path.join(__dirname, `work-p${P}`)
const TL = JSON.parse(fs.readFileSync(path.join(WORK, 'timeline.json'), 'utf8'))
const OUT = path.join(WORK, 'frames'); fs.mkdirSync(OUT, { recursive: true })
const N = Math.ceil(TL.total * FPS)
const per = Math.ceil(N / NW), f0 = W * per, f1 = Math.min(N, f0 + per)
const SAMPLE = process.env.SAMPLE ? process.env.SAMPLE.split(',').map((x) => Math.round(+x * FPS)) : null
const GAMBAR_DIR = process.env.GAMBAR_DIR || path.join(__dirname, 'gambar')

const CSS = `
body.video #stage { position: fixed; left: 0; top: 0; width: 850px; height: 720px; }
#vp { position: fixed; right: 0; top: 0; width: 430px; height: 720px; background: #241f2c; color: #f2edf6; padding: 26px 28px 16px; box-sizing: border-box; display: flex; flex-direction: column; font-family: Nunito, system-ui, sans-serif; border-left: 1px solid #3e3749; }
#vp .vp-kick { align-self: flex-start; font-size: 14px; font-weight: 800; color: #ffa489; background: #47302c; padding: 4px 13px; border-radius: 999px; }
#vp .vp-ttl { font-size: 29px; line-height: 1.15; font-weight: 800; margin: 12px 0 4px; }
#vp .vp-st { font-size: 17px; color: #b1a8bc; font-weight: 600; }
#vp .vp-card { margin-top: 14px; border-radius: 18px; padding: 13px 16px; font-size: 17.5px; line-height: 1.38; white-space: pre-line; font-weight: 600; }
#vp .vp-card .vp-h { display: block; font-size: 15.5px; font-weight: 800; margin-bottom: 4px; }
#vp .vp-card.q { background: #3d3420; } #vp .vp-card.q .vp-h { color: #ffd36b; }
#vp .vp-card.a { background: #1f3a31; } #vp .vp-card.a .vp-h { color: #4fd39a; }
#vp .vp-card.mnemo { background: #31294d; } #vp .vp-card.mnemo .vp-h { color: #b9a0ff; }
#vp .vp-card.nama { background: #1f2b45; } #vp .vp-card.nama .vp-h { color: #84b5ff; }
#vp .vp-card.klinis { background: #1c3631; } #vp .vp-card.klinis .vp-h { color: #4fd39a; }
#vp .vp-card.fakta { background: #3e301c; } #vp .vp-card.fakta .vp-h { color: #f3b45a; }
#vp .vp-card.model { background: #302a38; } #vp .vp-card.model .vp-h { color: #b1a8bc; }
#vp .vp-card.ilus { background: #31294d; } #vp .vp-card.ilus .vp-h { color: #b9a0ff; }
#vp .vp-card.intro { background: linear-gradient(135deg, #4a2c3a, #46391f 60%, #23344d); font-size: 20px; } #vp .vp-card.intro .vp-h { font-size: 24px; color: #fff; }
#vp .vp-tilik { margin-top: auto; background: #1d1924; border-radius: 16px; padding: 10px 12px 8px; }
#vp .vp-tilik .th { font-size: 13px; font-weight: 800; color: #ffd36b; letter-spacing: .04em; margin-bottom: 4px; display: flex; justify-content: space-between; }
#vp .vp-tilik .th span { color: #8f86a0; font-weight: 700; letter-spacing: 0; }
#vp .row { display: flex; align-items: center; gap: 8px; font-size: 14.5px; font-weight: 700; color: #b9b1c4; padding: 3px 6px; border-radius: 9px; transform-origin: left center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#vp .row .bx { flex: none; width: 19px; height: 19px; border-radius: 6px; border: 2px solid #5a5166; display: grid; place-items: center; font-size: 14px; font-weight: 900; color: #102018; }
#vp .row.selesai { color: #8fd9b3; } #vp .row.selesai .bx { background: #4fd39a; border-color: #4fd39a; }
#vp .row.kini { color: #fff; background: #3a2f47; }
#vp .vp-foot { margin-top: 8px; font-size: 10.5px; color: #8f86a0; line-height: 1.3; }
#vp .vp-foot b { color: #ffa489; }
#vsub { position: fixed; left: 40px; width: 770px; bottom: 24px; text-align: center; pointer-events: none; z-index: 5; }
#vsub span { display: inline; background: rgba(15, 12, 20, 0.8); color: #fff; font: 700 21px/1.55 Nunito, system-ui, sans-serif; padding: 3px 10px; border-radius: 8px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
#vcd { position: fixed; left: 0; top: 0; width: 850px; height: 720px; display: none; place-items: center; pointer-events: none; z-index: 6; }
#vcd div { width: 210px; height: 210px; border-radius: 50%; background: rgba(255, 194, 26, 0.94); color: #3b2a00; display: grid; place-items: center; font: 900 120px/1 Nunito, sans-serif; box-shadow: 0 0 0 16px rgba(255, 194, 26, 0.25); }
#vbab { position: fixed; left: 0; top: 0; width: 850px; height: 720px; display: none; place-items: center; pointer-events: none; background: rgba(20, 16, 26, 0.55); z-index: 6; }
#vbab div { background: #ff8a6b; color: #fff; font: 900 46px/1.2 Nunito, sans-serif; padding: 22px 40px; border-radius: 26px; text-align: center; max-width: 700px; box-shadow: 0 12px 40px rgba(0,0,0,.4); }
#vbab small { display: block; font-size: 18px; font-weight: 800; opacity: 0.9; margin-bottom: 4px; letter-spacing: 0.08em; }
#vimg { position: fixed; left: 0; top: 0; width: 850px; height: 720px; display: none; background: #141118; overflow: hidden; z-index: 4; }
#vimg .bingkai { position: absolute; left: 0; top: 0; width: 850px; height: 520px; display: grid; place-items: center; overflow: hidden; }
#vimg img { max-width: 820px; max-height: 496px; object-fit: contain; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.5); background: #fff; }
#vimg .ket { position: absolute; left: 0; right: 0; top: 522px; padding: 8px 24px 0; color: #e8e2ee; font: 800 17px/1.3 Nunito, sans-serif; }
#vimg .ket small { display: block; font-size: 11.5px; font-weight: 600; color: #a79fb2; margin-top: 3px; }
#vimg .jenis { position: absolute; left: 18px; top: 16px; z-index: 2; font: 900 14px Nunito, sans-serif; color: #1c1424; background: #ffc21a; padding: 4px 12px; border-radius: 999px; }
#valat { position: fixed; left: 18px; top: 52px; display: none; font: 900 13px Nunito, sans-serif; color: #1c1424; background: #2ee6d6; padding: 4px 12px; border-radius: 999px; z-index: 3; }
body.video .dir-top { top: 14px; } body.video .dir-bottom { display: none; }
`

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
function beatAt(t) { return TL.beats.find((b) => t >= b.t0 && t < b.t1) || TL.beats[TL.beats.length - 1] }
const smooth = (u) => { u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u) }

;(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, colorScheme: 'dark' })
  const page = await ctx.newPage()
  await page.goto(`http://localhost:4173/viewer.html?p=${P}&video=1`)
  await page.waitForFunction(() => window.__atlas?.ready, null, { timeout: 90000 })
  await page.evaluate((css) => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st)
    document.body.insertAdjacentHTML('beforeend', '<div id="vp"><div id="vp-atas"></div><div class="vp-tilik" id="vp-tilik"></div><div class="vp-foot" id="vp-foot"></div></div><div id="vsub"></div><div id="vcd"><div></div></div><div id="vbab"><div></div></div><div id="vimg"><span class="jenis"></span><div class="bingkai"><img></div><div class="ket"></div></div><div id="valat">🎨 Ilustrasi tindakan</div>')
    window.dispatchEvent(new Event('resize'))
  }, CSS)
  await page.waitForTimeout(500)
  const keys = await page.evaluate(() => window.__atlas.steps())
  const meta = await page.evaluate(() => window.__atlas.meta())
  await page.evaluate(() => { document.getElementById('vp-foot').innerHTML = '<b>Atlas 3D · Anatomi Modul Kardiovaskular</b><br>Model 3D: BodyParts3D © The Database Center for Life Science, CC BY 4.0 (via @dagno/anatomy-model). Bentuk berlabel "ilustrasi" dibuat sendiri. Bukan materi resmi departemen.' })

  // ---------- penanda sorot → ID mesh ----------
  const itemMesh = {}; for (const g of meta.grup) for (const it of g.item) itemMesh[it.key] = it.mesh
  function resolve(spec) {
    if (spec.startsWith('item:')) { const m = itemMesh[spec.slice(5)]; if (!m) throw new Error('item tidak ada: ' + spec); return m }
    if (spec.startsWith('name:')) { const re = new RegExp(spec.slice(5)); const ids = meta.parts.filter((p) => re.test(p.name)).map((p) => p.id); if (!ids.length) throw new Error('nama tidak cocok: ' + spec); return ids }
    if (!meta.parts.some((p) => p.id === spec)) throw new Error('mesh tidak ada: ' + spec)
    return [spec]
  }
  for (const bt of TL.beats) {
    bt._sorot = (bt.sorot || []).map(([label, spec]) => ({ label, ids: resolve(spec) }))
    if (bt.alat) bt.alat._ids = resolve(bt.alat.target)
  }

  // ---------- daftar tilik: urutan item + waktu dicentang ----------
  const tilik = meta.grup.flatMap((g) => g.item.map((it) => ({ key: it.key, nama: it.latin.replace(/\s*\([^)]*\)\s*$/, ''), grup: g.judul })))
    .filter((it, i, a) => a.findIndex((x) => x.nama === it.nama) === i)
  const waktuCentang = {}; for (const bt of TL.beats) if (bt.centang) waktuCentang[bt.centang] = bt.t1
  for (const it of tilik) if (!(it.key in waktuCentang)) console.warn(`[w${W}] PERINGATAN: ${it.key} tidak pernah dibahas di naskah`)
  function htmlTilik(t, step) {
    let iKini = tilik.findIndex((it) => it.key === step)
    if (iKini < 0) { const sel = tilik.map((it) => (waktuCentang[it.key] ?? Infinity) <= t); iKini = Math.max(0, sel.lastIndexOf(true) + 1) }
    const a = Math.max(0, Math.min(tilik.length - 6, iKini - 2)), selesai = tilik.filter((it) => (waktuCentang[it.key] ?? Infinity) <= t).length
    let h = `<div class="th">📋 DAFTAR TILIK <span>${selesai}/${tilik.length} ✓</span></div>`
    for (const it of tilik.slice(a, a + 6)) {
      const tc = waktuCentang[it.key] ?? Infinity, u = (t - (tc - 0.9)) / 0.9   // 0..1 selama animasi centang
      let cls = '', gaya = '', bx = ''
      if (t >= tc) { cls = 'selesai'; bx = '✓' }
      else if (u >= 0 && u < 1) {
        const zoom = 1 + 0.32 * Math.sin(Math.PI * Math.min(1, u * 1.15))           // baris membesar lalu kembali
        cls = 'kini' + (u > 0.45 ? ' selesai' : ''); gaya = `transform:scale(${zoom.toFixed(3)});`
        if (u > 0.45) { const pop = 1 + 0.9 * Math.max(0, 1 - (u - 0.45) / 0.25); bx = `<span style="display:inline-block;transform:scale(${pop.toFixed(2)})">✓</span>` }
      } else if (it.key === step) cls = 'kini'
      h += `<div class="row ${cls}" style="${gaya}"><span class="bx">${bx}</span>${esc(it.nama)}</div>`
    }
    return h
  }

  // ---------- alat klinis 3D (dibuat di dalam halaman) ----------
  await page.evaluate(() => {
    const { THREE, scene } = window.__atlas
    const logam = new THREE.MeshStandardMaterial({ color: 0xd9dde3, metalness: 0.85, roughness: 0.25 })
    const plastik = new THREE.MeshStandardMaterial({ color: 0xf4f6fa, transparent: true, opacity: 0.55, roughness: 0.2 })
    const gagang = new THREE.MeshStandardMaterial({ color: 0x8a96a3, metalness: 0.6, roughness: 0.35 })
    const hijau = new THREE.MeshStandardMaterial({ color: 0x2ea56b, roughness: 0.5 })
    const buat = {
      // Ujung alat di titik asal (0,0,0); alat memanjang ke arah +Y (menjauhi titik tusuk).
      jarum: () => { const g = new THREE.Group()
        const jr = new THREE.Mesh(new THREE.CylinderGeometry(0.00045, 0.00045, 0.032, 10), logam); jr.position.y = 0.016; g.add(jr)
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0012, 0.008, 16), hijau); hub.position.y = 0.035; g.add(hub)
        const tb = new THREE.Mesh(new THREE.CylinderGeometry(0.0055, 0.0055, 0.05, 24), plastik); tb.position.y = 0.064; g.add(tb)
        const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.06, 12), gagang); pl.position.y = 0.09; g.add(pl)
        return g },
      skalpel: () => { const g = new THREE.Group()
        const bl = new THREE.Mesh(new THREE.BoxGeometry(0.0004, 0.02, 0.009), logam); bl.position.y = 0.01; bl.position.z = 0.0025; g.add(bl)
        const hd = new THREE.Mesh(new THREE.BoxGeometry(0.0025, 0.075, 0.008), gagang); hd.position.y = 0.0575; g.add(hd)
        return g },
      klem: () => { const g = new THREE.Group()
        for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.0014, 0.05, 0.003), logam); r.position.set(s * 0.0022, 0.025, 0); r.rotation.z = s * 0.06; g.add(r) }
        const h = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0012, 8, 20), logam); h.position.y = 0.058; g.add(h)
        return g },
    }
    window.__alat = { buat, obj: null, jenis: null }
    // Titik tindakan: pusat vertex target pada ketinggian relatif yrel, digeser ke permukaan di sisi datangnya alat.
    window.__alatTitik = (a) => {
      if (a.titik) return new THREE.Vector3(...a.titik)   // titik tindakan eksplisit (mis. landmark)
      const { meshes } = window.__atlas, vs = []
      for (const id of a._ids) { const g = meshes.get(id).geometry.attributes.position; for (let i = 0; i < g.count; i++) vs.push(new THREE.Vector3(g.getX(i), g.getY(i), g.getZ(i))) }
      const ys = vs.map((v) => v.y), y0 = Math.min(...ys), y1 = Math.max(...ys), yt = y0 + (y1 - y0) * (a.yrel ?? 0.5)
      const dekat = vs.filter((v) => Math.abs(v.y - yt) < Math.max(0.004, (y1 - y0) * 0.03))
      const titik = dekat.reduce((s, v) => s.add(v), new THREE.Vector3()).divideScalar(dekat.length)
      const arah = new THREE.Vector3(...a.arah).normalize()
      return dekat.reduce((best, v) => (v.clone().sub(titik).dot(arah) > best.clone().sub(titik).dot(arah) ? v : best), dekat[0]).clone()
    }
  })

  let lastStep = null, lastAtas = null, lastTilik = null, lastSub = null, lastCd = null, lastBab = null, lastImg = null, lastAlat = null
  let stepPose = null, base = null, lastShot = null, lastSorotKey = null, prevCam = null, blend = null
  const t0 = Date.now()
  const daftar = SAMPLE || Array.from({ length: f1 - f0 }, (_, i) => f0 + i)
  for (const f of daftar) {
    const t = f / FPS, bt = beatAt(t)
    if (bt.step !== lastStep) {
      const i = keys.indexOf(bt.step); if (i < 0) throw new Error('step tidak ada: ' + bt.step)
      await page.evaluate((i) => window.__atlas.go(i), i)
      stepPose = await page.evaluate(() => window.__atlas.pose()); lastStep = bt.step; lastSorotKey = null
    }
    const sorotKey = JSON.stringify(bt._sorot)
    if (sorotKey !== lastSorotKey) { await page.evaluate((g) => window.__atlas.sorot(g), bt._sorot); lastSorotKey = sorotKey }
    if (bt.shot !== lastShot) {
      base = stepPose
      if (bt._sorot.length || bt.arah || bt.zoom || bt.alat) {
        base = await page.evaluate(([i, sorot, arah, zoom, alatIds, alat]) => {
          const A = window.__atlas, st = A.langkah(i), d = st.data
          if (alat) { const p = window.__alatTitik(alat); return A.framePose([], arah || d.kamera?.arah || 'depan', zoom || 1.15, p.toArray()) }
          const fokus = alatIds || (st.type === 'orientasi' ? d.fokus : (d.mesh.length ? d.mesh : d.konteks))
          const a = arah || d.kamera?.arah || 'depan', z = zoom || d.kamera?.zoom || 1
          const pin = d.pin && !alatIds ? A.meta().landmarks[d.pin] : null
          const dasar = A.framePose(fokus, a, z, pin)
          if (alatIds) return dasar
          const gabung = A.framePose([...fokus, ...sorot.flatMap((g) => g.ids)], a, z, pin)
          const jarak = (p) => Math.hypot(p.pos[0] - p.target[0], p.pos[1] - p.target[1], p.pos[2] - p.target[2])
          if (!gabung || jarak(gabung) <= jarak(dasar) * 1.9) return gabung || dasar
          const k = (jarak(dasar) * 1.9) / jarak(gabung)
          const t = gabung.target.map((v, j) => dasar.target[j] * 0.7 + v * 0.3)
          return { target: t, pos: t.map((v, j) => v + (gabung.pos[j] - gabung.target[j]) * k) }
        }, [keys.indexOf(bt.step), bt._sorot, bt.arah, bt.zoom, bt.alat ? bt.alat._ids : null, bt.alat || null])
      }
      blend = prevCam && !SAMPLE ? { from: prevCam, t0: t } : null
      lastShot = bt.shot
    }

    // ---------- panel kanan ----------
    const card = bt.card && bt.card.type !== 'bab' ? bt.card : null
    const atas = `<span class="vp-kick">${esc(bt.kicker || '')}</span><div class="vp-ttl">${esc(bt.title || '')}</div><div class="vp-st">${esc(bt.sub_title || '')}</div>` +
      (card ? `<div class="vp-card ${card.type}"><span class="vp-h">${esc(card.head)}</span>${esc(card.text)}</div>` : '')
    const tl = htmlTilik(t, bt.step)
    const bab = bt.card && bt.card.type === 'bab' ? bt.card.head : ''
    const cd = bt.countdown ? String(Math.max(1, bt.countdown - Math.floor(t - bt.t0))) : ''
    const sub = cd ? '' : bt.sub
    const img = bt.gambar ? bt.gambar.file : ''
    if (atas !== lastAtas || tl !== lastTilik || sub !== lastSub || cd !== lastCd || bab !== lastBab || img !== lastImg) {
      let dataUrl = null
      if (img && img !== lastImg) {
        const fp = path.join(GAMBAR_DIR, img); const ext = path.extname(fp).slice(1).toLowerCase().replace('jpg', 'jpeg')
        dataUrl = `data:image/${ext};base64,${fs.readFileSync(fp).toString('base64')}`
      }
      await page.evaluate(([atas, tl, sub, cd, bab, img, dataUrl, g]) => {
        document.getElementById('vp-atas').innerHTML = atas
        document.getElementById('vp-tilik').innerHTML = tl
        document.getElementById('vsub').innerHTML = sub ? `<span>${sub}</span>` : ''
        const c = document.getElementById('vcd'); c.style.display = cd ? 'grid' : 'none'; c.firstChild.textContent = cd
        const bb = document.getElementById('vbab'); bb.style.display = bab ? 'grid' : 'none'
        if (bab) { const m = bab.match(/^(\S+)\s+(.*)$/); bb.firstChild.innerHTML = `<small>BAB BARU ${m[1]}</small>${m[2]}` }
        const v = document.getElementById('vimg'); v.style.display = img ? 'block' : 'none'
        if (img && dataUrl) {
          v.querySelector('img').src = dataUrl
          v.querySelector('.jenis').textContent = g.jenis
          v.querySelector('.ket').innerHTML = `${g.judul}<small>${g.kredit}</small>`
        }
      }, [atas, tl, esc(sub), cd, bab, img, dataUrl, bt.gambar ? { jenis: bt.gambar.jenis, judul: esc(bt.gambar.judul), kredit: esc(bt.gambar.kredit) } : null])
      if (img && dataUrl) await page.waitForFunction(() => document.querySelector('#vimg img').complete)
      lastAtas = atas; lastTilik = tl; lastSub = sub; lastCd = cd; lastBab = bab; lastImg = img
    }
    if (img) {  // efek Ken Burns: gambar membesar pelan selama ditampilkan
      const u = (t - bt.t0) / Math.max(0.5, bt.t1 - bt.t0)
      await page.evaluate((s) => { document.querySelector('#vimg img').style.transform = `scale(${s})` }, (1 + 0.06 * smooth(u)).toFixed(4))
    }

    // ---------- alat klinis: muncul dari luar, bergerak menuju titik tindakan, lalu menusuk/menyayat ----------
    const alatKey = bt.alat ? JSON.stringify([bt.alat.jenis, bt.alat.target, bt.alat.arah, bt.t0]) : null
    if (alatKey !== lastAlat) {
      await page.evaluate((a) => {
        const { THREE, scene, meshes } = window.__atlas, al = window.__alat
        if (al.obj) { scene.remove(al.obj); al.obj = null }
        document.getElementById('valat').style.display = a ? 'block' : 'none'
        if (!a) return
        const arah = new THREE.Vector3(...a.arah).normalize(), permukaan = window.__alatTitik(a)
        const obj = al.buat[a.jenis](); obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah)
        obj.userData = { titik: permukaan.clone(), arah, masuk: (a.masuk ?? 6) / 1000, sayat: a.sayat ? new THREE.Vector3(...a.sayat).normalize() : null }
        scene.add(obj); al.obj = obj
      }, bt.alat)
      lastAlat = alatKey
    }
    if (bt.alat) {
      const u = (t - bt.t0) / Math.max(0.5, bt.t1 - bt.t0)
      await page.evaluate((u) => {
        const o = window.__alat.obj; if (!o) return
        const { titik, arah, masuk, sayat } = o.userData
        const datang = Math.min(1, u / 0.45), e = datang * datang * (3 - 2 * datang)
        let jarak = 0.07 * (1 - e) - masuk * Math.max(0, Math.min(1, (u - 0.45) / 0.15))   // mendekat → menembus
        const p = titik.clone().addScaledVector(arah, jarak)
        if (sayat && u > 0.6) p.addScaledVector(sayat, 0.015 * Math.min(1, (u - 0.6) / 0.3))     // skalpel menyayat sejajar
        o.position.copy(p)
      }, u)
    }

    // ---------- kamera ----------
    const k = Math.min(1, (t - bt.shot_t0) / Math.max(0.5, bt.shot_t1 - bt.shot_t0))
    const e = smooth(k)
    const putar = bt.alat ? 6 : 10
    const ang = (-putar + 2 * putar * e) * Math.PI / 180, zoom = 1 - 0.05 * e
    const [px, py, pz] = base.pos, [tx, ty, tz] = base.target
    const dx = px - tx, dz = pz - tz
    let cam = { pos: [tx + (dx * Math.cos(ang) + dz * Math.sin(ang)) * zoom, ty + (py - ty) * zoom, tz + (-dx * Math.sin(ang) + dz * Math.cos(ang)) * zoom], target: base.target }
    if (blend) {
      const u = Math.min(1, (t - blend.t0) / 0.8), w = smooth(u)
      if (u >= 1) blend = null
      else {
        const lerp = (a, b) => a.map((v, j) => v + (b[j] - v) * w)
        const tg = lerp(blend.from.target, cam.target)
        const o1 = blend.from.pos.map((v, j) => v - blend.from.target[j]), o2 = cam.pos.map((v, j) => v - cam.target[j])
        const L = (o) => Math.hypot(...o), n1 = o1.map((v) => v / L(o1)), n2 = o2.map((v) => v / L(o2))
        let d = lerp(n1, n2); const ld = L(d) || 1; d = d.map((v) => v / ld)
        const len = L(o1) + (L(o2) - L(o1)) * w
        cam = { pos: tg.map((v, j) => v + d[j] * len), target: tg }
      }
    }
    prevCam = cam
    await page.evaluate(([p, tg]) => window.__atlas.renderAt(p, tg), [cam.pos, cam.target])
    await page.screenshot({ path: path.join(SAMPLE ? WORK : OUT, `${SAMPLE ? 'sample-' : ''}${String(f).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 90 })
    if (!SAMPLE && (f - f0) % 300 === 0) console.log(`[w${W}] ${f - f0}/${f1 - f0} frame, ${((Date.now() - t0) / 60000).toFixed(1)} menit`)
  }
  console.log(`[w${W}] SELESAI ${daftar.length} frame dalam ${((Date.now() - t0) / 60000).toFixed(1)} menit`)
  await b.close()
})().catch((e) => { console.error(e); process.exit(1) })
