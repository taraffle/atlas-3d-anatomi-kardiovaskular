# Naskah video Praktikum 3: Pembuluh darah ekstremitas inferior (sisi kanan pasien).
# Semua fakta diambil dari content/praktikum-3.json (materi website). Saraf = ilustrasi buatan.
from naskah_umum import B, beat, tebak, judul_bab, ilus, lukisan, cadaver, GRAY

def I(key, label): return (label, f'item:{key}')
def NAMA(regex, label): return (label, f'name:{regex}')
COXAE = NAMA('^Right hip bone$', 'Os coxae')
SAKRUM = NAMA('^Sacrum$', 'Sacrum')
FEMUR = NAMA('^Right femur$', 'Femur')
PATELA = NAMA('^Right patella$', 'Patella')
TIBIA = NAMA('^Right tibia$', 'Tibia')
FIBULA = NAMA('^Right fibula$', 'Fibula')
METATARSAL = NAMA('^Right \\w+ metatarsal bone$', 'Ossa metatarsi')
A_FEM = ('A. femoralis', 'FJ2143'); V_FEM = ('V. femoralis', 'FJ2144'); A_POP = ('A. poplitea', 'FJ2170'); V_POP = ('V. poplitea', 'FJ2171')
A_IL_INT = ('A. iliaca interna', 'FJ3569'); A_IL_EXT = ('A. iliaca externa', 'FJ3567')
N_FEM = ('N. femoralis', 'X_N_FEMORALIS'); N_SAPH = ('N. saphenus', 'X_N_SAPHENUS'); N_ISC = ('N. ischiadicus', 'X_N_ISCHIADICUS')
N_TIB = ('N. tibialis', 'X_N_TIBIALIS'); N_FIB = ('N. fibularis communis', 'X_N_FIBULARIS_COM'); N_SUR = ('N. suralis', 'X_N_SURALIS')
N_GLUT = ('N. gluteus superior', 'X_N_GLUTEUS_SUP'); N_PUD = ('N. pudendus', 'X_N_PUDENDUS')
K = '🦵 Praktikum 3'

# ================= INTRO & ORIENTASI =================
beat('Halo lagi, calon dokter! Ini seri terakhir: pembuluh darah tungkai bawah. Siap jalan dari panggul sampai ujung kaki?',
     'orientasi-1', K, 'Anatomi Modul Kardiovaskular', 'Praktikum 3: Ekstremitas inferior',
     card=dict(type='intro', head='Halo lagi! 👋', text='Tur 3D Praktikum 3: pembuluh darah tungkai bawah'), sfx='whoosh')
beat('Semua struktur ditampilkan di sisi kanan pasien. Bentuk berlabel ilustrasi, termasuk semua saraf, dibuat sendiri karena tidak ada di data tiga dimensinya.',
     card=dict(type='ilus', head='🎨 Tentang ilustrasi buatan', text='Saraf & beberapa arteri tidak ada di BodyParts3D → digambar sendiri mengikuti struktur asli'))
beat('Jalur utamanya begini. Arteri iliaka eksterna lewat di bawah ligamentum inguinale dan berganti nama menjadi arteri femoralis.',
     'orientasi-1', 'Orientasi', 'Seluruh tungkai bawah', None, sfx='pop', sorot=[A_IL_EXT, A_FEM, COXAE])
beat('Setelah menembus hiatus adduktorius, ia menjadi arteri poplitea di belakang lutut, lalu bercabang menjadi arteri tibialis anterior dan posterior.',
     sorot=[A_POP, ('A. tibialis anterior', 'FJ2130'), ('A. tibialis posterior', 'FJ2172')])
beat('Dari belakang, perhatikan pembuluh gluteal yang keluar dari panggul lewat foramen iskiadikum mayus, cabang dari arteri iliaka interna.',
     'orientasi-2', 'Orientasi', 'Regio glutea dari belakang', None, sorot=[A_IL_INT, COXAE, SAKRUM])
beat('Di fossa poplitea, arteri poplitea letaknya paling dalam, menempel ke femur. Vena poplitea di superfisialnya, dan nervus tibialis paling superfisial.',
     'orientasi-3', 'Orientasi', 'Fossa poplitea dari belakang', None, sorot=[A_POP, V_POP, N_TIB, FEMUR])
