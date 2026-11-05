// โครงของ dashboard: เมนูด้านซ้าย, ชื่อช่องภาษาไทย, และกฎว่าช่องไหนเป็นรูป/วันที่/สี/ข้อความยาว
export const SECTIONS = [
  { id: 'events', label: 'หน้า Events', view: '/', keys: ['HERO', 'EVENTS', 'SUBMISSION_FORM', 'LECTURE_LINKS', 'VIDEOS', 'GALLERY', 'REFERENCE_DOCS', 'REFERENCE_LINKS', 'FLOATING'] },
  { id: 'about', label: 'About us', view: '/about-us', keys: ['ABOUT'] },
  { id: 'projects', label: 'Projects', map: 'PROJECTS', view: (k) => `/projects/${k}` },
  { id: 'thesis', label: 'Thesis', map: 'THESIS', view: (k) => `/thesis/${k}` },
  { id: 'submission', label: 'Submission', view: '/submission', keys: ['SUBMISSION'] },
  { id: 'alumni', label: 'Alumni', view: '/alumni', keys: ['ALUMNI'] },
  { id: 'download', label: 'Download', view: '/download', keys: ['DOWNLOADS'] },
  { id: 'site', label: 'เมนูและ Footer', view: '/', keys: ['NAV', 'FOOTER'] },
]

export const KEY_TITLES = {
  HERO: 'ส่วนหัวหน้าแรก (Hero)', EVENTS: 'กิจกรรม (ตารางกิจกรรม)', SUBMISSION_FORM: 'ลิงก์ฟอร์มส่งงาน (ปุ่ม Submission บนหน้าแรก)',
  LECTURE_LINKS: 'รายการ Special lecture', VIDEOS: 'วิดีโอ YouTube', GALLERY: 'รูปบรรยากาศ Workshop',
  REFERENCE_DOCS: 'เอกสารอ้างอิง (การ์ดมีรูป)', REFERENCE_LINKS: 'ลิงก์อ้างอิง', FLOATING: 'Floating Futures',
  ABOUT: 'About us', SUBMISSION: 'Submission', ALUMNI: 'Alumni', DOWNLOADS: 'หนังสือดาวน์โหลด', NAV: 'เมนูด้านบน', FOOTER: 'Footer',
}

export const LABELS = {
  eyebrow: 'ป้ายเล็กด้านบน', title: 'หัวข้อ', subtitle: 'หัวข้อรอง', titleTh: 'ชื่อภาษาไทย', semester: 'ภาคเรียน', text: 'ข้อความ',
  website: 'เว็บไซต์', image: 'รูป', id: 'รหัส', tag: 'ป้าย', color: 'สีป้าย', date: 'วันที่', endDate: 'ถึงวันที่ (ถ้าหลายวัน)',
  time: 'เวลา', photos: 'รูป', link: 'ลิงก์', label: 'ชื่อปุ่ม/ข้อความ', href: 'ลิงก์', cta: 'ข้อความปุ่ม', action: 'ปุ่มเพิ่มเติม',
  no: 'ลำดับ', img: 'รูป', images: 'รูป', name: 'ชื่อ', photo: 'รูป', path: 'ลิงก์ในเว็บ', children: 'เมนูย่อย',
  accent: 'สีประจำปี', intro: 'บทนำ', people: 'ผู้เข้าร่วม', workshop: 'Workshop / Fieldtrip', gallery: 'แกลเลอรี', wide: 'รูปกว้าง',
  thesisTitle: 'หัวข้อส่วน Thesis', thesis: 'ผลงาน Thesis', by: 'เจ้าของผลงาน', year: 'ปี', pages: 'หน้าพอร์ตโฟลิโอ',
  chart: 'บอร์ดนำเสนอ', models: 'รูปโมเดล', chartLabel: 'หัวข้อส่วนบอร์ด', hero: 'รูปเปิด', facts: 'ข้อมูลโครงการ',
  final: 'รูป Final Day', finalLabel: 'หัวข้อส่วน Final', video: 'วิดีโอ', modelCaption: 'คำบรรยายใต้รูปโมเดล',
  social: 'โซเชียล', note: 'หมายเหตุ', location: 'ตำแหน่งบนแผนที่', place: 'ชื่อสถานที่', lat: 'ละติจูด', lng: 'ลองจิจูด', approx: 'พิกัดโดยประมาณ (ไม่ทราบตำแหน่งแน่ชัด)',
  philosophy: 'Philosophy', principlesTitle: 'หัวข้อหลักการ', principles: 'หลักการ', statement: 'ข้อความแนวคิด',
  pillars: 'จุดเด่น 4 ด้าน', aims: 'We Aim To...', items: 'รายการ', generations: 'รุ่น', tutors: 'อาจารย์และผู้เชี่ยวชาญ',
  guests: 'Special guest', role: 'ตำแหน่ง', work: 'ผลงาน', cover: 'ปก', copyright: 'ลิขสิทธิ์', org: 'หน่วยงาน',
  faculty: 'คณะ', address: 'ที่อยู่', email: 'อีเมล', logos: 'โลโก้', alt: 'คำอธิบายรูป', captionsFromImages: 'ชื่อโครงการอ่านจากภาพ',
}

export const HINTS = {
  date: 'วันที่ใช้แยก "กำลังจะมาถึง/ผ่านไปแล้ว" และนับถอยหลังอัตโนมัติ',
  time: 'เช่น 13.00 – 16.00 (ใช้สร้างปุ่มเพิ่มลงปฏิทิน)',
  path: 'ลิงก์ภายในเว็บ เช่น /projects/2026',
  link: 'ลิงก์ภายในเว็บขึ้นต้นด้วย / เช่น /thesis/tinn หรือลิงก์ภายนอก https://...',
  id: 'รหัส YouTube คือส่วนหลัง v= ในลิงก์ เช่น RIu1eJcCY1o',
  lat: 'คลิกขวาที่ Google Maps แล้วคัดลอกตัวเลขแรก',
  lng: 'ตัวเลขที่สองจาก Google Maps',
}

export const COLORS = ['green', 'cyan', 'yellow', 'blue', 'orange', 'red', 'pink']
const IMAGE_KEYS = ['img', 'photo', 'cover', 'chart', 'image', 'wide']
const IMAGE_LIST_KEYS = ['photos', 'gallery', 'GALLERY', 'pages', 'models', 'final', 'hero', 'images']
const LONG_KEYS = ['text', 'intro', 'statement', 'philosophy', 'description']
const LINK_KEYS = ['href', 'link', 'path', 'SUBMISSION_FORM', 'website']

export const isImageValue = (v) => typeof v === 'string' && (/\.(jpe?g|png|webp|gif|svg)$/i.test(v) || v.startsWith('/media/'))
export const isImageKey = (k) => IMAGE_KEYS.includes(k)
export const isImageListKey = (k) => IMAGE_LIST_KEYS.includes(k)
export const isLongKey = (k) => LONG_KEYS.includes(k)
export const isLinkKey = (k) => LINK_KEYS.includes(k)

export function blank(v) {
  if (Array.isArray(v)) return []
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)]))
  if (typeof v === 'number') return 0
  if (typeof v === 'boolean') return false
  return ''
}

// ข้อความสั้น ๆ ที่ใช้เป็นหัวการ์ดของแต่ละรายการ
export function summary(item, i) {
  if (typeof item === 'string') return item
  if (Array.isArray(item)) return item.join(' · ')
  const v = item?.title || item?.name || item?.label || item?.tag || item?.no || item?.year
  return v ? String(v) : `รายการที่ ${i + 1}`
}
