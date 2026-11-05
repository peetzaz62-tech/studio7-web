import { useEffect, useRef, useState } from 'react'
import { useGallery } from '../components/Lightbox.jsx'
import Video from '../components/Video.jsx'
import SectionHead from '../components/SectionHead.jsx'
import SplitTitle from '../components/SplitTitle.jsx'
import { useScrollVar } from '../hooks/useReveal.js'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

function Grid({ items, cls, onOpen, caption }) {
  return (
    <div className={cls}>
      {items.map((f, i) => (
        <figure key={f + i} data-reveal style={{ '--d': i % 4 }}>
          <button type="button" className="zoom" onClick={() => onOpen(items, i)} aria-label="ดูรูปขนาดใหญ่">
            <img src={thumb(f)} alt="" loading="lazy" />
          </button>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

// พอร์ตโฟลิโอแบบเลื่อนแนวนอน (ปัดนิ้ว/ลากได้ + ปุ่มลูกศร + แถบความคืบหน้า)
function Portfolio({ pages, onOpen }) {
  const track = useRef(null)
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = track.current
    const on = () => setP(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth))
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])
  const go = (d) => track.current.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <div className="portfolio" data-reveal>
      <div className="portfolio-track" ref={track} tabIndex={0} aria-label="หน้าพอร์ตโฟลิโอ เลื่อนซ้ายขวาได้">
        {pages.map((f, i) => (
          <button key={f} className="portfolio-page" onClick={() => onOpen(pages, i)} aria-label={`เปิดหน้า ${i + 1}`}>
            <img src={thumb(f)} alt="" loading="lazy" />
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <div className="portfolio-bar">
        <button type="button" onClick={() => go(-1)} aria-label="เลื่อนไปทางซ้าย" disabled={p <= 0.001}>←</button>
        <span className="portfolio-progress"><i style={{ transform: `scaleX(${Math.max(0.08, p)})` }} /></span>
        <button type="button" onClick={() => go(1)} aria-label="เลื่อนไปทางขวา" disabled={p >= 0.999}>→</button>
      </div>
    </div>
  )
}

export default function Thesis({ slug }) {
  const { THESIS, PROJECTS } = useContent()
  const t = THESIS[slug]
  const [show, lightbox] = useGallery()
  const hero = useRef(null)
  useScrollVar(hero)
  const accent = PROJECTS[t.year]?.accent || 'cyan'
  const cover = t.hero?.[0] || t.chart || t.pages?.[0]
  const siblings = Object.keys(THESIS).filter((k) => THESIS[k].year === t.year)
  const at = siblings.indexOf(slug)
  const prev = siblings[at - 1]
  const next = siblings[at + 1]
  let n = 0
  const no = () => String(++n).padStart(2, '0')

  return (
    <div className={`accent-${accent}`}>
      <section className={`thesis-hero accent-${accent}`} ref={hero} data-edit="title titleTh by year location hero">
        {cover && <div className="thesis-hero-bg" style={{ backgroundImage: `url(${img(cover)})` }} />}
        <div className="wrap thesis-hero-inner">
          <a className="back-link hero-in" style={{ '--d': 0 }} href={`/projects/${t.year}`}>← Projects {t.year}</a>
          <p className="hero-in" style={{ '--d': 1 }}><span className={`tag tag-${accent}`}>Thesis {t.year}</span></p>
          <SplitTitle text={t.title} />
          {t.titleTh && <p className="thesis-th hero-in" style={{ '--d': 4 }}>{t.titleTh}</p>}
          <p className="thesis-author hero-in" style={{ '--d': 5 }}><span className="mono">by</span> {t.by}{t.location?.place && <span className="mono"> · {t.location.place}</span>}</p>
        </div>
      </section>

      <section className="section wrap" data-edit="text facts note social">
        <div className="split">
          <div>
            <SectionHead no={no()} kicker="Overview" title="แนวคิดโครงการ" />
            {t.hero && t.hero.length > 1 && <Grid items={t.hero} cls="hero-strip" onOpen={show} />}
          </div>
          <div className="prose" data-reveal style={{ '--d': 2 }}>
            {t.text.length ? t.text.map((p, i) => <p key={i}>{p}</p>) : <p className="muted">{t.note}</p>}
            {t.facts && (
              <dl className="facts">
                {t.facts.map(([k, v]) => (
                  <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            )}
            {t.social && (
              <p className="social">
                {t.social.map(([name, href]) => <a key={name} className="chip" href={href} target="_blank" rel="noreferrer">{name} ↗</a>)}
              </p>
            )}
          </div>
        </div>
      </section>

      {t.pages && t.pages.length > 0 && (
        <section className="section band" data-edit="pages">
          <div className="wrap">
            <SectionHead no={no()} kicker="Portfolio" title={`Portfolio · ${t.pages.length} หน้า`} lead="เลื่อนซ้าย–ขวา หรือกดที่หน้าเพื่อดูเต็มจอ" />
            <Portfolio pages={t.pages} onOpen={show} />
          </div>
        </section>
      )}

      {(t.chart || t.models?.length > 0) && (
        <section className="section wrap" data-edit="chart chartLabel models modelCaption">
          <SectionHead no={no()} kicker="Presentation" title={t.chartLabel || 'Chart and model'} />
          {t.chart && (
            <button type="button" className="chart-board zoom" onClick={() => show([t.chart, ...(t.models || [])], 0)} aria-label="ดูบอร์ดขนาดใหญ่" data-reveal>
              <img src={img(t.chart)} alt="Presentation board" loading="lazy" />
            </button>
          )}
          {t.models?.length > 0 && <Grid items={t.models} cls="models-grid" onOpen={show} caption={t.modelCaption} />}
        </section>
      )}

      {t.final && (
        <section className="section band" data-edit="final finalLabel">
          <div className="wrap">
            <SectionHead no={no()} kicker={`Thesis ${t.year}`} title={t.finalLabel || 'Final presentation'} />
            <Grid items={t.final} cls="final-grid" onOpen={show} />
          </div>
        </section>
      )}

      {t.video && (
        <section className="section wrap" data-edit="video">
          <SectionHead no={no()} kicker="Video" title={t.video.title} />
          <div className="single-video" data-reveal><Video id={t.video.id} title={t.video.title} /></div>
        </section>
      )}

      <nav className="pager wrap" aria-label="Thesis อื่นในปีเดียวกัน">
        {prev ? <a href={`/thesis/${prev}`} className="pager-prev"><span className="mono">← ก่อนหน้า</span><strong>{THESIS[prev].title}</strong></a> : <a href={`/projects/${t.year}`} className="pager-prev"><span className="mono">← กลับ</span><strong>Projects {t.year}</strong></a>}
        {next && <a href={`/thesis/${next}`} className="pager-next"><span className="mono">ถัดไป →</span><strong>{THESIS[next].title}</strong></a>}
      </nav>
      {lightbox}
    </div>
  )
}
