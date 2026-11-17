import sys, os, subprocess
import numpy as np
from faster_whisper import WhisperModel
sys.path.insert(0, os.path.dirname(__file__))
from naskah import B
m = WhisperModel('small', device='cpu', compute_type='int8')
vo = os.path.join(os.path.dirname(__file__), 'work', 'vo')
for i in [0, 3, 12, 24, 40, 60, 95, 120]:
    p = os.path.join(vo, f'{i:03d}.wav')
    if not os.path.exists(p): continue
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ar', '16000', '-ac', '1', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    seg, _ = m.transcribe(audio, language='id', beam_size=3)
    print(f'--- {i}\nNASKAH : {B[i]["say"]}\nDENGAR : {" ".join(s.text.strip() for s in seg)}')
