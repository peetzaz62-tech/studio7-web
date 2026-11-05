import { useEffect, useState } from 'react'
import { eventRange } from '../calendar.js'

// นับถอยหลังสู่กิจกรรมถัดไป (อัปเดตทุกนาที)
export default function Countdown({ events }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t) }, [])

  const list = events.filter((e) => e.date).map((e) => ({ e, ...eventRange(e) })).sort((a, b) => a.start - b.start)
  const live = list.find((x) => x.start <= now && now < x.end)
  const next = list.find((x) => x.start > now)
  const target = live || next
  if (!target) return null

  const ms = target.start - now
  const days = Math.floor(ms / 864e5)
  const hours = Math.floor((ms % 864e5) / 36e5)
  const mins = Math.floor((ms % 36e5) / 6e4)
  return (
    <a className="countdown" href="#schedule" onClick={(e) => { e.preventDefault(); document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' }) }}>
      {live ? (
        <span className="cd-live">● กำลังจัดอยู่ตอนนี้</span>
      ) : (
        <span className="cd-nums" aria-label={`อีก ${days} วัน ${hours} ชั่วโมง ${mins} นาที`}>
          <b>{days}</b><small>วัน</small><b>{String(hours).padStart(2, '0')}</b><small>ชม.</small><b>{String(mins).padStart(2, '0')}</b><small>นาที</small>
        </span>
      )}
      <span className="cd-what">{live ? '' : 'ถึง '}<strong>{target.e.tag || target.e.title}</strong> · {target.e.title}</span>
    </a>
  )
}
