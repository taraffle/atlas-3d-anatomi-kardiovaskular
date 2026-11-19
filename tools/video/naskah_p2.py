# Naskah video Praktikum 2: Pembuluh darah leher & ekstremitas superior (sisi kanan pasien).
# Semua fakta diambil dari content/praktikum-2.json (materi website). Saraf = ilustrasi buatan.
from naskah_umum import B, beat, tebak, judul_bab, ilus, lukisan, cadaver, GRAY

def I(key, label): return (label, f'item:{key}')
def NAMA(regex, label): return (label, f'name:{regex}')
HUMERUS = NAMA('^Right humerus$', 'Humerus')
KLAV = NAMA('^Right clavicle$', 'Clavicula')
IGA1 = NAMA('^Right first rib$', 'Costa I')
SKAPULA = NAMA('^Right scapula$', 'Scapula')
RADIUS = NAMA('^Right radius$', 'Radius')
ULNA = NAMA('^Right ulna$', 'Ulna')
N_AX = ('N. axillaris', 'X_N_AXILLARIS'); N_RAD = ('N. radialis', 'X_N_RADIALIS'); N_MED = ('N. medianus', 'X_N_MEDIANUS'); N_UL = ('N. ulnaris', 'X_N_ULNARIS')
K = '💪 Praktikum 2'

# ================= INTRO & ORIENTASI =================
beat('Halo lagi, calon dokter! Sekarang kita jalan-jalan menyusuri pembuluh darah leher dan lengan.',
     'orientasi-1', K, 'Anatomi Modul Kardiovaskular', 'Praktikum 2: Leher & ekstremitas superior',
     card=dict(type='intro', head='Halo lagi! 👋', text='Tur 3D Praktikum 2: pembuluh darah leher & lengan'), sfx='whoosh')
beat('Semua struktur ditampilkan di sisi kanan pasien. Bentuk yang berlabel ilustrasi, seperti saraf, dibuat sendiri karena tidak ada di data tiga dimensinya.',
     card=dict(type='ilus', head='🎨 Tentang ilustrasi buatan', text='Saraf & beberapa pembuluh tidak ada di BodyParts3D → digambar sendiri mengikuti struktur asli'))
beat('Mulai dari pangkalnya. Trunkus brakiosefalikus bercabang menjadi arteri karotis komunis kanan, yang naik ke leher, dan arteri subklavia kanan, yang menuju lengan.',
     'orientasi-1', 'Orientasi', 'Pangkal leher & dada atas', None, sfx='pop',
     sorot=[('Truncus brachiocephalicus', 'FJ3417'), I('a-carotis-communis', 'A. carotis communis'), I('a-subclavia', 'A. subclavia')])
beat('Perhatikan klavikula dan iga pertama: arteri subklavia melengkung tepat di atas iga pertama.', sorot=[KLAV, IGA1])
beat('Lalu namanya berganti-ganti mengikuti wilayahnya: subklavia, aksilaris, brakialis, lalu bercabang menjadi radialis dan ulnaris, dan berakhir di arkus palmaris.',
     'orientasi-2', 'Orientasi', 'Seluruh ekstremitas atas', None,
     sorot=[I('a-subclavia', 'A. subclavia'), ('A. axillaris', 'FJ2268'), ('A. brachialis', 'FJ2271'), ('A. radialis', 'FJ2294'), ('A. ulnaris', 'FJ2310')])
beat('Di bawah kulit ada dua vena superfisial utama: vena sefalika di sisi ibu jari, dan vena basilika di sisi kelingking.',
     'orientasi-3', 'Orientasi', 'Vena superfisial', None, sorot=[I('v-cephalica', 'V. cephalica (lateral)'), I('v-basilica', 'V. basilica (medial)')])
beat('Dan jangan lupa saraf! Di daftar tilik, saraf sering ditanyakan bersama pembuluhnya. Ada nervus aksilaris, radialis, medianus, dan ulnaris.',
     'orientasi-4', 'Orientasi', 'Saraf-saraf penting', '🎨 ilustrasi buatan', sorot=[N_AX, N_RAD, N_MED, N_UL])

