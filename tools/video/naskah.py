# Naskah video Praktikum 1 (versi 2: sorotan per kalimat).
# Semua fakta diambil dari content/praktikum-1.json (materi website).
# Setiap "beat" = satu kalimat voiceover (say) + tampilan:
#   step  : struktur utama (disorot KUNING, seperti di website)
#   sorot : struktur yang sedang DISEBUT di kalimat ini (disorot CYAN + label nama)
#           penanda: 'item:<key>' (mesh struktur di materi), 'name:<regex nama BodyParts3D>', atau 'FJxxxx'
#   arah  : (opsional) sudut kamera khusus untuk kalimat ini
# sub: subtitle (boleh pakai singkatan), say: teks untuk mesin suara.

B = []


def beat(say, step=None, kicker=None, title=None, sub_title=None, card=None, sub=None, sfx=None, hold=0.35, sorot=None, arah=None, zoom=None):
    B.append(dict(say=say, step=step, kicker=kicker, title=title, sub_title=sub_title, card=card, sub=sub or say,
                  sfx=sfx, hold=hold, sorot=sorot or [], arah=arah, zoom=zoom))


def tebak(no, step, kicker, title, sub_title, tanya_say, tanya_card, jawab_say, jawab_card, jawab_sorot=None, jawab_arah=None):
    head = f'📝 Coba tebak! Daftar tilik no. {no}'
    beat(tanya_say, step, kicker, title, sub_title, card=dict(type='q', head=head, text=tanya_card), sfx='pop')
    B.append(dict(countdown=3, card=dict(type='q', head=head, text=tanya_card)))
    beat(jawab_say, card=dict(type='a', head='✅ Jawabannya', text=jawab_card), sfx='ding', hold=0.6, sorot=jawab_sorot, arah=jawab_arah)


def judul_bab(kicker, emoji, teks_say):
    beat(teks_say, kicker=kicker, card=dict(type='bab', head=f'{emoji} {kicker}', text=''), sfx='whoosh', hold=0.5)


# ---- penanda yang sering dipakai ----
STERNUM = ('Sternum', 'name:^(Manubrium|Body of sternum|Xiphoid process)$')
MANUBRIUM = ('Manubrium sterni', 'name:^Manubrium$')
IGA = ('Costae (iga)', 'name:^(Left|Right) \\w+ rib$')
KARTILAGO = ('Cartilago costalis', 'name:^(Left|Right) (second|third|fourth|fifth|sixth) costal cartilage$')
DIAFRAGMA = ('Diaphragma', 'FJ3131')
ESOFAGUS = ('Oesophagus', 'FJ2563')
TRAKEA = ('Trachea', 'FJ2541')
BRONKUS_KI = ('Bronchus principalis sinister', 'FJ2450')
VERTEBRA = ('Vertebrae', 'name:^\\w+ (thoracic|lumbar) vertebra$')
def V(nama, label=None): return (label or nama, f'name:^{nama}$')
KLAVIKULA_KA = ('Clavicula dextra', 'name:^Right clavicle$')
KLAVIKULA_KI = ('Clavicula sinistra', 'name:^Left clavicle$')
PSOAS = ('M. psoas major', 'name:psoas major$')
HIP = ('Os coxae', 'name:^(Left|Right) hip bone$')
SAKRUM = ('Sacrum', 'name:^Sacrum$')
def I(key, label): return (label, f'item:{key}')

K = '🫀 Praktikum 1'

# ================= INTRO & ORIENTASI =================
beat('Halo, calon dokter! Selamat datang di tur tiga dimensi jantung dan pembuluh darah besar.',
     'orientasi-1', K, 'Anatomi Modul Kardiovaskular', 'Praktikum 1: Jantung',
     card=dict(type='intro', head='Halo, calon dokter! 👋', text='Tur 3D Praktikum 1: jantung & pembuluh darah besar'), sfx='whoosh')
beat('Semua model di video ini berasal dari data anatomi asli BodyParts3D. Siapkan daftar tilikmu, yuk mulai!')
beat('Pertama, orientasi. Jantung terletak di mediastinum medius, tepat di belakang sternum, atau tulang dada.',
     'orientasi-1', 'Orientasi', 'Jantung di rongga dada', 'Mediastinum medius', sfx='pop', sorot=[STERNUM])
beat('Ia juga berada di belakang tulang rawan iga kedua sampai keenam.', sorot=[KARTILAGO])
beat('Kira-kira dua pertiga massanya ada di sebelah kiri garis tengah, dan ia duduk di atas diafragma.',
     sorot=[DIAFRAGMA], arah=[0, 0.25, 1])
beat('Kalau tulangnya kita buat tembus, kelihatan sumbu jantung itu miring: dari basis di belakang atas kanan, ke apeks di depan bawah kiri.',
     'orientasi-2', 'Orientasi', 'Sumbu jantung miring', None)
beat('Akibatnya, bagian yang paling banyak terlihat dari depan adalah ventrikel kanan. Ingat ini waktu kamu membuka perikardium di cadaver!',
     sorot=[I('ventriculus-dexter', 'Ventriculus dexter')],
     card=dict(type='fakta', head='💡 Tips cadaver', text='Dari depan, yang paling banyak terlihat = ventrikel kanan.'))
beat('Dari sisi kiri: jantung di depan, lalu aorta desendens dan tulang belakang di belakangnya.',
     'orientasi-3', 'Orientasi', 'Dilihat dari kiri', None, sorot=[I('aorta-thoracica', 'Aorta descendens'), VERTEBRA])
beat('Atrium kiri adalah ruang jantung yang paling belakang, tepat di depan esofagus.',
     sorot=[I('atrium-sinistrum', 'Atrium sinistrum'), ESOFAGUS])
beat('Lalu aorta turun di depan tulang belakang, menembus diafragma, dan bercabang dua menjadi arteri iliaka komunis.',
     'orientasi-4', 'Orientasi', 'Pembuluh besar sampai panggul', None, sorot=[DIAFRAGMA, I('iliaca-communis', 'A. & V. iliaca communis')])
beat('Vena kava inferior berjalan di sebelah kanannya, dan tulang panggul membantu kamu membayangkan letak pembuluh iliaka di cadaver.',
     sorot=[I('vci', 'Vena cava inferior'), HIP, SAKRUM])

