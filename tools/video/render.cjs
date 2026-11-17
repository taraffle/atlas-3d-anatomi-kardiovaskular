// Rekam frame video dari viewer (mode ?video=1).
// Pakai: node render.cjs <worker> <jumlahWorker> [fps]
const { chromium } = require('playwright')
const fs = require('fs'), path = require('path')

const [W, NW, FPS] = [+process.argv[2], +process.argv[3], +(process.argv[4] || 15)]
const TL = JSON.parse(fs.readFileSync(path.join(__dirname, 'work/timeline.json'), 'utf8'))
const OUT = path.join(__dirname, 'work/frames'); fs.mkdirSync(OUT, { recursive: true })
const N = Math.ceil(TL.total * FPS)
const per = Math.ceil(N / NW), f0 = W * per, f1 = Math.min(N, f0 + per)
// SAMPLE="t1,t2" → hanya render frame pada detik-detik itu (untuk cek tampilan).
const SAMPLE = process.env.SAMPLE ? process.env.SAMPLE.split(',').map((x) => Math.round(+x * FPS)) : null

const CSS = `
body.video #stage { position: fixed; left: 0; top: 0; width: 850px; height: 720px; }
#vp { position: fixed; right: 0; top: 0; width: 430px; height: 720px; background: #241f2c; color: #f2edf6; padding: 30px 30px 20px; box-sizing: border-box; display: flex; flex-direction: column; font-family: Nunito, system-ui, sans-serif; border-left: 1px solid #3e3749; }
#vp .vp-kick { align-self: flex-start; font-size: 15px; font-weight: 800; color: #ffa489; background: #47302c; padding: 4px 14px; border-radius: 999px; }
#vp .vp-ttl { font-size: 33px; line-height: 1.15; font-weight: 800; margin: 16px 0 6px; }
#vp .vp-st { font-size: 19px; color: #b1a8bc; font-weight: 600; }
#vp .vp-card { margin-top: 22px; border-radius: 20px; padding: 18px 20px; font-size: 20px; line-height: 1.4; white-space: pre-line; font-weight: 600; }
#vp .vp-card .vp-h { display: block; font-size: 17px; font-weight: 800; margin-bottom: 6px; }
#vp .vp-card.q { background: #3d3420; } #vp .vp-card.q .vp-h { color: #ffd36b; }
#vp .vp-card.a { background: #1f3a31; } #vp .vp-card.a .vp-h { color: #4fd39a; }
#vp .vp-card.mnemo { background: #31294d; } #vp .vp-card.mnemo .vp-h { color: #b9a0ff; }
#vp .vp-card.nama { background: #1f2b45; } #vp .vp-card.nama .vp-h { color: #84b5ff; }
#vp .vp-card.klinis { background: #1c3631; } #vp .vp-card.klinis .vp-h { color: #4fd39a; }
#vp .vp-card.fakta { background: #3e301c; } #vp .vp-card.fakta .vp-h { color: #f3b45a; }
#vp .vp-card.model { background: #302a38; } #vp .vp-card.model .vp-h { color: #b1a8bc; }
#vp .vp-card.intro { background: linear-gradient(135deg, #4a2c3a, #46391f 60%, #23344d); font-size: 22px; } #vp .vp-card.intro .vp-h { font-size: 26px; color: #fff; }
#vp .vp-foot { margin-top: auto; font-size: 11.5px; color: #8f86a0; line-height: 1.35; }
#vp .vp-foot b { color: #ffa489; }
#vsub { position: fixed; left: 40px; width: 770px; bottom: 26px; text-align: center; pointer-events: none; }
#vsub span { display: inline; background: rgba(15, 12, 20, 0.78); color: #fff; font: 700 21px/1.55 Nunito, system-ui, sans-serif; padding: 3px 10px; border-radius: 8px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
#vcd { position: fixed; left: 0; top: 0; width: 850px; height: 720px; display: none; place-items: center; pointer-events: none; }
#vcd div { width: 210px; height: 210px; border-radius: 50%; background: rgba(255, 194, 26, 0.94); color: #3b2a00; display: grid; place-items: center; font: 900 120px/1 Nunito, sans-serif; box-shadow: 0 0 0 16px rgba(255, 194, 26, 0.25); }
#vbab { position: fixed; left: 0; top: 0; width: 850px; height: 720px; display: none; place-items: center; pointer-events: none; background: rgba(20, 16, 26, 0.55); }
#vbab div { background: #ff8a6b; color: #fff; font: 900 46px/1.2 Nunito, sans-serif; padding: 22px 40px; border-radius: 26px; text-align: center; max-width: 700px; box-shadow: 0 12px 40px rgba(0,0,0,.4); }
#vbab small { display: block; font-size: 18px; font-weight: 800; opacity: 0.9; margin-bottom: 4px; letter-spacing: 0.08em; }
body.video .dir-top { top: 14px; } body.video .dir-bottom { bottom: auto; top: 50px; display: none; }
`

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
function beatAt(t) { return TL.beats.find((b) => t >= b.t0 && t < b.t1) || TL.beats[TL.beats.length - 1] }

