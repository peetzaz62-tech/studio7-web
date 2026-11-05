// ข้อมูลหน้า Projects แต่ละปี
// - people: รายชื่อผู้เข้าร่วม (photo ว่าง = ยังไม่มีรูป จะแสดงอักษรย่อแทน)
// - link: ลิงก์ไปหน้า Thesis ของคนนั้น เช่น /thesis/tinn
// - accent: สีประจำปี (green / blue / orange / yellow)
const intro = (y) => [
  `The year ${y} marked a turning point in how architectural education and research confront the realities of climate change and urban flooding. Through hands-on studio work, interdisciplinary collaboration, and site-based experimentation, students developed bold, adaptive, and context-sensitive design solutions across Thailand and beyond.`,
  `This page features selected design studio outcomes, built prototypes, and research-informed interventions developed in ${y} as part of our mission to build a new language of resilient architecture.`,
]
const range = (n, f) => Array.from({ length: n }, (_, i) => f(i + 1))
const WORKSHOP_TEXT = 'กิจกรรมทำความเข้าใจ พูดคุย วิเคราะห์ และ นำเสนอ'

export const PROJECTS = {
  2024: {
    accent: 'green',
    subtitle: 'Resilient Architecture by Design: Studio Projects & Pilot Interventions',
    intro: intro(2024),
    people: [
      'Napatr Ekanai', 'Nutchanon Hojirawutthanapun', 'Tosapon Klinthuean', 'Natrawee Mesangpry',
      'Visava Nilrod', 'Vasita Saleekij', 'Kotchakorn Saimangkla', 'Nimit Sittichai',
    ].map((name, i) => ({ name, photo: `p2024-person-${i + 1}.jpg` })),
    workshop: {
      title: '2025, Workshop and Fieldtrip – Taipei', // เว็บเดิมเขียน 2025 ทั้งที่อยู่ในหน้า 2024 — ตรวจสอบอีกครั้ง
      text: WORKSHOP_TEXT,
      photos: range(3, (i) => `p2024-taipei-${i}.jpg`),
      gallery: range(16, (i) => `p2024-taipei-g${String(i).padStart(2, '0')}.jpg`),
    },
    thesisTitle: 'Thesis Project 2024',
    thesis: [
      { title: 'Nanotech air restorative architecture', img: 'p2024-thesis-1.jpg', link: '/thesis/p1-2024' },
      { title: 'Architecture for Peaces', img: 'p2024-thesis-2.jpg', link: '/thesis/p2-2024' },
      { title: 'Advanced data infrastructure Thailand', img: 'p2024-thesis-3.jpg', link: '/thesis/p3-2024' },
      { title: 'Coastal resilient architecture for flood adaptation', img: 'p2024-thesis-4.jpg', link: '/thesis/p4-2024' },
      { title: 'Oasis mosque Ethiopie', img: 'p2024-thesis-5.jpg', link: '/thesis/p5-2024' },
      { title: 'War shelter', img: 'p2024-thesis-6.jpg', link: '/thesis/p6-2024' },
      { title: 'Tsunami disaster learning and research center', img: 'p2024-thesis-7.jpg', link: '/thesis/p7-2024' },
      { title: 'Adaptive architecture and seismic resilience', img: 'p2024-thesis-8.jpg', link: '/thesis/p8-2024' },
    ],
  },

  2025: {
    accent: 'blue',
    subtitle: 'Resilient Architecture by Design: Studio Projects & Pilot Interventions',
    intro: intro(2025),
    people: [
      { name: 'Tinnapop Jongjareanpornsuk', photo: 'p2025-person-1.jpg', link: '/thesis/tinn' },
      { name: 'Sirilak Kachin', photo: 'p2025-person-2.jpg', link: '/thesis/ch' },
      { name: 'Manatsadha Kulatnam' },
      { name: 'Thanakorn Pomnoi' },
      { name: 'Tanakrit Ponwuttikul' },
      { name: 'Punsiri Sirisawat' },
      { name: 'Yada Sriboonpong', photo: 'p2025-person-7.jpg', link: '/thesis/yada' },
      { name: 'Phuwanat Tochaiyaphum', photo: 'p2025-person-8.jpg' },
    ],
    workshop: {
      title: '2025, Workshop and Fieldtrip – Shanghai',
      text: WORKSHOP_TEXT,
      photos: range(3, (i) => `p2025-shanghai-${i}.jpg`),
      // เว็บเดิมใช้ชุดรูปเดียวกับ Workshop Studio 7 ในหน้า Events
      gallery: range(21, (i) => `gallery-${String(i).padStart(2, '0')}.jpg`),
      wide: 'p2025-group.jpg',
    },
    thesisTitle: 'Thesis Projects',
    thesis: [
      { title: 'Architectural Approaches for Wildland Fire Resilience', by: 'Tinnapop Jongjareanpornsuk', img: 'p2025-person-1.jpg', link: '/thesis/tinn' },
      { title: 'Ecological Reclaiming: Architecture for Lost Coastal Territories', by: 'Sirilak Kachin', img: 'p2025-thesis-ch.jpg', link: '/thesis/ch' },
      { title: 'Food Resilience Architecture: A Flexible System for Crisis-Adapted Communities', by: 'Yada Sriboonpong', img: 'p2025-person-7.jpg', link: '/thesis/yada' },
    ],
  },

  2026: {
    accent: 'orange',
    subtitle: 'Resilient Architecture by Inclusive Design',
    intro: intro(2026),
    people: [
      'Alongkorn Jaimung', 'Nattanich Tappa', 'Bunthita Muenpoo', 'Thawanrat Nantasen',
      'Jiranan Numtee', 'Sataphon Ratchatasuwan', 'Pakavan Yansiwamok', 'Yanisa Watthanapradit',
    ].map((name, i) => ({
      name, photo: `p2026-person-${i + 1}.jpg`,
      ...(i === 3 ? { link: '/thesis/p4-2026' } : {}),
    })),
    workshop: { title: '2026, Workshop and Fieldtrip – Chongqing', text: WORKSHOP_TEXT },
    thesisTitle: 'Thesis Projects',
    thesis: [
      { title: 'ริมราง', img: 'p2026-thesis-1.jpg' },
      { title: '', img: 'p2026-thesis-2.jpg' },
      { title: 'Bangkok Resilient Architecture: Mitigating Urban Heat Island', img: 'p2026-thesis-3.jpg' },
      { title: 'Beyond the Road: Resilient Infrastructure', img: 'p2026-thesis-4.jpg', link: '/thesis/p4-2026' },
      { title: 'VFCW: Vertical Flow Constructed Wetland', img: 'p2026-thesis-5.jpg' },
      { title: 'Transitional Spaces for Cooling Relief', img: 'p2026-thesis-6.jpg' },
      { title: '', img: 'p2026-thesis-7.jpg' },
      { title: 'Spaceport Nexus in Bangkok', img: 'p2026-thesis-8.jpg' },
    ],
    captionsFromImages: true, // ชื่อโปรเจกต์ปีนี้อ่านจากภาพ — แก้ให้ตรงชื่อจริงได้
  },

  2027: {
    accent: 'yellow',
    subtitle: 'Resilient Architecture by Design: Studio Projects & Pilot Interventions',
    intro: intro(2027),
    // หน้าเดิมบน Google Sites ยังเป็นสำเนาของปี 2024 — ใส่รายชื่อ/โปรเจกต์จริงเมื่อพร้อม
    people: [],
    thesis: [],
  },
}