# ================= PELINDUNG JANTUNG =================
judul_bab('Pelindung jantung', '🛡️', 'Bab pertama: pelindung jantung!')
beat('Perikardium fibrosa adalah kantong jaringan ikat padat paling luar. Namanya dari peri, artinya sekitar, dan kardia, artinya jantung.',
     'pericardium-fibrosum', 'Pelindung jantung', 'Pericardium fibrosum', 'Perikardium fibrosa',
     card=dict(type='nama', head='🔤 Asal nama', text='Peri- (sekitar) + kardia (jantung)'))
beat('Perikardium tidak ada di model tiga dimensi ini, jadi yang menyala adalah jantung yang dibungkusnya. Di bawah, kantong ini melekat ke diafragma.',
     sorot=[DIAFRAGMA], card=dict(type='model', head='ℹ️ Tentang model', text='Perikardium tidak dimodelkan di BodyParts3D'))
beat('Fakta klinis: karena tidak bisa melar, cairan atau darah yang menumpuk di rongga perikardium bisa cepat menekan jantung. Ini disebut tamponade jantung.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Tamponade jantung'))
beat('Di dalamnya ada perikardium serosa. Lamina parietalis melapisi bagian dalam perikardium fibrosa, lalu berbalik di pangkal pembuluh besar menjadi lamina viseralis, atau epikardium, yang menempel langsung di permukaan jantung.',
     'pericardium-serosum-parietale', 'Pelindung jantung', 'Pericardium serosum', 'Lamina parietalis & visceralis (epicardium)',
     sorot=[I('aorta-ascendens', 'Aorta ascendens'), I('truncus-pulmonalis', 'Truncus pulmonalis'), I('vcs', 'V. cava superior')],
     card=dict(type='nama', head='🔤 Asal nama', text='Parietalis = dinding · Visceralis = organ · Epi- = di atas'))
tebak(1, 'cavum-sinus-pericardii', 'Pelindung jantung', 'Cavum & sinus pericardii', None,
      'Waktunya tebak-tebakan! Apa itu kavum perikardii, sinus transversus, dan sinus obliquus?',
      'Cavum pericardii, sinus transversus, sinus obliquus: apa dan di mana?',
      'Kavum perikardii adalah ruang potensial di antara lamina parietalis dan viseralis. Sinus transversus adalah lorong di belakang aorta asendens dan trunkus pulmonalis, tempat pin ini.',
      'Cavum: ruang potensial antara lamina parietalis & visceralis\nSinus transversus: di belakang aorta ascendens + truncus pulmonalis\nSinus obliquus: kantong buntu di belakang atrium kiri',
      jawab_sorot=[I('aorta-ascendens', 'Aorta ascendens'), I('truncus-pulmonalis', 'Truncus pulmonalis')])
beat('Sedangkan sinus obliquus adalah kantong buntu di belakang atrium kiri, dikelilingi vena-vena pulmonalis.',
     sorot=[I('atrium-sinistrum', 'Atrium sinistrum'), I('vv-pulmonales', 'Vv. pulmonales')], arah='belakang')
