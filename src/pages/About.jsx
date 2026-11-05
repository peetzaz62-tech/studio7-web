import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Marquee from '../components/Marquee.jsx'
import { thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

export default function About() {
  const { ABOUT } = useContent()
  return (
    <div className="accent-yellow" data-edit="ABOUT">
      <PageHero kicker="About us" title="Resilient architecture" subtitle="Faculty of Architecture, RMUTT · Water Adaptation Innovation Center" accent="yellow" />

      <section className="section wrap">
        <div className="split">
          <SectionHead no="01" kicker="Philosophy" title="Philosophy" />
          <div className="prose" data-reveal style={{ '--d': 2 }}>
            {ABOUT.philosophy.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <SectionHead no="02" kicker="Approach" title={ABOUT.principlesTitle} />
          <ol className="principles">
            {ABOUT.principles.map((p, i) => (
              <li key={p.title} data-reveal style={{ '--d': i }}>
                <span className="principle-no mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Marquee tone="light" items={ABOUT.pillars.map((p) => p.title)} />

      <section className="section wrap">
        <blockquote className="statement" data-reveal>
          <p>{ABOUT.statement}</p>
        </blockquote>
        <div className="pillars">
          {ABOUT.pillars.map((p, i) => (
            <figure key={p.title} data-reveal style={{ '--d': i }}>
              <span className="zoom"><img src={thumb(p.img)} alt="" loading="lazy" /></span>
              <figcaption><span className="mono">{String(i + 1).padStart(2, '0')}</span>{p.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section chrome-band">
        <div className="wrap">
          <SectionHead no="03" kicker="Mission" title="We Aim To..." />
          <ol className="aims">
            {ABOUT.aims.map((a, i) => <li key={a} data-reveal style={{ '--d': i }}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{a}</li>)}
          </ol>
        </div>
      </section>
    </div>
  )
}
