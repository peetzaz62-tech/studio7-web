import { Fragment } from 'react'

// แยกหัวข้อเป็นคำ ๆ แล้วเลื่อนขึ้นจากใต้เส้นทีละคำ (เริ่มเมื่อหน้าโหลดเสร็จ — class "booted" บน <html>)
export default function SplitTitle({ text = '', as: Tag = 'h1', className = '' }) {
  const words = String(text).split(/\s+/).filter(Boolean)
  return (
    <Tag className={`split-title ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-w" aria-hidden="true"><span style={{ '--d': i }}>{w}</span></span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
