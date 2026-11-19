# Pemetaan struktur daftar tilik → mesh BodyParts3D

Sumber model: `@dagno/anatomy-model@0.1.2` (BodyParts3D 4.0, CC BY 4.0). 2.234 mesh, 15 chunk.
Format `atlas.json` sudah aku cek dan cocok dengan catatanmu: positions float32 xyz → normals int16 → indices uint32 (offset di-padding ke kelipatan 4), satuan meter, +x = kiri pasien, +y = kranial, +z = anterior.

**Keterangan status**

- ✅ **Ada**: ada mesh khusus untuk struktur ini.
- 🟡 **Lewat struktur terkait**: tidak ada mesh sendiri. Ditunjukkan lewat mesh lain yang benar secara anatomi (misal sulkus ditunjukkan lewat pembuluh yang berjalan di dalamnya), dan di UI ditulis jelas "tidak ada mesh tersendiri".
- ◆ **Ilustrasi buatan**: tidak ada di data asli, jadi bentuknya dibuat sendiri (`scripts/buatan.mjs`) dengan letak yang dihitung dari struktur asli di sekitarnya. Selalu diberi label "ilustrasi buatan".
- ❌ **Tidak ada di model**: tidak dipaksakan. Di UI tetap muncul di daftar (supaya daftar tilik lengkap) dengan label "Tidak ada di model 3D", berisi teks materi saja.

ID yang ditulis "kanan / kiri" artinya mesh sisi kanan / kiri pasien.

---

## Praktikum 1: Jantung in situ, jantung lepasan, pembuluh besar toraks–abdomen–pelvis

### Pelindung jantung

| Struktur | Status | Mesh | Catatan |
|---|---|---|---|
| Pericardium fibrosum | ◆ | X_PERIKARDIUM | Kantong buatan membungkus jantung + pangkal pembuluh besar, transparan |
| Pericardium serosum, lamina parietalis | ◆ | X_PERIKARDIUM | Melapisi sisi dalam kantong buatan |
| Lamina visceralis / epicardium | ❌ | – | Epikardium melekat ke dinding jantung, tidak dimodelkan terpisah |
| Cavum pericardii, sinus transversus, sinus obliquus (pertanyaan 1) | ❌ | – | Hanya teks. Bisa ditambah tampilan "lokasi kira-kira" lewat aorta + truncus pulmonalis (sinus transversus) dan vv. pulmonales + VCI (sinus obliquus), tapi ini **opsional**, lihat pertanyaan B |
| Nervus phrenicus | ◆ | X_N_PHRENICUS_D, X_N_PHRENICUS_S | BodyParts3D tidak punya saraf perifer; jalur dihitung dari subclavia, VCS/atrium kanan, ventrikel kiri, diafragma |
| A. & V. pericardiacophrenica | ◆ | X_A_PCP_*, X_V_PCP_* | Digambar menyertai n. phrenicus |

### Jantung in situ dan pembuluh darah besar

