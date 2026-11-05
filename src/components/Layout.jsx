import { useEffect, useState } from 'react'
import { useContent, useContentState, isAdminHint } from '../content.jsx'
import { imgUrl as img } from '../media.js'
import { useReveal } from '../hooks/useReveal.js'
import WaterGauge from './WaterGauge.jsx'
import RouteLoader from './RouteLoader.jsx'
import Logo from './Logo.jsx'

const isActive = (path, current) => (path === '/' ? current === '/' || current === '/events' : current === path || current.startsWith(path + '/'))

function NavItem({ item, path, i }) {
  const active = isActive(item.path, path)
  return (
    <a href={item.path} className={`nav-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined} style={{ '--i': i }}>
      <span>{item.label}</span>
    </a>
  )
}

function Header({ path, overHero }) {
  const { NAV } = useContent()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => { setOpen(false); setAdmin(isAdminHint()); setHidden(false) }, [path])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [open])
  // ซ่อนแถบเมนูเมื่อเลื่อนลง แสดงเมื่อเลื่อนขึ้น
  useEffect(() => {
    let last = scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = scrollY
      setSolid(y > 40)
      if (Math.abs(y - last) > 6) { setHidden(y > last && y > 160); last = y }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    addEventListener('scroll', on, { passive: true })
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])

  const transparent = overHero && !solid && !open
  const groupActive = (item) => item.children.some((c) => isActive(c.path, path)) || (item.label === 'Projects' && path.startsWith('/thesis/'))
  let i = 0
  return (
    <header data-edit="NAV" className={`site-header ${transparent ? 'is-clear' : 'is-solid'} ${hidden && !open ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
      <div className="wrap header-row">
        <a href="/" className="brand" aria-label="Resilient Architecture by Studio 7 — หน้าแรก">
          <span className="brand-mark"><Logo /></span>
          <span className="brand-name">Resilient<br />Architecture</span>
        </a>

        <nav id="site-nav" className="nav" aria-label="เมนูหลัก">
          {NAV.map((item) =>
            item.children ? (
              <div className="nav-group" key={item.label} style={{ '--i': i++ }}>
                <button type="button" className={`nav-link ${groupActive(item) ? 'active' : ''}`} aria-haspopup="true">
                  <span>{item.label}</span> <i aria-hidden="true">▾</i>
                </button>
                <div className="dropdown">
                  {item.children.map((c) => <NavItem key={c.path} item={c} path={path} i={0} />)}
                </div>
              </div>
            ) : (
              <NavItem key={item.path} item={item} path={path} i={i++} />
            )
          )}
          <a href="/admin" className={`nav-login ${admin ? 'is-admin' : ''}`} style={{ '--i': i++ }}>
            {admin ? '✎ Dashboard' : 'เข้าสู่ระบบ'}
          </a>
        </nav>

        <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'} onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </div>
    </header>
  )
}

function CopyEmail({ email }) {
  const [done, setDone] = useState(false)
  const copy = async (e) => {
    const holder = e.currentTarget.parentNode.querySelector('.email-addr')
    try {
      await navigator.clipboard.writeText(email)
      setDone(true); setTimeout(() => setDone(false), 1800)
    } catch {
      const r = document.createRange(); r.selectNodeContents(holder)
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r)
    }
  }
  return (
    <p className="email">
      <a className="email-addr" href={`mailto:${email}`}>{email}</a>
      <button type="button" className="copy-btn" onClick={copy}>{done ? 'คัดลอกแล้ว ✓' : 'คัดลอก'}</button>
    </p>
  )
}

function Footer() {
  const { FOOTER, NAV } = useContent()
  const links = NAV.flatMap((n) => (n.children ? n.children : [n]))
  return (
    <footer className="site-footer" data-edit="FOOTER">
      <svg className="footer-wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30 C 180 0 360 0 540 30 S 900 60 1080 30 S 1260 0 1440 30 V60 H0 Z" />
      </svg>
      <div className="wrap footer-top">
        <div className="footer-brand" data-reveal>
          <Logo variant="outline" className="footer-mark" />
          <p className="footer-slogan">Designing with water,<br />not against it.</p>
        </div>
        <nav className="footer-links" aria-label="ลิงก์ท้ายเว็บ" data-reveal style={{ '--d': 1 }}>
          {links.map((l) => <a key={l.path} href={l.path}>{l.label}</a>)}
        </nav>
        <div className="footer-info" data-reveal style={{ '--d': 2 }}>
          <strong>{FOOTER.org}</strong>
          <p>{FOOTER.faculty}</p>
          <p>{FOOTER.address}</p>
          <CopyEmail email={FOOTER.email} />
        </div>
      </div>
      <div className="wrap footer-bottom">
        <div className="footer-logos">
          {FOOTER.logos.map((l) => <img key={l.img} src={img(l.img)} alt={l.alt} title={l.alt} loading="lazy" />)}
        </div>
        <p className="footer-copy">{FOOTER.copyright}</p>
        <button type="button" className="to-top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>ขึ้นด้านบน ↑</button>
      </div>
    </footer>
  )
}

// ปุ่มลอย "แก้ไขหน้านี้" — แสดงเฉพาะเครื่องที่ล็อกอิน admin ไว้
function EditButton({ editLink }) {
  const { dirty } = useContentState()
  const [show, setShow] = useState(false)
  useEffect(() => { setShow(isAdminHint()) }, [editLink])
  if (!show || !editLink) return null
  return (
    <a className={`edit-fab ${dirty ? 'is-dirty' : ''}`} href={editLink}>
      ✎ แก้ไขหน้านี้{dirty && <small>มีการแก้ไขที่ยังไม่บันทึก (กำลังแสดงตัวอย่าง)</small>}
    </a>
  )
}

export default function Layout({ path, overHero, editLink, children }) {
  useReveal(path)
  return (
    <>
      <a className="skip" href="#main">ข้ามไปเนื้อหา</a>
      <WaterGauge />
      <Header path={path} overHero={overHero} />
      <main id="main" className="page" key={path}>{children}</main>
      <Footer />
      <EditButton editLink={editLink} />
      <RouteLoader path={path} />
    </>
  )
}
