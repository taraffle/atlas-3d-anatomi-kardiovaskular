# Alat bantu menulis naskah video. Dipakai oleh naskah_p2.py, naskah_p3.py, dst.
#
# beat(...)   : satu kalimat voiceover + tampilan.
#   step      : struktur utama (key item di content/praktikum-N.json) → disorot KUNING
#   sorot     : [(label, penanda)] struktur yang disebut kalimat ini → CYAN + label.
#               penanda: 'item:<key>' | 'name:<regex nama BodyParts3D>' | 'FJxxxx' | 'X_...' (ilustrasi buatan)
#   card      : kartu di panel kanan: dict(type=..., head=..., text=...)
#               type: nama | mnemo | klinis | fakta | model | ilus | intro | q | a
#   gambar    : tampilkan gambar besar di area 3D: dict(file, jenis, judul, kredit) (file relatif ke folder gambar/)
#   alat      : animasi alat klinis 3D: dict(jenis='jarum'|'skalpel'|'klem', target=penanda, yrel=0..1,
#               arah=[x,y,z] (dari titik tindakan ke arah datangnya alat), masuk=mm, sayat=[x,y,z] opsional)
#   arah/zoom : sudut kamera khusus kalimat ini
# say = teks untuk suara (istilah ditulis lengkap); sub = subtitle (boleh pakai singkatan).

B = []


def beat(say, step=None, kicker=None, title=None, sub_title=None, card=None, sub=None, sfx=None, hold=0.35,
         sorot=None, arah=None, zoom=None, gambar=None, alat=None):
    B.append(dict(say=say, step=step, kicker=kicker, title=title, sub_title=sub_title, card=card, sub=sub or say,
                  sfx=sfx, hold=hold, sorot=sorot or [], arah=arah, zoom=zoom, gambar=gambar, alat=alat))


def tebak(no, step, kicker, title, sub_title, tanya_say, tanya_card, jawab_say, jawab_card, jawab_sorot=None, jawab_arah=None, jawab_sub=None):
    head = f'📝 Coba tebak! Daftar tilik no. {no}'
    beat(tanya_say, step, kicker, title, sub_title, card=dict(type='q', head=head, text=tanya_card), sfx='pop')
    B.append(dict(countdown=3, card=dict(type='q', head=head, text=tanya_card)))
    beat(jawab_say, card=dict(type='a', head='✅ Jawabannya', text=jawab_card), sfx='ding', hold=0.6, sorot=jawab_sorot, arah=jawab_arah, sub=jawab_sub)


def judul_bab(kicker, emoji, teks_say):
    beat(teks_say, kicker=kicker, card=dict(type='bab', head=f'{emoji} {kicker}', text=''), sfx='whoosh', hold=0.5)


# ---- kredit gambar (dicantumkan di layar & deskripsi YouTube) ----
GRAY = 'Henry Gray, Anatomy of the Human Body (1918) · domain publik · via Wikimedia Commons'
FORD = 'Ellis & Ford, Illustrations of Dissections (1867) · domain publik · via Wikimedia Commons'
A90 = 'Foto: Anatomist90 · CC BY-SA 3.0 · via Wikimedia Commons'


def ilus(file, judul, kredit=GRAY, jenis='🖼️ ILUSTRASI'):
    return dict(file=file, jenis=jenis, judul=judul, kredit=kredit)


def cadaver(file, judul, kredit=A90):
    return dict(file=file, jenis='🔬 FOTO CADAVER', judul=judul, kredit=kredit)


def lukisan(file, judul):
    return dict(file=file, jenis='🎨 LUKISAN DISEKSI', judul=judul, kredit=FORD)
