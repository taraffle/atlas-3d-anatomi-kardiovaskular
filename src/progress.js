// Progres belajar per pengguna, disimpan di browser masing-masing (localStorage).
// Kalau penyimpanan diblokir (mode privat, dsb.), situs tetap jalan; progres saja yang tidak tersimpan.
const KEY = 'atlas3d-progres-v1'

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
function writeAll(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch { /* abaikan */ }
}
function get(pid) {
  const p = readAll()[pid] || {}
  return { seen: new Set(p.seen || []), kuisTerbaik: p.kuisTerbaik || 0, selesai: !!p.selesai }
}

export const progres = {
  get,
  tandaiDilihat(pid, key) {
    const all = readAll(), p = all[pid] || {}
    const seen = new Set(p.seen || [])
    if (seen.has(key)) return false
    seen.add(key); p.seen = [...seen]; all[pid] = p; writeAll(all)
    return true
  },
  tandaiSelesai(pid) {
    const all = readAll(), p = all[pid] || {}
    const baru = !p.selesai
    p.selesai = true; all[pid] = p; writeAll(all)
    return baru
  },
  simpanSkorKuis(pid, benar) {
    const all = readAll(), p = all[pid] || {}
    const rekor = benar > (p.kuisTerbaik || 0)
    if (rekor) { p.kuisTerbaik = benar; all[pid] = p; writeAll(all) }
    return rekor
  },
}
