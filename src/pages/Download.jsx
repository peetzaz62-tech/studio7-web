import PageHero from '../components/PageHero.jsx'
import { thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

export default function Download() {
  const { DOWNLOADS } = useContent()
  return (
    <div className="accent-blue">
      <PageHero kicker="Download" title="Download" subtitle="หนังสือและคู่มือจาก Resilient Architecture by Studio 7" accent="blue" />
      <section className="section wrap books">
        {DOWNLOADS.map((b, i) => (
          <article key={b.year + b.title} className={`book ${i % 2 ? 'is-flip' : ''}`}>
            <a className="book-cover" href={b.href} target="_blank" rel="noreferrer" data-reveal aria-label={`ดาวน์โหลด ${b.title}`}>
              <img src={thumb(b.cover)} alt="" loading="lazy" />
            </a>
            <div className="book-body" data-reveal style={{ '--d': 1 }}>
              <span className="tag tag-blue">Book {b.year}</span>
              <h2>{b.title}</h2>
              {b.text.map((t, k) => <p key={k}>{t}</p>)}
              <a className="btn btn-dark" href={b.href} target="_blank" rel="noreferrer">{b.cta} <i>↓</i></a>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
