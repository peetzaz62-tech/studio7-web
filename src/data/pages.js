// ข้อมูลหน้า Submission / Alumni / Download
export const SUBMISSION = {
  intro: 'Designing for Resilient Architecture Requires More Than a Good Idea. It requires a process, one that is iterative, collaborative, and rooted in place. Our working method blends architectural education, climate risk analysis, and stakeholder engagement. The result: actionable design strategies that are technically sound, socially relevant, and environmentally integrated.',
  items: [
    { no: '01', title: 'Presentation (Gen 3)', label: 'ส่งงาน 2027', note: 'online submission (JPG file only)', href: 'https://docs.google.com/forms/d/e/1FAIpQLSeCID8XATtCPrN33ruyn1r92f4sSv3YV97dUs5xCN1AuMvbOg/viewform?usp=sharing' },
    { no: '02', title: 'Presentation (Gen 4)', label: 'ส่งงาน 2027', note: 'online submission (JPG file only)', href: 'https://docs.google.com/forms/d/e/1FAIpQLSeCID8XATtCPrN33ruyn1r92f4sSv3YV97dUs5xCN1AuMvbOg/viewform?usp=sharing' },
  ],
}

const GEN3 = ['Alongkorn Jaimung', 'Nattanich Tappa', 'Bunthita Muenpoo', 'Thawanrat Nantasen', 'Jiranan Numtee', 'Sataphon Ratchatasuwan', 'Pakavan Yansiwamok', 'Yanisa Watthanapradit']

export const ALUMNI = {
  intro: 'Our alumni are at the heart of a growing movement toward climate-adaptive design. From experimental prototypes to community-driven interventions, their work continues to shape how architecture engages with water, risk, and resilience. This page celebrates the students, designers, and researchers who have contributed to our studio, workshops, and international exchanges.',
  generations: [
    // หมายเหตุ: เว็บเดิมใช้รายชื่อชุดเดียวกันทั้ง Generation 4 และ 3 — แก้รายชื่อ Gen 4 เมื่อพร้อม
    { title: 'Generation 4 (2027)', people: GEN3.map((name) => ({ name })) },
    { title: 'Generation 3 (2026)', people: GEN3.map((name) => ({ name })) },
    {
      title: 'Generation 2 (2025)',
      people: ['Tinnapop Jongjareanpornsuk', 'Sirilak Kachin', 'Manatsadha Kulatnam', 'Thanakorn Pomnoi', 'Tanakrit Ponwuttikul', 'Punsiri Sirisawat', 'Yada Sriboonpong', 'Phuwanat Tochaiyaphum'].map((name) => ({ name })),
    },
    {
      title: 'Generation 1 (2024)',
      people: [
        { name: 'Napatr Ekanai', work: 'Nanotech air restorative architecture' },
        { name: 'Nutchanon Hojirawutthanapun', work: 'Architecture for Peaces' },
        { name: 'Tosapon Klinthuean', work: 'Advanced data infrastructure Thailand' },
        { name: 'Natrawee Mesangpry', work: 'Coastal resilient architecture for flood adaptation' },
        { name: 'Visava Nilrod', work: 'Oasis mosque Ethiopie' },
        { name: 'Vasita Saleekij', work: 'War shelter' },
        { name: 'Kotchakorn Saimangkla', work: 'Tsunami disaster learning and research center' },
        { name: 'Nimit Sittichai', work: 'Adaptive architecture and seismic resilience' },
      ],
    },
  ],
  tutors: [
    { name: 'Apinya Boonma Vashiratragool', photo: 'tutor-1.jpg' },
    { name: 'Noppakorn Palawan', photo: 'tutor-2.jpg' },
    { name: 'Asst. Prof. Dr. Polpat Nil-u-bon', photo: 'tutor-3.jpg' },
    { name: 'Nattapoom Rubcome-in', photo: 'tutor-4.jpg' },
    { name: 'Saran Chaiyasuta', photo: 'tutor-5.jpg' },
    { name: 'Asst. Prof. Dr. Sarin Pinich', photo: 'tutor-6.jpg' },
  ],
  guests: [
    { name: 'ผศ.ภูริน หล้าเตจา', role: 'Lecturer – King Mongkut’s University of Technology North Bangkok (KMUTNB)' },
    { name: 'อดิศักดิ์ โพธิ์แก้ว', role: 'Architect – Jal Hug Architects Co., Ltd.' },
    { name: 'ศศินา วุฒธรรมกรณ์', role: 'Architect – Studio Normad Co., Ltd.' },
  ],
}

export const DOWNLOADS = [
  {
    year: '2025',
    cover: 'book-2025.jpg',
    title: 'Amphibious Urbanism: Adaptive Transformation Toward the Future of Resilient Design',
    text: [
      'This book is born from the international summer course Amphibious Transformation by Design, a collaborative initiative that brought together students and lecturers from Thailand, Indonesia, and the Netherlands to confront one of the most urgent challenges of our time: how can cities learn to live with water?',
      'Through joint studios, fieldwork, and cross-cultural exchange, students from RMUTT (Rajamangala University of Technology Thanyaburi), UNS (Universitas Sebelas Maret), and KMUTT (King Mongkut’s University of Technology Thonburi) explored flood-prone urban environments and proposed design solutions that transcend traditional boundaries of land and water. Their work, guided by an interdisciplinary teaching team, formed the foundation of this book.',
    ],
    href: 'https://drive.google.com/file/d/1aCy-Ml6RAsYPAI7_jPQ2E1S8wTWA_bP0/view?usp=drive_link',
    cta: 'Download Book 2025',
  },
  {
    year: '2024',
    cover: 'book-2024.jpg',
    title: 'Design Guidelines for Resilient Architecture: Strategies for a Changing Climate',
    text: [
      'Architecture today must go beyond aesthetics and efficiency. In an age of rising seas, extreme heat, and urban disruption, resilience is not optional, it’s essential.',
      'This book offers a practical and visionary guide for designing buildings and cities that can adapt, endure, and regenerate. Drawing from global frameworks and local studio-based innovation, it presents design strategies for floods, earthquakes, and heatwaves, while showcasing 8 student-led projects that turn crisis into opportunity.',
      'Whether you are an architect, student, planner, or policymaker, this book will inspire and equip you to build for a future shaped by uncertainty but full of possibility.',
    ],
    href: 'https://drive.google.com/file/d/1AQaqz_SrS16xzcO9VmVSzBRR73nGWp9i/view?usp=drivesdk',
    cta: 'Download Book 2024',
  },
]
