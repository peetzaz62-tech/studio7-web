import { useEffect, useMemo, useRef, useState } from 'react'
import { useContent } from '../content.jsx'
import SectionHead from './SectionHead.jsx'

// ลูกโลก: ปักหมุดที่ตั้ง Thesis — หมุนเองช้า ๆ, ลากเพื่อหมุน, กดชื่อโครงการด้านล่างเพื่อหมุนไปหาตำแหน่งนั้น
// วาดแบบโมเดลกระดาษ/แบบร่าง: ทะเลสีกระดาษ, แผ่นดินลายเส้น hatch, เส้นหมึกบาง
const SIZE = 560
const ACCENT = { green: '#16a34a', cyan: '#0891b2', yellow: '#ca8a04', blue: '#2b5bff', orange: '#ea7a00', red: '#dc2626', pink: '#db2777' }
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function useGeo() {
  const [geo, setGeo] = useState(null)
  useEffect(() => {
    let alive = true
    Promise.all([import('d3-geo'), import('topojson-client'), import('world-atlas/land-110m.json')]).then(([d3, topo, landMod]) => {
      if (!alive) return
      const land = landMod.default || landMod
      setGeo({ d3, land: topo.feature(land, land.objects.land) })
    })
    return () => { alive = false }
  }, [])
  return geo
}

