"""Bikin voiceover (Piper TTS, suara id_ID-news_tts-medium) + efek suara, dan timeline untuk perekam frame.
Output: work/timeline.json, work/audio.wav
"""
import json, os, re, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TTS = os.environ.get('TTS_DIR', os.path.join(HERE, '..', 'tts'))  # folder berisi venv/bin/piper + model suara
WORK = os.path.join(HERE, 'work'); os.makedirs(os.path.join(WORK, 'vo'), exist_ok=True)
sys.path.insert(0, HERE)
from naskah import B  # noqa: E402

SR = 22050
LEAD_IN = 0.6  # detik hening di awal

# Ejaan untuk mesin suara (tidak mengubah subtitle).
EJAAN = [
    (r'\bLAD\b', 'el a de'), (r'\bPDA\b', 'pe de a'), (r'\bnodus SA\b', 'nodus es a'),
    (r'BodyParts3D', 'Bodi Parts tri di'), (r'\bm\. psoas\b', 'muskulus psoas'),
    (r'May-Thurner', 'Mei Turner'), (r'widowmaker', 'widow meker'), (r'\bC tiga\b', 'Se tiga'), (r'\bC lima\b', 'Se lima'),
]
def ejaan(t):
    for a, b in EJAAN: t = re.sub(a, b, t)
    assert not re.search(r'\b(a|v|m|n|r|aa|vv|mm|rr|lig)\.\s', t), f'singkatan tertinggal: {t}'
    return t

def tts(text, path):
    if os.path.exists(path): return
    subprocess.run([os.path.join(TTS, 'venv/bin/piper'), '-m', os.path.join(TTS, 'id_ID-news_tts-medium.onnx'),
                    '--length-scale', '0.94', '--sentence-silence', '0.15', '-f', path],
                   input=text.encode(), check=True, capture_output=True)

def baca(path):
    with wave.open(path) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768

# ---------- efek suara (disintesis, tanpa file luar) ----------
def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)
def nada(f, dur, d=0.3, vol=0.3):
    n = int(SR * dur); t = np.arange(n) / SR
    return vol * np.sin(2 * np.pi * f * t) * env(n, d=d)
SFX = {
    'ding': np.concatenate([nada(1046.5, 0.18, 0.12, 0.22), nada(1568, 0.7, 0.35, 0.25)]),
    'pop': nada(660, 0.12, 0.05, 0.25) + nada(990, 0.12, 0.04, 0.12),
    'tick': nada(1200, 0.08, 0.025, 0.22),
    'go': nada(1600, 0.25, 0.09, 0.22),
}
n = int(SR * 0.6); t = np.arange(n) / SR
noise = np.random.default_rng(1).standard_normal(n)
kern = np.ones(40) / 40
SFX['whoosh'] = 0.18 * np.convolve(noise, kern, 'same') * np.sin(np.pi * t / 0.6) ** 2

# ---------- timeline ----------
beats, waktu, step, kicker, title, sub_title, card = [], LEAD_IN, None, None, None, None, None
klip = []  # (mulai, array)
for i, b in enumerate(B):
    if b.get('step') and b['step'] != step:
        step = b['step']; card = None
    for k in ('kicker', 'title', 'sub_title'):
        pass
    if b.get('kicker'): kicker = b['kicker']
    if b.get('title'): title = b['title']; sub_title = b.get('sub_title')
    if b.get('card'): card = b['card']
    if b.get('countdown'):
        dur = float(b['countdown']) + 0.4
        for s in range(int(b['countdown'])):
            klip.append((waktu + s, SFX['tick']))
        beats.append(dict(t0=waktu, t1=waktu + dur, step=step, kicker=kicker, title=title, sub_title=sub_title, card=card,
                          sub='', countdown=int(b['countdown'])))
        waktu += dur
        continue
    path = os.path.join(WORK, 'vo', f'{i:03d}.wav')
    tts(ejaan(b['say']), path)
    a = baca(path)
    if b.get('sfx'):
        klip.append((waktu, SFX[b['sfx']]))
    mulai_suara = waktu + (0.25 if b.get('sfx') in ('whoosh', 'pop') else 0.0)
    klip.append((mulai_suara, a))
    dur = (mulai_suara - waktu) + len(a) / SR + b['hold']
    beats.append(dict(t0=waktu, t1=waktu + dur, step=step, kicker=kicker, title=title, sub_title=sub_title, card=card, sub=b['sub']))
    waktu += dur
total = waktu + 1.2
print(f'{len(beats)} beat, durasi {total / 60:.1f} menit')

# Rentang waktu tiap "shot" (beat berurutan dengan step sama) untuk gerak kamera.
shots, cur = [], None
for b in beats:
    if not cur or cur['step'] != b['step']:
        cur = dict(step=b['step'], t0=b['t0'], t1=b['t1']); shots.append(cur)
    else: cur['t1'] = b['t1']
for b in beats:
    s = next(s for s in shots if s['t0'] <= b['t0'] < s['t1'] + 1e-6 and s['step'] == b['step'])
    b['shot_t0'], b['shot_t1'] = s['t0'], s['t1']

json.dump(dict(total=total, beats=beats), open(os.path.join(WORK, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)

# ---------- mix audio ----------
mix = np.zeros(int(SR * total) + SR)
for mulai, a in klip:
    i0 = int(mulai * SR); mix[i0:i0 + len(a)] += a[: len(mix) - i0]
peak = np.max(np.abs(mix)); mix = mix / max(peak, 1e-9) * 0.89
with wave.open(os.path.join(WORK, 'audio.wav'), 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('audio.wav selesai, peak dinormalisasi')