beat('Fakta klinis: saat operasi jantung, dokter bedah melewatkan klem lewat sinus transversus untuk menjepit aorta dan trunkus pulmonalis.',
     sorot=[I('aorta-ascendens', 'Aorta ascendens'), I('truncus-pulmonalis', 'Truncus pulmonalis')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Klem lewat sinus transversus saat operasi jantung'))
tebak(2, 'n-phrenicus', 'Pelindung jantung', 'Nervus phrenicus', 'Saraf frenikus',
      'Berikutnya, nervus frenikus, dari akar saraf C tiga sampai C lima. Sarafnya tidak ada di model, tapi ia turun di sisi jantung. Tebak: saraf ini menginervasi apa?',
      'Nervus phrenicus menginervasi apa?',
      'Motorik: diafragma, satu-satunya persarafan motorik diafragma. Sensorik: perikardium, pleura mediastinalis, pleura diafragmatika bagian sentral, dan peritoneum di bawahnya.',
      'Motorik: diaphragma\nSensorik: pericardium, pleura mediastinalis, pleura diaphragmatica sentral, peritoneum di bawahnya',
      jawab_sorot=[DIAFRAGMA], jawab_arah=[0, 0.2, 1])
beat('Jembatan keledainya: C tiga, empat, lima, keeps the diaphragm alive!', sorot=[DIAFRAGMA],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"C3, 4, 5 keeps the diaphragm alive"'))
beat('Fun fact: phren dalam bahasa Yunani berarti diafragma. Dulu orang Yunani mengira jiwa ada di diafragma, makanya kata ini juga jadi akar kata skizofrenia!',
     sorot=[DIAFRAGMA], card=dict(type='nama', head='🔤 Asal nama', text='Phren (Yunani) = diafragma → juga akar kata "skizofrenia"'))
beat('Saraf ini berjalan bersama arteri dan vena perikardiakofrenika, cabang dari arteri torasika interna yang turun di belakang tulang rawan iga ini.',
     'a-v-pericardiacophrenica', 'Pelindung jantung', 'A. & V. pericardiacophrenica', None, sorot=[KARTILAGO])
beat('Namanya pun menjelaskan daerah yang diperdarahinya: perikardium dan frenikus, alias diafragma.', sorot=[DIAFRAGMA],
     card=dict(type='nama', head='🔤 Asal nama', text='Pericardio- + phrenica: dua daerah yang diperdarahinya'))

# ================= PEMBULUH BESAR =================
judul_bab('Pembuluh darah besar', '🩸', 'Bab dua: jantung in situ dan pembuluh-pembuluh darah besar!')
beat('Vena brakiosefalika kanan dibentuk oleh vena jugularis interna dari leher, dan vena subklavia dari lengan, di belakang ujung klavikula kanan.',
     'v-brachiocephalica-dextra', 'Pembuluh darah besar', 'V. brachiocephalica dextra', 'Vena brakiosefalika kanan',
     sorot=[('V. jugularis interna', 'FJ3585'), ('V. subclavia', 'FJ3587'), KLAVIKULA_KA])
beat('Makanya namanya brakiosefalika: brakium artinya lengan, kefale artinya kepala.',
     sorot=[('V. jugularis interna (kepala)', 'FJ3585'), ('V. subclavia (lengan)', 'FJ3587')],
     card=dict(type='nama', head='🔤 Asal nama', text='Brachium (lengan) + kephale (kepala)'))
beat('Yang kiri kira-kira dua kali lebih panjang. Ia menyeberang miring ke kanan di belakang manubrium, di depan cabang-cabang arkus aorta.',
     'v-brachiocephalica-sinistra', 'Pembuluh darah besar', 'V. brachiocephalica sinistra', 'Vena brakiosefalika kiri',
     sorot=[MANUBRIUM, I('arcus-aortae', 'Arcus aortae')])
beat('Kedua vena brakiosefalika bersatu membentuk vena kava superior, yang turun di sebelah kanan aorta asendens lalu bermuara ke atrium kanan.',
     'vcs', 'Pembuluh darah besar', 'Vena cava superior', 'Vena kava superior',
     sorot=[I('v-brachiocephalica-dextra', 'V. brachiocephalica dextra'), I('v-brachiocephalica-sinistra', 'V. brachiocephalica sinistra'), I('aorta-ascendens', 'Aorta ascendens'), I('atrium-dextrum', 'Atrium dextrum')])
beat('Dari belakang, ia menerima vena azigos. Kava artinya berongga, karena ukurannya yang besar.',
     sorot=[I('v-azygos', 'V. azygos')], arah=[-0.6, 0.2, -0.8], card=dict(type='nama', head='🔤 Asal nama', text='Cava = berongga (karena besar)'))
beat('Trunkus pulmonalis keluar dari ventrikel kanan, naik di depan aorta asendens, lalu bercabang menjadi arteri pulmonalis kanan dan kiri.',
     'truncus-pulmonalis', 'Pembuluh darah besar', 'Truncus pulmonalis', 'Batang arteri pulmonalis',
     sorot=[I('ventriculus-dexter', 'Ventriculus dexter'), I('aorta-ascendens', 'Aorta ascendens'), I('a-pulmonales', 'Aa. pulmonales')])
beat('Arteri pulmonalis kanan lebih panjang, dan berjalan di belakang aorta asendens dan vena kava superior.',
     'a-pulmonales', 'Pembuluh darah besar', 'Arteriae pulmonales', 'Arteri pulmonalis kanan & kiri',
     sorot=[I('aorta-ascendens', 'Aorta ascendens'), I('vcs', 'V. cava superior')])
beat('Fun fact: inilah satu-satunya arteri pada orang dewasa yang membawa darah miskin oksigen, makanya di model ini warnanya biru.',
     card=dict(type='fakta', head='💡 Tahukah kamu?', text='Satu-satunya arteri dewasa yang membawa darah MISKIN oksigen'))
beat('Sebaliknya, empat vena pulmonalis membawa darah kaya oksigen ke atrium kiri, jadi warnanya merah.',
     'vv-pulmonales', 'Pembuluh darah besar', 'Venae pulmonales', 'Vena-vena pulmonalis', sorot=[I('atrium-sinistrum', 'Atrium sinistrum')],
     card=dict(type='fakta', head='💡 Tahukah kamu?', text='Satu-satunya vena dewasa yang membawa darah KAYA oksigen'))
beat('Aorta asendens keluar dari ventrikel kiri, panjangnya sekitar lima sentimeter. Dari pangkalnya keluar arteri koroner kanan dan kiri.',
     'aorta-ascendens', 'Pembuluh darah besar', 'Aorta ascendens', 'Aorta asendens',
     sorot=[I('ventriculus-sinister', 'Ventriculus sinister'), I('a-coronaria-dextra', 'A. coronaria dextra'), ('A. coronaria sinistra', 'item:a-coronaria-sinistra')],
     card=dict(type='nama', head='🔤 Asal nama', text='Aorte (Yunani) = yang diangkat/digantung · Ascendens = naik'))
tebak(3, 'arcus-aortae', 'Pembuluh darah besar', 'Arcus aortae', 'Lengkung aorta',
      'Ini arkus aorta, yang mulai dan berakhir setinggi angulus sterni. Tebak: apa saja cabang-cabangnya?',
      'Sebutkan cabang-cabang arcus aortae!',
      'Dari kanan ke kiri: trunkus brakiosefalikus, arteri karotis komunis kiri, dan arteri subklavia kiri.',
      '1. Truncus brachiocephalicus\n2. A. carotis communis sinistra\n3. A. subclavia sinistra',
      jawab_sorot=[('Truncus brachiocephalicus', 'FJ3417'), ('A. carotis communis sinistra', 'FJ3483'), ('A. subclavia sinistra', 'FJ3479')])
beat('Jembatan keledainya: A B C S. Aortic arch, Brachiocephalic, Carotid, Subclavian!',
     sorot=[('B', 'FJ3417'), ('C', 'FJ3483'), ('S', 'FJ3479')],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"ABC\'S": Arch → Brachiocephalic → Carotid → Subclavian'))
tebak(4, 'lig-arteriosum', 'Pembuluh darah besar', 'Ligamentum arteriosum (Botalli)', 'Sisa ductus arteriosus',
      'Pin ini menandai ligamentum arteriosum, yang menghubungkan arkus aorta dengan arteri pulmonalis kiri. Tebak: apa makna klinisnya?',
      'Apa makna klinis ligamentum arteriosum?',
      'Nervus laringeus rekuren kiri melingkar di bawah arkus aorta tepat di dekat ligamentum ini, jadi rawan cedera saat operasi. Kalau duktusnya tidak menutup setelah lahir, terjadilah PDA.',
      '• Penanda n. laryngeus recurrens sinister (risiko suara serak)\n• Duktus tidak menutup → PDA (machinery murmur)\n• Koarktasio aorta sering di dekatnya',
      jawab_sorot=[I('arcus-aortae', 'Arcus aortae'), ('A. pulmonalis sinistra', 'FJ2924')])
beat('Fun fact: ligamentum ini dinamai Botallo, padahal duktusnya sudah dideskripsikan jauh sebelumnya oleh Galen. Eponim yang salah alamat!',
     card=dict(type='nama', head='🔤 Asal nama', text='Eponim Leonardo Botallo, tapi Galen sudah mendeskripsikannya lebih dulu'))
beat('Setelah arkus, aorta turun sebagai aorta desendens, mulai setinggi vertebra torakal empat sampai lima.',
     'aorta-descendens', 'Pembuluh darah besar', 'Aorta descendens', 'Aorta desendens',
     sorot=[V('Fourth thoracic vertebra', 'T4'), V('Fifth thoracic vertebra', 'T5')])
beat('Selama di dada, namanya aorta torakalis, karena toraks artinya dada. Ia memberi cabang interkostal posterior di antara iga-iga, cabang bronkial, esofageal, dan lain-lain.',
     'aorta-thoracica', 'Pembuluh darah besar', 'Aorta thoracica', 'Aorta torakalis', sorot=[IGA, ESOFAGUS])
beat('Setelah menembus diafragma setinggi vertebra torakal dua belas, namanya berganti jadi aorta abdominalis.',
     'aorta-abdominalis', 'Pembuluh darah besar', 'Aorta abdominalis', None,
     sorot=[DIAFRAGMA, V('Twelfth thoracic vertebra', 'T12')], arah=[0, 0.1, 1])
beat('Ia lalu bercabang dua setinggi lumbal empat, kira-kira sejajar dengan pusar.',
     sorot=[V('Fourth lumbar vertebra', 'L4'), I('iliaca-communis', 'A. & V. iliaca communis')])
beat('Ingat angka delapan, sepuluh, dua belas: vena kava inferior menembus diafragma di T delapan, esofagus di T sepuluh, dan aorta di T dua belas.',
     sorot=[DIAFRAGMA, I('vci', 'V. cava inferior'), ESOFAGUS, V('Eighth thoracic vertebra', 'T8'), V('Tenth thoracic vertebra', 'T10'), V('Twelfth thoracic vertebra', 'T12')],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"I 8 10 Eggs At 12"\nIVC T8 · Esophagus T10 · Aorta T12'))
beat('Di sini lahir arteri dan vena iliaka komunis. Fakta klinis: arteri iliaka komunis kanan bisa menekan vena iliaka komunis kiri. Itu sindrom May-Thurner.',
     'iliaca-communis', 'Pembuluh darah besar', 'A. & V. iliaca communis', 'Arteri & vena iliaka komunis',
     sorot=[('A. iliaca communis dextra', 'FJ3565'), ('V. iliaca communis sinistra', 'FJ3465')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Sindrom May-Thurner → DVT lebih sering di tungkai kiri'))
beat('Iliaka eksterna berjalan di sepanjang tepi muskulus psoas, lalu lewat di bawah ligamentum inguinale dan berganti nama menjadi arteri femoralis.',
     'iliaca-externa', 'Pembuluh darah besar', 'A. & V. iliaca externa', None, sorot=[PSOAS],
     sub='Iliaca externa berjalan di tepi m. psoas, lalu lewat di bawah lig. inguinale dan berganti nama menjadi a. femoralis.')
beat('Iliaka interna masuk ke rongga panggul, di depan sakrum, memperdarahi organ panggul, regio glutea, dan perineum.',
     'iliaca-interna', 'Pembuluh darah besar', 'A. & V. iliaca interna', None, sorot=[SAKRUM])
beat('Vena kava inferior adalah vena terbesar di tubuh. Ia dibentuk setinggi lumbal lima oleh kedua vena iliaka komunis, lalu naik di kanan aorta.',
     'vci', 'Pembuluh darah besar', 'Vena cava inferior', 'Vena kava inferior',
     sorot=[V('Fifth lumbar vertebra', 'L5'), ('Vv. iliacae communes', 'FJ3566'), ('Aorta', 'FJ1932')])
beat('Ia menembus diafragma setinggi torakal delapan, lalu masuk ke atrium kanan.', sorot=[DIAFRAGMA, I('atrium-dextrum', 'Atrium dextrum')], arah=[0, 0.1, 1])
tebak(5, 'v-azygos', 'Pembuluh darah besar', 'Vena azygos', 'Vena azigos',
      'Ini vena azigos, naik di sisi kanan tulang belakang lalu melengkung ke vena kava superior. Tebak: apa fungsi utamanya?',
      'Sebutkan fungsi utama vena azygos!',
      'Mengalirkan darah dari dinding toraks posterior, lewat vena-vena interkostal di antara iga, ke vena kava superior. Ia juga jalur kolateral kalau vena kava inferior tersumbat.',
      '• Drainase dinding toraks posterior (vv. intercostales posteriores) → VCS\n• Jalur kolateral VCI ↔ VCS',
      jawab_sorot=[IGA, I('vcs', 'V. cava superior')])
beat('Fun fact: azigos artinya tanpa pasangan, karena vena ini hanya ada di kanan. Di kiri, perannya digantikan vena hemiazigos.',
     sorot=[('V. hemiazygos', 'FJ3434'), ('V. hemiazygos accessoria', 'FJ1981')],
     card=dict(type='nama', head='🔤 Asal nama', text='A- (tanpa) + zygos (pasangan)'))

# ================= PERMUKAAN JANTUNG =================
judul_bab('Permukaan jantung', '🗺️', 'Bab tiga: struktur-struktur di permukaan jantung!')
beat('Apeks kordis, ujung jantung yang mengarah ke depan bawah kiri, dibentuk oleh ventrikel kiri.',
     'apex-cordis', 'Permukaan jantung', 'Apex cordis', 'Puncak jantung')
beat('Letaknya kira-kira di belakang sela iga kelima kiri. Di sinilah iktus kordis teraba, dan ini juga titik auskultasi katup mitral.',
     sorot=[('Costa V & VI kiri', 'name:^Left (fifth|sixth) rib$')], arah=[0.3, 0, 1],
     sub='Letaknya kira-kira di belakang ICS V kiri. Di sinilah ictus cordis teraba, dan ini juga titik auskultasi katup mitral.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Ictus cordis teraba di sini · auskultasi mitral'))
beat('Nah, ini sering tertukar! Basis kordis tidak menghadap ke bawah, tapi ke belakang, ke arah tulang belakang. Ia terutama dibentuk oleh atrium kiri.',
     'basis-cordis', 'Permukaan jantung', 'Basis cordis', 'Facies posterior cordis', sorot=[VERTEBRA],
     card=dict(type='fakta', head='⚠️ Sering tertukar', text='Basis = BELAKANG, bukan bawah. Permukaan bawah = facies diaphragmatica.'))
beat('Fasies sternokostalis adalah permukaan depan. Namanya begitu karena ia menghadap sternum dan kosta, alias tulang dada dan tulang iga.',
     'facies-sternocostalis', 'Permukaan jantung', 'Facies sternocostalis', 'Permukaan depan', sorot=[STERNUM, IGA, KARTILAGO],
     card=dict(type='nama', head='🔤 Asal nama', text='Sternum (tulang dada) + costa (iga)'))
beat('Sebagian besar permukaan ini dibentuk oleh ventrikel kanan.')
beat('Fasies diafragmatika adalah permukaan bawah. Namanya begitu karena ia bertumpu di atas diafragma. Terutama dibentuk oleh ventrikel kiri.',
     'facies-diaphragmatica', 'Permukaan jantung', 'Facies diaphragmatica', 'Permukaan bawah', sorot=[DIAFRAGMA],
     card=dict(type='nama', head='🔤 Asal nama', text='Diaphragma (Yunani: sekat)'))
beat('Lalu tiga tepi. Margo dekster, tepi kanan, dibentuk atrium kanan, terbentang di antara vena kava superior dan inferior.',
     'margo-dexter', 'Permukaan jantung', 'Margo dexter', 'Tepi kanan', sorot=[I('vcs', 'V. cava superior'), ('V. cava inferior', 'FJ3441')])
beat('Margo sinister, atau margo obtusus, dibentuk ventrikel kiri. Obtusus artinya tumpul, karena tepinya membulat.',
     'margo-sinister', 'Permukaan jantung', 'Margo sinister / obtusus', 'Tepi kiri (tumpul)',
     card=dict(type='nama', head='🔤 Asal nama', text='Obtusus = tumpul'))
beat('Dan margo inferior, atau margo akutus, terutama dibentuk ventrikel kanan. Akutus artinya tajam. Ramus marginalis dekster berjalan di sepanjang tepi ini.',
     'margo-inferior', 'Permukaan jantung', 'Margo inferior / acutus', 'Tepi bawah (tajam)', sorot=[I('r-marginalis-dexter', 'R. marginalis dexter')],
     card=dict(type='nama', head='🔤 Asal nama', text='Acutus = tajam'))
tebak(6, 'sulcus-coronarius', 'Permukaan jantung', 'Sulcus coronarius', 'Alur koroner',
      'Sulkus koronarius melingkari jantung, memisahkan atrium dari ventrikel. Tebak: struktur apa saja yang melintasinya?',
      'Struktur apa saja yang melintasi sulcus coronarius?',
      'Arteri koroner kanan, ramus sirkumfleksus, sinus koronarius, vena kordis magna, dan vena kordis parva.',
      '• A. coronaria dextra\n• R. circumflexus\n• Sinus coronarius\n• V. cordis magna\n• V. cordis parva',
      jawab_sorot=[('A. coronaria dextra', 'FJ2723'), I('r-circumflexus', 'R. circumflexus'), I('sinus-coronarius', 'Sinus coronarius'), ('V. cordis magna', 'FJ2656')])
beat('Fun fact: korona artinya mahkota. Pembuluh yang melingkari jantung seperti mahkota inilah yang disebut koroner.',
     card=dict(type='nama', head='🔤 Asal nama', text='Corona = mahkota → "koroner"'))
beat('Sulkus interventrikularis anterior menandai letak septum dari depan. Isinya ramus interventrikularis anterior dan venanya.',
     'sulcus-iv-anterior', 'Permukaan jantung', 'Sulcus interventricularis anterior', None,
     sorot=[('R. interventricularis anterior', 'FJ2631')])
beat('Dan sulkus interventrikularis posterior di permukaan bawah, berisi ramus interventrikularis posterior dan vena kordis media.',
     'sulcus-iv-posterior', 'Permukaan jantung', 'Sulcus interventricularis posterior', None, sorot=[I('r-interventricularis-posterior', 'R. interventricularis posterior')])
beat('Sulkus terminalis adalah alur dangkal di atrium kanan, dari vena kava superior ke inferior. Fakta klinis: nodus SA, pacu jantung alami kita, ada di ujung atasnya.',
     'sulcus-terminalis', 'Permukaan jantung', 'Sulcus terminalis cordis', None, sorot=[I('vcs', 'V. cava superior'), ('V. cava inferior', 'FJ3441')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Nodus SA di ujung atas sulcus / crista terminalis'))

# ================= ATRIUM DEXTRUM =================
judul_bab('Atrium dextrum', '🚪', 'Sekarang kita masuk ke ruang-ruang jantung. Mulai dari atrium kanan!')
beat('Atrium kanan menerima darah miskin oksigen dari vena kava superior, vena kava inferior, dan sinus koronarius.',
     'atrium-dextrum', 'Atrium dextrum', 'Atrium dextrum', 'Serambi kanan',
     sorot=[I('vcs', 'V. cava superior'), ('V. cava inferior', 'FJ3441'), I('sinus-coronarius', 'Sinus coronarius')])
beat('Atrium artinya ruang depan rumah Romawi, tempat tamu masuk sebelum ke ruang utama. Di sini, ruang utamanya adalah ventrikel.',
     sorot=[I('ventriculus-dexter', 'Ventriculus dexter')], card=dict(type='nama', head='🔤 Asal nama', text='Atrium = ruang depan rumah Romawi, tempat "tamu" masuk'))
beat('Ini rongganya, volume darah di dalam atrium. Dari sini darah mengalir lewat katup trikuspid ke ventrikel kanan.',
     'atrium-dextrum-dalam', 'Atrium dextrum', 'Rongga atrium dextrum', 'Mode lihat dalam', sorot=[I('valva-tricuspidalis', 'Valva tricuspidalis')])
beat('Aurikula dekstra adalah kantong otot berbentuk kerucut yang menjulur ke depan, menutupi pangkal aorta. Aurikula artinya telinga kecil.',
     'auricula-dextra', 'Atrium dextrum', 'Auricula dextra', 'Aurikula kanan', sorot=[I('aorta-ascendens', 'Aorta ascendens')],
     card=dict(type='nama', head='🔤 Asal nama', text='Auricula = telinga kecil'))
beat('Di dinding dalamnya ada muskuli pektinati, rigi-rigi otot yang tersusun seperti gigi sisir. Pektin artinya sisir.',
     'mm-pectinati-dextri', 'Atrium dextrum', 'Mm. pectinati atrii dextri', 'Otot pektinatus',
     card=dict(type='nama', head='🔤 Asal nama', text='Pecten = sisir'))
beat('Krista terminalis memisahkan bagian halus dan bagian berotot pektinatus, membentang dari muara vena kava superior ke inferior.',
     'crista-terminalis', 'Atrium dextrum', 'Crista terminalis', None, sorot=[I('vcs', 'V. cava superior'), ('V. cava inferior', 'FJ3441')])
beat('Fosa ovalis adalah cekungan di septum antara atrium kanan dan kiri, sisa foramen ovale janin.',
     'fossa-ovalis', 'Atrium dextrum', 'Fossa ovalis', None, sorot=[I('atrium-sinistrum', 'Atrium sinistrum')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Foramen ovale yang tidak menutup sempurna = PFO'))
beat('Ostium sinus koronarii adalah muara sinus koronarius, terletak di antara muara vena kava inferior dan ostium atrioventrikular kanan.',
     'ostium-sinus-coronarii', 'Atrium dextrum', 'Ostium sinus coronarii', 'Muara sinus koroner',
     sorot=[I('sinus-coronarius', 'Sinus coronarius'), ('V. cava inferior', 'FJ3441')])
beat('Dan ostium atrioventrikular kanan, dijaga oleh katup trikuspid.',
     'ostium-av-dextrum', 'Atrium dextrum', 'Ostium atrioventriculare dextrum', None)

# ================= VENTRICULUS DEXTER =================
judul_bab('Ventriculus dexter', '💙', 'Lanjut ke ventrikel kanan!')
beat('Ventrikel kanan membentuk sebagian besar permukaan depan jantung, dan memompa darah ke trunkus pulmonalis. Dindingnya lebih tipis dari ventrikel kiri.',
     'ventriculus-dexter', 'Ventriculus dexter', 'Ventriculus dexter', 'Bilik kanan', sorot=[I('truncus-pulmonalis', 'Truncus pulmonalis')],
     card=dict(type='model', head='ℹ️ Tentang model', text='Batas dinding ventrikel kanan/kiri = hasil pembagian otomatis'))
beat('Rongganya berbentuk bulan sabit pada potongan melintang, karena septum menonjol ke arahnya.',
     'ventriculus-dexter-dalam', 'Ventriculus dexter', 'Rongga ventriculus dexter', 'Mode lihat dalam')
beat('Katup trikuspid punya tiga daun, sesuai namanya: tri artinya tiga. Daunnya anterior, posterior, dan septalis.',
     'valva-tricuspidalis', 'Ventriculus dexter', 'Valva tricuspidalis', 'Katup trikuspid',
     sorot=[('Cuspis anterior', 'FJ2421'), ('Cuspis posterior', 'FJ2433'), ('Cuspis septalis', 'FJ2436')],
     card=dict(type='nama', head='🔤 Asal nama', text='Tri (tiga) + cuspis (ujung runcing)'))
beat('Jembatan keledainya: LAB RAT. Left atrium bicuspid, right atrium tricuspid!',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"LAB RAT"\nLeft Atrium Bicuspid · Right Atrium Tricuspid'))
beat('Lihat tali-tali tipis itu? Itu korda tendinea, yang menghubungkan daun katup ke muskulus papilaris, supaya daun katup tidak terbalik ke atrium.',
     'chordae-tricuspidalis', 'Ventriculus dexter', 'Chordae tendineae', 'Si "senar jantung"', sorot=[I('mm-papillares-dextri', 'Mm. papillares')],
     card=dict(type='nama', head='🔤 Asal nama', text='Chorda = tali · julukannya "heart strings"'))
beat('Krista supraventrikularis memisahkan bagian masuk yang kasar dari bagian keluar yang halus menuju trunkus pulmonalis. Strukturnya tidak ada di model.',
     'crista-supraventricularis', 'Ventriculus dexter', 'Crista supraventricularis', None,
     sorot=[I('valva-tricuspidalis', 'Valva tricuspidalis (masuk)'), I('valva-trunci-pulmonalis', 'Valva trunci pulmonalis (keluar)')])
beat('Trabekula karnea adalah rigi-rigi otot di dinding dalam. Trabekula artinya balok kecil, karnea artinya berdaging.',
     'trabeculae-carneae-dextri', 'Ventriculus dexter', 'Trabeculae carneae', None,
     card=dict(type='nama', head='🔤 Asal nama', text='Trabecula = balok kecil · carneae = berdaging'))
tebak(7, 'trabecula-septomarginalis', 'Ventriculus dexter', 'Trabecula septomarginalis', 'Moderator band',
      'Ini trabekula septomarginalis, atau moderator band, dari septum ke muskulus papilaris anterior. Tebak: apa fungsinya?',
      'Apa fungsi trabecula septomarginalis?',
      'Membawa cabang kanan berkas His langsung ke muskulus papilaris anterior, supaya otot itu berkontraksi tepat waktu dan katup trikuspid tidak prolaps.',
      'Membawa crus dextrum fasciculus AV (berkas His kanan) ke m. papillaris anterior → kontraksi tepat waktu',
      jawab_sorot=[('M. papillaris anterior', 'FJ2419'), I('valva-tricuspidalis', 'Valva tricuspidalis')])
beat('Fun fact: namanya moderator, karena dulu dikira berfungsi menahan ventrikel kanan supaya tidak terlalu meregang.',
     card=dict(type='nama', head='🔤 Asal nama', text='"Moderator": dulu dikira menahan ventrikel agar tidak meregang'))
beat('Muskuli papilares ventrikel kanan ada tiga: anterior, posterior, dan septalis. Papila artinya puting kecil, sesuai bentuknya.',
     'mm-papillares-dextri', 'Ventriculus dexter', 'Mm. papillares ventriculi dextri', None,
     sorot=[('Anterior', 'FJ2419'), ('Posterior', 'FJ2430'), ('Septalis', 'FJ2437')],
     card=dict(type='nama', head='🔤 Asal nama', text='Papilla = puting kecil'))
beat('Septum interventrikulare tidak dimodelkan sendiri. Lihat celah di antara rongga kanan yang biru dan rongga kiri yang merah. Di situlah septumnya.',
     'septum-interventriculare', 'Ventriculus dexter', 'Septum interventriculare', 'Sekat antarbilik',
     card=dict(type='klinis', head='🏥 Makna klinis', text='VSD paling sering di pars membranacea'))
beat('Dari depan, letak septum ditandai ramus interventrikularis anterior, dan dari bawah oleh ramus interventrikularis posterior.',
     sorot=[('R. interventricularis anterior', 'FJ2631'), I('r-interventricularis-posterior', 'R. interventricularis posterior')])
beat('Di ujung bagian keluar ventrikel kanan ada katup trunkus pulmonalis, dengan tiga valvula semilunaris. Semilunaris artinya setengah bulan.',
     'valva-trunci-pulmonalis-rv', 'Ventriculus dexter', 'Valva trunci pulmonalis', 'Katup pulmonal', sorot=[I('truncus-pulmonalis', 'Truncus pulmonalis')],
     card=dict(type='nama', head='🔤 Asal nama', text='Semilunaris = setengah bulan'))

# ================= ATRIUM SINISTRUM =================
judul_bab('Atrium sinistrum', '🚪', 'Pindah ke sisi kiri. Atrium kiri!')
beat('Atrium kiri membentuk sebagian besar basis kordis dan menerima darah kaya oksigen dari empat vena pulmonalis.',
     'atrium-sinistrum', 'Atrium sinistrum', 'Atrium sinistrum', 'Serambi kiri', sorot=[I('vv-pulmonales', 'Vv. pulmonales')])
beat('Fakta klinis: atrium kiri letaknya tepat di depan esofagus. Kalau membesar, ia bisa menekan esofagus.',
     sorot=[ESOFAGUS], arah=[0.9, 0, -0.4], card=dict(type='klinis', head='🏥 Makna klinis', text='Atrium kiri membesar → menekan esofagus'))
beat('Ini rongganya. Dari sini darah mengalir lewat katup mitral ke ventrikel kiri.',
     'atrium-sinistrum-dalam', 'Atrium sinistrum', 'Rongga atrium sinistrum', 'Mode lihat dalam', sorot=[I('valva-mitralis', 'Valva mitralis')])
beat('Aurikula sinistra sempit dan memanjang, di sisi kiri pangkal trunkus pulmonalis. Fakta klinis: pada fibrilasi atrium, darah mudah membeku di sini dan bisa menyebabkan stroke.',
     'auricula-sinistra', 'Atrium sinistrum', 'Auricula sinistra', 'Aurikula kiri', sorot=[I('truncus-pulmonalis', 'Truncus pulmonalis')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Fibrilasi atrium → trombus di auricula sinistra → stroke'))
beat('Empat vena pulmonalis bermuara di dinding belakang atrium kiri, tanpa katup.',
     'vv-pulmonales-la', 'Atrium sinistrum', 'Vv. pulmonales', None, sorot=[I('atrium-sinistrum', 'Atrium sinistrum')])
beat('Berbeda dengan atrium kanan, muskuli pektinati atrium kiri hanya ada di dalam aurikula.',
     'mm-pectinati-sinistri', 'Atrium sinistrum', 'Mm. pectinati atrii sinistri', None)
beat('Septum interatriale memisahkan atrium kiri dan kanan. Fosa ovalis ada di sisi kanannya.',
     'septum-interatriale', 'Atrium sinistrum', 'Septum interatriale', None,
     sorot=[I('atrium-dextrum', 'Atrium dextrum'), I('atrium-sinistrum', 'Atrium sinistrum')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='ASD & PFO terjadi di sini'))
beat('Ostium atrioventrikular kiri dijaga oleh katup mitral.',
     'ostium-av-sinistrum', 'Atrium sinistrum', 'Ostium atrioventriculare sinistrum', None)

# ================= VENTRICULUS SINISTER =================
judul_bab('Ventriculus sinister', '❤️', 'Dan sang juara, ventrikel kiri!')
beat('Ventrikel kiri membentuk apeks dan tepi kiri jantung. Dindingnya dua sampai tiga kali lebih tebal dari ventrikel kanan, karena ia memompa darah ke aorta, ke seluruh tubuh.',
     'ventriculus-sinister', 'Ventriculus sinister', 'Ventriculus sinister', 'Bilik kiri',
     sorot=[I('ventriculus-dexter', 'Ventriculus dexter'), I('aorta-ascendens', 'Aorta')])
beat('Rongganya berbentuk kerucut, dan pada potongan melintang tampak bundar.',
     'ventriculus-sinister-dalam', 'Ventriculus sinister', 'Rongga ventriculus sinister', 'Mode lihat dalam')
beat('Katup mitral punya dua daun, anterior dan posterior. Daun anteriornya berbatasan dengan katup aorta.',
     'valva-mitralis', 'Ventriculus sinister', 'Valva mitralis', 'Katup mitral / bikuspid',
     sorot=[('Cuspis anterior', 'FJ2420'), ('Cuspis posterior', 'FJ2432'), I('valva-aortae', 'Valva aortae')])
beat('Fun fact: namanya mitral karena dua daunnya mirip topi mitra uskup!',
     card=dict(type='nama', head='🔤 Asal nama', text='Mitra = topi uskup (dua daunnya mirip topi mitra)'))
beat('Muskuli papilares ventrikel kiri lebih besar dari yang di kanan, dan mengikat korda ke kedua daun katup mitral.',
     'mm-papillares-sinistri', 'Ventriculus sinister', 'Mm. papillares ventriculi sinistri', None, sorot=[I('valva-mitralis', 'Valva mitralis')])
beat('Fakta klinis: ruptur otot papilaris setelah infark bisa menyebabkan regurgitasi mitral akut.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Ruptur m. papillaris pasca-infark → regurgitasi mitral akut'))
beat('Korda tendinea mitralis menahan daun katup mitral saat sistol. Di model, talinya juga menyatu dengan daun katup.',
     'chordae-mitralis', 'Ventriculus sinister', 'Chordae tendineae mitralis', None, sorot=[I('mm-papillares-sinistri', 'Mm. papillares')])
beat('Trabekula karnea ventrikel kiri lebih halus dan rapat dibanding di kanan, terutama di dekat apeks.',
     'trabeculae-carneae-sinistri', 'Ventriculus sinister', 'Trabeculae carneae', None)

# ================= RADIX =================
judul_bab('Radix aortae & trunci pulmonalis', '🌸', 'Sekarang kita lihat katup-katup dari atas.')
beat('Katup aorta punya tiga valvula semilunaris. Di belakang tiap valvula ada kantong, sinus aorta. Dari sinus kanan dan kiri, keluar arteri koroner kanan dan kiri.',
     'valva-aortae', 'Radix aortae', 'Valva aortae', 'Katup aorta',
     sorot=[('A. coronaria dextra', 'FJ2723'), ('A. coronaria sinistra', 'FJ2737')])
beat('Untuk titik auskultasi, ingat: All Physicians Take Money. Aorta di sela iga kedua kanan, pulmonal di sela iga kedua kiri, trikuspid di tepi kiri sternum bawah, dan mitral di apeks.',
     sorot=[STERNUM, ('Costa II', 'name:^(Left|Right) second (rib|costal cartilage)$')], arah='depan', zoom=1.3,
     sub='Titik auskultasi: All Physicians Take Money. Aorta ICS II kanan, pulmonal ICS II kiri, trikuspid ICS IV–V parasternal kiri, mitral di apex.',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"All Physicians Take Money"\nAorta ICS II ka · Pulmonal ICS II ki · Trikuspid ICS IV–V parasternal ki · Mitral apex'))
beat('Fun fact: arteri koroner terisi terutama saat diastol, waktu katup aorta menutup dan darah memantul ke sinus aorta.',
     sorot=[('A. coronaria dextra', 'FJ2723'), ('A. coronaria sinistra', 'FJ2737')],
     card=dict(type='fakta', head='💡 Tahukah kamu?', text='Arteri koroner terisi terutama saat DIASTOL'))
beat('Dan katup trunkus pulmonalis, sedikit lebih tinggi dan lebih ke depan dari katup aorta.',
     'valva-trunci-pulmonalis', 'Radix trunci pulmonalis', 'Valva trunci pulmonalis', 'Katup pulmonal', sorot=[I('valva-aortae', 'Valva aortae')])

# ================= PEMBULUH DARAH JANTUNG =================
judul_bab('Pembuluh darah jantung', '👑', 'Bab terakhir: pembuluh darah jantung sendiri!')
beat('Arteri koroner kiri keluar dari sinus aorta kiri, berjalan di antara trunkus pulmonalis dan aurikula kiri, lalu segera bercabang dua.',
     'a-coronaria-sinistra', 'Pembuluh darah jantung', 'A. coronaria sinistra', 'dan cabang-cabangnya',
     sorot=[I('truncus-pulmonalis', 'Truncus pulmonalis'), I('atrium-sinistrum', 'Atrium sinistrum (aurikula)')])
beat('Kedua cabangnya: ramus interventrikularis anterior, dan ramus sirkumfleksus.',
     sorot=[('R. interventricularis anterior', 'FJ2631'), I('r-circumflexus', 'R. circumflexus')])
tebak(8, 'r-interventricularis-anterior', 'Pembuluh darah jantung', 'R. interventricularis anterior', 'LAD',
      'Ini ramus interventrikularis anterior, atau LAD. Tebak: ia melintas di mana, dan bersama apa?',
      'R. interventricularis anterior melintas di ... bersama ...?',
      'Di sulkus interventrikularis anterior, bersama vena kordis magna.',
      'Sulcus interventricularis anterior, bersama v. cordis magna', jawab_sorot=[I('v-cordis-magna', 'V. cordis magna')])
beat('Fakta klinis: sumbatan di pangkal LAD dijuluki widowmaker, karena daerah yang terkena sangat luas.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Sumbatan proksimal LAD = "widowmaker"'))
tebak(9, 'r-circumflexus', 'Pembuluh darah jantung', 'R. circumflexus', 'Cabang sirkumfleks',
      'Ramus sirkumfleksus, namanya dari circum, mengelilingi, karena ia melingkari tepi kiri jantung. Tebak lagi: ia melintas di mana, bersama apa?',
      'R. circumflexus melintas di ... bersama ...?',
      'Di sulkus koronarius bagian kiri, bersama vena kordis magna, yang kemudian menjadi sinus koronarius.',
      'Sulcus coronarius (kiri), bersama v. cordis magna',
      jawab_sorot=[('V. cordis magna', 'FJ2656'), I('sinus-coronarius', 'Sinus coronarius')])
beat('Arteri koroner kanan keluar dari sinus aorta kanan, berjalan di antara aurikula kanan dan trunkus pulmonalis, lalu menyusuri sulkus koronarius kanan.',
     'a-coronaria-dextra', 'Pembuluh darah jantung', 'A. coronaria dextra', 'dan cabang-cabangnya',
     sorot=[I('atrium-dextrum', 'Atrium dextrum (aurikula)'), I('truncus-pulmonalis', 'Truncus pulmonalis')])
tebak(10, 'r-interventricularis-posterior', 'Pembuluh darah jantung', 'R. interventricularis posterior', 'PDA',
      'Ramus interventrikularis posterior. Pertanyaan terakhir: melintas di mana, bersama apa?',
      'R. interventricularis posterior melintas di ... bersama ...?',
      'Di sulkus interventrikularis posterior, bersama vena kordis media.',
      'Sulcus interventricularis posterior, bersama v. cordis media', jawab_sorot=[I('v-cordis-media', 'V. cordis media')])
beat('Ramus marginalis dekster berjalan di sepanjang margo akutus menuju apeks.',
     'r-marginalis-dexter', 'Pembuluh darah jantung', 'R. marginalis dexter', None)
beat('Sinus koronarius mengumpulkan sebagian besar darah vena jantung, lalu bermuara ke atrium kanan.',
     'sinus-coronarius', 'Pembuluh darah jantung', 'Sinus coronarius', None, sorot=[I('atrium-dextrum', 'Atrium dextrum')])
beat('Vena kordis magna, vena jantung besar, naik bersama LAD, lalu membelok bersama ramus sirkumfleksus.',
     'v-cordis-magna', 'Pembuluh darah jantung', 'V. cordis magna', 'Vena jantung besar',
     sorot=[('R. interventricularis anterior', 'FJ2631'), I('r-circumflexus', 'R. circumflexus')],
     card=dict(type='mnemo', head='🧠 Pasangan vena–arteri', text='V. cordis magna ↔ LAD + circumflex\nV. cordis media ↔ PDA\nV. cordis parva ↔ r. marginalis dexter'))
beat('Vena kordis media, vena jantung tengah, naik bersama ramus interventrikularis posterior.',
     'v-cordis-media', 'Pembuluh darah jantung', 'V. cordis media', 'Vena jantung tengah', sorot=[I('r-interventricularis-posterior', 'R. interventricularis posterior')])
beat('Dan vena kordis parva, vena jantung kecil, menyertai ramus marginalis dekster. Magna besar, media tengah, parva kecil!',
     'v-cordis-parva', 'Pembuluh darah jantung', 'V. cordis parva', 'Vena jantung kecil', sorot=[I('r-marginalis-dexter', 'R. marginalis dexter')],
     card=dict(type='nama', head='🔤 Asal nama', text='Magna = besar · Media = tengah · Parva = kecil'))

# ================= OUTRO =================
beat('Selesai! Kamu sudah keliling semua struktur Praktikum satu. Hebat!',
     'orientasi-2', K, 'Selesai! 🎉', None, card=dict(type='intro', head='🎉 Hebat!', text='Semua struktur Praktikum 1 sudah kamu jelajahi'), sfx='ding')
beat('Sekarang buka websitenya, coba mode kuis, dan cocokkan semuanya dengan cadaver saat praktikum. Semangat, calon dokter!',
     card=dict(type='intro', head='🎯 Langkah berikutnya', text='Buka website → coba Kuis → cocokkan dengan cadaver'))