beat('Dan saraf! Nervus femoralis di depan paha, nervus iskiadikus di belakang, yang lalu bercabang menjadi nervus tibialis dan fibularis komunis.',
     'orientasi-4', 'Orientasi', 'Saraf-saraf penting', '🎨 ilustrasi buatan', sorot=[N_FEM, N_ISC, N_TIB, N_FIB])
beat('Nervus safenus menemani vena safena magna, dan nervus suralis menemani vena safena parva. Ingat pasangan ini, sering ditanyakan!',
     sorot=[N_SAPH, N_SUR, I('v-saphena-magna', 'V. saphena magna'), I('v-saphena-parva', 'V. saphena parva')],
     sub='N. saphenus menemani v. saphena magna, dan n. suralis menemani v. saphena parva. Ingat pasangan ini, sering ditanyakan!')

# ================= GLUTEA =================
judul_bab('Regio glutea', '🍑', 'Bab pertama: regio glutea, alias bokong!')
beat('Arteri glutea superior adalah cabang terbesar divisi posterior arteri iliaka interna. Ia keluar lewat foramen iskiadikum mayus di atas otot piriformis.',
     'glutea-superior', 'Regio glutea', 'A. & Vv. glutea superior', None, sorot=[A_IL_INT, COXAE],
     gambar=ilus('gray_glutea_proyeksi.png', 'Proyeksi pembuluh & saraf regio glutea di permukaan'))
beat('Ia ditemani nervus gluteus superior, untuk memperdarahi otot gluteus medius, minimus, dan maksimus.', sorot=[N_GLUT])
beat('Jembatan keledainya: di atas piriformis, hanya yang namanya superior. Arteri, vena, dan nervus gluteus superior. Sisanya lewat di bawah.',
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='Di ATAS m. piriformis: hanya yang "superior"\n(a., v., n. gluteus superior)\nSemua yang lain lewat di BAWAH'))
beat('Arteri glutea inferior adalah cabang divisi anterior arteri iliaka interna. Ia keluar di bawah piriformis, bersama nervus iskiadikus, terutama untuk otot gluteus maksimus.',
     'glutea-inferior', 'Regio glutea', 'A. & Vv. glutea inferior', None, sorot=[N_ISC, A_IL_INT])
beat('Fakta klinis: suntikan intramuskular di bokong dilakukan di kuadran lateral atas, supaya jauh dari nervus iskiadikus.',
     sorot=[N_ISC], card=dict(type='klinis', head='🏥 Makna klinis', text='Injeksi IM gluteal: kuadran LATERAL ATAS → hindari n. ischiadicus'))
beat('Arteri pudenda interna adalah arteri utama perineum. Ia keluar lewat foramen iskiadikum mayus, melingkari spina iskiadika, lalu masuk lagi lewat foramen iskiadikum minus.',
     'pudenda-interna', 'Regio glutea', 'A. & Vv. pudenda interna', None, sorot=[N_PUD, COXAE],
     card=dict(type='nama', head='🔤 Asal nama', text='Pudendum (Latin) = alat kelamin luar'))
beat('Di perineum, ia berjalan di kanalis pudendalis, atau kanal Alcock, bersama nervus pudendus.', sorot=[N_PUD])

# ================= PAHA =================
judul_bab('Regio femoris', '🦵', 'Bab dua: paha, dan trigonum femorale!')
beat('Vena femoralis adalah lanjutan vena poplitea. Di trigonum femorale, ia terletak di medial arteri femoralis.',
     'v-femoralis', 'Regio femoris', 'Vena femoralis', None, sorot=[A_FEM, N_FEM],
     gambar=ilus('gray_femoral_selubung.png', 'Isi trigonum femorale & selubung femoral'))
