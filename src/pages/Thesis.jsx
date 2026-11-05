import { useGallery } from '../components/Lightbox.jsx'
import Video from '../components/Video.jsx'
import { THESIS } from '../data/thesis.js'
import { PROJECTS } from '../data/projects.js'

const img = (f) => `./img/${f}`

function Grid({ items, cls, onOpen, caption }) {
  return (
    <div className={cls}>
      {items.map((f, i) => (
        <figure key={f}>
          <button type="button" onClick={() => onOpen(items, i)} aria-label="ดูรูปขนาดใหญ่">
            <img src={img(f)} alt="" loading="lazy" />
          </button>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

export default function Thesis({ slug }) {
  const t = THESIS[slug]
  const [show, lightbox] = useGallery()
  const accent = PROJECTS[t.year]?.accent || 'cyan'
  const cover = t.hero?.[0] || t.pages?.[0]

  return (
    <>
      <section className={`thesis-hero accent-${accent}`}>
        {t.hero && <img className="thesis-hero-bg" src={img(cover)} alt="" />}
        <div className="wrap thesis-hero-inner">
          <a className="back-link" href={`#projects-${t.year}`}>← Back to Projects {t.year}</a>
          <span className={`tag tag-${accent}`}>Thesis {t.year}</span>
          <h1>{t.title}</h1>
          {t.titleTh && <p className="thesis-th">{t.titleTh}</p>}
          <p className="thesis-author">{t.by}</p>
        </div>
      </section>

      <section className="section wrap">
        <div className="split">
          <div>
            {t.hero && t.hero.length > 1 && <Grid items={t.hero} cls="hero-strip" onOpen={show} />}
            {!t.hero && t.pages && (
              <button type="button" className="cover-btn" onClick={() => show(t.pages, 0)} aria-label="เปิดพอร์ตโฟลิโอ">
                <img src={img(t.pages[0])} alt="" />
              </button>
            )}
          </div>
          <div className="prose">
            {t.text.length ? t.text.map((p, i) => <p key={i}>{p}</p>) : <p className="muted">{t.note}</p>}
            {t.facts && (
              <dl className="facts">
                {t.facts.map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            )}
            {t.social && (
              <p className="social">
                {t.social.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer">{name} ↗</a>)}
              </p>
            )}
          </div>
        </div>
      </section>

      {t.pages && t.pages.length > 1 && (
        <section className="section band">
          <div className="wrap">
            <header className="section-head">
              <span className="kicker">Portfolio</span>
              <h2>Portfolio ({t.pages.length} หน้า)</h2>
            </header>
            <Grid items={t.pages} cls="pages-grid" onOpen={show} />
          </div>
        </section>
      )}

      <section className="section wrap">
        <header className="section-head">
          <span className="kicker">Presentation</span>
          <h2>{t.chartLabel}</h2>
        </header>
        <button type="button" className="chart-board" onClick={() => show([t.chart, ...t.models], 0)} aria-label="ดูบอร์ดขนาดใหญ่">
          <img src={img(t.chart)} alt="Presentation board" loading="lazy" />
        </button>
        {t.models.length > 0 && (
          <Grid items={t.models} cls="models-grid" onOpen={show} caption={t.modelCaption} />
        )}
      </section>

      {t.final && (
        <section className="section band">
          <div className="wrap">
            <header className="section-head">
              <span className="kicker">Thesis {t.year}</span>
              <h2>{t.finalLabel || 'Final presentation'}</h2>
            </header>
            <Grid items={t.final} cls="final-grid" onOpen={show} />
          </div>
        </section>
      )}

      {t.video && (
        <section className="section wrap">
          <header className="section-head">
            <span className="kicker">Video</span>
            <h2>{t.video.title}</h2>
          </header>
          <div className="single-video"><Video id={t.video.id} title={t.video.title} /></div>
        </section>
      )}

      <section className="wrap thesis-foot">
        <a className="btn btn-ghost-dark" href={`#projects-${t.year}`}>← Back to Projects {t.year}</a>
      </section>
      {lightbox}
    </>
  )
}
