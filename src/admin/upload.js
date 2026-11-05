// ย่อรูปในเบราว์เซอร์ (ยาวสุด 1600px, แปลงเป็น WebP) แล้วอัปโหลดขึ้น /api/upload
const MAX = 1600

async function toWebp(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, MAX / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.85))
  return blob && blob.size < file.size ? blob : file
}

export async function uploadImage(file) {
  const body = await toWebp(file)
  const res = await fetch('/api/upload', { method: 'POST', headers: { 'content-type': body.type || file.type }, body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `อัปโหลดไม่สำเร็จ (${res.status})`)
  return data.url
}
