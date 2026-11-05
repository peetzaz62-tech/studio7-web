import PageHero from '../components/PageHero.jsx'
import { SUBMISSION } from '../data/pages.js'

export default function Submission() {
  return (
    <>
      <PageHero kicker="Submission" title="Project submission" accent="red" />
      <section className="section wrap">
        <p className="lead-text">{SUBMISSION.intro}</p>
        <div className="submit-list">
          {SUBMISSION.items.map((s) => (
            <article key={s.no} className="submit-card">
              <span className="submit-no">{s.no}</span>
              <div className="submit-body">
                <h2>{s.title}</h2>
                <p><strong>{s.label}</strong> · {s.note}</p>
              </div>
              <a className="btn btn-solid" href={s.href} target="_blank" rel="noreferrer">Upload Now! ↗</a>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
