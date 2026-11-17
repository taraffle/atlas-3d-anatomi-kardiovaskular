# Naskah video Praktikum 1. Semua fakta diambil dari content/praktikum-1.json (materi website).
# Setiap "beat" = satu kalimat voiceover (say) + tampilan (step 3D, judul, kartu).
# say: teks untuk mesin suara (istilah ditulis lengkap); sub: teks subtitle (boleh pakai singkatan).

B = []  # daftar beat


def beat(say, step=None, kicker=None, title=None, sub_title=None, card=None, sub=None, sfx=None, hold=0.35):
    B.append(dict(say=say, step=step, kicker=kicker, title=title, sub_title=sub_title, card=card, sub=sub or say, sfx=sfx, hold=hold))


def tebak(no, step, kicker, title, sub_title, tanya_say, tanya_card, jawab_say, jawab_card):
    beat(tanya_say, step, kicker, title, sub_title, card=dict(type='q', head=f'📝 Coba tebak! Daftar tilik no. {no}', text=tanya_card), sfx='pop')
    B.append(dict(countdown=3, card=dict(type='q', head=f'📝 Coba tebak! Daftar tilik no. {no}', text=tanya_card)))
    beat(jawab_say, card=dict(type='a', head='✅ Jawabannya', text=jawab_card), sfx='ding', hold=0.6)


def judul_bab(kicker, emoji, teks_say):
    beat(teks_say, kicker=kicker, card=dict(type='bab', head=f'{emoji} {kicker}', text=''), sfx='whoosh', hold=0.5)


K = '🫀 Praktikum 1'

# ---------------- INTRO & ORIENTASI ----------------
beat('Halo, calon dokter! Selamat datang di tur tiga dimensi jantung dan pembuluh darah besar.',
     'orientasi-1', K, 'Anatomi Modul Kardiovaskular', 'Praktikum 1: Jantung', card=dict(type='intro', head='Halo, calon dokter! 👋', text='Tur 3D Praktikum 1: jantung & pembuluh darah besar'), sfx='whoosh')
beat('Semua model di video ini berasal dari data anatomi asli BodyParts3D. Siapkan daftar tilikmu, yuk mulai!')
beat('Pertama, orientasi. Jantung terletak di mediastinum medius, di belakang sternum dan tulang rawan iga kedua sampai keenam.',
     'orientasi-1', 'Orientasi', 'Jantung di rongga dada', 'Mediastinum medius', sfx='pop')
beat('Kira-kira dua pertiga massanya ada di sebelah kiri garis tengah, dan ia duduk di atas diafragma, di antara kedua paru.')
beat('Kalau tulangnya kita buat tembus, kelihatan sumbu jantung itu miring: dari basis di belakang atas kanan, ke apeks di depan bawah kiri.',
     'orientasi-2', 'Orientasi', 'Sumbu jantung miring', None)
beat('Akibatnya, bagian yang paling banyak terlihat dari depan adalah ventrikel kanan. Ingat ini waktu kamu membuka perikardium di cadaver!',
     card=dict(type='fakta', head='💡 Tips cadaver', text='Dari depan, yang paling banyak terlihat = ventrikel kanan.'))
beat('Dari sisi kiri: jantung di depan, aorta desendens dan vertebra di belakang. Atrium kiri adalah ruang jantung yang paling posterior, tepat di depan esofagus.',
     'orientasi-3', 'Orientasi', 'Dilihat dari kiri', None)
beat('Lalu aorta turun di depan tulang belakang, menembus diafragma, dan bercabang dua menjadi arteri iliaka komunis. Vena kava inferior berjalan di sebelah kanannya.',
     'orientasi-4', 'Orientasi', 'Pembuluh besar sampai panggul', None)

# ---------------- PELINDUNG JANTUNG ----------------
judul_bab('Pelindung jantung', '🛡️', 'Bab pertama: pelindung jantung!')
beat('Perikardium fibrosa adalah kantong jaringan ikat padat paling luar. Karena tidak elastis, ia mencegah jantung meregang berlebihan.',
     'pericardium-fibrosum', 'Pelindung jantung', 'Pericardium fibrosum', 'Perikardium fibrosa',
     card=dict(type='nama', head='🔤 Asal nama', text='Peri- (sekitar) + kardia (jantung)'))
beat('Perikardium memang tidak ada di model tiga dimensi ini. Jadi yang disorot adalah jantung yang dibungkusnya.',
     card=dict(type='model', head='ℹ️ Tentang model', text='Perikardium tidak dimodelkan di BodyParts3D'))