| Struktur | Status | Mesh | Catatan |
|---|---|---|---|
| V. brachiocephalica dextra | ✅ | FJ3583 | |
| V. brachiocephalica sinistra | ✅ | FJ3482 | |
| Vena cava superior | ✅ | FJ3645 | |
| Truncus pulmonalis | ✅ | FJ2966 | |
| A. pulmonalis dextra / sinistra | ✅ | FJ3019 / FJ2924 | |
| Vv. pulmonales | ✅ | kanan: FJ3020, FJ3040; kiri: FJ2925, FJ2933, FJ2944, FJ2950, FJ2955 | 4 vena (sup/inf kanan-kiri), tersusun dari 7 mesh |
| Aorta ascendens | ✅ | FJ3413 | |
| Arcus aortae | ✅ | FJ3411 | Untuk pertanyaan 3, cabangnya ditampilkan juga: truncus brachiocephalicus FJ3417, a. carotis communis sinistra FJ3483, a. subclavia sinistra FJ3479 |
| Ligamentum arteriosum (Botalli) | ◆ | X_LIG_ARTERIOSUM | Pita buatan di titik kontak arcus–a. pulmonalis sinistra (di model keduanya hampir menempel, 0,6 mm). Ditambah n. vagus & n. laryngeus recurrens kiri (buatan) |
| Aorta descendens | ✅ | FJ3427 | **Perlu dicek visual:** mesh ini tumpang tindih dengan dua mesh di bawah (rentang tingginya mencakup keduanya). Saat satu ditampilkan, yang lain disembunyikan supaya tidak "berkedip" |
| Aorta thoracica | ✅ | FJ1931 | |
| Aorta abdominalis | ✅ | FJ1932 | |
| A. & V. iliaca communis | ✅ | A: FJ3565 kanan, FJ3464 kiri; V: FJ3566 kanan, FJ3465 kiri | |
| A. & V. iliaca externa | ✅ | A: FJ3567 kanan, FJ3466 kiri; V: FJ3568 kanan, FJ3484 + FJ3522–3524 kiri | |
| A. & V. iliaca interna | ✅ | A: FJ3569 kanan, FJ3468 kiri; V: FJ3570–3572, FJ3607–3609 kanan; FJ3469–3471 kiri | |
| Vena cava inferior | ✅ | FJ3441 (bagian atas) + FJ3659 (bagian bawah) | |
| Vena azygos | ✅ | FJ3416 | Hemiazygos (FJ3434) dan hemiazygos accessoria (FJ1981) ditampilkan sebagai konteks |

### Struktur pada permukaan jantung

Tidak ada satu pun yang berupa mesh sendiri: semuanya adalah *bagian permukaan* dari dinding jantung.

| Struktur | Status | Cara ditunjukkan |
|---|---|---|
| Apex cordis | 🟡 | Dinding ventrikel (FJ2428) + kamera ke ujung apex + penanda titik (lihat pertanyaan A) |
| Basis cordis / facies posterior | 🟡 | Dinding atrium kiri (FJ2438) + vv. pulmonales, dilihat dari belakang |
| Facies sternocostalis | 🟡 | Seluruh jantung dari depan |
| Facies diaphragmatica | 🟡 | Seluruh jantung dari bawah |
| Margo dexter | 🟡 | Dinding atrium kanan (FJ2439), dilihat dari depan |
| Margo sinister / obtusus | 🟡 | Dinding ventrikel, sisi kiri (hasil pembagian, lihat catatan septum) |
| Margo inferior / acutus | 🟡 | Dinding ventrikel, tepi bawah depan, + r. marginalis dexter |
| Sulcus coronarius | 🟡 | Lewat isinya: trunk a. coronaria dextra FJ2723, r. circumflexus FJ2649–2654, sinus coronarius FJ2655, v. cordis magna FJ2656 (sekaligus jawaban pertanyaan 6) |
| Sulcus interventricularis anterior | 🟡 | Lewat isinya: r. interventricularis anterior FJ2631 + v. interventricularis anterior FJ2657–2665 |
| Sulcus interventricularis posterior | 🟡 | Lewat isinya: r. interventricularis posterior FJ2692–2700 + v. cordis media FJ2678–2691 |
| Sulcus terminalis cordis | ❌ | Tidak ada pembuluh penanda dan tidak dimodelkan |

### Ruang-ruang jantung (eksternal & internal)

