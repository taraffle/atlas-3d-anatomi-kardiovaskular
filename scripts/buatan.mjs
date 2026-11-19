// Struktur ILUSTRASI BUATAN untuk bagian yang tidak ada di BodyParts3D
// (perikardium, ligamentum, saraf perifer, sebagian pembuluh).
// Bentuknya dibuat sendiri, tetapi letaknya dihitung dari mesh asli (titik acuan),
// supaya posisinya masuk akal. Di website & video selalu diberi label "ilustrasi buatan".
//
// Setiap generator mengembalikan { id, name, system, pos: Float32Array, idx: Uint32Array, buatan: true, gaya }
// gaya: 'saraf' | 'arteri' | 'vena' | 'ligamen' | 'kantong'

import * as THREE from 'three'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'

const V = (a) => new THREE.Vector3(...a)

export function buatGenerator({ geometry }) {
  // ---------- utilitas berbasis mesh asli ----------
  const verts = (id) => { const g = geometry(id), out = []; for (let i = 0; i < g.pos.length; i += 3) out.push(new THREE.Vector3(g.pos[i], g.pos[i + 1], g.pos[i + 2])); return out }
  const centroidOf = (ids) => { const c = new THREE.Vector3(); let n = 0; for (const id of ids) for (const v of verts(id)) { c.add(v); n++ } return c.divideScalar(n) }
  const bbox = (ids) => { const b = new THREE.Box3(); for (const id of ids) for (const v of verts(id)) b.expandByPoint(v); return b }
  const meshObj = (ids) => {
    const grp = new THREE.Group()
    for (const id of ids) {
      const g = geometry(id), bg = new THREE.BufferGeometry()
      bg.setAttribute('position', new THREE.BufferAttribute(g.pos, 3)); bg.setIndex(new THREE.BufferAttribute(g.idx, 1))
      grp.add(new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })))
    }
    grp.updateMatrixWorld(true); return grp
  }
  const ray = new THREE.Raycaster()
  // titik tembus terjauh / terdekat sepanjang sinar dari `from` ke arah `dir`
  const hit = (ids, from, dir, terjauh = true) => {
    ray.set(V(from), V(dir).normalize()); ray.far = 1
    const h = ray.intersectObject(meshObj(ids), true)
    if (!h.length) throw new Error(`sinar tidak mengenai ${ids}`)
    return (terjauh ? h[h.length - 1] : h[0]).point.clone()
  }
  // titik permukaan mesh terdekat ke titik p
  const nearest = (ids, p) => { let best = null, d = Infinity; for (const id of ids) for (const v of verts(id)) { const dd = v.distanceTo(p); if (dd < d) { d = dd; best = v } } return best.clone() }
  // titik-titik vertex mesh pada ketinggian y tertentu (±tol), rata-ratanya
  const pusatPadaY = (ids, y, tol = 0.004) => { const c = new THREE.Vector3(); let n = 0; for (const id of ids) for (const v of verts(id)) if (Math.abs(v.y - y) < tol) { c.add(v); n++ } if (!n) throw new Error(`tidak ada vertex ${ids} di y=${y}`); return c.divideScalar(n) }

  // ---------- pembuat geometri ----------
  const fromThree = (g, meta) => {
    const ng = g.index ? g : g.toNonIndexed()
    if (!ng.index) { const n = ng.attributes.position.count; ng.setIndex([...Array(n).keys()]) }
    return { ...meta, buatan: true, pos: Float32Array.from(ng.attributes.position.array), idx: Uint32Array.from(ng.index.array) }
  }
  const tabung = (titik, r, meta, seg = 80) => {
    const kurva = new THREE.CatmullRomCurve3(titik.map((p) => p.clone()), false, 'centripetal')
    return fromThree(new THREE.TubeGeometry(kurva, seg, r, 10, false), meta)
  }
  const geser = (titik, offset) => titik.map((p) => p.clone().add(V(offset)))

  // ---------- titik-titik acuan Praktikum 1 (semua dari mesh asli) ----------
  const DINDING = ['FJ2439', 'FJ2438', 'FJ2428']
  let _kantong = null
  const kantong = () => {
    if (_kantong) return _kantong
    // Titik dinding jantung + pangkal pembuluh besar yang berada di dalam perikardium.
    const pts = []
    for (const id of DINDING) pts.push(...verts(id))
    pts.push(...verts('FJ3413').filter((v) => v.y < 1.356))           // aorta ascendens (sampai sebelum arcus)
    pts.push(...verts('FJ2966').filter((v) => v.y < 1.364))           // truncus pulmonalis (sampai sebelum bifurkasio)
    pts.push(...verts('FJ3645').filter((v) => v.y < 1.372))           // separuh bawah VCS
    const la = verts('FJ2438')
    for (const id of ['FJ3020', 'FJ3040', 'FJ2925', 'FJ2933', 'FJ2944', 'FJ2950', 'FJ2955'])   // muara vv. pulmonales
      pts.push(...verts(id).filter((v) => la.some((w) => w.distanceTo(v) < 0.012)))
    pts.push(...verts('FJ3441').filter((v) => v.y > 1.255))           // ujung VCI
    const c = centroidOf(DINDING)
    const besar = pts.map((p) => p.clone().add(p.clone().sub(c).normalize().multiplyScalar(0.004)))  // 4 mm di luar jantung
    const g = new ConvexGeometry(besar)
    _kantong = fromThree(g, { id: 'X_PERIKARDIUM', name: 'Pericardium (ilustrasi buatan)', system: 'connective', gaya: 'kantong' })
    _kantong._obj = (() => { const bg = new THREE.BufferGeometry(); bg.setAttribute('position', new THREE.BufferAttribute(_kantong.pos, 3)); bg.setIndex(new THREE.BufferAttribute(_kantong.idx, 1)); const m = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); m.updateMatrixWorld(true); return m })()
    return _kantong
  }
  // titik di permukaan luar kantong perikardium, dari pusat jantung ke arah dir
  const diKantong = (dir, dari, tambah = 0.0015) => {
    const k = kantong(); ray.set(dari.clone(), V(dir).normalize()); ray.far = 1
    const h = ray.intersectObject(k._obj, false); if (!h.length) throw new Error('kantong tidak kena')
    const p = h[h.length - 1].point; return p.add(V(dir).normalize().multiplyScalar(tambah))
  }
  const pusatJantung = () => centroidOf(DINDING)

  // N. phrenicus kanan: leher → antara a./v. subclavia → sisi lateral VCS & atrium kanan (di atas perikardium) → diafragma.
  const phrenicusKanan = () => {
    const ijv = centroidOf(['FJ3585'])
    const p0 = V([ijv.x - 0.010, 1.468, ijv.z - 0.008])
    const sa = centroidOf(['FJ3579']), sv = centroidOf(['FJ3587'])
    const p1 = V([-0.034, (sa.y + sv.y) / 2, (sa.z + sv.z) / 2])
    const vcs = centroidOf(['FJ3645'])
    const p2 = hit(['FJ3645'], vcs, [-1, 0, 0.1]).add(V([-0.005, 0, 0]))
    const ra = centroidOf(['FJ2439'])
    const p3 = diKantong([-1, 0, 0.15], V([ra.x, 1.315, ra.z]))
    const p4 = diKantong([-1, -0.35, 0.1], V([ra.x, 1.29, ra.z]))
    const p5 = hit(['FJ3131'], V([p4.x - 0.004, p4.y, p4.z]), [0, -1, 0], false)
    return [p0, p1, p2, p3, p4, p5]
  }
  // N. phrenicus kiri: leher → antara a./v. subclavia kiri → lateral arcus aortae → di atas ventrikel kiri → diafragma kiri.
  const phrenicusKiri = () => {
    const ijv = centroidOf(['FJ3485'])
    const p0 = V([ijv.x + 0.010, 1.466, ijv.z - 0.008])
    const sa = centroidOf(['FJ3479']), sv = centroidOf(['FJ3486'])
    const p1 = V([0.036, (sa.y + sv.y) / 2, (sa.z + sv.z) / 2])
    const arc = centroidOf(['FJ3411'])
    const p2 = hit(['FJ3411'], arc, [1, 0.1, 0.35]).add(V([0.005, 0, 0.002]))
    const lv = centroidOf(['FJ2422'])
    const p3 = diKantong([1, 0.1, 0.25], V([lv.x, 1.32, lv.z]))
    const p4 = diKantong([1, -0.3, 0.3], V([lv.x, 1.29, lv.z]))
    const p5 = hit(['FJ3131'], V([p4.x + 0.004, p4.y, p4.z]), [0, -1, 0], false)
    return [p0, p1, p2, p3, p4, p5]
  }
  // N. vagus kiri: leher (di antara a. carotis communis & v. jugularis interna, di belakangnya) → di depan arcus
  // → di belakang radix pulmonis sinistra → esofagus. N. laryngeus recurrens kiri melingkar di bawah arcus,
  // lateral dari lig. arteriosum, lalu naik di alur trakea–esofagus.
  const titikLig = () => {
    const arc = verts('FJ3411'), lpa = verts('FJ2924')
    let best = Infinity, a = null, b = null
    for (const p of lpa) for (const q of arc) { const d = p.distanceTo(q); if (d < best) { best = d; a = q; b = p } }
    return { arc: a.clone(), lpa: b.clone() }
  }
  const vagusKiri = () => {
    const cca = centroidOf(['FJ3483']), ijv = centroidOf(['FJ3485'])
    const p0 = V([(cca.x + ijv.x) / 2, 1.455, Math.min(cca.z, ijv.z) - 0.006])
    const arc = centroidOf(['FJ3411'])
    const p1 = hit(['FJ3411'], arc, [1, 0.35, 0.45]).add(V([0.003, 0.002, 0.002]))
    const { arc: la } = titikLig()
    const p2 = V([la.x + 0.010, la.y - 0.004, la.z - 0.004])
    const br = centroidOf(['FJ2450'])
    const p3 = V([br.x - 0.004, br.y - 0.012, br.z - 0.012])
    const es = pusatPadaY(['FJ2563'], 1.25, 0.006)
    const p4 = V([es.x + 0.004, 1.25, es.z + 0.007])
    const p5 = V([es.x + 0.002, 1.20, es.z + 0.006])
    return [p0, p1, p2, p3, p4, p5]
  }
  const recurrensKiri = () => {
    const v = vagusKiri(), { arc: la } = titikLig()
    const bawah = bbox(['FJ3411']).min.y
    const q0 = v[2].clone()
    const q1 = V([la.x + 0.006, bawah - 0.004, la.z - 0.010])
    const q2 = V([la.x - 0.004, bawah - 0.002, la.z - 0.020])
    const tr = pusatPadaY(['FJ2541'], 1.40, 0.006), es = pusatPadaY(['FJ2563'], 1.40, 0.008)
    const q3 = V([(tr.x + es.x) / 2 + 0.008, 1.40, (tr.z + es.z) / 2])
    const tr2 = pusatPadaY(['FJ2541'], 1.46, 0.006), es2 = pusatPadaY(['FJ2563'], 1.46, 0.008)
    const q4 = V([(tr2.x + es2.x) / 2 + 0.008, 1.46, (tr2.z + es2.z) / 2])
    return [q0, q1, q2, q3, q4]
  }

  const GEN = {
    X_PERIKARDIUM: () => kantong(),
    // Di BodyParts3D arcus aortae dan a. pulmonalis sinistra hampir menempel (±0,6 mm), jadi ligamentum
    // digambar sebagai pita yang menjembatani keduanya di sisi kiri titik kontak, sedikit menonjol supaya terlihat.
    X_LIG_ARTERIOSUM: () => {
      const { arc, lpa } = titikLig(), c = arc.clone().add(lpa).multiplyScalar(0.5)
      return tabung([c.clone().add(V([0.0, 0.008, 0.001])), c.clone().add(V([0.006, 0.003, 0.002])), c.clone().add(V([0.006, -0.003, 0.002])), c.clone().add(V([0.0, -0.008, 0.001]))], 0.003,
        { id: 'X_LIG_ARTERIOSUM', name: 'Ligamentum arteriosum (ilustrasi buatan)', system: 'connective', gaya: 'ligamen' }, 24)
    },
    X_N_PHRENICUS_D: () => tabung(phrenicusKanan(), 0.0014, { id: 'X_N_PHRENICUS_D', name: 'N. phrenicus dexter (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),
    X_N_PHRENICUS_S: () => tabung(phrenicusKiri(), 0.0014, { id: 'X_N_PHRENICUS_S', name: 'N. phrenicus sinister (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),
    // a./v. pericardiacophrenica: menyertai n. phrenicus (mulai setinggi a. thoracica interna), sedikit di depan/belakangnya
    X_A_PCP_D: () => tabung(geser(phrenicusKanan().slice(2), [0, 0, 0.0036]), 0.0010, { id: 'X_A_PCP_D', name: 'A. pericardiacophrenica dextra (ilustrasi buatan)', system: 'arterial', gaya: 'arteri' }),
    X_V_PCP_D: () => tabung(geser(phrenicusKanan().slice(2), [0, 0, -0.0036]), 0.0011, { id: 'X_V_PCP_D', name: 'V. pericardiacophrenica dextra (ilustrasi buatan)', system: 'venous', gaya: 'vena' }),
    X_A_PCP_S: () => tabung(geser(phrenicusKiri().slice(2), [0, 0, 0.0036]), 0.0010, { id: 'X_A_PCP_S', name: 'A. pericardiacophrenica sinistra (ilustrasi buatan)', system: 'arterial', gaya: 'arteri' }),
    X_V_PCP_S: () => tabung(geser(phrenicusKiri().slice(2), [0, 0, -0.0036]), 0.0011, { id: 'X_V_PCP_S', name: 'V. pericardiacophrenica sinistra (ilustrasi buatan)', system: 'venous', gaya: 'vena' }),
    X_N_VAGUS_S: () => tabung(vagusKiri(), 0.0016, { id: 'X_N_VAGUS_S', name: 'N. vagus sinister (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),
    X_N_RECURRENS_S: () => tabung(recurrensKiri(), 0.0011, { id: 'X_N_RECURRENS_S', name: 'N. laryngeus recurrens sinister (ilustrasi buatan)', system: 'nervous', gaya: 'saraf' }),
  }
  const cache = new Map()
  return (id) => {
    if (!GEN[id]) return null
    if (!cache.has(id)) { const g = { ...GEN[id]() }; delete g._obj; cache.set(id, g) }
    return cache.get(id)
  }
}
