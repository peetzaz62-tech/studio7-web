// ============================================================
//  ข้อมูลทั้งหมดของเว็บอยู่ในไฟล์นี้ — แก้ตรงนี้ที่เดียว ไม่ต้องแตะโค้ดหน้าเว็บ
// ============================================================


export const NAV = [
  { label: 'Events', id: 'events' },
  { label: 'About us', id: 'about-us' },
  {
    label: 'Projects',
    children: [
      { label: 'Year 2024', id: 'projects-2024' },
      { label: 'Year 2025', id: 'projects-2025' },
      { label: 'Year 2026', id: 'projects-2026' },
      { label: 'Year 2027', id: 'projects-2027' },
    ],
  },
  { label: 'Submission', id: 'submission' },
  { label: 'Alumni', id: 'alumni' },
  { label: 'Download', id: 'download' },
]

export const HERO = {
  eyebrow: 'Events 2026 – 2027',
  title: 'Resilient architecture',
  semester: 'First / Second Semester',
  text: 'Explore our ongoing and past events that showcase how resilience in architecture is being translated into action, education, and community engagement.',
  website: 'www.deresilient.com',
}

export const SUBMISSION_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSeUMWZ81RKietwbtb0S5451cowXMeR30wgGeUMWwWDIrxqfig/viewform?usp=sharing'

const MEET = 'https://meet.google.com/dqz-kwmw-gan'

// วันที่ใส่แบบ YYYY-MM-DD — เว็บจะคำนวณเองว่าเป็น "กำลังจะมาถึง" หรือ "ผ่านไปแล้ว"
// tag สีมี: green, cyan, yellow
export const EVENTS = [
  {
    id: 'workshop-day',
    tag: 'Workshop Day',
    color: 'cyan',
    date: '2025-07-21',
    time: '14.00 – 16.00',
    title: 'กิจกรรมทำความเข้าใจ พูดคุย วิเคราะห์ และนำเสนอ',
    photos: ['wday-1.jpg', 'wday-2.jpg', 'wday-3.jpg'],
  },
  {
    id: 'workshop-week',
    tag: 'Workshop Week',
    color: 'green',
    date: '2026-12-08',
    endDate: '2026-12-15',
    time: '09.00 – 16.00',
    title: 'Workshop Week, Studio 7',
    action: { label: 'Upload a link of Canvas here', href: SUBMISSION_FORM, cta: 'Submission' },
  },
  {
    id: 'workshop-01',
    tag: 'Workshop 01, Studio 7',
    color: 'green',
    date: '2026-12-08',
    time: '13.00 – 16.00',
    title: 'What is Resilient Architecture?',
  },
  {
    id: 'workshop-02',
    tag: 'Workshop 02, Studio 7',
    color: 'cyan',
    date: '2026-12-15',
    time: '13.00 – 16.00',
    title: 'Business Model Canvas (BMC)',
  },
  {
    id: 'lecture-schwan',
    tag: 'Online Lecture',
    color: 'yellow',
    date: '2027-01-12',
    time: '14.00 – 16.00',
    title: 'Special lecture by Schwan Pundoangnetr',
    subtitle: 'RMUTT – Thailand',
    link: { label: 'Online (Google Meet)', href: MEET },
  },
  {
    id: 'lecture-jan',
    tag: 'Online Lecture',
    color: 'yellow',
    date: '2027-01-19', // หมายเหตุ: เว็บเดิมเขียน WED แต่ 19 ม.ค. 2027 เป็นวันอังคาร — ตรวจสอบอีกครั้ง
    time: '14.00 – 16.00',
    title: 'Special lecture by Jan Willem',
    subtitle: 'FlexBase BV, the Netherlands',
    link: { label: 'Online (Google Meet)', href: MEET },
  },
]

