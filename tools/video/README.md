# Pembuat video (Praktikum 1)

Video dibuat dari model 3D asli di viewer (mode rekam `viewer.html?p=1&video=1`) + voiceover TTS bahasa Indonesia.

1. **Naskah**: `naskah.py`. Semua fakta diambil dari `content/praktikum-1.json`. `say` = teks untuk suara, `sub` = subtitle, `sorot` = struktur yang sedang disebut (menyala cyan + label), `arah`/`zoom` = sudut kamera khusus kalimat itu.
2. **Suara** (`audio.py`): bawaan memakai suara neural Microsoft lewat paket `edge-tts` (`TTS_VOICE=id-ID-GadisNeural` atau `id-ID-ArdiNeural`; perlu akses ke `speech.platform.bing.com`). Alternatif lokal: `TTS_ENGINE=piper` dengan suara `id_ID-news_tts-medium` (lebih kaku). Folder mesin suara ditunjuk env `TTS_DIR`. Hasil: `work/audio.wav` + `work/timeline.json`.
3. **Frame** (`render.cjs`): jalankan `npm run build && npx vite preview --port 4173`, lalu `node render.cjs <worker> <jumlahWorker>` (bisa paralel). Cek tampilan dulu dengan `SAMPLE="2,60.5" node render.cjs 0 1`.
4. **Gabung** (`gabung.sh`): frame + audio → `Praktikum1_Jantung_Atlas3D.mp4`.
5. (Opsional) `cek_suara.py`: transkrip beberapa klip dengan Whisper untuk mengecek kejelasan ucapan.

Folder `work/` tidak di-commit (berisi ribuan frame).