beat('Fakta klinis: karena tidak bisa melar, cairan atau darah yang menumpuk di rongga perikardium bisa cepat menekan jantung. Ini disebut tamponade jantung.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Tamponade jantung'))
beat('Di dalamnya ada perikardium serosa. Lamina parietalis melapisi bagian dalam perikardium fibrosa, lalu berbalik di pangkal pembuluh besar menjadi lamina viseralis, atau epikardium, yang menempel langsung di permukaan jantung.',
     'pericardium-serosum-parietale', 'Pelindung jantung', 'Pericardium serosum', 'Lamina parietalis & visceralis (epicardium)',
     card=dict(type='nama', head='🔤 Asal nama', text='Parietalis = dinding · Visceralis = organ · Epi- = di atas'))
tebak(1, 'cavum-sinus-pericardii', 'Pelindung jantung', 'Cavum & sinus pericardii', None,
      'Waktunya tebak-tebakan! Apa itu kavum perikardii, sinus transversus, dan sinus obliquus?',
      'Cavum pericardii, sinus transversus, sinus obliquus: apa dan di mana?',
      'Kavum perikardii adalah ruang potensial di antara lamina parietalis dan viseralis. Sinus transversus adalah lorong di belakang aorta asendens dan trunkus pulmonalis. Sinus obliquus adalah kantong buntu di belakang atrium kiri.',
      'Cavum: ruang potensial antara lamina parietalis & visceralis\nSinus transversus: di belakang aorta ascendens + truncus pulmonalis\nSinus obliquus: kantong buntu di belakang atrium kiri')
beat('Fakta klinis: saat operasi jantung, dokter bedah melewatkan klem lewat sinus transversus untuk menjepit aorta dan trunkus pulmonalis.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Klem lewat sinus transversus saat operasi jantung'))
tebak(2, 'n-phrenicus', 'Pelindung jantung', 'Nervus phrenicus', 'Saraf frenikus',
      'Berikutnya, nervus frenikus, dari akar saraf C tiga sampai C lima. Tebak: saraf ini menginervasi apa?',
      'Nervus phrenicus menginervasi apa?',
      'Motorik: diafragma, satu-satunya persarafan motorik diafragma. Sensorik: perikardium, pleura mediastinalis, pleura diafragmatika bagian sentral, dan peritoneum di bawahnya.',
      'Motorik: diaphragma\nSensorik: pericardium, pleura mediastinalis, pleura diaphragmatica sentral, peritoneum di bawahnya')
