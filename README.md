# Atlas 3D · Anatomi Modul Kardiovaskular

Situs atlas 3D untuk praktikum anatomi Modul Kardiovaskular. Bisa dibuka di HP dan berbahasa Indonesia. Semua model 3D berasal dari data anatomi asli BodyParts3D (lewat paket npm `@dagno/anatomy-model`, CC BY 4.0). Rincian atribusi ada di `atribusi.html`.

> PDF daftar tilik departemen **tidak** disimpan di repo ini dan tidak boleh di-upload. Materi di `content/` hanya memakai nama struktur. Pertanyaannya ditulis ulang sebagai judul topik.

## Struktur folder

```
content/praktikum-N.json   ← MATERI (ini yang paling sering kamu edit)
scripts/build-data.mjs     ← preprocessing: ambil mesh yang dipakai → public/data/
src/                       ← kode viewer (three.js) dan halaman utama
public/data/               ← hasil preprocessing (dibuat otomatis, jangan diedit)
docs/pemetaan-struktur.md  ← tabel struktur → ID mesh BodyParts3D
```

## Menjalankan di komputer sendiri

Butuh [Node.js](https://nodejs.org) versi 20 ke atas.

```bash
npm install
```

```bash
npm run dev
```

Lalu buka alamat yang muncul (biasanya http://localhost:5173). `npm run dev` otomatis menjalankan preprocessing dulu.

## Mengedit materi yang sudah ada

Buka `content/praktikum-N.json` dan ubah teksnya. Tiap struktur punya kolom berikut:

| Kolom | Isi |
|---|---|
| `latin`, `indonesia` | Nama struktur |
| `status` | `"ada"` (ada mesh), `"terkait"` (ditunjukkan lewat mesh lain), `"ilustrasi"` (bentuk buatan dari `scripts/buatan.mjs`, ID diawali `X_`), `"tidak-ada"` (hanya teks) |
| `mesh` | ID mesh yang disorot kuning, misal `["FJ3645"]`, atau nama set seperti `"@vci"` |
| `konteks` | Mesh yang ditampilkan normal di sekitarnya. Mesh lain otomatis diredupkan |
| `kamera` | `{"arah": "depan"}`. Pilihan: depan, belakang, kiri, kanan, atas, bawah, atau vektor `[x, y, z]`. Tambahan opsional: `"zoom": 0.7` (lebih dekat) / `1.5` (lebih jauh) |
| `tulang` | Keadaan tulang saat struktur dibuka: `"hilang"`, `"tembus"`, `"utuh"` |
| `mode` | `"dalam"` agar dinding jantung transparan saat dibuka |
| `rongga` | `true` hanya untuk struktur rongga jantung (rongga tidak pernah tampil di struktur lain) |
| `pin`, `pinLabel` | Titik penanda "perkiraan" (nama landmark yang ada di `scripts/build-data.mjs`) |
| `catatanModel` | Penjelasan jujur tentang keterbatasan model |
| `ringkas`, `klinis`, `asalNama`, `funFact`, `jembatanKeledai` | Materi (semua opsional) |
| `pertanyaan` | `{"no": 3, "teks": "judul topik", "jawaban": "…"}` |
| `perluDicek` | Daftar fakta yang belum diverifikasi, tampil sebagai kotak merah "PERLU DICEK" |

Arah sumbu model: +x = kiri pasien, +y = kepala, +z = depan.

## Menambah praktikum baru

1. **Salin** file yang paling mirip, misalnya `content/praktikum-3.json` → `content/praktikum-4.json`. Ganti `id` menjadi `4`, lalu ubah `judul`, `topik`, dan tampilan kartunya: `ikon` (satu emoji, misal `"🫁"`), `warna` (warna utama, misal `"#f59f00"`), dan `warnaLatar` (versi pucatnya, misal `"#fff3d6"`).
2. **Cari ID mesh** untuk struktur yang kamu perlukan. Jalankan perintah ini (ganti kata kuncinya):
   ```bash
   node -e "const a=require('@dagno/anatomy-model/model/atlas.json');for(const p of a.parts)if(/renal/i.test(p.name))console.log(p.id,p.system,p.name)"
   ```
   Nama di BodyParts3D berbahasa Inggris, misalnya "Right renal artery". Kalau tidak ketemu, struktur itu memang tidak ada di model. Pakai `"status": "tidak-ada"`, jangan dipaksakan ke mesh lain.
3. **Isi** `grup` (subtopik) dan `item` (struktur) seperti contoh di file lain.
   - `scene`: mesh yang selalu dimuat.
   - `set`: singkatan untuk sekelompok ID, dipakai dengan awalan `@`.
   - `tulangPola`: regex nama tulang yang ikut dimuat.
   - `sisi: "kanan"`: build akan menolak mesh sisi kiri (berguna untuk ekstremitas).
4. **Isi `orientasi`**: 2–4 langkah yang menunjukkan letak organ di dalam tubuh beserta tulang di sekitarnya.
5. **Jalankan** `npm run data`. Script akan:
   - menolak ID yang salah atau tidak ada;
   - menampilkan ukuran file (usahakan di bawah 2 MB; kalau lebih, kurangi tulang atau mesh konteks).
6. **Cek** dengan `npm run dev`, lalu buka setiap struktur dan pastikan yang kuning benar-benar struktur yang dimaksud.
7. **Upload**: commit lalu push ke GitHub. Situs akan ter-update otomatis dalam 1–2 menit (lihat tab *Actions* di GitHub).

Praktikum baru otomatis muncul di halaman utama. Tidak perlu mengubah kode.

## Ganti nama situs (untuk modul lain)

Nama yang tampil di halaman ada di `src/situs.js` (`label`, `nama`, `deskripsi`). Judul tab browser ada di tag `<title>` di `index.html`, `viewer.html`, dan `atribusi.html`. Untuk modul baru, kamu bisa menyalin seluruh repo ini menjadi repo baru (misalnya `atlas-3d-respirasi`), lalu mengganti nama di tempat-tempat itu dan mengisi `content/` dengan praktikum modul tersebut.

## Fitur belajar

- **Progres**: struktur yang sudah dibuka diberi tanda ✓, disimpan di browser masing-masing pengguna (tidak dikirim ke mana pun).
- **Kuis 🎯**: 10 soal acak dari struktur berstatus `"ada"`. Pengecoh diutamakan dari subtopik yang sama. Struktur baru otomatis ikut masuk kuis.

## Deploy

Situs dibangun dan dipublikasikan otomatis oleh GitHub Actions (`.github/workflows/deploy.yml`) setiap kali ada push ke branch `main`.
