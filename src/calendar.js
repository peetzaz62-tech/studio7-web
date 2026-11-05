// สร้างลิงก์ Google Calendar / ไฟล์ .ics จากข้อมูลกิจกรรม (เวลาไทย UTC+7)
const TZ_OFFSET_H = 7
const pad = (n) => String(n).padStart(2, '0')

export function parseTime(t = '') {
  const m = t.match(/(\d{1,2})[.:](\d{2})\s*[–-]\s*(\d{1,2})[.:](\d{2})/)
  return m ? m.slice(1).map(Number) : null
}

// คืน { start, end } เป็น Date (เวลาจริง) หรือ allDay
export function eventRange(ev) {
  const [y, mo, d] = ev.date.split('-').map(Number)
  const [y2, mo2, d2] = (ev.endDate || ev.date).split('-').map(Number)
  const t = parseTime(ev.time)
  if (!t) return { allDay: true, start: new Date(Date.UTC(y, mo - 1, d)), end: new Date(Date.UTC(y2, mo2 - 1, d2 + 1)) }
  return {
    allDay: false,
    start: new Date(Date.UTC(y, mo - 1, d, t[0] - TZ_OFFSET_H, t[1])),
    end: new Date(Date.UTC(y2, mo2 - 1, d2, t[2] - TZ_OFFSET_H, t[3])),
  }
}

const utc = (dt) => `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`
const day = (dt) => `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}`
const where = (ev) => ev.link?.href || 'Faculty of Architecture, RMUTT, Pathum Thani'
const what = (ev) => `${ev.tag ? ev.tag + ': ' : ''}${ev.title}`

export function googleCalendarUrl(ev) {
  const r = eventRange(ev)
  const dates = r.allDay ? `${day(r.start)}/${day(r.end)}` : `${utc(r.start)}/${utc(r.end)}`
  const p = new URLSearchParams({ action: 'TEMPLATE', text: what(ev), dates, details: [ev.subtitle, 'Resilient Architecture by Studio 7'].filter(Boolean).join('\n'), location: where(ev) })
  return `https://calendar.google.com/calendar/render?${p}`
}

export function downloadIcs(ev) {
  const r = eventRange(ev)
  const esc = (s = '') => s.replace(/[\\,;]/g, (c) => '\\' + c).replace(/\n/g, '\\n')
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Studio 7//Resilient Architecture//TH', 'BEGIN:VEVENT',
    `UID:${ev.id || ev.date}-${ev.title.length}@studio7`, `DTSTAMP:${utc(new Date())}`,
    r.allDay ? `DTSTART;VALUE=DATE:${day(r.start)}` : `DTSTART:${utc(r.start)}`,
    r.allDay ? `DTEND;VALUE=DATE:${day(r.end)}` : `DTEND:${utc(r.end)}`,
    `SUMMARY:${esc(what(ev))}`, `LOCATION:${esc(where(ev))}`,
    ev.subtitle ? `DESCRIPTION:${esc(ev.subtitle)}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean)
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `${(ev.id || 'event')}.ics` })
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