beat('Jembatan keledainya: C tiga, empat, lima, keeps the diaphragm alive!',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"C3, 4, 5 keeps the diaphragm alive"'))
beat('Fun fact: phren dalam bahasa Yunani berarti diafragma. Dulu orang Yunani mengira jiwa ada di diafragma, makanya kata ini juga jadi akar kata skizofrenia!',
     card=dict(type='nama', head='🔤 Asal nama', text='Phren (Yunani) = diafragma → juga akar kata "skizofrenia"'))
beat('Saraf ini berjalan bersama arteri dan vena perikardiakofrenika. Arterinya adalah cabang arteri torasika interna.',
     'a-v-pericardiacophrenica', 'Pelindung jantung', 'A. & V. pericardiacophrenica', None,
     card=dict(type='nama', head='🔤 Asal nama', text='Pericardio- + phrenica: dua daerah yang diperdarahinya'))

# ---------------- JANTUNG IN SITU & PEMBULUH BESAR ----------------
judul_bab('Pembuluh darah besar', '🩸', 'Bab dua: jantung in situ dan pembuluh-pembuluh darah besar!')
beat('Vena brakiosefalika kanan dibentuk oleh vena jugularis interna dan vena subklavia, di belakang ujung klavikula kanan. Pendek dan hampir vertikal.',
     'v-brachiocephalica-dextra', 'Pembuluh darah besar', 'V. brachiocephalica dextra', 'Vena brakiosefalika kanan',
     card=dict(type='nama', head='🔤 Asal nama', text='Brachium (lengan) + kephale (kepala): darah dari lengan dan kepala'))
beat('Yang kiri lebih panjang, kira-kira dua kali lipat. Ia menyeberang miring ke kanan di belakang manubrium, di depan cabang-cabang arkus aorta.',
     'v-brachiocephalica-sinistra', 'Pembuluh darah besar', 'V. brachiocephalica sinistra', 'Vena brakiosefalika kiri')
beat('Kedua vena brakiosefalika bersatu membentuk vena kava superior, yang turun di kanan aorta asendens dan bermuara ke atrium kanan. Dari belakang, ia menerima vena azigos.',
     'vcs', 'Pembuluh darah besar', 'Vena cava superior', 'Vena kava superior',
     card=dict(type='nama', head='🔤 Asal nama', text='Cava = berongga (karena besar)'))
beat('Trunkus pulmonalis keluar dari ventrikel kanan, lalu bercabang di bawah arkus aorta menjadi arteri pulmonalis kanan dan kiri.',
     'truncus-pulmonalis', 'Pembuluh darah besar', 'Truncus pulmonalis', 'Batang arteri pulmonalis')
beat('Arteri pulmonalis kanan lebih panjang, berjalan di belakang aorta asendens dan vena kava superior.',
     'a-pulmonales', 'Pembuluh darah besar', 'Arteriae pulmonales', 'Arteri pulmonalis kanan & kiri',
     card=dict(type='fakta', head='💡 Tahukah kamu?', text='Satu-satunya arteri dewasa yang membawa darah MISKIN oksigen'))
beat('Sebaliknya, empat vena pulmonalis membawa darah kaya oksigen ke atrium kiri. Itu sebabnya di model ini arteri paru berwarna biru dan vena paru merah.',
     'vv-pulmonales', 'Pembuluh darah besar', 'Venae pulmonales', 'Vena-vena pulmonalis',
     card=dict(type='fakta', head='💡 Tahukah kamu?', text='Satu-satunya vena dewasa yang membawa darah KAYA oksigen'))
beat('Aorta asendens keluar dari ventrikel kiri, panjangnya sekitar lima sentimeter. Dari pangkalnya keluar arteri koroner kanan dan kiri.',
     'aorta-ascendens', 'Pembuluh darah besar', 'Aorta ascendens', 'Aorta asendens',
     card=dict(type='nama', head='🔤 Asal nama', text='Aorte (Yunani) = yang diangkat/digantung · Ascendens = naik'))
tebak(3, 'arcus-aortae', 'Pembuluh darah besar', 'Arcus aortae', 'Lengkung aorta',
      'Ini arkus aorta, yang mulai dan berakhir setinggi angulus sterni. Tebak: apa saja cabang-cabangnya?',
      'Sebutkan cabang-cabang arcus aortae!',
      'Dari kanan ke kiri: trunkus brakiosefalikus, arteri karotis komunis kiri, dan arteri subklavia kiri.',
      '1. Truncus brachiocephalicus\n2. A. carotis communis sinistra\n3. A. subclavia sinistra')
beat('Jembatan keledainya: A B C S. Aortic arch, Brachiocephalic, Carotid, Subclavian!',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"ABC\'S": Arch → Brachiocephalic → Carotid → Subclavian'))
tebak(4, 'lig-arteriosum', 'Pembuluh darah besar', 'Ligamentum arteriosum (Botalli)', 'Sisa ductus arteriosus',
      'Pin ini menandai ligamentum arteriosum, sisa duktus arteriosus janin. Tebak: apa makna klinisnya?',
      'Apa makna klinis ligamentum arteriosum?',
      'Nervus laringeus rekuren kiri melingkar di bawah arkus aorta tepat di dekat ligamentum ini, jadi rawan cedera saat operasi. Kalau duktusnya tidak menutup setelah lahir, terjadilah PDA.',
      '• Penanda n. laryngeus recurrens sinister (risiko suara serak)\n• Duktus tidak menutup → PDA (machinery murmur)\n• Koarktasio aorta sering di dekatnya')
beat('Fun fact: ligamentum ini dinamai Botallo, padahal duktusnya sudah dideskripsikan jauh sebelumnya oleh Galen. Eponim yang salah alamat!',
     card=dict(type='nama', head='🔤 Asal nama', text='Eponim Leonardo Botallo, tapi Galen sudah mendeskripsikannya lebih dulu'))
beat('Setelah arkus, aorta turun sebagai aorta desendens, mulai setinggi torakal empat sampai lima.',
     'aorta-descendens', 'Pembuluh darah besar', 'Aorta descendens', 'Aorta desendens')
beat('Selama di dada, namanya aorta torakalis. Ia memberi cabang interkostal posterior, bronkial, esofageal, dan lain-lain.',
     'aorta-thoracica', 'Pembuluh darah besar', 'Aorta thoracica', 'Aorta torakalis')
beat('Setelah menembus hiatus aortikus setinggi torakal dua belas, namanya aorta abdominalis, sampai bercabang dua setinggi lumbal empat.',
     'aorta-abdominalis', 'Pembuluh darah besar', 'Aorta abdominalis', None,
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"I 8 10 Eggs At 12"\nIVC T8 · Esophagus T10 · Aorta T12'))
beat('Ingat angka delapan, sepuluh, dua belas: vena kava inferior di T delapan, esofagus di T sepuluh, aorta di T dua belas.')
beat('Di sini lahir arteri dan vena iliaka komunis. Fakta klinis: arteri iliaka komunis kanan bisa menekan vena iliaka komunis kiri. Itu sindrom May-Thurner.',
     'iliaca-communis', 'Pembuluh darah besar', 'A. & V. iliaca communis', 'Arteri & vena iliaka komunis',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Sindrom May-Thurner → DVT lebih sering di tungkai kiri'))
beat('Iliaka eksterna berjalan di tepi m. psoas, lalu lewat di bawah ligamentum inguinale dan berganti nama menjadi arteri femoralis.',
     'iliaca-externa', 'Pembuluh darah besar', 'A. & V. iliaca externa', None, sub='Iliaca externa berjalan di tepi m. psoas, lalu lewat di bawah lig. inguinale dan berganti nama menjadi a. femoralis.')
beat('Iliaka interna masuk ke rongga panggul, memperdarahi organ panggul, regio glutea, dan perineum.',
     'iliaca-interna', 'Pembuluh darah besar', 'A. & V. iliaca interna', None)
beat('Vena kava inferior, vena terbesar di tubuh. Dibentuk setinggi lumbal lima, naik di kanan aorta, dan menembus diafragma setinggi torakal delapan.',
     'vci', 'Pembuluh darah besar', 'Vena cava inferior', 'Vena kava inferior')
tebak(5, 'v-azygos', 'Pembuluh darah besar', 'Vena azygos', 'Vena azigos',
      'Ini vena azigos, naik di sisi kanan tulang belakang lalu melengkung ke vena kava superior. Tebak: apa fungsi utamanya?',
      'Sebutkan fungsi utama vena azygos!',
      'Mengalirkan darah dari dinding toraks posterior ke vena kava superior, dan menjadi jalur kolateral antara vena kava inferior dan superior kalau vena kava inferior tersumbat.',
      '• Drainase dinding toraks posterior (vv. intercostales posteriores) → VCS\n• Jalur kolateral VCI ↔ VCS')
beat('Fun fact: azigos artinya tanpa pasangan, karena vena ini hanya ada di sisi kanan.',
     card=dict(type='nama', head='🔤 Asal nama', text='A- (tanpa) + zygos (pasangan)'))

# ---------------- PERMUKAAN JANTUNG ----------------
judul_bab('Permukaan jantung', '🗺️', 'Bab tiga: struktur-struktur di permukaan jantung!')
beat('Apeks kordis, ujung jantung yang mengarah ke depan bawah kiri, dibentuk oleh ventrikel kiri. Letaknya kira-kira di sela iga kelima kiri, sekitar garis midklavikula.',
     'apex-cordis', 'Permukaan jantung', 'Apex cordis', 'Puncak jantung', sub='Apex cordis dibentuk ventrikel kiri, kira-kira di ICS V kiri sekitar linea midclavicularis.')
beat('Di sinilah iktus kordis teraba, dan ini juga titik auskultasi katup mitral.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Ictus cordis teraba di sini · auskultasi mitral'))
beat('Nah, ini sering tertukar! Basis kordis tidak menghadap ke bawah, tapi ke belakang. Ia terutama dibentuk oleh atrium kiri.',
     'basis-cordis', 'Permukaan jantung', 'Basis cordis', 'Facies posterior cordis',
     card=dict(type='fakta', head='⚠️ Sering tertukar', text='Basis = BELAKANG, bukan bawah. Permukaan bawah = facies diaphragmatica.'))
beat('Fasies sternokostalis, permukaan depan, sebagian besar dibentuk oleh ventrikel kanan.',
     'facies-sternocostalis', 'Permukaan jantung', 'Facies sternocostalis', 'Permukaan depan')
beat('Fasies diafragmatika, permukaan bawah, bertumpu di atas diafragma dan terutama dibentuk oleh ventrikel kiri.',
     'facies-diaphragmatica', 'Permukaan jantung', 'Facies diaphragmatica', 'Permukaan bawah')
beat('Lalu tiga tepi. Margo dekster dibentuk atrium kanan.',
     'margo-dexter', 'Permukaan jantung', 'Margo dexter', 'Tepi kanan')
beat('Margo sinister, atau margo obtusus, dibentuk ventrikel kiri. Obtusus artinya tumpul.',
     'margo-sinister', 'Permukaan jantung', 'Margo sinister / obtusus', 'Tepi kiri (tumpul)',
     card=dict(type='nama', head='🔤 Asal nama', text='Obtusus = tumpul'))
beat('Dan margo inferior, atau margo akutus, yang tajam, terutama dibentuk ventrikel kanan. Akutus artinya tajam.',
     'margo-inferior', 'Permukaan jantung', 'Margo inferior / acutus', 'Tepi bawah (tajam)',
     card=dict(type='nama', head='🔤 Asal nama', text='Acutus = tajam'))
tebak(6, 'sulcus-coronarius', 'Permukaan jantung', 'Sulcus coronarius', 'Alur koroner',
      'Sulkus koronarius melingkari jantung seperti mahkota, memisahkan atrium dari ventrikel. Tebak: struktur apa saja yang melintasinya?',
      'Struktur apa saja yang melintasi sulcus coronarius?',
      'Arteri koroner kanan, ramus sirkumfleksus, sinus koronarius, vena kordis magna, dan vena kordis parva.',
      '• A. coronaria dextra\n• R. circumflexus\n• Sinus coronarius\n• V. cordis magna\n• V. cordis parva')
beat('Fun fact: korona artinya mahkota. Pembuluh yang melingkari jantung seperti mahkota inilah yang disebut koroner.',
     card=dict(type='nama', head='🔤 Asal nama', text='Corona = mahkota → "koroner"'))
beat('Sulkus interventrikularis anterior menandai letak septum dari depan. Isinya ramus interventrikularis anterior dan venanya.',
     'sulcus-iv-anterior', 'Permukaan jantung', 'Sulcus interventricularis anterior', None)
beat('Dan sulkus interventrikularis posterior di permukaan bawah, berisi ramus interventrikularis posterior dan vena kordis media.',
     'sulcus-iv-posterior', 'Permukaan jantung', 'Sulcus interventricularis posterior', None)
beat('Sulkus terminalis adalah alur dangkal di atrium kanan, dari vena kava superior ke inferior. Fakta klinis: nodus SA, pacu jantung alami kita, ada di ujung atasnya.',
     'sulcus-terminalis', 'Permukaan jantung', 'Sulcus terminalis cordis', None,
     card=dict(type='klinis', head='🏥 Makna klinis', text='Nodus SA di ujung atas sulcus / crista terminalis'))

# ---------------- ATRIUM DEXTRUM ----------------
judul_bab('Atrium dextrum', '🚪', 'Sekarang kita masuk ke ruang-ruang jantung. Mulai dari atrium kanan!')
beat('Atrium kanan menerima darah miskin oksigen dari vena kava superior, vena kava inferior, dan sinus koronarius.',
     'atrium-dextrum', 'Atrium dextrum', 'Atrium dextrum', 'Serambi kanan',
     card=dict(type='nama', head='🔤 Asal nama', text='Atrium = ruang depan rumah Romawi, tempat "tamu" masuk'))
beat('Ini rongganya, volume darah di dalam atrium. Dari sini darah mengalir lewat katup trikuspid ke ventrikel kanan.',
     'atrium-dextrum-dalam', 'Atrium dextrum', 'Rongga atrium dextrum', 'Mode lihat dalam')
beat('Aurikula dekstra adalah kantong otot berbentuk kerucut yang menjulur ke depan, menutupi pangkal aorta. Aurikula artinya telinga kecil.',
     'auricula-dextra', 'Atrium dextrum', 'Auricula dextra', 'Aurikula kanan',
     card=dict(type='nama', head='🔤 Asal nama', text='Auricula = telinga kecil'))
beat('Di dinding dalamnya ada muskuli pektinati, rigi-rigi otot yang tersusun seperti gigi sisir. Pektin artinya sisir.',
     'mm-pectinati-dextri', 'Atrium dextrum', 'Mm. pectinati atrii dextri', 'Otot pektinatus',
     card=dict(type='nama', head='🔤 Asal nama', text='Pecten = sisir'))
beat('Krista terminalis memisahkan bagian halus dan bagian berotot pektinatus. Di luar, ia sesuai dengan sulkus terminalis.',
     'crista-terminalis', 'Atrium dextrum', 'Crista terminalis', None)
beat('Fosa ovalis adalah cekungan di septum interatriale, sisa foramen ovale janin.',
     'fossa-ovalis', 'Atrium dextrum', 'Fossa ovalis', None,
     card=dict(type='klinis', head='🏥 Makna klinis', text='Foramen ovale yang tidak menutup sempurna = PFO'))
beat('Ostium sinus koronarii adalah muara sinus koronarius, terletak di antara muara vena kava inferior dan ostium atrioventrikular kanan.',
     'ostium-sinus-coronarii', 'Atrium dextrum', 'Ostium sinus coronarii', 'Muara sinus koroner')
beat('Dan ostium atrioventrikular kanan, dijaga oleh katup trikuspid.',
     'ostium-av-dextrum', 'Atrium dextrum', 'Ostium atrioventriculare dextrum', None)

# ---------------- VENTRICULUS DEXTER ----------------
judul_bab('Ventriculus dexter', '💙', 'Lanjut ke ventrikel kanan!')
beat('Ventrikel kanan membentuk sebagian besar permukaan depan jantung. Dindingnya lebih tipis dari ventrikel kiri.',
     'ventriculus-dexter', 'Ventriculus dexter', 'Ventriculus dexter', 'Bilik kanan',
     card=dict(type='model', head='ℹ️ Tentang model', text='Batas dinding ventrikel kanan/kiri = hasil pembagian otomatis'))
beat('Rongganya berbentuk bulan sabit pada potongan melintang, karena septum menonjol ke arahnya.',
     'ventriculus-dexter-dalam', 'Ventriculus dexter', 'Rongga ventriculus dexter', 'Mode lihat dalam')
beat('Katup trikuspid punya tiga daun: anterior, posterior, dan septalis.',
     'valva-tricuspidalis', 'Ventriculus dexter', 'Valva tricuspidalis', 'Katup trikuspid',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"LAB RAT"\nLeft Atrium Bicuspid · Right Atrium Tricuspid'))
beat('Jembatan keledainya: LAB RAT. Left atrium bicuspid, right atrium tricuspid!')
beat('Lihat tali-tali tipis itu? Itu korda tendinea, yang menahan daun katup supaya tidak terbalik ke atrium. Di model ini, korda menyatu dengan daun katupnya.',
     'chordae-tricuspidalis', 'Ventriculus dexter', 'Chordae tendineae', 'Si "senar jantung"',
     card=dict(type='nama', head='🔤 Asal nama', text='Chorda = tali · julukannya "heart strings"'))
beat('Krista supraventrikularis memisahkan bagian masuk yang kasar dari konus arteriosus yang halus. Strukturnya tidak ada di model, jadi bayangkan di atap ventrikel kanan.',
     'crista-supraventricularis', 'Ventriculus dexter', 'Crista supraventricularis', None)
beat('Trabekula karnea adalah rigi-rigi otot di dinding dalam. Karnea artinya berdaging.',
     'trabeculae-carneae-dextri', 'Ventriculus dexter', 'Trabeculae carneae', None,
     card=dict(type='nama', head='🔤 Asal nama', text='Trabecula = balok kecil · carneae = berdaging'))
tebak(7, 'trabecula-septomarginalis', 'Ventriculus dexter', 'Trabecula septomarginalis', 'Moderator band',
      'Ini trabekula septomarginalis, atau moderator band, dari septum ke muskulus papilaris anterior. Tebak: apa fungsinya?',
      'Apa fungsi trabecula septomarginalis?',
      'Membawa cabang kanan berkas His langsung ke muskulus papilaris anterior, supaya otot itu berkontraksi tepat waktu dan katup trikuspid tidak prolaps.',
      'Membawa crus dextrum fasciculus AV (berkas His kanan) ke m. papillaris anterior → kontraksi tepat waktu')
beat('Fun fact: namanya moderator, karena dulu dikira berfungsi menahan ventrikel kanan supaya tidak terlalu meregang.',
     card=dict(type='nama', head='🔤 Asal nama', text='"Moderator": dulu dikira menahan ventrikel agar tidak meregang'))
beat('Muskuli papilares ventrikel kanan ada tiga: anterior, posterior, dan septalis. Papila artinya puting kecil, sesuai bentuknya.',
     'mm-papillares-dextri', 'Ventriculus dexter', 'Mm. papillares ventriculi dextri', None,
     card=dict(type='nama', head='🔤 Asal nama', text='Papilla = puting kecil'))
beat('Septum interventrikulare tidak dimodelkan sendiri. Lihat celah di antara rongga kanan yang biru dan rongga kiri yang merah. Di situlah septumnya.',
     'septum-interventriculare', 'Ventriculus dexter', 'Septum interventriculare', 'Sekat antarbilik',
     card=dict(type='klinis', head='🏥 Makna klinis', text='VSD paling sering di pars membranacea'))
beat('Di ujung konus arteriosus ada katup trunkus pulmonalis dengan tiga valvula semilunaris.',
     'valva-trunci-pulmonalis-rv', 'Ventriculus dexter', 'Valva trunci pulmonalis', 'Katup pulmonal',
     card=dict(type='nama', head='🔤 Asal nama', text='Semilunaris = setengah bulan'))

# ---------------- ATRIUM SINISTRUM ----------------
judul_bab('Atrium sinistrum', '🚪', 'Pindah ke sisi kiri. Atrium kiri!')
beat('Atrium kiri membentuk sebagian besar basis kordis dan menerima darah kaya oksigen dari empat vena pulmonalis.',
     'atrium-sinistrum', 'Atrium sinistrum', 'Atrium sinistrum', 'Serambi kiri')
beat('Fakta klinis: karena tepat di depan esofagus, atrium kiri yang membesar bisa menekan esofagus.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Atrium kiri membesar → menekan esofagus'))
beat('Ini rongganya. Dari sini darah mengalir lewat katup mitral ke ventrikel kiri.',
     'atrium-sinistrum-dalam', 'Atrium sinistrum', 'Rongga atrium sinistrum', 'Mode lihat dalam')
beat('Aurikula sinistra sempit dan memanjang. Fakta klinis: pada fibrilasi atrium, darah mudah membeku di sini dan bisa menyebabkan stroke.',
     'auricula-sinistra', 'Atrium sinistrum', 'Auricula sinistra', 'Aurikula kiri',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Fibrilasi atrium → trombus di auricula sinistra → stroke'))
beat('Empat vena pulmonalis bermuara di dinding belakang atrium kiri, tanpa katup.',
     'vv-pulmonales-la', 'Atrium sinistrum', 'Vv. pulmonales', None)
beat('Berbeda dengan atrium kanan, muskuli pektinati atrium kiri hanya ada di dalam aurikula.',
     'mm-pectinati-sinistri', 'Atrium sinistrum', 'Mm. pectinati atrii sinistri', None)
beat('Septum interatriale memisahkan kedua atrium. Fosa ovalis ada di sisi kanannya.',
     'septum-interatriale', 'Atrium sinistrum', 'Septum interatriale', None,
     card=dict(type='klinis', head='🏥 Makna klinis', text='ASD & PFO terjadi di sini'))
beat('Ostium atrioventrikular kiri dijaga oleh katup mitral.',
     'ostium-av-sinistrum', 'Atrium sinistrum', 'Ostium atrioventriculare sinistrum', None)

# ---------------- VENTRICULUS SINISTER ----------------
judul_bab('Ventriculus sinister', '❤️', 'Dan sang juara, ventrikel kiri!')
beat('Ventrikel kiri membentuk apeks dan tepi kiri jantung. Dindingnya dua sampai tiga kali lebih tebal dari ventrikel kanan, karena ia memompa darah ke seluruh tubuh.',
     'ventriculus-sinister', 'Ventriculus sinister', 'Ventriculus sinister', 'Bilik kiri')
beat('Rongganya berbentuk kerucut, dan pada potongan melintang tampak bundar.',
     'ventriculus-sinister-dalam', 'Ventriculus sinister', 'Rongga ventriculus sinister', 'Mode lihat dalam')
beat('Katup mitral punya dua daun, anterior dan posterior.',
     'valva-mitralis', 'Ventriculus sinister', 'Valva mitralis', 'Katup mitral / bikuspid',
     card=dict(type='nama', head='🔤 Asal nama', text='Mitra = topi uskup (dua daunnya mirip topi mitra)'))
beat('Fun fact: namanya mitral karena dua daunnya mirip topi mitra uskup!')
beat('Muskuli papilares ventrikel kiri lebih besar dari yang di kanan. Fakta klinis: ruptur otot papilaris setelah infark bisa menyebabkan regurgitasi mitral akut.',
     'mm-papillares-sinistri', 'Ventriculus sinister', 'Mm. papillares ventriculi sinistri', None,
     card=dict(type='klinis', head='🏥 Makna klinis', text='Ruptur m. papillaris pasca-infark → regurgitasi mitral akut'))
beat('Korda tendinea mitralis menahan daun katup mitral saat sistol. Di model, talinya juga menyatu dengan daun katup.',
     'chordae-mitralis', 'Ventriculus sinister', 'Chordae tendineae mitralis', None)
beat('Trabekula karnea ventrikel kiri lebih halus dan rapat dibanding di kanan, terutama di dekat apeks.',
     'trabeculae-carneae-sinistri', 'Ventriculus sinister', 'Trabeculae carneae', None)

# ---------------- RADIX ----------------
judul_bab('Radix aortae & trunci pulmonalis', '🌸', 'Sekarang kita lihat katup-katup dari atas.')
beat('Katup aorta punya tiga valvula semilunaris. Dari sinus kanan dan kirinya, keluar arteri koroner kanan dan kiri.',
     'valva-aortae', 'Radix aortae', 'Valva aortae', 'Katup aorta',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"All Physicians Take Money"\nAorta ICS II ka · Pulmonal ICS II ki · Trikuspid ICS IV–V parasternal ki · Mitral apex'))
beat('Untuk titik auskultasi, ingat: All Physicians Take Money. Aorta, pulmonal, trikuspid, mitral.')
beat('Fun fact: arteri koroner terisi terutama saat diastol, waktu katup aorta menutup dan darah memantul ke sinus aorta.',
     card=dict(type='fakta', head='💡 Tahukah kamu?', text='Arteri koroner terisi terutama saat DIASTOL'))
beat('Dan katup trunkus pulmonalis, sedikit lebih tinggi dan lebih ke depan dari katup aorta.',
     'valva-trunci-pulmonalis', 'Radix trunci pulmonalis', 'Valva trunci pulmonalis', 'Katup pulmonal')

# ---------------- PEMBULUH DARAH JANTUNG ----------------
judul_bab('Pembuluh darah jantung', '👑', 'Bab terakhir: pembuluh darah jantung sendiri!')
beat('Arteri koroner kiri keluar dari sinus aorta kiri, lalu segera bercabang dua: ramus interventrikularis anterior dan ramus sirkumfleksus.',
     'a-coronaria-sinistra', 'Pembuluh darah jantung', 'A. coronaria sinistra', 'dan cabang-cabangnya')
tebak(8, 'r-interventricularis-anterior', 'Pembuluh darah jantung', 'R. interventricularis anterior', 'LAD',
      'Ini ramus interventrikularis anterior, atau LAD. Tebak: ia melintas di mana, dan bersama apa?',
      'R. interventricularis anterior melintas di ... bersama ...?',
      'Di sulkus interventrikularis anterior, bersama vena kordis magna.',
      'Sulcus interventricularis anterior, bersama v. cordis magna')
beat('Fakta klinis: sumbatan di pangkal LAD dijuluki widowmaker, karena daerah yang terkena sangat luas.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Sumbatan proksimal LAD = "widowmaker"'))
tebak(9, 'r-circumflexus', 'Pembuluh darah jantung', 'R. circumflexus', 'Cabang sirkumfleks',
      'Ramus sirkumfleksus. Tebak lagi: ia melintas di mana, bersama apa?',
      'R. circumflexus melintas di ... bersama ...?',
      'Di sulkus koronarius bagian kiri, bersama vena kordis magna, yang kemudian menjadi sinus koronarius.',
      'Sulcus coronarius (kiri), bersama v. cordis magna')
beat('Arteri koroner kanan keluar dari sinus aorta kanan, lalu menyusuri sulkus koronarius kanan.',
     'a-coronaria-dextra', 'Pembuluh darah jantung', 'A. coronaria dextra', 'dan cabang-cabangnya')
tebak(10, 'r-interventricularis-posterior', 'Pembuluh darah jantung', 'R. interventricularis posterior', 'PDA',
      'Ramus interventrikularis posterior. Pertanyaan terakhir: melintas di mana, bersama apa?',
      'R. interventricularis posterior melintas di ... bersama ...?',
      'Di sulkus interventrikularis posterior, bersama vena kordis media.',
      'Sulcus interventricularis posterior, bersama v. cordis media')
beat('Ramus marginalis dekster berjalan di sepanjang margo akutus menuju apeks.',
     'r-marginalis-dexter', 'Pembuluh darah jantung', 'R. marginalis dexter', None)
beat('Sinus koronarius mengumpulkan sebagian besar darah vena jantung, lalu bermuara ke atrium kanan.',
     'sinus-coronarius', 'Pembuluh darah jantung', 'Sinus coronarius', None)
beat('Vena kordis magna naik bersama LAD, lalu membelok bersama ramus sirkumfleksus.',
     'v-cordis-magna', 'Pembuluh darah jantung', 'V. cordis magna', 'Vena jantung besar',
     card=dict(type='mnemo', head='🧠 Pasangan vena–arteri', text='V. cordis magna ↔ LAD + circumflex\nV. cordis media ↔ PDA\nV. cordis parva ↔ r. marginalis dexter'))
beat('Vena kordis media naik bersama ramus interventrikularis posterior.',
     'v-cordis-media', 'Pembuluh darah jantung', 'V. cordis media', 'Vena jantung tengah')
beat('Dan vena kordis parva menyertai ramus marginalis dekster. Parva artinya kecil.',
     'v-cordis-parva', 'Pembuluh darah jantung', 'V. cordis parva', 'Vena jantung kecil',
     card=dict(type='nama', head='🔤 Asal nama', text='Magna = besar · Media = tengah · Parva = kecil'))

# ---------------- OUTRO ----------------
beat('Selesai! Kamu sudah keliling semua struktur Praktikum satu. Hebat!',
     'orientasi-2', K, 'Selesai! 🎉', None, card=dict(type='intro', head='🎉 Hebat!', text='Semua struktur Praktikum 1 sudah kamu jelajahi'), sfx='ding')
beat('Sekarang buka websitenya, coba mode kuis, dan cocokkan semuanya dengan cadaver saat praktikum. Semangat, calon dokter!',
     card=dict(type='intro', head='🎯 Langkah berikutnya', text='Buka website → coba Kuis → cocokkan dengan cadaver'))