beat('Urutan isi trigonum femorale dari lateral ke medial: NAVEL. Nervus, Arteri, Vena, Empty space, dan Lymphatics.',
     sorot=[N_FEM, A_FEM, V_FEM],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"NAVEL" (lateral → medial)\nNerve · Artery · Vein · Empty space (canalis femoralis) · Lymphatics'))
beat('Begini di cadaver. Dari lateral: nervus femoralis, arteri femoralis, lalu vena femoralis. Vena safena magna masuk dari bawah.',
     gambar=cadaver('cadaver_trigonum_femorale.jpg', 'Trigonum femorale: n., a., v. femoralis & v. saphena magna'))
beat('Fakta klinis: untuk akses vena di lipat paha, raba denyut arteri femoralis, lalu tusuk sedikit di medialnya.',
     alat=dict(jenis='jarum', target='FJ2144', yrel=0.9, arah=[0.15, -0.5, 0.85], masuk=6), arah=[0.15, 0, 1],
     card=dict(type='klinis', head='🏥 Makna klinis', text='Akses vena femoralis: raba a. femoralis → tusuk sedikit MEDIAL'))
beat('Arteri femoralis adalah lanjutan arteri iliaka eksterna di bawah ligamentum inguinale, kira-kira di titik tengah antara SIAS dan simfisis pubis.',
     'a-femoralis', 'Regio femoris', 'Arteria femoralis', None, sorot=[A_IL_EXT, COXAE],
     gambar=ilus('gray_trigonum_femorale.png', 'A. femoralis di trigonum femorale'))
beat('Ia turun lewat trigonum femorale dan kanalis adduktorius, atau kanal Hunter, lalu lewat hiatus adduktorius dan menjadi arteri poplitea.',
     sorot=[A_POP, FEMUR])
beat('Di cadaver yang bernomor ini, coba cari: nomor delapan nervus femoralis, sembilan arteri femoralis, dan sepuluh vena femoralis.',
     gambar=cadaver('cadaver_trigonum_bernomor.jpg', 'Trigonum femorale: 8 n. femoralis · 9 a. femoralis · 10 v. femoralis · 11 v. saphena magna'))
beat('Fakta klinis: denyutnya mudah diraba di lipat paha, dan inilah akses utama kateterisasi arteri untuk angiografi.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Denyut di lipat paha · akses kateterisasi arteri (angiografi)'))
beat('Arteri epigastrika superfisialis adalah cabang superfisial arteri femoralis tepat di bawah ligamentum inguinale. Ia menembus fasia kribrosa lalu naik ke arah umbilikus.',
     'epigastrica-superficialis', 'Regio femoris', 'A. epigastrica superficialis', None, sorot=[A_FEM])
beat('Arteri sirkumfleksa iliaka superfisialis berjalan ke lateral, sejajar di bawah ligamentum inguinale, ke arah SIAS.',
     'circumflexa-iliaca-superficialis', 'Regio femoris', 'A. circumflexa iliaca superficialis', '🎨 ilustrasi buatan', sorot=[COXAE])
beat('Arteri pudenda eksterna berjalan ke medial, untuk kulit regio pubis dan genitalia eksterna. Jadi ada tiga cabang superfisial kecil: epigastrika, sirkumfleksa iliaka, dan pudenda eksterna.',
     'pudendae-externae', 'Regio femoris', 'Aa. pudendae externae', '🎨 ilustrasi buatan',
     sorot=[I('epigastrica-superficialis', 'A. epigastrica superficialis'), I('circumflexa-iliaca-superficialis', 'A. circumflexa il. superficialis')],
     card=dict(type='mnemo', head='🧠 3 cabang superfisial a. femoralis', text='Ke atas: a. epigastrica superficialis\nKe lateral: a. circumflexa ilium superficialis\nKe medial: aa. pudendae externae'))
beat('Arteri femoralis profunda adalah cabang terbesar arteri femoralis, keluar dari sisi posterolateral sekitar tiga sampai empat sentimeter di bawah ligamentum inguinale.',
     'profunda-femoris', 'Regio femoris', 'A. profunda femoris', '🎨 ilustrasi buatan', sorot=[A_FEM],
     gambar=ilus('gray_femoralis_profunda.png', 'A. femoralis & a. profunda femoris beserta cabangnya'))
