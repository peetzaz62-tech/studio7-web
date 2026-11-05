import { useEffect, useMemo, useState } from 'react'
import { useContent } from '../content.jsx'
import SectionHead from './SectionHead.jsx'

// แผนที่โลก: ปักหมุดที่ตั้งโครงการ Thesis ทุกชิ้น (โหลดข้อมูลแผนที่แยกไฟล์เมื่อเลื่อนมาถึง)
const W = 960
const H = 470
const ACCENT = { green: '#00ff00', cyan: '#00ffff', yellow: '#ffff00', blue: '#6f8cff', orange: '#ff9a00', red: '#ff4d4d', pink: '#ff4da6' }

function useWorld() {
  const [geo, setGeo] = useState(null)
  useEffect(() => {
    let alive = true
    Promise.all([import('d3-geo'), import('topojson-client'), import('world-atlas/land-110m.json')]).then(([d3, topo, landMod]) => {
      if (!alive) return
      const land = landMod.default || landMod
      const proj = d3.geoEqualEarth().fitExtent([[6, 6], [W - 6, H - 6]], { type: 'Sphere' })
      const path = d3.geoPath(proj)
      setGeo({ proj, sphere: path({ type: 'Sphere' }), grat: path(d3.geoGraticule10()), land: path(topo.feature(land, land.objects.land)) })
    })
    return () => { alive = false }
  }, [])
  return geo
}

export default function ThesisMap({ year, title = 'Thesis around the world', no }) {
  const { THESIS, PROJECTS } = useContent()
  const geo = useWorld()
  const [hover, setHover] = useState(null)

  const items = Object.entries(THESIS)
    .filter(([, t]) => t.location && Number.isFinite(+t.location.lat) && (!year || t.year === year))
    .map(([slug, t]) => ({ slug, ...t, color: ACCENT[PROJECTS[t.year]?.accent] || ACCENT.cyan }))

  // หมุดที่ตำแหน่งเดียวกัน (เช่น กรุงเทพฯ หลายชิ้น) กระจายเป็นวงเล็ก ๆ
  const pins = useMemo(() => {
    if (!geo) return []
    const groups = {}
    for (const it of items) {
      const [x, y] = geo.proj([+it.location.lng, +it.location.lat]) || [0, 0]
      const key = `${Math.round(x / 6)}:${Math.round(y / 6)}`
      ;(groups[key] ||= []).push({ ...it, x, y })
    }
    return Object.values(groups).flatMap((g) => g.map((p, i) => {
      if (g.length === 1) return p
      const a = (i / g.length) * Math.PI * 2 - Math.PI / 2
      return { ...p, x: p.x + Math.cos(a) * 11, y: p.y + Math.sin(a) * 11 }
    }))
  }, [geo, items.map((i) => i.slug + i.location.lat + i.location.lng).join()])

  const years = [...new Set(items.map((i) => i.year))].sort()
  const active = pins.find((p) => p.slug === hover)

  return (
    <section className="section map-band" aria-labelledby="map-title">
      <div className="wrap">
        <SectionHead no={no} kicker="Locations" title={<span id="map-title">{title}</span>}
          lead={`${items.length} โครงการ · ${new Set(items.map((i) => i.location.place.split(',').pop().trim())).size} ประเทศ — ชี้หรือแตะหมุดเพื่อดูชื่อโครงการ`} />
        <div className="map-frame" data-reveal>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`แผนที่ที่ตั้งโครงการ ${items.length} แห่ง`}>
            {geo ? (
              <>
                <path d={geo.sphere} className="map-sphere" />
                <path d={geo.grat} className="map-grat" />
                <path d={geo.land} className="map-land" />
                {pins.map((p) => (
                  <a key={p.slug} href={`/thesis/${p.slug}`} className="map-pin" aria-label={`${p.title} — ${p.location.place}`}
                    onMouseEnter={() => setHover(p.slug)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.slug)} onBlur={() => setHover(null)}>
                    <circle cx={p.x} cy={p.y} r="14" className="pin-ripple" style={{ stroke: p.color }} />
                    <circle cx={p.x} cy={p.y} r="5.5" style={{ fill: p.color }} className="pin-dot" />
                  </a>
                ))}
              </>
            ) : <text x={W / 2} y={H / 2} textAnchor="middle" className="map-loading">กำลังโหลดแผนที่…</text>}
          </svg>
          {active && (
            <div className="map-tip" style={{ left: `${(active.x / W) * 100}%`, top: `${(active.y / H) * 100}%` }}>
              <strong>{active.title}</strong>
              <span>{active.by} · {active.year}</span>
              <span>{active.location.place}{active.location.approx ? ' (โดยประมาณ)' : ''}</span>
            </div>
          )}
        </div>
        <ul className="map-list" data-reveal>
          {years.map((y) => (
            <li key={y}>
              <span className="map-year"><i style={{ background: ACCENT[PROJECTS[y]?.accent] || ACCENT.cyan }} />Thesis {y}</span>
              <span className="map-links">
                {items.filter((i) => i.year === y).map((i) => (
                  <a key={i.slug} href={`/thesis/${i.slug}`} onMouseEnter={() => setHover(i.slug)} onMouseLeave={() => setHover(null)}>
                    {i.title} <small>{i.location.place}</small>
                  </a>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
