import PageHero from '../components/PageHero.jsx'
import { useContent } from '../content.jsx'

export default function Submission() {
  const { SUBMISSION } = useContent()
  return (
    <div className="accent-red" data-edit="SUBMISSION">
      <PageHero kicker="Submission" title="Project submission" accent="red" />
      <section className="section wrap">
        <p className="lead-text" data-reveal>{SUBMISSION.intro}</p>
        <div className="submit-list">
          {SUBMISSION.items.map((s, i) => (
            <a key={s.no + s.title} className="submit-card" href={s.href} target="_blank" rel="noreferrer" data-reveal style={{ '--d': i }}>
              <span className="submit-no">{s.no}</span>
              <span className="submit-body">
                <strong>{s.title}</strong>
                <span><b>{s.label}</b> · {s.note}</span>
              </span>
              <span className="btn btn-dark">Upload Now <i>↗</i></span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