beat('Cabangnya diingat dengan L M P: sirkumfleksa femoris Lateralis, sirkumfleksa femoris Medialis, dan arteri Perforantes.',
     sorot=[I('circumflexa-femoris-lateralis', 'A. circumflexa fem. lateralis'), I('circumflexa-femoris-medialis', 'A. circumflexa fem. medialis'), I('aa-perforantes', 'Aa. perforantes')],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"LMP"\nCircumflexa femoris Lateralis · circumflexa femoris Medialis · Perforantes'))
beat('Di cadaver, cari arteri femoralis profunda yang menyelam ke dalam, beserta arteri sirkumfleksa femoris lateralis dan medialis.',
     gambar=cadaver('cadaver_trigonum_femorale.jpg', 'Deep femoral a., lateral & medial circumflex femoral a.'))
beat('Arteri sirkumfleksa femoris lateralis berjalan ke lateral di bawah otot sartorius dan rektus femoris, lalu bercabang tiga: asendens, transversus, dan desendens.',
     'circumflexa-femoris-lateralis', 'Regio femoris', 'A. circumflexa lateralis femoris', None, sorot=[FEMUR])
beat('Arteri sirkumfleksa femoris medialis berjalan ke medial-posterior, mengitari kolum femoris dari belakang.',
     'circumflexa-femoris-medialis', 'Regio femoris', 'A. circumflexa medialis femoris', '🎨 ilustrasi buatan', sorot=[FEMUR])
beat('Fakta klinis: inilah pemasok darah utama kaput femoris. Fraktur kolum femoris bisa merusaknya, sehingga terjadi nekrosis avaskular kaput femoris.',
     sorot=[FEMUR], card=dict(type='klinis', head='🏥 Makna klinis', text='Fraktur collum femoris → cabang a. circumflexa fem. medialis rusak → nekrosis avaskular caput femoris'))
beat('Arteri perforantes biasanya tiga, menembus otot adduktor magnus di dekat linea aspera, untuk otot-otot hamstring di paha belakang.',
     'aa-perforantes', 'Regio femoris', 'Aa. perforantes femoris', None, sorot=[FEMUR],
     gambar=ilus('gray_paha_belakang.png', 'Aa. perforantes di paha belakang'),
     card=dict(type='nama', head='🔤 Asal nama', text='Perforare (Latin) = menembus (m. adductor magnus)'))
beat('Di cadaver paha ini, lihat nervus femoralis di lateral dan vena femoralis yang turun di bawah otot sartorius, menuju kanalis adduktorius.',
     gambar=cadaver('cadaver_paha_femoralis.jpg', 'Paha anterior: n. femoralis, v. femoralis & v. saphena magna'))

# ================= POPLITEA =================
judul_bab('Regio poplitea', '🦿', 'Bab tiga: fossa poplitea, di belakang lutut!')
tebak(21, 'a-poplitea', 'Regio poplitea', 'Arteria poplitea', 'Paling dalam di fossa poplitea',
      'Arteri poplitea adalah lanjutan arteri femoralis dari hiatus adduktorius. Tebak: apa saja cabang-cabangnya?',
      'Sebutkan cabang-cabang a. poplitea!',
      'Arteri suralis untuk otot betis, lima arteri genus di sekitar lutut, lalu cabang terminalnya: arteri tibialis anterior dan posterior.',
      '• Aa. surales (m. gastrocnemius, soleus, plantaris)\n• Aa. genus: sup. lat., sup. med., media, inf. lat., inf. med.\n• Terminal: a. tibialis anterior & posterior',
      jawab_sorot=[('Aa. genus', 'FJ2166'), ('A. genus sup. lat.', 'FJ2162'), ('A. tibialis anterior', 'FJ2130'), ('A. tibialis posterior', 'FJ2172')], jawab_arah=[0, 0, -1],
      jawab_sub='Aa. surales, lima aa. genus, lalu cabang terminal a. tibialis anterior dan posterior.')
beat('Kelima arteri genus membentuk anastomosis di sekitar lutut. Catatan: arteri fibularis biasanya bukan dari arteri poplitea langsung, melainkan dari arteri tibialis posterior.',
     sorot=[PATELA], gambar=ilus('gray_genus_anastomosis.png', 'Anastomosis aa. genus di sekitar lutut'))
beat('Ini fossa poplitea di cadaver. Arteri poplitea di dalam, nervus tibialis di tengah, dan nervus fibularis di tepi lateral, mengikuti biseps femoris.',
     gambar=cadaver('cadaver_poplitea.jpg', 'Fossa poplitea: a. poplitea, n. tibialis, n. fibularis'))
beat('Fakta klinis: karena menempel ke femur, arteri poplitea mudah cedera pada fraktur suprakondilar femur atau dislokasi lutut.',
     sorot=[FEMUR], card=dict(type='klinis', head='🏥 Makna klinis', text='Fraktur suprakondilar femur / dislokasi lutut → cedera a. poplitea\nDenyut diraba dengan lutut sedikit fleksi'))
beat('Vena poplitea dibentuk oleh pertemuan vena-vena tibialis, naik di superfisial arteri, menerima vena safena parva, lalu menjadi vena femoralis.',
     'v-poplitea', 'Regio poplitea', 'Vena poplitea', None, sorot=[A_POP, I('v-saphena-parva', 'V. saphena parva')])
beat('Fakta klinis: vena poplitea adalah lokasi yang sering terkena trombosis vena dalam, atau DVT.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Lokasi tersering trombosis vena dalam (DVT)'))
beat('Di fossa poplitea, nervus iskiadikus bercabang. Nervus tibialis turun lurus ke betis, dan nervus fibularis komunis melingkari kolum fibula.',
     sorot=[N_ISC, N_TIB, N_FIB, FIBULA], gambar=cadaver('cadaver_tibialis_fibularis.jpg', 'N. tibialis & n. peroneus (fibularis) communis'))
