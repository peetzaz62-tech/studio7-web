import { useRef, useState } from 'react'
import { scrollToId } from '../router.js'
import { useGallery } from '../components/Lightbox.jsx'
import Video from '../components/Video.jsx'
import ThesisMap from '../components/ThesisMap.jsx'
import Countdown from '../components/Countdown.jsx'
import SectionHead from '../components/SectionHead.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import Marquee from '../components/Marquee.jsx'
import { useScrollVar } from '../hooks/useReveal.js'
import { googleCalendarUrl, downloadIcs } from '../calendar.js'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const dd = (n) => String(n).padStart(2, '0')
const fmt = (d) => `${dd(d.getDate())}.${dd(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}`

function useToday() {
  const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate())
}

function EventCard({ ev, today, onPhoto, i }) {
  const start = parse(ev.date)
  const end = ev.endDate ? parse(ev.endDate) : start
  const status = end < today ? 'past' : start <= today ? 'now' : 'upcoming'
  const label = { past: 'ผ่านไปแล้ว', now: 'กำลังจัดอยู่', upcoming: 'กำลังจะมาถึง' }[status]
  return (
    <li className={`event is-${status} accent-${ev.color || 'cyan'}`} data-reveal style={{ '--d': i % 4 }}>
      <span className="event-dot" aria-hidden="true" />
      <article className="event-card">
        <div className="event-date">
          <span className="dow">{DAYS[start.getDay()]}</span>
          <span className="day">{dd(start.getDate())}</span>
          <span className="my">{MONTHS[start.getMonth()]} {start.getFullYear()}</span>
          {ev.endDate && <span className="until">→ {fmt(end)}</span>}
        </div>
        <div className="event-body">
          <div className="event-meta">
            <span className={`tag tag-${ev.color || 'cyan'}`}>{ev.tag}</span>
            <span className={`status status-${status}`}>{label}</span>
          </div>
          <h3>{ev.title}</h3>
          {ev.subtitle && <p className="event-sub">{ev.subtitle}</p>}
          <p className="event-time">
            <span>{fmt(start)}{ev.endDate ? ` – ${fmt(end)}` : ''}</span>
            {ev.time && <span>{ev.time} น.</span>}
          </p>
          <div className="event-links">
            {ev.link && <a className="link-arrow" href={ev.link.href} target="_blank" rel="noreferrer">{ev.link.label} <i>↗</i></a>}
            {status !== 'past' && (
              <>
                <a className="chip" href={googleCalendarUrl(ev)} target="_blank" rel="noreferrer">＋ Google Calendar</a>
                <button type="button" className="chip" onClick={() => downloadIcs(ev)}>＋ ไฟล์ปฏิทิน .ics</button>
              </>
            )}
          </div>
          {ev.action && (
            <div className="event-action">
              <span>{ev.action.label}</span>
              <a className="btn btn-small" href={ev.action.href} target="_blank" rel="noreferrer">{ev.action.cta} <i>↗</i></a>
            </div>
          )}
          {ev.photos?.length > 0 && (
            <div className="event-photos">
              {ev.photos.map((p, k) => (
                <button key={p} onClick={() => onPhoto(ev.photos, k)} aria-label="ดูรูปขนาดใหญ่" className="zoom">
                  <img src={thumb(p)} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </article>
    </li>
  )
}

function Hero({ HERO, EVENTS, SUBMISSION_FORM }) {
  const ref = useRef(null)
  useScrollVar(ref)
  return (
    <section className="hero" ref={ref}>
      <div className="hero-bg" style={{ backgroundImage: `url(${img(HERO.image || 'hero-bg.jpg')})` }} />
      <div className="hero-grid" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="hero-eyebrow hero-in" style={{ '--d': 0 }}><span className="tag tag-green">{HERO.eyebrow}</span><span className="mono">{HERO.semester}</span></p>
        <SplitTitle text={HERO.title} className="hero-title" />
        <p className="hero-text hero-in" style={{ '--d': 3 }}>{HERO.text}</p>
        <div className="hero-actions hero-in" style={{ '--d': 4 }}>
          <button type="button" className="btn btn-light" onClick={() => scrollToId('schedule')}>ดูตารางกิจกรรม <i>↓</i></button>
          <a className="btn btn-outline" href={SUBMISSION_FORM} target="_blank" rel="noreferrer">Submission <i>↗</i></a>
        </div>
        <div className="hero-in" style={{ '--d': 5 }}><Countdown events={EVENTS} /></div>
      </div>
      <svg className="hero-waves" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="wv wv1" d="M0 60 C 120 30 240 30 360 60 S 600 90 720 60 S 960 30 1080 60 S 1320 90 1440 60 S 1680 30 1800 60 S 2040 90 2160 60 S 2400 30 2520 60 S 2760 90 2880 60" />
        <path className="wv wv2" d="M0 80 C 160 55 320 55 480 80 S 800 105 960 80 S 1280 55 1440 80 S 1760 105 1920 80 S 2240 55 2400 80 S 2720 105 2880 80" />
        <path className="wv wv3" d="M0 100 C 200 85 400 85 600 100 S 1000 115 1200 100 S 1600 85 1800 100 S 2200 115 2400 100 S 2800 85 3000 100" />
      </svg>
      <button type="button" className="scroll-cue" onClick={() => scrollToId('schedule')} aria-label="เลื่อนลง">
        <span>scroll</span><i aria-hidden="true" />
      </button>
    </section>
  )
}

export default function Events() {
  const { HERO, EVENTS, LECTURE_LINKS, VIDEOS, REFERENCE_DOCS, REFERENCE_LINKS, FLOATING, GALLERY, SUBMISSION_FORM } = useContent()
  const today = useToday()
  const [show, lightbox] = useGallery()
  const [showAll, setShowAll] = useState(false)

  const sorted = [...EVENTS].filter((e) => e.date).sort((a, b) => parse(a.date) - parse(b.date) || (b.endDate ? 1 : 0) - (a.endDate ? 1 : 0))
  const upcoming = sorted.filter((e) => parse(e.endDate || e.date) >= today)
  const past = sorted.filter((e) => parse(e.endDate || e.date) < today).reverse()
  const tags = [...new Set(EVENTS.map((e) => e.tag).filter(Boolean))]

  return (
    <>
      <Hero HERO={HERO} EVENTS={EVENTS} SUBMISSION_FORM={SUBMISSION_FORM} />
      <Marquee items={['Resilient Architecture', 'Living with water', ...tags, 'Studio 7 · RMUTT', 'Climate adaptation']} />

      <section id="schedule" className="section wrap">
        <SectionHead no="01" kicker="Schedule" title="กิจกรรมที่กำลังจะมาถึง" lead={`${upcoming.length} กิจกรรมในภาคการศึกษานี้ — เพิ่มลงปฏิทินได้จากแต่ละกิจกรรม`} />
        {upcoming.length ? (
          <ol className="timeline">
            {upcoming.map((ev, i) => <EventCard key={ev.id || ev.date + ev.title} ev={ev} today={today} onPhoto={show} i={i} />)}
          </ol>
        ) : <p className="muted">ยังไม่มีกิจกรรมใหม่</p>}

        {past.length > 0 && (
          <details className="past-events" data-reveal>
            <summary><span>กิจกรรมที่ผ่านมา</span><span className="mono">{past.length}</span></summary>
            <ol className="timeline is-past">
              {past.map((ev, i) => <EventCard key={ev.id || ev.date + ev.title} ev={ev} today={today} onPhoto={show} i={i} />)}
            </ol>
          </details>
        )}
      </section>

      <section className="section band">
        <div className="wrap">
          <SectionHead no="02" kicker="Workshop Gallery" title="บรรยากาศ Workshop" lead={`${GALLERY.length} ภาพจากห้องเรียน Studio 7`} />
          <div className="masonry">
            {(showAll ? GALLERY : GALLERY.slice(0, 9)).map((g, i) => (
              <button key={g + i} className="masonry-item zoom" onClick={() => show(GALLERY, i)} aria-label={`ดูรูปที่ ${i + 1}`} data-reveal style={{ '--d': i % 3 }}>
                <img src={thumb(g)} alt="" loading="lazy" />
                <span className="masonry-no mono">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          {!showAll && GALLERY.length > 9 && (
            <div className="center"><button className="btn btn-dark" onClick={() => setShowAll(true)}>ดูรูปทั้งหมด <span className="mono">({GALLERY.length})</span></button></div>
          )}
        </div>
      </section>

      <ThesisMap no="03" />

      <section id="lectures" className="section wrap">
        <SectionHead no="04" kicker="Special Lectures" title="Special lecture" />
        <ol className="lecture-list">
          {LECTURE_LINKS.map((l, i) => (
            <li key={l.no} data-reveal style={{ '--d': i }}>
              <a href={l.href} target="_blank" rel="noreferrer">
                <span className="vdo mono">VDO_{l.no}</span>
                <span className="lt">{l.title}</span>
                <span className="arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="videos">
          {VIDEOS.map((v, i) => <div key={v.id} data-reveal style={{ '--d': i % 2 }}><Video id={v.id} title={v.title} /></div>)}
        </div>
      </section>

      <section id="references" className="section band">
        <div className="wrap">
          <SectionHead no="05" kicker="References" title="เอกสารอ้างอิง" />
          <div className="refs">
            {REFERENCE_DOCS.map((r, i) => (
              <a key={r.href} className="ref-card" href={r.href} target="_blank" rel="noreferrer" data-reveal style={{ '--d': i }}>
                <span className="ref-img zoom"><img src={thumb(r.img)} alt="" loading="lazy" /></span>
                <span className="ref-title">{r.title}</span>
                <span className="ref-cta mono">PDF ↗</span>
              </a>
            ))}
          </div>
          <ul className="ref-links" data-reveal>
            {REFERENCE_LINKS.map((r) => (
              <li key={r.href}><a className="link-arrow" href={r.href} target="_blank" rel="noreferrer">{r.title} <i>↗</i></a></li>
            ))}
          </ul>

          <div className="floating">
            <div className="floating-text" data-reveal>
              <span className="tag tag-cyan">Project</span>
              <h3>{FLOATING.title}</h3>
              <a className="link-arrow" href={FLOATING.href} target="_blank" rel="noreferrer">ดูโพสต์บน Facebook <i>↗</i></a>
            </div>
            <div className="floating-imgs">
              {FLOATING.images.map((f, i) => (
                <button key={f} className="zoom" onClick={() => show(FLOATING.images, i)} aria-label="ดูรูปขนาดใหญ่" data-reveal style={{ '--d': i }}>
                  <img src={thumb(f)} alt={FLOATING.title} loading="lazy" />
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
