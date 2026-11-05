import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import { useGallery } from '../components/Lightbox.jsx'
import ThesisMap from '../components/ThesisMap.jsx'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'
const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

function Person({ p }) {
  const inner = (
    <>
      <span className="person-photo">
        {p.photo ? <img src={thumb(p.photo)} alt="" loading="lazy" /> : <span className="initials" aria-hidden="true">{initials(p.name)}</span>}
      </span>
      <span className="person-name">{p.name}{p.link && <i aria-hidden="true"> →</i>}</span>
    </>
  )
  return p.link
    ? <a className="person" href={p.link}>{inner}</a>
    : <div className="person">{inner}</div>
}

export default function Project({ year }) {
  const { PROJECTS, THESIS } = useContent()
  const d = PROJECTS[year]
  const [show, lightbox] = useGallery()
  const [all, setAll] = useState(false)
  const w = d.workshop
  const gallery = w?.gallery || []

  return (
    <>
      <PageHero kicker={`Projects · ${year}`} big={year} title="" subtitle={d.subtitle} accent={d.accent} />

      <section className="section wrap">
        <div className="split">
          <header className="section-head">
            <span className="kicker">Project {year}</span>
            <h2>{d.subtitle}</h2>
          </header>
          <div className="prose">{d.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
        </div>
      </section>

      {d.people.length > 0 && (
        <section className="section band">
          <div className="wrap">
            <header className="section-head">
              <span className="kicker">Participants</span>
              <h2>ผู้เข้าร่วม {d.people.length} คน</h2>
            </header>
            <div className="people">{d.people.map((p) => <Person key={p.name} p={p} />)}</div>
          </div>
        </section>
      )}

      {w && (
        <section className="section wrap">
          <header className="section-head">
            <span className="kicker">Workshop &amp; Fieldtrip</span>
            <h2>{w.title}</h2>
            <p className="section-lead">{w.text}</p>
          </header>
          {w.photos && (
            <div className="trio">
              {w.photos.map((f, i) => (
                <button key={f} onClick={() => show(w.photos, i)} aria-label="ดูรูปขนาดใหญ่"><img src={thumb(f)} alt="" loading="lazy" /></button>
              ))}
            </div>
          )}
          {gallery.length > 0 && (
            <>
              <div className="gallery">
                {(all ? gallery : gallery.slice(0, 8)).map((f, i) => (
                  <button key={f} onClick={() => show(gallery, i)} aria-label={`รูปที่ ${i + 1}`}><img src={thumb(f)} alt="" loading="lazy" /></button>
                ))}
              </div>
              {!all && gallery.length > 8 && (
                <div className="center"><button className="btn btn-ghost-dark" onClick={() => setAll(true)}>ดูรูปทั้งหมด ({gallery.length})</button></div>
              )}
            </>
          )}
          {w.wide && <img className="wide-photo" src={img(w.wide)} alt="" loading="lazy" />}
          {!w.photos && !gallery.length && <p className="muted">รูปกิจกรรมจะอัปเดตเร็ว ๆ นี้</p>}
        </section>
      )}

      <section className="section band">
        <div className="wrap">
          <header className="section-head">
            <span className="kicker">Thesis</span>
            <h2>{d.thesisTitle || 'Thesis Projects'}</h2>
          </header>
          {d.thesis.length ? (
            <div className="thesis">
              {d.thesis.map((t, i) => {
                const body = (
                  <>
                    <span className="thesis-img"><img src={thumb(t.img)} alt={t.title} loading="lazy" /></span>
                    <span className="thesis-text">
                      <span className="thesis-no">{String(i + 1).padStart(2, '0')}</span>
                      {t.title && <strong>{t.title}</strong>}
                      {t.by && <span className="thesis-by">{t.by}</span>}
                      {t.link && <span className="thesis-more">ดูรายละเอียด →</span>}
                    </span>
                  </>
                )
                return t.link
                  ? <a key={i} className="thesis-card" href={t.link}>{body}</a>
                  : <button key={i} type="button" className="thesis-card" onClick={() => show(d.thesis.map((x) => x.img), i)}>{body}</button>
              })}
            </div>
          ) : (
            <p className="muted">รายชื่อผู้เข้าร่วมและผลงานปี {year} จะอัปเดตเร็ว ๆ นี้</p>
          )}
        </div>
      </section>
      {d.thesis.length > 0 && Object.values(THESIS).some((t) => t.year === year && t.location) && <ThesisMap year={year} title={`Thesis ${year} around the world`} />}
      {lightbox}
    </>
  )
}