| Struktur | Status | Mesh | Catatan |
|---|---|---|---|
| Atrium dextrum | ✅ | dinding FJ2439, rongga FJ2424 | Rongga hanya tampil di mode "Lihat dalam" |
| • Auricula dextra | 🟡 | FJ2439 | Bagian dari dinding atrium kanan, tidak terpisah |
| • Mm. pectinati atrii dextri | ❌ | – | Permukaan dalam atrium di model halus |
| • Crista terminalis | ❌ | – | |
| • Fossa ovalis | ❌ | – | |
| • Ostium sinus coronarii | ❌ | – | Sinus coronarius (FJ2655) ada, tapi muaranya tidak dimodelkan |
| • Ostium atrioventriculare dextrum | 🟡 | lewat 3 daun valva tricuspidalis | |
| Ventriculus dexter | ✅* | rongga FJ2423; dinding = bagian kanan FJ2428 | *Dinding hasil pembagian (lihat catatan septum) |
| • Valva tricuspidalis | ✅ | FJ2421 (anterior), FJ2433 (posterior), FJ2436 (septalis) | |
| • Chordae tendineae tricuspidalis | 🟡 | lewat FJ2421, FJ2433, FJ2436 | Ditemukan saat tes: chordae menyatu dengan mesh daun katup trikuspid |
| • Crista supraventricularis | ❌ | – | |
| • Trabeculae carneae ventriculi dextri | ❌ | – | |
| • Trabecula septomarginalis (moderator band) | ❌ | – | Pertanyaan 7 tetap dijawab di teks |
| • Mm. papillares ventriculi dextri | ✅ | FJ2419 (anterior), FJ2430 (posterior), FJ2437 (septalis) | |
| • Septum interventriculare | 🟡 | lewat rongga FJ2423 + FJ2422 | FJ2428 ternyata hanya cangkang luar, tanpa lembaran septum. Ditunjukkan lewat kedua rongga ventrikel + pin di celah terdekatnya |
| • Valva trunci pulmonalis | ✅ | FJ2417, FJ2427, FJ2434 | 3 valvula semilunaris |
| Atrium sinistrum | ✅ | dinding FJ2438, rongga FJ2425 | |
| • Auricula sinistra | 🟡 | FJ2438 | Bagian dari dinding atrium kiri |
| • Vv. pulmonales | ✅ | sama seperti di atas | |
| • Mm. pectinati atrii sinistri | ❌ | – | |
| • Septum interatriale | ❌ | – | Tidak dimodelkan terpisah |
| • Ostium atrioventriculare sinistrum | 🟡 | lewat 2 daun valva mitralis | |
| Ventriculus sinister | ✅* | rongga FJ2422; dinding = bagian kiri FJ2428 | *Hasil pembagian |
| • Valva mitralis | ✅ | FJ2420 (anterior), FJ2432 (posterior) | |
| • Mm. papillares ventriculi sinistri | ✅ | FJ2429 + FJ2418 | **Perlu dicek:** BodyParts3D menamainya "lateral papillary muscle" dan "anterolateral head of lateral papillary muscle", bukan anterior/posterior seperti istilah buku. Aku akan pakai nama netral "M. papillaris ventriculi sinistri" |
| • Chordae tendineae mitralis | 🟡 | lewat FJ2420, FJ2432 | Chordae menyatu dengan mesh daun katup mitral |
| • Trabeculae carneae ventriculi sinistri | ❌ | – | |

### Radix aortae & radix trunci pulmonalis

| Struktur | Status | Mesh |
|---|---|---|
| Valva aortae | ✅ | FJ2435 (anterior), FJ2426 (posterior kiri), FJ2431 (posterior kanan) |
| Valva trunci pulmonalis | ✅ | FJ2417, FJ2427, FJ2434 |

Catatan: nama cusp di BodyParts3D memakai sistem lama (anterior/left posterior/right posterior). Itu berbeda dari istilah klinis (right/left/non-coronary). Aku **tidak** akan menerjemahkan ke nama klinis tanpa verifikasi, cukup ditulis "valvula semilunaris" + catatan "PERLU DICEK".

### Pembuluh darah jantung

| Struktur | Status | Mesh |
|---|---|---|
| A. coronaria sinistra (trunk) | ✅ | FJ2737 |
| • R. interventricularis anterior | ✅ | FJ2631 (batang). Cabang diagonal FJ2633–2642, FJ2648 dan cabang conus FJ2643–2644 sebagai konteks |
| • R. circumflexus | ✅ | FJ2649–FJ2654 |
| A. coronaria dextra (trunk) | ✅ | FJ2723 |
| • R. interventricularis posterior | ✅ | FJ2692–FJ2700 |
| • R. marginalis dexter | ✅ | FJ2667, FJ2668, FJ2672, FJ2674, FJ2675 |
| Sinus coronarius | ✅ | FJ2655 |
| V. cordis magna | ✅ | FJ2656 (+ v. interventricularis anterior FJ2657–2665, yaitu bagian awal v. cordis magna) |
| V. cordis media | ✅ | FJ2678–FJ2691 |
| V. cordis parva | ✅ | FJ2724, FJ2731 |

