#!/usr/bin/env bash
# Gabungkan frame + audio jadi MP4 (H.264 + AAC, faststart: bisa langsung diputar saat diunduh).
set -euo pipefail
cd "$(dirname "$0")/work"
ffmpeg -y -v error -stats -framerate 15 -i frames/%06d.jpg -i audio.wav \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -r 30 -tune animation \
  -c:a aac -b:a 128k -ar 44100 -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  -shortest -movflags +faststart \
  -metadata title="Atlas 3D · Anatomi Modul Kardiovaskular — Praktikum 1: Jantung" \
  -metadata comment="Model 3D: BodyParts3D (c) The Database Center for Life Science, CC BY 4.0" \
  ../AnatomiKV_Praktikum1_Jantung.mp4
ffprobe -v error -show_entries format=duration,size -of default=nw=1 ../AnatomiKV_Praktikum1_Jantung.mp4
