export default function PageHero({ kicker, title, subtitle, accent = 'cyan', big }) {
  return (
    <section className={`page-hero accent-${accent}`}>
      <div className="wrap page-hero-inner">
        <span className={`tag tag-${accent}`}>{kicker}</span>
        <h1>{big && <span className="page-hero-big">{big}</span>}{title}</h1>
        {subtitle && <p className="page-hero-sub">{subtitle}</p>}
      </div>
    </section>
  )
}
