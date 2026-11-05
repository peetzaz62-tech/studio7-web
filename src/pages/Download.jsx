import PageHero from '../components/PageHero.jsx'
import { DOWNLOADS } from '../data/pages.js'

const img = (f) => `./img/${f}`

export default function Download() {
  return (
    <>
      <PageHero kicker="Download" title="Download" subtitle="หนังสือและคู่มือจาก Resilient Architecture by Studio 7" accent="blue" />
      <section className="section wrap books">
        {DOWNLOADS.map((b) => (
          <article key={b.year} className="book">
            <a className="book-cover" href={b.href} target="_blank" rel="noreferrer">
              <img src={img(b.cover)} alt={b.title} loading="lazy" />
            </a>
            <div className="book-body">
              <span className="tag tag-blue">Book {b.year}</span>
              <h2>{b.title}</h2>
              {b.text.map((t, i) => <p key={i}>{t}</p>)}
              <a className="btn btn-solid" href={b.href} target="_blank" rel="noreferrer">{b.cta} ↗</a>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