export const LECTURE_LINKS = [
  { no: '01', title: 'ธรรมาภิบาลและการวางแผนด้านน้ำ โดย Prof. Chris Zevenbergen', href: 'https://youtu.be/pdL7IFY_WmQ' },
  { no: '02', title: 'แนวทางปรับตัวน้ำท่วมเซี่ยงไฮ้ภายใต้ความไม่แน่นอน', href: 'https://youtu.be/ZITeygde_z0' },
  { no: '03', title: 'การปรับตัวเชิงฉวยโอกาส: วงจรการต่ออายุเมืองเพื่อรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ', href: 'https://youtu.be/BL-XeQsfvdo' },
  { no: '04', title: 'กลยุทธ์วิสัยทัศน์เมืองลอยน้ำ โดย Dr. Koen Olthuis', href: 'https://youtu.be/112WbZJCjH4' },
]

export const VIDEOS = [
  { id: 'RIu1eJcCY1o', title: 'Koen Olthuis | Amphibious Architecture Talk' },
  { id: 'ht27hKYnGGs', title: 'TrendyDesign l EP.1 l เรื่องเล่าจากรอบโลกและเนเธอแลนด์ในการจัดการน้ำ' },
  { id: '1rXldQDyP58', title: 'Amphi Garden' },
  { id: 'r8yvxB1uoao', title: 'Koen Olthuis' },
]

export const REFERENCE_DOCS = [
  { img: 'ref-rotterdam-adaptation.jpg', title: 'Rotterdam Climate Change Adaptation Strategy', href: 'https://static1.squarespace.com/static/5f082078d610926644d22e00/t/621e3a61f6c1665ece53bf4d/1646148232693/UB_RAS_EN_lr.pdf' },
  { img: 'ref-rotterdam-resilience.jpg', title: 'Rotterdam Resilience Strategy', href: 'https://resilientcitiesnetwork.org/downloadable_resources/Network/Rotterdam-Resilience-Strategy-English.pdf' },
  { img: 'ref-rebuild-flood.jpg', title: 'Rebuild by Design — Flood', href: 'https://rebuildbydesign.org/wp-content/uploads/2021/12/673.pdf' },
]

export const REFERENCE_LINKS = [
  { title: 'Understanding Risk 2016, Matthijs Bouw', href: 'https://understandrisk.org/wp-content/uploads/Rebuild-by-design.pdf' },
  { title: 'Riverfront Park Design Workshop', href: 'https://dep.nj.gov/wp-content/uploads/floodresilience/rbdm-20200123-pres.pdf' },
  { title: 'New Meadowlands — Rebuild by Design', href: 'https://rebuildbydesign.org/wp-content/uploads/2021/12/672.pdf' },
]

export const FLOATING = {
  title: 'Floating Futures',
  href: 'https://www.facebook.com/share/p/1KXsjZ1Gsb/',
  images: ['floating-model.jpg', 'floating-render.jpg', 'floating-futures.jpg'],
}

export const GALLERY = Array.from({ length: 21 }, (_, i) => `gallery-${String(i + 1).padStart(2, '0')}.jpg`)

export const FOOTER = {
  copyright: '© 2024 Resilient Architecture by Studio 7',
  org: 'Water Adaptation Innovation Center (WAIC)',
  faculty: 'Faculty of Architecture, Rajamangala University of Technology Thanyaburi (RMUTT)',
  address: '39 Moo 1, Rangsit-Nakhonnayok Rd. (Klong 6), Thanyaburi, Pathum Thani 12110',
  email: 'info@rastudio7.co.th', // เว็บเดิมแสดง info@rastudio7.co.th แต่ลิงก์ไปที่ info@ras7.co.th — เลือกอันที่ถูก
  logos: [
    { img: 'logo-rmutt.png', alt: 'Faculty of Architecture RMUTT' },
    { img: 'logo-waic.png', alt: 'Water Adaptation Innovation Center' },
    { img: 'logo-watercube.png', alt: 'Watercube Lab Co., Ltd.' },
  ],
}