---

## Praktikum 2: Pembuluh darah leher dan ekstremitas superior

| Struktur | Status | Mesh (kanan / kiri) | Catatan |
|---|---|---|---|
| V. jugularis externa | ❌ | – | Tidak ada di model |
| V. jugularis interna | ✅ | FJ3585 / FJ3485 | Hanya segmen pendek di leher bawah |
| A. carotis communis | ✅ | FJ3564 / FJ3483 | |
| • A. carotis interna | ✅ | FJ1682 / FJ1682M | |
| • A. carotis externa | ❌ | – | Tidak ada di model |
| A. subclavia | ✅ | FJ3579 / FJ3479 | |
| • A. vertebralis | ✅ | FJ1725 / FJ1725M | |
| • A. thoracica interna | ✅ | FJ1937 / FJ1972 | |
| • Truncus thyrocervicalis | ✅ | FJ2307 / FJ2255 | Mesh kecil (±75 verteks). Cabang konteks: a. thyroidea inferior, a. transversa colli, a. cervicalis superficialis. **A. suprascapularis tidak ada** |
| • Truncus costocervicalis | ✅ | FJ2276 / FJ2224 | Cabang konteks: a. cervicalis profunda, a. intercostalis suprema (superior) |
| A. & V. axillaris | ✅ | A: FJ2268 / FJ2216; V: FJ2269 / FJ2217 | |
| • A. & V. thoracica superior | ❌ | – | |
| • A. & V. thoracica lateralis | ✅ | A: FJ1938 / FJ1976; V: FJ2285 / FJ2233 | |
| • A. & V. thoracoacromialis | ❌ | – | |
| • A. & V. subscapularis | ✅ | A: FJ2298 / FJ2246; V: FJ2299 / FJ2247 | Pertanyaan 13: a. circumflexa scapulae (FJ2273 / FJ2221) dan a. thoracodorsalis (FJ2305 / FJ2253) ada |
| • A. & V. circumflexa humeri anterior | ✅ | A: FJ2264 / FJ2212; V: FJ2265 / FJ2213 | |
| • A. circumflexa humeri posterior | ✅ | FJ2291+FJ2292 / FJ2239+FJ2240 | **Venanya tidak ada** |
| A. & V. brachialis | ✅ | A: FJ2271 / FJ2219; V: FJ2341 / FJ2313 | Vena di model bernama "medial brachial vein" |
| • A. profunda brachii | ✅ | FJ2277 / FJ2225 | **Venanya tidak ada** |
| A. & V. radialis | ✅ | A: FJ2294 / FJ2242; V: FJ2296 / FJ2244 | |
| A. & V. ulnaris | ✅ | A: FJ2310 / FJ2258; V: FJ2312 / FJ2260 | |
| Arcus palmaris superficialis | ✅ | FJ2300 / FJ2248 | |
| Arcus palmaris profundus | ✅ | FJ2279 / FJ2227 | |
| V. cephalica | ✅ | FJ2272 / FJ2220 | |
| V. basilica | ✅ | FJ2270 / FJ2218 | |
| V. mediana antebrachii | ✅ | FJ2286 / FJ2234 | |
| V. mediana cubiti | ✅ | FJ2287 / FJ2235 | |
| V. mediana cephalica | ❌ | – | |
| V. mediana basilica | ❌ | – | |

## Praktikum 3: Pembuluh darah ekstremitas inferior

