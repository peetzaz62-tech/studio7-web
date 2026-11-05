// รูปในเว็บมี 2 แบบ:
// 1) ไฟล์ใน public/img เขียนในข้อมูลเป็นชื่อเดิม เช่น "gallery-01.jpg" → เสิร์ฟเป็น /img/gallery-01.webp (เต็ม) และ /img/gallery-01-sm.webp (ย่อ)
// 2) รูปที่อัปโหลดผ่าน dashboard เป็นลิงก์ /media/xxxx.webp (มีขนาดเดียว)
export function imgUrl(f) {
  if (!f) return ''
  if (/^(\/|https?:)/.test(f)) return f
  if (f.endsWith('.png')) return `/img/${f}`
  return `/img/${f.replace(/\.(jpe?g|webp)$/i, '')}.webp`
}

export function thumbUrl(f) {
  if (!f) return ''
  if (/^(\/|https?:)/.test(f)) return f
  if (f.endsWith('.png')) return `/img/${f}`
  return `/img/${f.replace(/\.(jpe?g|webp)$/i, '')}-sm.webp`
}
