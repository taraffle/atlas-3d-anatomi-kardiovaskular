# Pembuat video (Praktikum 1)

Video dibuat dari model 3D asli di viewer (mode rekam `viewer.html?p=1&video=1`) + voiceover TTS bahasa Indonesia.

1. **Naskah**: `naskah.py`. Semua fakta diambil dari `content/praktikum-1.json`. `say` = teks untuk suara, `sub` = subtitle.
2. **Suara** (`audio.py`): butuh [Piper](https://pypi.org/project/piper-tts/) + suara `id_ID-news_tts-medium` dari Hugging Face (`rhasspy/piper-voices`). Taruh di folder yang ditunjuk env `TTS_DIR` (berisi `venv/bin/piper` dan `id_ID-news_tts-medium.onnx` + `.onnx.json`). Hasil: `work/audio.wav` + `work/timeline.json`.
3. **Frame** (`render.cjs`): jalankan `npm run build && npx vite preview --port 4173`, lalu `node render.cjs <worker> <jumlahWorker>` (bisa paralel). Cek tampilan dulu dengan `SAMPLE="2,60.5" node render.cjs 0 1`.
4. **Gabung** (`gabung.sh`): frame + audio → `Praktikum1_Jantung_Atlas3D.mp4`.
5. (Opsional) `cek_suara.py`: transkrip beberapa klip dengan Whisper untuk mengecek kejelasan ucapan.

Folder `work/` tidak di-commit (berisi ribuan frame).
