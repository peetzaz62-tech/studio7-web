import SplitTitle from './SplitTitle.jsx'
import Logo from './Logo.jsx'

// ส่วนหัวของหน้าใน: พื้นดำ + เส้นระดับน้ำสีประจำหน้า + โลโก้เส้นจาง ๆ ด้านหลัง
export default function PageHero({ kicker, title, subtitle, accent = 'cyan', big, children, edit }) {
  return (
    <section className={`page-hero accent-${accent}`} data-edit={edit}>
      <Logo variant="outline" className="page-hero-mark" />
      <div className="wrap page-hero-inner">
        <p className="hero-in" style={{ '--d': 0 }}><span className={`tag tag-${accent}`}>{kicker}</span></p>
        {big && <p className="page-hero-big" aria-hidden="true"><span>{big}</span></p>}
        {title && <SplitTitle text={title} />}
        {subtitle && <p className="page-hero-sub hero-in" style={{ '--d': 3 }}>{subtitle}</p>}
        {children}
      </div>
      <div className="page-hero-water" aria-hidden="true" />
    </section>
  )
}
