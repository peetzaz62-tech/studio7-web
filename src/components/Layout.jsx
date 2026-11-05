import { useEffect, useState } from 'react'
import { useContent, useContentState, isAdminHint } from '../content.jsx'
import { imgUrl as img } from '../media.js'
import WaterGauge from './WaterGauge.jsx'

const isActive = (path, current) => (path === '/' ? current === '/' || current === '/events' : current === path || current.startsWith(path + '/'))

function NavItem({ item, path }) {
  const active = isActive(item.path, path)
  return (
    <a href={item.path} className={`nav-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
      {item.label}
    </a>
  )
}

function Header({ path, overHero }) {
  const { NAV } = useContent()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [admin, setAdmin] = useState(false)
  useEffect(() => { setAdmin(isAdminHint()) }, [path])

  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = overHero && !solid && !open
  const groupActive = (item) => item.children.some((c) => isActive(c.path, path)) || (item.label === 'Projects' && path.startsWith('/thesis/'))
  return (
    <header className={`site-header ${transparent ? '' : 'is-solid'}`}>
      <div className="wrap header-row">
        <a href="/" className="brand" aria-label="Resilient Architecture by Studio 7">
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
                <span className={`nav-link ${groupActive(item) ? 'active' : ''}`} tabIndex={0}>
                  {item.label} <i aria-hidden="true">▾</i>
                </span>
                <div className="dropdown">
                  {item.children.map((c) => <NavItem key={c.path} item={c} path={path} />)}
                </div>
              </div>
            ) : (
              <NavItem key={item.path} item={item} path={path} />
            )
          )}
          <a href="/admin" className={`nav-link nav-login ${admin ? 'is-admin' : ''}`}>
            {admin ? '✎ Dashboard' : 'เข้าสู่ระบบ'}
          </a>
        </nav>
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
      email: <a className="email-addr" href={`mailto:${email}`}>{email}</a>
      <button type="button" className="copy-btn" onClick={copy}>{done ? 'คัดลอกแล้ว' : 'คัดลอก'}</button>
    </p>
  )
}

function Footer() {
  const { FOOTER } = useContent()
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
  return (
    <>
      <WaterGauge />
      <Header path={path} overHero={overHero} />
      <main id="main">{children}</main>
      <Footer />
      <EditButton editLink={editLink} />
    </>
  )
}
