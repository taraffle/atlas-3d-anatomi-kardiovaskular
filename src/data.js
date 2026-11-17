// Memuat data praktikum hasil preprocessing (lihat scripts/build-data.mjs).
import * as THREE from 'three'
import { gunzipSync } from 'fflate'

export async function loadPraktikum(id, base, onProgress) {
  const metaRes = await fetch(`${base}data/praktikum-${id}.json`)
  if (!metaRes.ok) throw new Error(`Praktikum ${id} tidak ditemukan`)
  const meta = await metaRes.json()

  const res = await fetch(`${base}data/praktikum-${id}.bin`)
  if (!res.ok) throw new Error('Gagal memuat model 3D')
  const total = +res.headers.get('content-length') || 0
  let bytes
  if (res.body && total && onProgress) {
    const reader = res.body.getReader(), chunks = []
    let got = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value); got += value.length
      onProgress(Math.min(1, got / total))
    }
    bytes = new Uint8Array(got); let o = 0
    for (const c of chunks) { bytes.set(c, o); o += c.length }
  } else {
    bytes = new Uint8Array(await res.arrayBuffer())
  }
  // File disimpan sebagai gzip mentah. Beberapa server sudah membuka gzip-nya sendiri,
  // jadi cek "magic bytes" dulu sebelum di-unzip.
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = gunzipSync(bytes)
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)

  const { min, step } = meta.quant
  const geometries = new Map()
  for (const p of meta.parts) {
    const q = new Int16Array(buf, p.posOffset, p.vertexCount * 3)
    const pos = new Float32Array(q.length)
    for (let i = 0; i < q.length; i++) { const a = i % 3; pos[i] = (q[i] + 32767) * step[a] + min[a] }
    const idx = new Uint16Array(buf, p.idxOffset, p.indexCount).slice()
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setIndex(new THREE.BufferAttribute(idx, 1))
    g.computeVertexNormals()
    g.computeBoundingBox()
    geometries.set(p.id, g)
  }
  return { meta, geometries }
}
