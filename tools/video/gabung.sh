#!/usr/bin/env bash
# Pakai: PRAKTIKUM=2 ./gabung.sh "Judul" NamaFile.mp4
# Gabungkan frame + audio jadi MP4 (H.264 + AAC, faststart).
set -euo pipefail
cd "$(dirname "$0")/work-p${PRAKTIKUM}"
ffmpeg -y -v error -stats -framerate 15 -i frames/%06d.jpg -i audio.wav \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -r 30 -tune animation \
  -c:a aac -b:a 128k -ar 44100 -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -shortest -movflags +faststart \
  -metadata title="$1" \
  -metadata comment="Model 3D: BodyParts3D (c) The Database Center for Life Science, CC BY 4.0. Gambar: Wikimedia Commons (lihat deskripsi)" \
  "../$2"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "../$2"