beat('Fakta klinis: di kolum fibula, nervus fibularis komunis sangat superfisial. Cedera di sini membuat kaki terkulai, atau foot drop.',
     sorot=[N_FIB, FIBULA], card=dict(type='klinis', head='🏥 Makna klinis', text='Cedera n. fibularis communis di collum fibulae → foot drop'))

# ================= TUNGKAI BAWAH =================
judul_bab('Regio cruris', '🏃', 'Bab empat: tungkai bawah!')
beat('Arteri tibialis anterior menembus ke depan di atas membrana interosea, lalu turun di kompartemen anterior bersama nervus fibularis profundus.',
     'a-tibialis-anterior', 'Regio cruris', 'A. tibialis anterior', None, sorot=[TIBIA, FIBULA, N_FIB],
     gambar=ilus('gray_tibialis_anterior.png', 'A. tibialis anterior & a. dorsalis pedis'))
beat('Di depan sendi pergelangan kaki, namanya berganti menjadi arteri dorsalis pedis. Fakta klinis: pada sindrom kompartemen anterior, alirannya bisa terganggu.',
     sorot=[('A. dorsalis pedis', 'FJ2055')], card=dict(type='klinis', head='🏥 Makna klinis', text='Sindrom kompartemen anterior → aliran a. tibialis anterior terganggu'))
beat('Arteri tibialis posterior adalah cabang terminal yang lebih besar. Ia turun di kompartemen posterior bersama nervus tibialis, lalu lewat di belakang maleolus medialis.',
     'a-tibialis-posterior', 'Regio cruris', 'A. tibialis posterior', None, sorot=[N_TIB, TIBIA],
     gambar=ilus('gray_tibialis_posterior.png', 'A. tibialis posterior & a. fibularis'))
beat('Urutan di belakang maleolus medialis, dari depan ke belakang: Tom, Dick, And Very Nervous Harry.',
     sorot=[N_TIB, TIBIA],
     card=dict(type='mnemo', head='🧠 Jembatan keledai', text='"Tom, Dick And Very Nervous Harry"\nTibialis post. · flexor Digitorum longus · Arteri · Vena · Nervus tibialis · flexor Hallucis longus'))
beat('Fakta klinis: denyutnya diraba di antara maleolus medialis dan tendo Achilles.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Denyut a. tibialis posterior: antara malleolus medialis & tendo Achilles'))
beat('Arteri fibularis adalah cabang terbesar arteri tibialis posterior. Ia turun di sisi lateral kompartemen posterior, dekat fibula.',
     'a-fibularis', 'Regio cruris', 'A. fibularis / A. peronea', '🎨 ilustrasi buatan', sorot=[FIBULA, ('A. tibialis posterior', 'FJ2172')],
     card=dict(type='nama', head='🔤 Asal nama', text='Fibula (Latin) = peniti/bros · peronē (Yunani) juga = peniti'))

# ================= KAKI =================
judul_bab('Regio pedis', '🦶', 'Bab lima: kaki!')
beat('Arteri dorsalis pedis berjalan di punggung kaki, di lateral tendo ekstensor halusis longus, menuju sela metatarsal pertama.',
     'a-dorsalis-pedis', 'Regio pedis', 'A. dorsalis pedis', None, sorot=[METATARSAL],
     gambar=ilus('gray_dorsum_pedis.png', 'A. dorsalis pedis di punggung kaki'))
