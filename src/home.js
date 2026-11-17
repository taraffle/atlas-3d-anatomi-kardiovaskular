import './style.css'
import { attributionLine } from './attribution.js'
import { progres } from './progress.js'
import { pasangTombolTema } from './theme.js'

const BASE = import.meta.env.BASE_URL
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const app = document.querySelector('#app')
app.innerHTML = `
  <main class="home-wrap">
    <header class="hero">
      <div class="hero-emoji" aria-hidden="true">🩺</div>
      <button class="icon-btn theme-btn" id="tema"></button>
      <div class="wave">Halo, calon dokter! 👋</div>
      <h1>Atlas 3D Praktikum Anatomi</h1>
      <p>Belajar Modul Kardiovaskular sebelum ketemu cadaver. Putar modelnya, tebak strukturnya, dan cek jawaban daftar tilikmu, dari HP, tablet, atau laptop.</p>
    </header>

    <h2 class="section-title">Pilih praktikum</h2>
    <section id="list" class="cards"><p class="muted">Memuat daftar praktikum…</p></section>

    <h2 class="section-title">Cara belajar yang asyik</h2>
    <section class="tips">
      <div class="tip"><span class="tip-emoji">🧭</span><span class="tip-title">1. Orientasi dulu</span>Lihat letak organ di dalam tubuh, lengkap dengan tulang di sekitarnya.</div>
      <div class="tip"><span class="tip-emoji">👆</span><span class="tip-title">2. Telusuri</span>Tekan <b>Lanjut</b>, atau ketuk struktur mana saja di model. Yang <span class="hl">kuning</span> itulah yang sedang dibahas.</div>
      <div class="tip"><span class="tip-emoji">📝</span><span class="tip-title">3. Jawab daftar tilik</span>Coba jawab sendiri dulu, baru buka jawabannya.</div>
      <div class="tip"><span class="tip-emoji">🎯</span><span class="tip-title">4. Kuis!</span>Uji ingatanmu: struktur disorot, kamu tebak namanya. Kejar skor sempurna 🏆</div>
    </section>

    <details class="howto">
      <summary>🕹️ Cara mengendalikan model 3D</summary>
      <ul>
        <li><b>HP/tablet</b>: satu jari untuk memutar; dua jari dicubit untuk zoom, digeser untuk menggeser.</li>
        <li><b>Komputer</b>: drag mouse untuk memutar, scroll untuk zoom, klik kanan + drag untuk menggeser.</li>
        <li><b>Ketuk/klik</b> sebuah struktur untuk membuka materinya. <b>☰</b> untuk daftar lengkap.</li>
        <li><b>Tulang</b>: hilang / tembus / utuh. <b>Lihat dalam</b>: dinding jantung dibuat transparan.</li>
        <li>Label <b>"Kiri pasien"</b> di tepi layar ikut berputar, jadi kamu nggak akan ketukar kiri-kanan.</li>
      </ul>
    </details>

    <p class="note-kecil">📄 Struktur yang tidak ada di model 3D tetap ada di daftar (ditandai ○) beserta penjelasannya. Situs ini untuk belajar mandiri, bukan materi resmi departemen. Selalu cocokkan dengan atlas dan cadaver ya!</p>
    <footer class="attr small">${attributionLine(BASE)}</footer>
  </main>
`

pasangTombolTema(document.querySelector('#tema'))

fetch(`${BASE}data/index.json`).then((r) => r.json()).then((list) => {
  document.querySelector('#list').innerHTML = list.map((p) => {
    const pr = progres.get(String(p.id))
    const n = Math.min(pr.seen.size, p.jumlahStruktur)
    const status = pr.selesai ? '🏆 Semua sudah dilihat' : n ? `✨ ${n}/${p.jumlahStruktur} sudah dilihat` : '🚀 Belum dimulai'
    const kuis = pr.kuisTerbaik ? ` · 🎯 Skor kuis terbaik: ${pr.kuisTerbaik}` : ''
    return `
    <a class="card" href="${BASE}viewer.html?p=${p.id}" style="--card-color:${esc(p.warna)};--card-bg:${esc(p.warnaLatar)}">
      <div class="card-icon" aria-hidden="true">${esc(p.ikon)}</div>
      <div class="card-body">
        <div class="card-title">${esc(p.judul)}</div>
        <div class="muted small">${esc(p.topik)}</div>
        <div class="progress"><span style="width:${(n / p.jumlahStruktur) * 100}%"></span></div>
        <div class="card-meta"><span>${status}${kuis}</span><span>${p.jumlahStruktur} struktur · ±${p.ukuranMB.toLocaleString('id')} MB</span></div>
      </div>
      <div class="card-go" aria-hidden="true">›</div>
    </a>`
  }).join('')
}).catch(() => { document.querySelector('#list').innerHTML = '<p>😵 Gagal memuat daftar. Coba muat ulang halaman.</p>' })
