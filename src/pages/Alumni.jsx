import PageHero from '../components/PageHero.jsx'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'
import { useContent } from '../content.jsx'

export default function Alumni() {
  const { ALUMNI } = useContent()
  return (
    <>
      <PageHero kicker="Alumni" title="Alumni" accent="pink" />
      <section className="section wrap">
        <p className="lead-text">{ALUMNI.intro}</p>
        <div className="generations">
          {ALUMNI.generations.map((g) => (
            <section key={g.title} className="generation">
              <h2>{g.title}</h2>
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
          <header className="section-head">
            <span className="kicker">Team</span>
            <h2>Tutors, Experts, and Public lecturers</h2>
          </header>
          <div className="people">
            {ALUMNI.tutors.map((t) => (
              <div key={t.name} className="person">
                <span className="person-photo"><img src={thumb(t.photo)} alt="" loading="lazy" /></span>
                <span className="person-name">{t.name}</span>
              </div>
            ))}
          </div>

          <header className="section-head small">
            <h2>Special guest</h2>
          </header>
          <ul className="guests">
            {ALUMNI.guests.map((g) => (
              <li key={g.name}><strong>{g.name}</strong><span>{g.role}</span></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
