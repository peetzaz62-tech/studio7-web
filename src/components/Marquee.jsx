// แถบข้อความวิ่ง (หยุดเมื่อชี้เมาส์ / ไม่วิ่งถ้าผู้ใช้ตั้งลดการเคลื่อนไหว)
export default function Marquee({ items, tone = 'dark' }) {
  const row = items.map((t, i) => <span key={i}>{t}<i aria-hidden="true">✦</i></span>)
  return (
    <div className={`marquee marquee-${tone}`} aria-label={items.join(' · ')}>
      <div className="marquee-track" aria-hidden="true">{row}{row}</div>
    </div>
  )
}
