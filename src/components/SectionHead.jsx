// หัวข้อส่วน: เลขลำดับแบบแบบแปลน + ป้ายเล็ก + หัวข้อใหญ่
export default function SectionHead({ no, kicker, title, lead, align, children }) {
  return (
    <header className={`sec-head ${align === 'center' ? 'is-center' : ''}`}>
      <p className="sec-kicker" data-reveal>{no && <span className="sec-no">{no}</span>}<span>{kicker}</span></p>
      <h2 data-reveal style={{ '--d': 1 }}>{title}</h2>
      {lead && <p className="sec-lead" data-reveal style={{ '--d': 2 }}>{lead}</p>}
      {children}
    </header>
  )
}