beat('Fakta klinis: denyutnya dipakai menilai perfusi kaki, misalnya pada kaki diabetik. Tapi pada sebagian orang memang tidak teraba karena variasi anatomi.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Nilai perfusi kaki (kaki diabetik) · kadang tidak teraba (variasi)'))
beat('Di telapak kaki, arteri tibialis posterior bercabang dua. Arteri plantaris lateralis yang lebih besar berjalan ke lateral, lalu melengkung ke medial.',
     'a-plantaris-lateralis', 'Regio pedis', 'A. plantaris lateralis', None, sorot=[('A. tibialis posterior', 'FJ2172')],
     gambar=ilus('gray_plantar.png', 'Arteri-arteri telapak kaki'))
beat('Arteri plantaris medialis lebih kecil, di sisi medial telapak kaki, untuk otot-otot ibu jari kaki.',
     'a-plantaris-medialis', 'Regio pedis', 'A. plantaris medialis', None, sorot=[I('a-plantaris-lateralis', 'A. plantaris lateralis')])
tebak(22, 'arcus-plantaris', 'Regio pedis', 'Arcus plantaris', 'Lengkung arteri di telapak kaki',
      'Arkus plantaris, lengkung arteri di dalam telapak kaki setinggi basis metatarsal. Tebak: pembuluh apa yang membentuknya?',
      'Pembuluh darah apa yang membentuk arcus plantaris?',
      'Terutama lanjutan arteri plantaris lateralis, dilengkapi di medial oleh arteri plantaris profunda dari arteri dorsalis pedis.',
      'Terutama lanjutan a. plantaris lateralis, dilengkapi a. plantaris profunda (dari a. dorsalis pedis)',
      jawab_sorot=[I('a-plantaris-lateralis', 'A. plantaris lateralis'), ('A. plantaris profunda', 'FJ2136'), I('a-dorsalis-pedis', 'A. dorsalis pedis')],
      jawab_sub='Terutama lanjutan a. plantaris lateralis, dilengkapi a. plantaris profunda dari a. dorsalis pedis.')
beat('Bandingkan dengan tangan: di kaki hanya ada satu lengkung arteri utama yang dalam, yaitu arkus plantaris.',
     card=dict(type='fakta', head='💡 Bandingkan', text='Tangan: 2 arcus (superficialis & profundus)\nKaki: 1 arcus plantaris (dalam)'))

# ================= VENA SUPERFISIAL =================
judul_bab('Vena-vena superfisial', '🩸', 'Bab terakhir: vena safena, si panjang dan si kecil!')
beat('Vena safena magna adalah vena terpanjang di tubuh. Ia mulai dari ujung medial arkus venosus dorsalis pedis, naik di depan maleolus medialis bersama nervus safenus.',
     'v-saphena-magna', 'Vena superfisial', 'V. saphena magna', None, sorot=[N_SAPH, TIBIA],
     gambar=ilus('gray_saphena_magna.png', 'V. saphena magna dari kaki sampai paha'))
beat('Lalu naik di sisi medial tungkai, kira-kira satu telapak tangan di belakang patela, dan terus di sisi medial paha.',
     sorot=[PATELA, FEMUR], card=dict(type='nama', head='🔤 Asal nama', text='Saphenes (Yunani) = terlihat jelas, atau al-safin (Arab). Asal pastinya diperdebatkan'))
tebak(23, 'v-saphena-magna', 'Vena superfisial', 'V. saphena magna', 'Vena terpanjang di tubuh',
      'Tebak: di mana muara vena safena magna?',
      'Di manakah muara v. saphena magna?',
      'Ke vena femoralis, melalui hiatus safenus di fasia lata, kira-kira tiga sampai empat sentimeter inferolateral dari tuberkulum pubikum.',
      'Ke v. femoralis, melalui hiatus saphenus (fossa ovalis) di fascia lata, ±3–4 cm inferolateral tuberculum pubicum',
      jawab_sorot=[V_FEM, COXAE], jawab_sub='Ke v. femoralis, melalui hiatus saphenus di fascia lata, ±3–4 cm inferolateral tuberculum pubicum.')
beat('Fakta klinis: vena ini sering dipakai sebagai graft bypass koroner. Dan kalau katupnya tidak berfungsi, terjadilah varises.',
     card=dict(type='klinis', head='🏥 Makna klinis', text='Graft bypass koroner (CABG) · katup rusak → varises'))