;(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, colorScheme: 'dark' })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4173/viewer.html?p=1&video=1')
  await page.waitForFunction(() => window.__atlas?.ready, null, { timeout: 90000 })
  await page.evaluate((css) => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st)
    document.body.insertAdjacentHTML('beforeend', '<div id="vp"></div><div id="vsub"></div><div id="vcd"><div></div></div><div id="vbab"><div></div></div>')
    window.dispatchEvent(new Event('resize'))
  }, CSS)
  await page.waitForTimeout(500)
  const keys = await page.evaluate(() => window.__atlas.steps())
  let lastStep = null, lastPanel = null, lastSub = null, lastCd = null, lastBab = null, pose = null
  const t0 = Date.now()
  const daftar = SAMPLE || Array.from({ length: f1 - f0 }, (_, i) => f0 + i)
  for (const f of daftar) {
    const t = f / FPS, bt = beatAt(t)
    if (bt.step !== lastStep) {
      const i = keys.indexOf(bt.step); if (i < 0) throw new Error('step tidak ada: ' + bt.step)
      await page.evaluate((i) => window.__atlas.go(i), i)
      await page.evaluate(() => window.dispatchEvent(new Event('resize')))
      pose = await page.evaluate(() => window.__atlas.pose()); lastStep = bt.step
    }
    // Panel kanan (judul + kartu). Kartu "bab" tampil sebagai banner besar di area 3D.
    const card = bt.card && bt.card.type !== 'bab' ? bt.card : null
    const panel = `<span class="vp-kick">${esc(bt.kicker || '')}</span><div class="vp-ttl">${esc(bt.title || '')}</div><div class="vp-st">${esc(bt.sub_title || '')}</div>` +
      (card ? `<div class="vp-card ${card.type}"><span class="vp-h">${esc(card.head)}</span>${esc(card.text)}</div>` : '') +
      `<div class="vp-foot"><b>Atlas 3D · Anatomi Modul Kardiovaskular</b><br>Model 3D: BodyParts3D © The Database Center for Life Science, CC BY 4.0 (via @dagno/anatomy-model). Materi untuk belajar mandiri, bukan materi resmi departemen.</div>`
    const bab = bt.card && bt.card.type === 'bab' ? bt.card.head : ''
    const cd = bt.countdown ? String(Math.max(1, bt.countdown - Math.floor(t - bt.t0))) : ''
    const sub = cd ? '' : bt.sub
    if (panel !== lastPanel || sub !== lastSub || cd !== lastCd || bab !== lastBab) {
      await page.evaluate(([panel, sub, cd, bab]) => {
        document.getElementById('vp').innerHTML = panel
        document.getElementById('vsub').innerHTML = sub ? `<span>${sub}</span>` : ''
        const c = document.getElementById('vcd'); c.style.display = cd ? 'grid' : 'none'; c.firstChild.textContent = cd
        const g = document.getElementById('vbab'); g.style.display = bab ? 'grid' : 'none'
        if (bab) { const m = bab.match(/^(\S+)\s+(.*)$/); g.firstChild.innerHTML = `<small>BAB BARU ${m[1]}</small>${m[2]}` }
      }, [panel, esc(sub), cd, bab])
      lastPanel = panel; lastSub = sub; lastCd = cd; lastBab = bab
    }
    // Kamera: putar pelan mengelilingi target sepanjang shot (−14° → +14°) + zoom-in halus 6%.
    const k = Math.min(1, (t - bt.shot_t0) / Math.max(0.5, bt.shot_t1 - bt.shot_t0))
    const e = k * k * (3 - 2 * k)
    const ang = (-14 + 28 * e) * Math.PI / 180, zoom = 1 - 0.06 * e
    const [px, py, pz] = pose.pos, [tx, ty, tz] = pose.target
    const dx = px - tx, dz = pz - tz
    const p = [tx + (dx * Math.cos(ang) + dz * Math.sin(ang)) * zoom, ty + (py - ty) * zoom, tz + (-dx * Math.sin(ang) + dz * Math.cos(ang)) * zoom]
    await page.evaluate(([p, tg]) => window.__atlas.renderAt(p, tg), [p, pose.target])
    await page.screenshot({ path: path.join(SAMPLE ? path.join(__dirname, 'work') : OUT, `${SAMPLE ? 'sample-' : ''}${String(f).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 90 })
    if ((f - f0) % 300 === 0) console.log(`[w${W}] ${f - f0}/${f1 - f0} frame, ${((Date.now() - t0) / 1000 / 60).toFixed(1)} menit`)
  }
  console.log(`[w${W}] SELESAI ${f1 - f0} frame dalam ${((Date.now() - t0) / 60000).toFixed(1)} menit`)
  await b.close()
})().catch((e) => { console.error(e); process.exit(1) })
