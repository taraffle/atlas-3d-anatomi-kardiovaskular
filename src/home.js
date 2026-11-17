import './style.css'
import { attributionLine } from './attribution.js'

const BASE = import.meta.env.BASE_URL
const app = document.querySelector('#app')
app.innerHTML = `
  <main class="home-wrap">
    <header class="home-head">
      <h1>Atlas 3D Praktikum Anatomi</h1>
      <p class="muted">Modul Kardiovaskular. Putar, perbesar, dan telusuri struktur yang ada di daftar tilik, langsung dari HP.</p>
    </header>
    <section id="list" class="cards"><p class="muted">Memuat daftar praktikum…</p></section>
    <section class="howto">
      <h2>Cara pakai</h2>
      <ul>
        <li><b>Satu jari</b>: putar model. <b>Dua jari</b>: cubit untuk zoom, geser untuk menggeser.</li>
        <li><b>Ketuk</b> sebuah struktur untuk memilihnya. Struktur terpilih berwarna <span class="hl">kuning</span>.</li>
        <li><b>Lanjut / Kembali</b> untuk menelusuri semua struktur berurutan. <b>☰</b> untuk daftar lengkap.</li>
        <li><b>Tulang</b>: hilang / tembus / utuh. <b>Lihat dalam</b>: dinding jantung dibuat transparan.</li>
        <li>Tiap praktikum dimulai dengan <b>Orientasi</b> supaya kamu tahu letak organ di dalam tubuh.</li>
      </ul>
      <p class="muted small">Struktur yang tidak ada di model 3D tetap ada di daftar (ditandai ○) beserta penjelasannya. Situs ini dibuat untuk belajar mandiri, bukan materi resmi departemen. Selalu cocokkan dengan atlas dan cadaver.</p>
    </section>
    <footer class="attr small">${attributionLine(BASE)}</footer>
  </main>
`
fetch(`${BASE}data/index.json`).then((r) => r.json()).then((list) => {
  document.querySelector('#list').innerHTML = list.map((p) => `
    <a class="card" href="${BASE}viewer.html?p=${p.id}">
      <div class="card-num">${p.id}</div>
      <div><div class="card-title">${p.judul}</div><div class="muted small">${p.topik}</div>
      <div class="muted small">${p.jumlahStruktur} struktur · ±${p.ukuranMB.toLocaleString('id')} MB</div></div>
    </a>`).join('')
}).catch(() => { document.querySelector('#list').innerHTML = '<p>Gagal memuat daftar.</p>' })