export default function ThesisMap({ year, title = 'Thesis around the world', no }) {
  const { THESIS, PROJECTS } = useContent()
  const geo = useGeo()
  const wrap = useRef(null)
  const rot = useRef([-100, -10])
  const target = useRef(null)
  const drag = useRef(null)
  const visible = useRef(false)
  const [, setFrame] = useState(0)
  const [hover, setHover] = useState(null)

  const items = useMemo(() => Object.entries(THESIS)
    .filter(([, t]) => t.location && Number.isFinite(+t.location.lat) && (!year || t.year === year))
    .map(([slug, t]) => ({ slug, ...t, color: ACCENT[PROJECTS[t.year]?.accent] || ACCENT.cyan })), [THESIS, PROJECTS, year])

  // เริ่มหันไปทางกลุ่มโครงการ (ค่าเฉลี่ยลองจิจูด)
  useEffect(() => {
    if (!items.length) return
    const lng = items.reduce((s, i) => s + +i.location.lng, 0) / items.length
    rot.current = [-lng, -12]
  }, [items.length])

  // หมุนเอง (หยุดเมื่ออยู่นอกจอ / กำลังลาก / ชี้หมุด / ผู้ใช้ตั้งลดการเคลื่อนไหว)
  useEffect(() => {
    if (!geo) return
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting })
    io.observe(wrap.current)
    let raf = 0
    let last = performance.now()
    const tick = (t) => {
      const dt = Math.min(64, t - last)
      last = t
      if (visible.current && !drag.current) {
        if (target.current) {
          const [tl, tp] = target.current
          const [l, p] = rot.current
          let dl = ((tl - l + 540) % 360) - 180
          const k = Math.min(1, dt / 220)
          rot.current = [l + dl * k, p + (tp - p) * k]
          if (Math.abs(dl) < 0.3 && Math.abs(tp - p) < 0.3) target.current = null
          setFrame((f) => f + 1)
        } else if (!hover && !reduced()) {
          rot.current = [rot.current[0] + dt * 0.006, rot.current[1]]
          setFrame((f) => f + 1)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [geo, hover])

  const view = useMemo(() => {
    if (!geo) return null
    const { d3, land } = geo
    const proj = d3.geoOrthographic().scale(SIZE / 2 - 8).translate([SIZE / 2, SIZE / 2]).rotate(rot.current).clipAngle(90)
    const path = d3.geoPath(proj)
    const center = [-rot.current[0], -rot.current[1]]
    const pins = items.map((it) => {
      const ll = [+it.location.lng, +it.location.lat]
      const front = d3.geoDistance(ll, center) < Math.PI / 2 - 0.05
      const [x, y] = proj(ll) || [0, 0]
      return { ...it, x, y, front }
    })
    return { sphere: path({ type: 'Sphere' }), grat: path(d3.geoGraticule().step([15, 15])()), land: path(land), pins }
  })

  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, r: [...rot.current], moved: false }
    target.current = null
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    const scale = 180 / (wrap.current.clientWidth || SIZE)
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
    rot.current = [d.r[0] + dx * scale, Math.max(-60, Math.min(60, d.r[1] - dy * scale))]
    setFrame((f) => f + 1)
  }
  const onUp = () => { setTimeout(() => { drag.current = null }, 0) }
  const focus = (it) => { target.current = [-it.location.lng, Math.max(-50, Math.min(50, -it.location.lat))]; setHover(it.slug) }

  const years = [...new Set(items.map((i) => i.year))].sort()
  const active = view?.pins.find((p) => p.slug === hover && p.front)

  return (
    <section className="section globe-band" aria-labelledby="map-title">
      <div className="wrap globe-layout">
        <div className="globe-head">
          <SectionHead no={no} kicker="Locations" title={<span id="map-title">{title}</span>}
            lead={`${items.length} โครงการ · ${new Set(items.map((i) => i.location.place.split(',').pop().trim())).size} ประเทศ — ลากเพื่อหมุนลูกโลก หรือกดชื่อโครงการเพื่อหมุนไปหา`} />
        </div>
          <ul className="globe-list" data-reveal>
            {years.map((y) => (
              <li key={y}>
                <span className="globe-year mono"><i style={{ background: ACCENT[PROJECTS[y]?.accent] || ACCENT.cyan }} />Thesis {y}</span>
                <span className="globe-links">
                  {items.filter((i) => i.year === y).map((i) => (
                    <span key={i.slug} className={`globe-item ${hover === i.slug ? 'on' : ''}`}>
                      <button type="button" onClick={() => focus(i)} onMouseEnter={() => setHover(i.slug)} onMouseLeave={() => setHover(null)}>
                        {i.title || i.by}
                      </button>
                      <small>{i.location.place}{i.location.approx ? ' (โดยประมาณ)' : ''}</small>
                      <a href={`/thesis/${i.slug}`} aria-label={`เปิด ${i.title}`}>→</a>
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>

        <div className="globe-frame" ref={wrap} data-reveal style={{ '--d': 1 }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`ลูกโลกแสดงที่ตั้งโครงการ ${items.length} แห่ง`}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}>
            <defs>
              <pattern id="globe-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" className="hatch-line" />
              </pattern>
              <radialGradient id="globe-shade" cx="38%" cy="32%" r="75%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity=".1" />
              </radialGradient>
            </defs>
            {view ? (
              <>
                <path d={view.sphere} className="globe-sea" />
                <path d={view.grat} className="globe-grat" />
                <path d={view.land} className="globe-land" />
                <path d={view.land} className="globe-coast" />
                <path d={view.sphere} fill="url(#globe-shade)" className="globe-shade" />
                <path d={view.sphere} className="globe-rim" />
                {view.pins.filter((p) => p.front).map((p) => (
                  <a key={p.slug} href={`/thesis/${p.slug}`} className={`globe-pin ${hover === p.slug ? 'on' : ''}`} aria-label={`${p.title} — ${p.location.place}`}
                    onClick={(e) => { if (drag.current?.moved) e.preventDefault() }}
                    onMouseEnter={() => setHover(p.slug)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.slug)} onBlur={() => setHover(null)}>
                    <line x1={p.x} y1={p.y} x2={p.x} y2={p.y - 22} className="pin-stem" />
                    <circle cx={p.x} cy={p.y - 22} r="6.5" style={{ fill: p.color }} className="pin-head" />
                    <circle cx={p.x} cy={p.y} r="2" className="pin-foot" />
                  </a>
                ))}
              </>
            ) : <text x={SIZE / 2} y={SIZE / 2} textAnchor="middle" className="globe-loading">กำลังโหลดลูกโลก…</text>}
          </svg>
          {active && (
            <div className="globe-tip" style={{ left: `${(active.x / SIZE) * 100}%`, top: `${((active.y - 30) / SIZE) * 100}%` }}>
              <strong>{active.title}</strong>
              <span>{active.by} · {active.year}</span>
              <span className="mono">{active.location.place}</span>
            </div>
          )}
          <p className="globe-hint mono" aria-hidden="true">⟲ drag to rotate</p>
        </div>
      </div>
    </section>
  )
}