| Struktur | Status | Mesh (kanan / kiri) | Catatan |
|---|---|---|---|
| A. glutea superior | ❌ | – | Hanya venanya |
| Vv. gluteae superiores | ✅ | FJ3616 / FJ3531 | |
| A. glutea inferior | ❌ | – | |
| Vv. gluteae inferiores | ✅ | FJ3606 / FJ3513 | |
| A. pudenda interna | ❌ | – | Hanya cabang ujungnya (a. dorsalis penis) |
| V. pudenda interna | ✅ | FJ3610 / FJ3525 | |
| V. femoralis | ✅ | FJ2144 / FJ2102 | |
| A. femoralis | ✅ | FJ2143 / FJ2074 | |
| • A. epigastrica superficialis | ✅ | FJ3614 / FJ3529 | |
| • A. circumflexa ilium superficialis | ❌ | – | |
| • Aa. pudendae externae | ❌ | – | |
| • A. profunda femoris (batang) | ❌ | – | Tidak ada mesh batangnya. (Daftar *concept* BodyParts3D mengelompokkan "deep femoral artery" ke a. circumflexa femoris lateralis + a. descendens genus. Itu bukan batang a. profunda femoris, jadi **tidak aku pakai**) |
| ➢ A. circumflexa femoris lateralis | ✅ | FJ2158 (+ r. descendens FJ2057) / FJ2078 (+ FJ2063) | |
| ➢ A. circumflexa femoris medialis | ❌ | – | Hanya venanya (FJ2202 / FJ2189) |
| ➢ Aa. perforantes | 🟡 | "Set of perforating arteries" FJ2127, FJ2203 / FJ2090, FJ2094 | **PERLU DICEK visual**: posisinya di paha (cocok), tapi ada mesh lain di model ini yang namanya tidak cocok dengan lokasinya (lihat di bawah) |
| A. poplitea | ✅ | FJ2170 / FJ2086 | Pertanyaan 21: aa. genus (superior lateral/medial, media, inferior lateral/medial) ada sebagai konteks |
| V. poplitea | ✅ | FJ2171 / FJ2117 | |
| A. tibialis anterior | ✅ | FJ2130 / FJ2065 | |
| A. tibialis posterior | ✅ | FJ2172 / FJ2087 | |
| A. fibularis / peronea | ❌ | – | Hanya v. fibularis |
| A. dorsalis pedis | ✅ | FJ2055 / FJ2073 | |
| A. plantaris lateralis | ✅ | FJ2159 / FJ2079 | |
| A. plantaris medialis | ✅ | FJ2164 / FJ2082 | |
| Arcus plantaris | ✅ | FJ2169 / FJ2085 | |
| V. saphena magna | ✅ | FJ2145 / FJ2103 | |
| V. saphena parva | ✅ | FJ2176 / FJ2121 | |

**Anomali data yang aku temukan (tidak akan dipakai):** "Set of calcaneal branches of posterior tibial artery" (FJ2091 / FJ2195) letaknya di ketinggian panggul (y ≈ 0,84–0,91 m), padahal seharusnya di tumit. Kemungkinan salah label di data sumber.

---

## Ringkasan

| Praktikum | Total struktur | ✅ Ada | 🟡 Lewat struktur terkait | ❌ Tidak ada |
|---|---|---|---|---|
| 1 | 73 | 38 | 17 | 18 |
| 2 | 29 | 23 | 0 | 6 |
| 3 | 26 | 17 | 1 | 8 |

(Dihitung per baris tabel. Di Praktikum 1, valva trunci pulmonalis muncul dua kali karena di PDF juga tercantum dua kali, dan cavum/sinus pericardii dihitung satu baris.)

## Catatan pembagian dinding ventrikel

Dinding ventrikel kanan dan kiri adalah satu mesh (FJ2428). Tiap segitiga diberi label "kanan" atau "kiri" berdasarkan rongga ventrikel terdekat (FJ2423 vs FJ2422), lalu dihaluskan dengan voting tetangga. UI menuliskan bahwa batas ini hasil pembagian otomatis.

Saat diuji, ternyata FJ2428 hanya berupa cangkang luar, tanpa lembaran septum di dalamnya. Jadi septum interventriculare **tidak** dibuat dari mesh ini, melainkan ditunjukkan lewat kedua rongga ventrikel (kanan biru, kiri merah) dan pin di titik terdekat di antara keduanya.
