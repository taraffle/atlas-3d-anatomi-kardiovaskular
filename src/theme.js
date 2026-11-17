// Tema terang/gelap. Bawaan: ikut pengaturan perangkat. Pilihan manual diingat di browser.
// Atribut data-theme sudah dipasang lebih awal oleh skrip kecil di <head> (supaya tidak berkedip).
const KEY = 'atlas3d-tema' // 'terang' | 'gelap' | (kosong = ikut perangkat)
const media = window.matchMedia('(prefers-color-scheme: dark)')

function pilihan() { try { return localStorage.getItem(KEY) } catch { return null } }
function aktif() { const p = pilihan(); return p === 'gelap' || (p !== 'terang' && media.matches) ? 'dark' : 'light' }

const buttons = new Set()
function terapkan() {
  const t = aktif()
  document.documentElement.dataset.theme = t
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#1c1922' : '#fff8f1')
  for (const b of buttons) {
    b.textContent = t === 'dark' ? '☀️' : '🌙'
    b.title = t === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'
    b.setAttribute('aria-label', b.title)
  }
  window.dispatchEvent(new CustomEvent('tema', { detail: t }))
}

export function pasangTombolTema(b) {
  buttons.add(b)
  b.addEventListener('click', () => {
    try { localStorage.setItem(KEY, aktif() === 'dark' ? 'terang' : 'gelap') } catch { /* tetap ganti untuk sesi ini */ }
    // Kalau penyimpanan diblokir, ganti langsung tanpa mengingat.
    if (!pilihan()) document.documentElement.dataset.theme = aktif() === 'dark' ? 'light' : 'dark'
    terapkan()
  })
  terapkan()
}
media.addEventListener?.('change', () => { if (!pilihan()) terapkan() })
terapkan()