beat('Di cadaver tungkai bawah ini, vena safena magna terlihat berjalan di depan, dekat tepi medial tibia.',
     gambar=cadaver('cadaver_saphena_tungkai.jpg', 'Tungkai bawah anterior: v. saphena magna'))
tebak(24, 'venaseksi-saphena-magna', 'Vena superfisial', 'Lokasi venaseksi', 'Cut-down vena',
      'Venaseksi adalah membuka kulit untuk mencapai vena secara langsung, bila akses vena biasa sulit. Tebak: di mana lokasinya untuk vena safena magna?',
      'Di manakah lokasi venaseksi v. saphena magna?',
      'Di depan maleolus medialis. Di sini letak vena sangat konstan dan superfisial, langsung di atas tulang.',
      'Di ANTERIOR malleolus medialis: letak vena konstan, superfisial, langsung di atas tulang',
      jawab_sorot=[TIBIA, N_SAPH], jawab_sub='Di depan malleolus medialis: letaknya konstan, superfisial, langsung di atas tulang.')
beat('Begini kira-kira sayatannya: melintang di depan maleolus medialis, lalu vena diangkat dan dibebaskan.',
     alat=dict(jenis='skalpel', target='FJ2145', titik=[-0.0629, 0.0894, 0.0055], arah=[0.35, 0.75, 0.55], masuk=2, sayat=[0.6, 0, -0.8]), arah=[0.85, 0.2, 0.5], zoom=3,
     card=dict(type='klinis', head='🏥 Ilustrasi tindakan', text='Venaseksi: insisi di anterior malleolus medialis'))
beat('Hati-hati dengan nervus safenus yang berjalan di sampingnya. Ia bisa ikut terikat atau terpotong!',
     sorot=[N_SAPH], card=dict(type='klinis', head='⚠️ Hati-hati', text='N. saphenus di samping vena → bisa ikut terikat/terpotong'))
beat('Vena safena parva mulai dari ujung lateral arkus venosus dorsalis pedis, naik di belakang maleolus lateralis bersama nervus suralis, lalu di garis tengah betis.',
     'v-saphena-parva', 'Vena superfisial', 'V. saphena parva', None, sorot=[N_SUR, FIBULA],
     gambar=ilus('gray_saphena_parva.png', 'V. saphena parva di betis'),
     card=dict(type='nama', head='🔤 Asal nama', text='Parva (Latin) = kecil'))
tebak(25, 'v-saphena-parva', 'Vena superfisial', 'V. saphena parva', 'Naik di belakang malleolus lateralis',
      'Tebak: di mana muara vena safena parva?',
      'Di manakah muara v. saphena parva?',
      'Ke vena poplitea di fossa poplitea, setelah menembus fasia profunda. Kadang ada variasi, bermuara lebih tinggi.',
      'Ke v. poplitea di fossa poplitea, setelah menembus fascia profunda\n(variasi: kadang lebih tinggi ke v. femoralis / v. saphena magna)',
      jawab_sorot=[V_POP], jawab_arah=[0, 0, -1],
      jawab_sub='Ke v. poplitea di fossa poplitea, setelah menembus fascia profunda.')
beat('Ringkasnya: magna di depan maleolus medialis bersama nervus safenus, parva di belakang maleolus lateralis bersama nervus suralis.',
     sorot=[I('v-saphena-magna', 'V. saphena magna + n. saphenus'), I('v-saphena-parva', 'V. saphena parva + n. suralis')],
     card=dict(type='mnemo', head='🧠 Ringkas', text='MAGNA: depan malleolus Medialis + n. saphenus → v. femoralis\nPARVA: belakang malleolus lateralis + n. suralis → v. poplitea'))

# ================= OUTRO =================
beat('Selesai! Semua struktur Praktikum tiga, dan seluruh modul kardiovaskular, sudah kita telusuri. Hebat!',
     'orientasi-1', K, 'Selesai! 🎉', None, card=dict(type='intro', head='🎉 Hebat!', text='Semua struktur Praktikum 3 sudah kamu jelajahi'), sfx='ding')
beat('Buka websitenya, coba kuisnya, dan semoga lancar praktikumnya!',
     card=dict(type='intro', head='🎯 Langkah berikutnya', text='Buka website → coba Kuis → semangat praktikum!'))
