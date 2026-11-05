import { useEffect, useState } from 'react'
import { NAV, FOOTER } from '../data/site.js'

const img = (f) => `./img/${f}`

function NavItem({ item, route }) {
  return (
    <a href={`#${item.id}`} className={`nav-link ${route === item.id ? 'active' : ''}`} aria-current={route === item.id ? 'page' : undefined}>
      {item.label}
    </a>
  )
}

function Header({ route }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => { setOpen(false) }, [route])
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const overHero = route === 'events' && !solid && !open
  return (
    <header className={`site-header ${overHero ? '' : 'is-solid'}`}>
      <div className="wrap header-row">
        <a href="#events" className="brand" aria-label="Resilient Architecture by Studio 7">
          <img src={img('logo-7.png')} alt="" />
          <span>Resilient<br />Architecture</span>
        </a>

        <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" aria-label="เมนู" onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>

        <nav id="site-nav" className={`nav ${open ? 'is-open' : ''}`}>
          {NAV.map((item) =>
            item.children ? (
              <div className="nav-group" key={item.label}>
                <span className={`nav-link ${(route.startsWith('projects') || route.startsWith('thesis')) ? 'active' : ''}`} tabIndex={0}>
                  {item.label} <i aria-hidden="true">▾</i>
                </span>
                <div className="dropdown">
                  {item.children.map((c) => <NavItem key={c.id} item={c} route={route} />)}
                </div>
              </div>
            ) : (
              <NavItem key={item.id} item={item} route={route} />
            )
          )}
        </nav>
      </div>
    </header>
  )
}

function CopyEmail({ email }) {
  const [done, setDone] = useState(false)
  const copy = async (e) => {
    try {
      await navigator.clipboard.writeText(email)
      setDone(true); setTimeout(() => setDone(false), 1800)
    } catch {
      const r = document.createRange(); r.selectNodeContents(e.currentTarget.parentNode.querySelector('.email-addr'))
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r)
    }
  }
  return (
    <p className="email">
      email: {import.meta.env.VITE_ARTIFACT
        ? <span className="email-addr">{email}</span>
        : <a className="email-addr" href={`mailto:${email}`}>{email}</a>}
      <button type="button" className="copy-btn" onClick={copy}>{done ? 'คัดลอกแล้ว' : 'คัดลอก'}</button>
    </p>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <img className="footer-mark" src={img('logo-7.png')} alt="Studio 7" />
          <p className="footer-copy">{FOOTER.copyright}</p>
        </div>
        <div className="footer-info">
          <strong>{FOOTER.org}</strong>
          <p>{FOOTER.faculty}</p>
          <p>{FOOTER.address}</p>
          <CopyEmail email={FOOTER.email} />
        </div>
        <div className="footer-logos">
          {FOOTER.logos.map((l) => <img key={l.img} src={img(l.img)} alt={l.alt} title={l.alt} />)}
        </div>
      </div>
    </footer>
  )
}

export default function Layout({ route, children }) {
  return (
    <>
      <Header route={route} />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
