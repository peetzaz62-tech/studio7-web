// เตรียมรูปในเบราว์เซอร์ก่อนอัปโหลด:
// - รูปเต็ม ยาวสุด 1600px และรูปย่อ ยาวสุด 640px แปลงเป็น WebP ทั้งคู่ (รูปจากมือถือ 5–10 MB จะเหลือราว 150–400 KB)
// - GIF อัปโหลดตามเดิม (เพื่อให้ภาพเคลื่อนไหวยังขยับได้) ไม่เกิน 10 MB
// - ไฟล์ที่เบราว์เซอร์เปิดไม่ได้ (เช่น HEIC บน Chrome/Windows) แจ้งให้แปลงเป็น JPG ก่อน
const FULL = 1600
const THUMB = 640
const MAX_INPUT = 40 * 1024 * 1024
const MAX_GIF = 10 * 1024 * 1024

async function decode(file) {
  try {
    return await createImageBitmap(file)
  } catch {
    // บางเบราว์เซอร์ (เช่น Safari กับ HEIC) เปิดผ่าน <img> ได้แม้ createImageBitmap ไม่ได้
    const url = URL.createObjectURL(file)
    try {
      const img = new Image()
      img.src = url
      await img.decode()
      return img
    } catch {
      return null
    } finally {
      URL.revokeObjectURL(url)
    }
  }
}

function toWebp(src, max, quality) {
  const w = src.width || src.naturalWidth
  const h = src.height || src.naturalHeight
  const scale = Math.min(1, max / Math.max(w, h))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(w * scale))
  canvas.height = Math.max(1, Math.round(h * scale))
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff' // PNG โปร่งใส → พื้นขาว (WebP รองรับโปร่งใส แต่รูปส่วนใหญ่ในเว็บเป็นภาพถ่าย)
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height)
  return new Promise((r) => canvas.toBlob(r, 'image/webp', quality))
}

async function post(body, type, thumbOf) {
  const res = await fetch(`/api/upload${thumbOf ? `?thumb=${encodeURIComponent(thumbOf)}` : ''}`, { method: 'POST', headers: { 'content-type': type }, body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `อัปโหลดไม่สำเร็จ (${res.status})`)
  return data
}

export const formatSize = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)

// คืน { url, size, original } — size = ขนาดรูปเต็มหลังแปลง
export async function uploadImage(file) {
  if (file.size > MAX_INPUT) throw new Error(`"${file.name}" ใหญ่เกิน 40 MB — ลดขนาดก่อนอัปโหลด`)
  if (file.type === 'image/gif') {
    if (file.size > MAX_GIF) throw new Error(`GIF "${file.name}" ใหญ่เกิน 10 MB`)
    const r = await post(file, 'image/gif')
    return { url: r.url, size: r.size, original: file.size }
  }
  const src = await decode(file)
  if (!src) {
    const heic = /\.hei[cf]$/i.test(file.name) || /hei[cf]/.test(file.type)
    throw new Error(heic
      ? `เบราว์เซอร์นี้เปิดไฟล์ HEIC "${file.name}" ไม่ได้ — แปลงเป็น JPG ก่อน (บน iPhone: ตั้งค่า → กล้อง → รูปแบบ → "เข้ากันได้มากที่สุด" หรือส่งรูปผ่าน Safari)`
      : `เปิดไฟล์ "${file.name}" ไม่ได้ — ใช้ไฟล์ JPG, PNG หรือ WebP`)
  }
  const [full, thumb] = await Promise.all([toWebp(src, FULL, 0.82), toWebp(src, THUMB, 0.78)])
  src.close?.()
  if (!full || !thumb) throw new Error('แปลงรูปไม่สำเร็จ ลองใหม่อีกครั้ง')
  const r = await post(full, 'image/webp')
  await post(thumb, 'image/webp', r.id)
  return { url: r.url, size: r.size, original: file.size }
}