# ================= LEHER =================
judul_bab('Pembuluh darah leher', '🦒', 'Bab pertama: pembuluh darah di leher!')
beat('Vena jugularis eksterna dibentuk di dekat angulus mandibula, lalu turun menyilang permukaan otot sternokleidomastoideus, dan bermuara ke vena subklavia.',
     'v-jugularis-externa', 'Pembuluh darah leher', 'V. jugularis externa', '🎨 ilustrasi buatan',
     sorot=[NAMA('^Mandible$', 'Mandibula'), ('V. subclavia', 'FJ3587')],
     card=dict(type='nama', head='🔤 Asal nama', text='Jugulum (Latin) = leher / tenggorokan'))
beat('Fakta klinis: vena ini sering terlihat menonjol saat tekanan vena sentral naik, misalnya pada gagal jantung kanan.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Vena jugularis menonjol → tekanan vena sentral naik'))
beat('Vena jugularis interna turun di dalam selubung karotis bersama arteri karotis, lalu bersatu dengan vena subklavia membentuk vena brakiosefalika.',
     'v-jugularis-interna', 'Pembuluh darah leher', 'V. jugularis interna', None,
     sorot=[I('a-carotis-communis', 'A. carotis communis'), ('V. subclavia', 'FJ3587'), ('V. brachiocephalica', 'FJ3583')])
beat('Fakta klinis: di sinilah kateter vena sentral sering dipasang, terutama di sisi kanan karena jalurnya lebih lurus ke vena kava superior.',
     alat=dict(jenis='jarum', target='FJ3585', yrel=0.45, arah=[-0.35, 0.55, 0.75], masuk=5), arah=[-0.6, 0.15, 0.8],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Pemasangan kateter vena sentral (CVC), terutama sisi kanan'))
beat('Arteri karotis komunis naik tanpa memberi cabang, lalu bercabang dua setinggi tepi atas kartilago tiroid.',
     'a-carotis-communis', 'Pembuluh darah leher', 'A. carotis communis', None,
     sorot=[I('a-carotis-interna', 'A. carotis interna'), ('A. carotis externa', 'X_A_CAROTIS_EXT')],
     gambar=ilus('gray_leher_carotis.png', 'A. carotis communis, a. subclavia & a. vertebralis di leher (tampak lateral)'))
beat('Fun fact: karotis berasal dari bahasa Yunani karoun, artinya membuat pingsan, karena menekan arteri ini bisa membuat orang pingsan.',
     card=dict(type='nama', head='🔤 Asal nama', text='Karoun (Yunani) = membuat tertidur / pingsan'))
beat('Arteri karotis interna tidak bercabang di leher. Ia masuk ke tengkorak dan memperdarahi otak dan mata.',
     'a-carotis-interna', 'Pembuluh darah leher', 'A. carotis interna', None,
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='Interna = tidak bercabang di leher (masuk ke kepala)\nExterna = banyak cabang (ke wajah)'))
beat('Fakta klinis: plak aterosklerosis di pangkal arteri karotis interna adalah penyebab penting stroke iskemik.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Plak di pangkal a. carotis interna → stroke iskemik'))
beat('Arteri karotis eksterna justru punya banyak cabang untuk leher depan, wajah, dan kulit kepala.',
     'a-carotis-externa', 'Pembuluh darah leher', 'A. carotis externa', '🎨 ilustrasi buatan',
     gambar=ilus('gray_carotis_externa.png', 'Cabang-cabang a. carotis externa'))
