import PageHero from '../components/PageHero.jsx'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

export default function About() {
  const { ABOUT } = useContent()
  return (
    <>
      <PageHero kicker="About us" title="Resilient architecture" subtitle="Faculty of Architecture, RMUTT · Water Adaptation Innovation Center" accent="yellow" />

      <section className="section wrap">
        <div className="split">
          <header className="section-head">
            <span className="kicker">Philosophy</span>
            <h2>Philosophy</h2>
          </header>
          <div className="prose">
            {ABOUT.philosophy.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <header className="section-head">
            <span className="kicker">Approach</span>
            <h2>{ABOUT.principlesTitle}</h2>
          </header>
          <ol className="principles">
            {ABOUT.principles.map((p, i) => (
              <li key={p.title}>
                <span className="principle-no">{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section wrap">
        <blockquote className="statement">
          <span className="tag tag-yellow">Resilient architecture</span>
          <p>{ABOUT.statement}</p>
        </blockquote>
        <div className="pillars">
          {ABOUT.pillars.map((p) => (
            <figure key={p.title}>
              <img src={thumb(p.img)} alt="" loading="lazy" />
              <figcaption>{p.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section chrome-band">
        <div className="wrap">
          <header className="section-head">
            <span className="kicker">Mission</span>
            <h2>We Aim To...</h2>
          </header>
          <ul className="aims">
            {ABOUT.aims.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      </section>
    </>
  )
}
