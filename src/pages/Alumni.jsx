import PageHero from '../components/PageHero.jsx'
import SectionHead from '../components/SectionHead.jsx'
import { thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

export default function Alumni() {
  const { ALUMNI } = useContent()
  return (
    <div className="accent-pink">
      <PageHero kicker="Alumni" title="Alumni" accent="pink" />
      <section className="section wrap">
        <p className="lead-text" data-reveal>{ALUMNI.intro}</p>
        <div className="generations">
          {ALUMNI.generations.map((g, gi) => (
            <section key={g.title} className="generation" data-reveal style={{ '--d': gi % 2 }}>
              <h2>{g.title}<span className="mono">{g.people.length}</span></h2>
              <ol>
                {g.people.map((p) => (
                  <li key={p.name}>
                    <span className="gen-name">{p.name}</span>
                    {p.work && <span className="gen-work">{p.work}</span>}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <SectionHead no="01" kicker="Team" title="Tutors, Experts, and Public lecturers" />
          <div className="people">
            {ALUMNI.tutors.map((t, i) => (
              <div key={t.name} className="person" data-reveal style={{ '--d': i % 4 }}>
                <span className="person-photo"><img src={thumb(t.photo)} alt="" loading="lazy" /></span>
                <span className="person-name">{t.name}</span>
              </div>
            ))}
          </div>
          <SectionHead no="02" kicker="Guests" title="Special guest" />
          <ul className="guests">
            {ALUMNI.guests.map((g, i) => (
              <li key={g.name} data-reveal style={{ '--d': i }}><strong>{g.name}</strong><span>{g.role}</span></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