beat('Urutan cabangnya bisa diingat dengan: Some Anatomists Like Freaking Out Poor Medical Students.',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"Some Anatomists Like Freaking Out Poor Medical Students"\nSup. thyroid · Asc. pharyngeal · Lingual · Facial · Occipital · Post. auricular · Maxillary · Sup. temporal'))
beat('Arteri subklavia melengkung di atas iga pertama, dan di tepi lateral iga pertama namanya berganti menjadi arteri aksilaris.',
     'a-subclavia', 'Pembuluh darah leher', 'A. subclavia', None, sorot=[IGA1, KLAV, ('A. axillaris', 'FJ2268')],
     card=dict(type='nama', head='🔤 Asal nama', text='Sub- (di bawah) + clavis (klavikula)'))
beat('Cabang-cabangnya: vertebralis, torasika interna, trunkus tiroservikalis, dan trunkus kostoservikalis. Ingat: VIT C dan D!',
     sorot=[I('a-vertebralis', 'A. vertebralis'), I('a-thoracica-interna', 'A. thoracica interna'), ('Truncus thyrocervicalis', 'FJ2307'), ('Truncus costocervicalis', 'FJ2276')],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"VIT C & D"\nVertebral · Internal thoracic · Thyrocervical · Costocervical · Dorsal scapular'),
     sub='Cabang-cabangnya: vertebralis, thoracica interna, truncus thyrocervicalis, dan truncus costocervicalis. Ingat: VIT C & D!')
beat('Arteri vertebralis adalah cabang pertama arteri subklavia. Ia naik melewati lubang-lubang di prosesus transversus vertebra servikal, lalu masuk ke tengkorak.',
     'a-vertebralis', 'Pembuluh darah leher', 'A. vertebralis', None, sorot=[NAMA('^\\w+ cervical vertebra$', 'Vertebrae cervicales')],
     card=dict(type='nama', head='🔤 Asal nama', text='Vertebra = ruas tulang belakang'))
beat('Fakta klinis: kalau pangkal arteri subklavia tersumbat, darah bisa dicuri, mengalir terbalik dari arteri vertebralis ke lengan. Ini disebut subclavian steal syndrome.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Subclavian steal syndrome'))
beat('Arteri torasika interna turun di belakang tulang rawan iga, sekitar satu sentimeter dari tepi sternum. Fakta klinis: arteri ini sering dipakai sebagai graft bypass koroner.',
     'a-thoracica-interna', 'Pembuluh darah leher', 'A. thoracica interna', None,
     sorot=[NAMA('^(Manubrium|Body of sternum)$', 'Sternum'), NAMA('^Right \\w+ costal cartilage$', 'Cartilago costalis')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Graft untuk operasi bypass koroner (CABG)'))
tebak(11, 'truncus-thyrocervicalis', 'Pembuluh darah leher', 'Truncus thyrocervicalis', 'Batang pendek dari a. subclavia',
      'Ini trunkus tiroservikalis, batang pendek dari bagian pertama arteri subklavia. Tebak: apa empat cabangnya?',
      'Sebutkan empat cabang truncus thyrocervicalis!',
      'Tiroidea inferior, servikalis asendens, transversa servikalis, dan suprascapularis.',
      '1. A. thyroidea inferior\n2. A. cervicalis ascendens\n3. A. transversa cervicis\n4. A. suprascapularis',
      jawab_sorot=[('A. thyroidea inferior', 'FJ2209'), ('A. transversa cervicis', 'FJ2309'), ('A. cervicalis superficialis', 'FJ2308')],
      jawab_sub='A. thyroidea inferior, a. cervicalis ascendens, a. transversa cervicis, dan a. suprascapularis.')
beat('Jembatan keledainya: STAT. Suprascapular, Transverse cervical, Ascending cervical, Thyroid inferior. A. suprascapularis tidak ada di model ini.',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"STAT"\nSuprascapular · Transverse cervical · Ascending cervical · Thyroid (inferior)'))
tebak(12, 'truncus-costocervicalis', 'Pembuluh darah leher', 'Truncus costocervicalis', 'Dari bagian kedua a. subclavia',
      'Trunkus kostoservikalis keluar dari bagian kedua arteri subklavia. Tebak: apa dua cabangnya?',
      'Sebutkan dua cabang truncus costocervicalis!',
      'Arteri servikalis profunda, dan arteri interkostalis suprema, yang memperdarahi sela iga pertama dan kedua.',
      '1. A. cervicalis profunda\n2. A. intercostalis suprema (ICS I–II)',
      jawab_sorot=[('A. cervicalis profunda', 'FJ2278'), ('A. intercostalis suprema', 'FJ1935')], jawab_arah=[-0.6, 0.2, -0.8])

# ================= AKSILA =================
judul_bab('Regio axillaris', '🙋', 'Bab dua: ketiak, alias regio aksilaris!')
beat('Arteri aksilaris berjalan dari tepi lateral iga pertama sampai tepi bawah otot teres mayor. Otot pektoralis minor yang menyilang di depannya membaginya jadi tiga bagian.',
     'a-v-axillaris', 'Regio axillaris', 'A. & V. axillaris', None, sorot=[IGA1],
     gambar=ilus('gray_axillaris_cabang.png', 'Cabang-cabang a. axillaris'))
beat('Jumlah cabang tiap bagian sama dengan nomor bagiannya: satu, dua, tiga. Ingat: Screw The Lawyer Save A Patient!',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"Screw The Lawyer Save A Patient"\nSup. thoracic · Thoracoacromial · Lateral thoracic · Subscapular · Ant. & Post. circumflex humeral'))
beat('Lihat juga keempat saraf yang berjalan di sekitarnya: aksilaris, radialis, medianus, dan ulnaris.', sorot=[N_AX, N_RAD, N_MED, N_UL])
beat('Begini tampilannya di cadaver. Perhatikan arteri aksilaris yang berlanjut jadi arteri brakialis, vena basilika di medialnya, dan fasikulus pleksus brakialis di sekitarnya.',
     gambar=cadaver('cadaver_aksila_1.jpg', 'Regio axillaris: a. axillaris → a. brachialis, v. basilica, fasciculi plexus brachialis'))
beat('Ini lukisan diseksi klasik dari tahun 1867. Di aksila, arteri, vena, dan saraf dibungkus bersama dalam satu selubung, yaitu selubung aksilaris.',
     gambar=lukisan('ford_axilla.jpg', 'Diseksi regio axillaris'))
beat('Arteri torasika superior adalah satu-satunya cabang bagian pertama, kecil, untuk sela iga pertama dan kedua.',
     'thoracica-superior', 'Regio axillaris', 'A. & V. thoracica superior', '🎨 ilustrasi buatan', sorot=[IGA1])
beat('Arteri torasika lateralis turun di sepanjang dinding dada lateral. Fakta klinis: ia ikut memperdarahi payudara bagian lateral dan dijumpai saat diseksi aksila.',
     'thoracica-lateralis', 'Regio axillaris', 'A. & V. thoracica lateralis', None, sorot=[NAMA('^Right (third|fourth|fifth) rib$', 'Iga III–V')],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Perdarahan payudara lateral · dijumpai saat diseksi aksila'))
beat('Arteri torakoakromialis adalah batang pendek dari bagian kedua, yang langsung bercabang empat. Ingat: CAD P, klavikularis, akromialis, deltoideus, pektoralis.',
     'thoracoacromialis', 'Regio axillaris', 'A. & V. thoracoacromialis', '🎨 ilustrasi buatan', sorot=[KLAV, SKAPULA],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"CAD-P"\nClavicular · Acromial · Deltoid · Pectoral'),
     sub='A. thoracoacromialis: batang pendek dari bagian kedua, bercabang empat. Ingat "CAD-P": clavicularis, acromialis, deltoideus, pectoralis.')
tebak(13, 'subscapularis', 'Regio axillaris', 'A. & V. subscapularis', 'Cabang terbesar a. axillaris',
      'Arteri subskapularis adalah cabang terbesar arteri aksilaris. Tebak: apa dua cabangnya?',
      'Sebutkan dua cabang a. subscapularis!',
      'Arteri sirkumfleksa skapula, yang lewat celah segitiga ke belakang skapula, dan arteri torakodorsalis, yang mengikuti sarafnya ke otot latissimus dorsi.',
      '1. A. circumflexa scapulae (lewat spatium triangulare)\n2. A. thoracodorsalis (ke m. latissimus dorsi)',
      jawab_sorot=[('A. circumflexa scapulae', 'FJ2273'), ('A. thoracodorsalis', 'FJ2305'), SKAPULA], jawab_arah=[-0.8, 0, -0.6])
beat('Arteri sirkumfleksa humeri anterior melingkar kecil di depan kolum kirurgikum humerus.',
     'circumflexa-humeri-anterior', 'Regio axillaris', 'A. & V. circumflexa humeri anterior', None)
tebak(14, 'circumflexa-humeri-posterior', 'Regio axillaris', 'A. & V. circumflexa humeri posterior', 'Lewat spatium quadrangulare',
      'Arteri sirkumfleksa humeri posterior melingkari kolum kirurgikum humerus dari belakang. Tebak: ia lewat bersama struktur apa?',
      'Pembuluh ini melintasi collum chirurgicum humeri bersama struktur apa?',
      'Bersama nervus aksilaris, melewati celah segi empat, atau spatium quadrangulare.',
      'Bersama nervus axillaris, melalui spatium quadrangulare', jawab_sorot=[N_AX],
      jawab_sub='Bersama nervus axillaris, melewati spatium quadrangulare.')
beat('Fakta klinis: fraktur kolum kirurgikum humerus bisa mencederai nervus aksilaris, sehingga otot deltoid melemah dan kulit bahu lateral mati rasa.',
     sorot=[N_AX], card=dict(type='klinis', head='🏥 Makna klinis', text='Fraktur collum chirurgicum → cedera n. axillaris → m. deltoideus lemah'))
beat('Batas celah segi empat: teres minor di atas, teres mayor di bawah, kaput longum triseps di medial, dan kolum kirurgikum humerus di lateral.',
     card=dict(type='mnemo', head='🧠 Batas spatium quadrangulare', text='Atas: m. teres minor · Bawah: m. teres major\nMedial: caput longum m. triceps · Lateral: collum chirurgicum humeri'))

# ================= LENGAN ATAS =================
judul_bab('Regio brachii', '💪', 'Bab tiga: lengan atas!')
beat('Arteri brakialis adalah lanjutan arteri aksilaris mulai dari tepi bawah teres mayor. Ia turun bersama nervus medianus di sisi medial lengan.',
     'a-v-brachialis', 'Regio brachii', 'A. & V. brachialis', None, sorot=[N_MED],
     gambar=ilus('gray_lengan_atas_brachialis.png', 'A. brachialis & a. profunda brachii, dengan n. radialis'))
beat('Di fossa kubiti, arteri brakialis bercabang menjadi arteri radialis dan arteri ulnaris.',
     sorot=[I('a-v-radialis', 'A. radialis'), I('a-v-ulnaris', 'A. ulnaris')])
beat('Di cadaver, cari arteri brakialis yang selalu ditemani nervus medianus. Di lengan atas, saraf ini menyilang arteri dari lateral ke medial.',
     gambar=cadaver('cadaver_brachialis_medianus.jpg', 'A. brachialis & n. medianus di lengan atas'))
beat('Ini lukisan diseksi lengan atas. Ikuti arteri brakialis dari aksila sampai ke siku.',
     gambar=lukisan('ford_lengan_atas.jpg', 'Diseksi regio brachii anterior'))
beat('Fakta klinis: inilah arteri yang kita dengar saat mengukur tekanan darah, dengan stetoskop di fossa kubiti, di medial tendo biseps.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Pengukuran tekanan darah: manset di lengan atas, stetoskop di fossa cubiti'))
tebak(15, 'profunda-brachii', 'Regio brachii', 'A. & V. profunda brachii', 'Cabang besar a. brachialis',
      'Arteri profunda brakii berjalan ke belakang mengitari humerus. Tebak: ia melintasi sulkus spiralis bersama struktur apa?',
      'Pembuluh ini melintasi sulcus spiralis bersama struktur apa?',
      'Bersama nervus radialis, di sulkus nervi radialis di belakang humerus.',
      'Bersama nervus radialis, di sulcus nervi radialis (sulcus spiralis) humeri', jawab_sorot=[N_RAD], jawab_arah=[-0.6, 0, -0.8],
      jawab_sub='Bersama nervus radialis, di sulcus nervi radialis di belakang humerus.')
beat('Fakta klinis: fraktur korpus humeri bisa mencederai nervus radialis, menyebabkan tangan terkulai, atau wrist drop.',
     sorot=[N_RAD], card=dict(type='klinis', head='🏥 Makna klinis', text='Fraktur corpus humeri → cedera n. radialis → wrist drop'))

beat('Potongan melintang lengan atas ini membantu membayangkan letak arteri, vena, dan saraf terhadap humerus dan otot-ototnya.',
     gambar=cadaver('cadaver_potongan_lengan.jpg', 'Potongan melintang regio brachii'))
# ================= LENGAN BAWAH =================
judul_bab('Regio antebrachii', '🤚', 'Bab empat: lengan bawah!')
beat('Arteri radialis turun di sisi lateral, sisi ibu jari. Di dekat pergelangan tangan letaknya superfisial, di lateral tendo fleksor karpi radialis.',
     'a-v-radialis', 'Regio antebrachii', 'A. & V. radialis', None, sorot=[RADIUS, N_RAD],
     gambar=ilus('gray_lengan_bawah_arteri.png', 'A. radialis & a. ulnaris di lengan bawah'),
     card=dict(type='nama', head='🔤 Asal nama', text='Radius (Latin) = jari-jari roda'))
beat('Fakta klinis: di sinilah nadi biasa diraba, dan darah arteri diambil untuk analisis gas darah. Sebelumnya lakukan tes Allen untuk menilai aliran kolateral dari arteri ulnaris.',
     alat=dict(jenis='jarum', target='FJ2294', yrel=0.08, arah=[0, -0.55, 0.85], masuk=4), arah=[-0.3, 0, 1],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Nadi radialis · pungsi untuk analisis gas darah · tes Allen dulu'))
beat('Arteri ulnaris turun di sisi medial, sisi kelingking, bersama nervus ulnaris, lalu masuk ke tangan lewat kanal Guyon.',
     'a-v-ulnaris', 'Regio antebrachii', 'A. & V. ulnaris', None, sorot=[ULNA, N_UL],
     card=dict(type='nama', head='🔤 Asal nama', text='Ulna (Latin) = siku / lengan'))
beat('Perhatikan nervus ulnaris lewat di belakang epikondilus medialis humerus. Itulah tulang lucu yang kesemutan saat siku terbentur!',
     sorot=[N_UL], arah=[0.3, 0, -1], sub='N. ulnaris lewat di belakang epicondylus medialis humeri: itulah "tulang lucu" yang kesemutan saat siku terbentur!')

beat('Ini lukisan diseksi lengan bawah. Arteri radialis di sisi ibu jari, arteri ulnaris di sisi kelingking.',
     gambar=lukisan('ford_lengan_bawah.jpg', 'Diseksi regio antebrachii anterior'))
# ================= TANGAN =================
judul_bab('Regio manus', '🖐️', 'Bab lima: telapak tangan!')
tebak(16, 'arcus-palmaris-superficialis', 'Regio manus', 'Arcus palmaris superficialis', 'Lengkung palmar superfisial',
      'Arkus palmaris superfisialis, lengkung arteri yang lebih ke distal. Tebak: pembuluh apa yang membentuknya?',
      'Pembuluh darah apa sajakah yang membentuk struktur ini?',
      'Terutama arteri ulnaris, dilengkapi ramus palmaris superfisialis arteri radialis.',
      'Terutama a. ulnaris, dilengkapi r. palmaris superficialis a. radialis', jawab_sorot=[I('a-v-ulnaris', 'A. ulnaris'), I('a-v-radialis', 'A. radialis')],
      jawab_sub='Terutama a. ulnaris, dilengkapi r. palmaris superficialis a. radialis.')
tebak(17, 'arcus-palmaris-profundus', 'Regio manus', 'Arcus palmaris profundus', 'Lengkung palmar dalam',
      'Arkus palmaris profundus, lebih dalam dan lebih ke proksimal, di atas basis tulang metakarpal. Tebak: pembentuknya?',
      'Pembuluh darah apa sajakah yang membentuk struktur ini?',
      'Terutama arteri radialis, dilengkapi ramus palmaris profundus arteri ulnaris.',
      'Terutama a. radialis, dilengkapi r. palmaris profundus a. ulnaris',
      jawab_sorot=[I('a-v-radialis', 'A. radialis'), I('a-v-ulnaris', 'A. ulnaris'), NAMA('^Right \\w+ metacarpal bone$', 'Ossa metacarpi')],
      jawab_sub='Terutama a. radialis, dilengkapi r. palmaris profundus a. ulnaris.')
beat('Jembatan keledainya: S U dan P R. Superfisialis ulnaris, profundus radialis!',
     sorot=[I('arcus-palmaris-superficialis', 'Superficialis ← ulnaris'), I('arcus-palmaris-profundus', 'Profundus ← radialis')],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"SU – PR"\nSuperficialis ← Ulnaris · Profundus ← Radialis'))

beat('Di cadaver tangan, arteri radialis dan arteri ulnaris bisa diikuti sampai membentuk lengkung-lengkung di telapak tangan.',
     gambar=cadaver('cadaver_tangan_radialis.jpg', 'A. radialis & a. ulnaris di tangan'))
# ================= VENA SUPERFISIAL =================
judul_bab('Vena-vena superfisial', '🩸', 'Bab terakhir: vena-vena superfisial, favorit untuk ambil darah!')
tebak(18, 'v-cephalica', 'Vena superfisial', 'Vena cephalica', 'Sisi lateral (ibu jari)',
      'Vena sefalika naik di sisi lateral lengan, lalu masuk ke alur di antara otot deltoid dan pektoralis mayor. Tebak: di mana muaranya?',
      'Di manakah muara vena cephalica?',
      'Ke vena aksilaris. Ia menembus fasia klavipektoralis di bawah klavikula, lalu bermuara ke vena aksilaris.',
      'Ke v. axillaris (setelah menembus fascia clavipectoralis di trigonum clavipectorale)', jawab_sorot=[('V. axillaris', 'FJ2269'), KLAV])
beat('Fun fact: namanya dari kata Yunani kefale, kepala, kemungkinan karena salah terjemah dari bahasa Arab. Vena ini tidak ada hubungannya dengan kepala!',
     card=dict(type='nama', head='🔤 Asal nama', text='Kephale (Yunani) = kepala → kemungkinan salah terjemah dari bahasa Arab'))
beat('Ini gambaran klasik vena-vena superfisial lengan: sefalika di lateral, basilika di medial, dan penghubungnya di fossa kubiti.',
     gambar=ilus('gray_vena_superfisial_lengan.png', 'Vena-vena superfisial ekstremitas superior'))
tebak(19, 'v-basilica', 'Vena superfisial', 'Vena basilica', 'Sisi medial (kelingking)',
      'Vena basilika naik di sisi medial lengan. Tebak: di mana muaranya?',
      'Di manakah muara vena basilica?',
      'Di pertengahan lengan atas ia menembus fasia profunda, lalu bergabung dengan vena brakialis membentuk vena aksilaris.',
      'Menembus fascia profunda di pertengahan lengan atas → bergabung dgn vv. brachiales → v. axillaris',
      jawab_sorot=[('V. brachialis', 'FJ2341'), ('V. axillaris', 'FJ2269')])
beat('Vena mediana antebrakii berjalan di tengah permukaan depan lengan bawah. Polanya sangat bervariasi.',
     'v-mediana-antebrachii', 'Vena superfisial', 'V. mediana antebrachii', None)
tebak(20, 'v-mediana-cubiti', 'Vena superfisial', 'V. mediana cubiti', 'Penghubung di fossa cubiti',
      'Vena mediana kubiti menghubungkan vena sefalika dan vena basilika di fossa kubiti. Tebak: apa makna klinisnya?',
      'Apakah makna klinis vena-vena di regio cubiti?',
      'Tempat favorit pungsi vena: ambil darah, pasang infus, dan transfusi, karena superfisial, besar, mudah terlihat, dan relatif terfiksasi.',
      'Tempat favorit pungsi vena (ambil darah, infus, transfusi): superfisial, besar, mudah terlihat & teraba, relatif terfiksasi',
      jawab_sorot=[I('v-cephalica', 'V. cephalica'), I('v-basilica', 'V. basilica')])
beat('Begini kira-kira posisi jarum saat mengambil darah: masuk dengan sudut landai, searah aliran vena.',
     alat=dict(jenis='jarum', target='FJ2287', yrel=0.5, arah=[0, -0.5, 0.86], masuk=4), arah=[-0.2, 0, 1],
     card=dict(type='klinis', head='🏥 Ilustrasi tindakan', text='Pungsi vena di v. mediana cubiti'))
beat('Aponeurosis bisipitalis di bawah vena ini melindungi arteri brakialis dan nervus medianus di bawahnya. Tapi hati-hati jangan menusuk terlalu dalam!',
     sorot=[I('a-v-brachialis', 'A. brachialis'), N_MED], card=dict(type='klinis', head='⚠️ Hati-hati', text='Di bawahnya: a. brachialis & n. medianus (dilindungi aponeurosis bicipitalis)'))
beat('Pada sebagian orang, polanya berbentuk huruf M: vena mediana antebrakii bercabang dua. Cabang lateralnya vena mediana sefalika...',
     'v-mediana-cephalica', 'Vena superfisial', 'V. mediana cephalica', '🎨 variasi pola "M"', sorot=[I('v-cephalica', 'V. cephalica')])
beat('...dan cabang medialnya vena mediana basilika. Hati-hati, ia dekat sekali dengan arteri brakialis.',
     'v-mediana-basilica', 'Vena superfisial', 'V. mediana basilica', '🎨 variasi pola "M"', sorot=[I('v-basilica', 'V. basilica'), I('a-v-brachialis', 'A. brachialis')])

# ================= OUTRO =================
beat('Selesai! Semua struktur Praktikum dua sudah kita telusuri. Mantap!',
     'orientasi-2', K, 'Selesai! 🎉', None, card=dict(type='intro', head='🎉 Mantap!', text='Semua struktur Praktikum 2 sudah kamu jelajahi'), sfx='ding')
beat('Buka websitenya, coba kuisnya, dan sampai jumpa di Praktikum tiga!',
     card=dict(type='intro', head='🎯 Langkah berikutnya', text='Buka website → coba Kuis → lanjut Praktikum 3'))
