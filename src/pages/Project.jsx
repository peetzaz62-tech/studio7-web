import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { useGallery } from '../components/Lightbox.jsx'
import ThesisMap from '../components/ThesisMap.jsx'
import PersonPhoto from '../components/PersonPhoto.jsx'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'


function Person({ p, i }) {
  const inner = (
    <>
      <PersonPhoto photo={p.photo} name={p.name} />
      <span className="person-name">{p.name}</span>
      {p.link && <span className="person-more mono">ดูผลงาน →</span>}
    </>
  )
  return p.link
    ? <a className="person" href={p.link} data-reveal style={{ '--d': i % 4 }}>{inner}</a>
    : <div className="person" data-reveal style={{ '--d': i % 4 }}>{inner}</div>
}

export default function Project({ year }) {
  const { PROJECTS, THESIS } = useContent()
  const d = PROJECTS[year]
  const [show, lightbox] = useGallery()
  const [all, setAll] = useState(false)
  const w = d.workshop
  const gallery = w?.gallery || []
  const years = Object.keys(PROJECTS).sort()
  const idx = years.indexOf(year)
  let n = 0
  const no = () => String(++n).padStart(2, '0')

  return (
    <div className={`accent-${d.accent}`}>
      <PageHero kicker={`Projects · ${year}`} big={year} subtitle={d.subtitle} accent={d.accent}>
        <nav className="year-switch hero-in" style={{ '--d': 4 }} aria-label="เลือกปี">
          {years.map((y) => <a key={y} href={`/projects/${y}`} className={y === year ? 'on' : ''} aria-current={y === year ? 'page' : undefined}>{y}</a>)}
        </nav>
      </PageHero>

      <section className="section wrap">
        <div className="split">
          <SectionHead no={no()} kicker={`Project ${year}`} title={d.subtitle} />
          <div className="prose" data-reveal style={{ '--d': 2 }}>{d.intro.map((p, i) => <p key={i}>{p}</p>)}</div>
        </div>
      </section>

      {d.people.length > 0 && (
        <section className="section band">
          <div className="wrap">
            <SectionHead no={no()} kicker="Participants" title={`ผู้เข้าร่วม ${d.people.length} คน`} />
            <div className="people">{d.people.map((p, i) => <Person key={p.name} p={p} i={i} />)}</div>
          </div>
        </section>
      )}

      {w && (
        <section className="section wrap">
          <SectionHead no={no()} kicker="Workshop & Fieldtrip" title={w.title} lead={w.text} />
          {w.photos?.length > 0 && (
            <div className="trio">
              {w.photos.map((f, i) => (
                <button key={f} className="zoom" onClick={() => show(w.photos, i)} aria-label="ดูรูปขนาดใหญ่" data-reveal style={{ '--d': i }}><img src={thumb(f)} alt="" loading="lazy" /></button>
              ))}
            </div>
          )}
          {gallery.length > 0 && (
            <>
              <div className="masonry">
                {(all ? gallery : gallery.slice(0, 9)).map((f, i) => (
                  <button key={f + i} className="masonry-item zoom" onClick={() => show(gallery, i)} aria-label={`ดูรูปที่ ${i + 1}`} data-reveal style={{ '--d': i % 3 }}>
                    <img src={thumb(f)} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              {!all && gallery.length > 9 && (
                <div className="center"><button className="btn btn-dark" onClick={() => setAll(true)}>ดูรูปทั้งหมด <span className="mono">({gallery.length})</span></button></div>
              )}
            </>
          )}
          {w.wide && <button className="wide-photo zoom" onClick={() => show([w.wide], 0)} data-reveal><img src={img(w.wide)} alt="" loading="lazy" /></button>}
          {!w.photos?.length && !gallery.length && <p className="muted">รูปกิจกรรมจะอัปเดตเร็ว ๆ นี้</p>}
        </section>
      )}

      <section className="section band">
        <div className="wrap">
          <SectionHead no={no()} kicker="Thesis" title={d.thesisTitle || 'Thesis Projects'} />
          {d.thesis.length ? (
            <div className="thesis">
              {d.thesis.map((t, i) => {
                const body = (
                  <>
                    <span className="thesis-img zoom"><img src={thumb(t.img)} alt={t.title || `Thesis ${i + 1}`} loading="lazy" /></span>
                    <span className="thesis-text">
                      <span className="thesis-no mono">{String(i + 1).padStart(2, '0')}</span>
                      {t.title && <strong>{t.title}</strong>}
                      {t.by && <span className="thesis-by">{t.by}</span>}
                      {t.link && <span className="thesis-more">ดูรายละเอียด <i>→</i></span>}
                    </span>
                  </>
                )
                return t.link
                  ? <a key={i} className="thesis-card" href={t.link} data-reveal style={{ '--d': i % 4 }}>{body}</a>
                  : <button key={i} type="button" className="thesis-card" onClick={() => show(d.thesis.map((x) => x.img), i)} data-reveal style={{ '--d': i % 4 }}>{body}</button>
              })}
            </div>
          ) : (
            <p className="muted">รายชื่อผู้เข้าร่วมและผลงานปี {year} จะอัปเดตเร็ว ๆ นี้</p>
          )}
        </div>
      </section>
      {d.thesis.length > 0 && Object.values(THESIS).some((t) => t.year === year && t.location) && <ThesisMap year={year} title={`Thesis ${year} around the world`} no={no()} />}

      <nav className="pager wrap" aria-label="ปีอื่น">
        {idx > 0 ? <a href={`/projects/${years[idx - 1]}`} className="pager-prev"><span className="mono">← ปีก่อนหน้า</span><strong>Projects {years[idx - 1]}</strong></a> : <span />}
        {idx < years.length - 1 && <a href={`/projects/${years[idx + 1]}`} className="pager-next"><span className="mono">ปีถัดไป →</span><strong>Projects {years[idx + 1]}</strong></a>}
      </nav>
      {lightbox}
    </div>
  )
}
