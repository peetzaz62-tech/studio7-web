import { useState } from 'react'
import { scrollToId } from '../router.js'
import { useGallery } from '../components/Lightbox.jsx'
import Video from '../components/Video.jsx'
import {
  HERO, EVENTS, LECTURE_LINKS, VIDEOS, REFERENCE_DOCS, REFERENCE_LINKS, FLOATING, GALLERY, SUBMISSION_FORM,
} from '../data/site.js'

const img = (f) => `./img/${f}`
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const dd = (n) => String(n).padStart(2, '0')
const fmt = (d) => `${dd(d.getDate())}.${dd(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}`

function useToday() {
  const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

function EventCard({ ev, today, onPhoto }) {
  const start = parse(ev.date)
  const end = ev.endDate ? parse(ev.endDate) : start
  const status = end < today ? 'past' : start <= today ? 'now' : 'upcoming'
  const label = { past: 'ผ่านไปแล้ว', now: 'กำลังจัดอยู่', upcoming: 'กำลังจะมาถึง' }[status]
  return (
    <article className={`event is-${status}`}>
      <div className="event-date">
        <span className="dow">{DAYS[start.getDay()]}</span>
        <span className="day">{dd(start.getDate())}</span>
        <span className="my">{dd(start.getMonth() + 1)}.{String(start.getFullYear()).slice(2)}</span>
        {ev.endDate && <span className="until">ถึง {fmt(end)}</span>}
      </div>
      <div className="event-body">
        <div className="event-meta">
          <span className={`tag tag-${ev.color}`}>{ev.tag}</span>
          <span className={`status status-${status}`}>{label}</span>
        </div>
        <h3>{ev.title}</h3>
        {ev.subtitle && <p className="event-sub">{ev.subtitle}</p>}
        <p className="event-time">
          {fmt(start)}{ev.endDate ? ` – ${fmt(end)}` : ''} · {ev.time} น.
        </p>
        {ev.link && (
          <a className="text-link" href={ev.link.href} target="_blank" rel="noreferrer">{ev.link.label} ↗</a>
        )}
        {ev.action && (
          <div className="event-action">
            <span>{ev.action.label}</span>
            <a className="btn btn-small" href={ev.action.href} target="_blank" rel="noreferrer">{ev.action.cta} ↗</a>
          </div>
        )}
        {ev.photos && (
          <div className="event-photos">
            {ev.photos.map((p, i) => (
              <button key={p} onClick={() => onPhoto(ev.photos, i)} aria-label="ดูรูปขนาดใหญ่">
                <img src={img(p)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default function Events() {
  const today = useToday()
  const [show, lightbox] = useGallery()

  const sorted = [...EVENTS].sort((a, b) => parse(a.date) - parse(b.date) || (b.endDate ? 1 : 0) - (a.endDate ? 1 : 0))
  const upcoming = sorted.filter((e) => parse(e.endDate || e.date) >= today)
  const past = sorted.filter((e) => parse(e.endDate || e.date) < today).reverse()
  const [showAll, setShowAll] = useState(false)

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${img('hero-bg.jpg')})` }}>
        <div className="wrap hero-inner">
          <span className="tag tag-green">{HERO.eyebrow}</span>
          <h1>{HERO.title}</h1>
          <p className="hero-sem">{HERO.semester}</p>
          <p className="hero-text">{HERO.text}</p>
          <div className="hero-actions">
            <button type="button" className="btn" onClick={() => scrollToId('schedule')}>ดูตารางกิจกรรม</button>
            <a className="btn btn-ghost" href={SUBMISSION_FORM} target="_blank" rel="noreferrer">Submission ↗</a>
          </div>
          <a className="hero-site" href="https://www.deresilient.com" target="_blank" rel="noreferrer">{HERO.website}</a>
        </div>
      </section>

      <section id="schedule" className="section wrap">
        <header className="section-head">
          <span className="kicker">Schedule</span>
          <h2>กิจกรรมที่กำลังจะมาถึง</h2>
        </header>
        <div className="events">
          {upcoming.length ? upcoming.map((ev) => (
            <EventCard key={ev.id} ev={ev} today={today} onPhoto={show} />
          )) : <p className="muted">ยังไม่มีกิจกรรมใหม่</p>}
        </div>

        {past.length > 0 && (
          <>
            <header className="section-head small">
              <h2>กิจกรรมที่ผ่านมา</h2>
            </header>
            <div className="events">
              {past.map((ev) => <EventCard key={ev.id} ev={ev} today={today} onPhoto={show} />)}
            </div>
          </>
        )}
      </section>

      <section className="section band">
        <div className="wrap">
          <header className="section-head">
            <span className="kicker">Workshop Gallery</span>
            <h2>บรรยากาศ Workshop</h2>
          </header>
          <div className="gallery">
            {(showAll ? GALLERY : GALLERY.slice(0, 8)).map((g, i) => (
              <button key={g} onClick={() => show(GALLERY, i)} aria-label={`รูปที่ ${i + 1}`}>
                <img src={img(g)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          {!showAll && (
            <div className="center">
              <button className="btn btn-ghost-dark" onClick={() => setShowAll(true)}>ดูรูปทั้งหมด ({GALLERY.length})</button>
            </div>
          )}
        </div>
      </section>

      <section id="lectures" className="section wrap">
        <header className="section-head">
          <span className="kicker">Special Lectures</span>
          <h2>Special lecture</h2>
        </header>
        <ol className="lecture-list">
          {LECTURE_LINKS.map((l) => (
            <li key={l.no}>
              <a href={l.href} target="_blank" rel="noreferrer">
                <span className="vdo">VDO_{l.no}</span>
                <span className="lt">{l.title}</span>
                <span className="arrow" aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="videos">
          {VIDEOS.map((v) => <Video key={v.id} id={v.id} title={v.title} />)}
        </div>
      </section>

      <section id="references" className="section band">
        <div className="wrap">
          <header className="section-head">
            <span className="kicker">References</span>
            <h2>เอกสารอ้างอิง</h2>
          </header>
          <div className="refs">
            {REFERENCE_DOCS.map((r) => (
              <a key={r.href} className="ref-card" href={r.href} target="_blank" rel="noreferrer">
                <img src={img(r.img)} alt="" loading="lazy" />
                <span>{r.title} <i aria-hidden>↗</i></span>
              </a>
            ))}
          </div>
          <ul className="ref-links">
            {REFERENCE_LINKS.map((r) => (
              <li key={r.href}><a href={r.href} target="_blank" rel="noreferrer">{r.title} ↗</a></li>
            ))}
          </ul>

          <div className="floating">
            <div className="floating-text">
              <span className="tag tag-cyan">Project</span>
              <h3>{FLOATING.title}</h3>
              <a className="text-link" href={FLOATING.href} target="_blank" rel="noreferrer">ดูโพสต์บน Facebook ↗</a>
            </div>
            <div className="floating-imgs">
              {FLOATING.images.map((f, i) => (
                <button key={f} onClick={() => show(FLOATING.images, i)} aria-label="ดูรูปขนาดใหญ่">
                  <img src={img(f)} alt={FLOATING.title} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightbox}
    </>
  )
}
