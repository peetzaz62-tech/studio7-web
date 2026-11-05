import PageHero from '../components/PageHero.jsx'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

export default function Download() {
  const { DOWNLOADS } = useContent()
  return (
    <>
      <PageHero kicker="Download" title="Download" subtitle="หนังสือและคู่มือจาก Resilient Architecture by Studio 7" accent="blue" />
      <section className="section wrap books">
        {DOWNLOADS.map((b) => (
          <article key={b.year} className="book">
            <a className="book-cover" href={b.href} target="_blank" rel="noreferrer">
              <img src={thumb(b.cover)} alt={b.title} loading="lazy" />
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
