# Pembuat video tutorial (opsional)

Alat untuk membuat video tur 3D per praktikum: voiceover Bahasa Indonesia, sorotan per kalimat,
daftar tilik yang dicentang otomatis (zoom → ✓), kartu gambar (ilustrasi / foto cadaver / lukisan diseksi),
dan animasi alat klinis 3D (jarum, skalpel, klem). Tidak dipakai oleh website.

## Langkah

1. **Naskah**: `naskah_p1.py`, `naskah_p2.py`, `naskah_p3.py` (alat bantunya di `naskah_umum.py`, lihat komentar di atas file itu).
   Semua fakta diambil dari `content/praktikum-N.json`. Daftar tilik di video hanya memakai **nama struktur** dari JSON itu.
2. **Suara + timeline** (`audio.py`): butuh folder `../tts` berisi venv dengan `edge-tts`
   (`python -m venv ../tts/venv && ../tts/venv/bin/pip install edge-tts numpy`).
   ```bash
   PRAKTIKUM=2 TTS_VOICE=id-ID-GadisNeural ../tts/venv/bin/python audio.py
   ```
   Hasil: `work-p2/audio.wav` + `work-p2/timeline.json`.
3. **Gambar**: taruh file di `gambar/` (tidak ikut di-commit). Daftar file & lisensinya ada di `gambar/KREDIT.md`.
   Semua dari Wikimedia Commons: Gray's Anatomy 1918 & Ellis–Ford 1867 (domain publik), foto Anatomist90 (CC BY-SA 3.0).
4. **Frame** (`render.cjs`): jalankan `npm run build && npx vite preview --port 4173`, lalu
   ```bash
   PRAKTIKUM=2 node render.cjs 0 3   # worker 0 dari 3; jalankan juga 1 dan 2 secara paralel
   ```
   Cek tampilan dulu: `PRAKTIKUM=2 SAMPLE="60,350.5" node render.cjs 0 1`.
5. **Gabung** (`gabung.sh`): `PRAKTIKUM=2 ./gabung.sh "Judul video" NamaFile.mp4`.
6. **Cek suara** (`cek_suara.py`, opsional): transkrip ulang dengan faster-whisper untuk memeriksa pelafalan.

## Kredit di deskripsi video
Model 3D: BodyParts3D © The Database Center for Life Science, CC BY 4.0.
Gambar: lihat `gambar/KREDIT.md`. Bukan materi resmi departemen mana pun.
