import { useState } from 'react'
import { thumbUrl as thumb } from '../media.js'

// รูปคน: ถ้าไม่มีรูปหรือโหลดไม่ขึ้น แสดงรูปคนเส้น (แบบ scale figure ในแบบสถาปัตย์) + "ยังไม่มีรูป"
export default function PersonPhoto({ photo, name }) {
  const [failed, setFailed] = useState(false)
  if (photo && !failed) {
    return <span className="person-photo"><img src={thumb(photo)} alt="" loading="lazy" onError={() => setFailed(true)} /></span>
  }
  return (
    <span className="person-photo is-empty" title={`${name} — ยังไม่มีรูป`}>
      <svg viewBox="0 0 100 125" aria-hidden="true">
        <circle cx="50" cy="38" r="15" />
        <path d="M20 125 C 22 86, 34 66, 50 66 C 66 66, 78 86, 80 125" />
        <path d="M8 118 H 92" className="ground" />
      </svg>
      <small>ยังไม่มีรูป</small>
    </span>
  )
}
