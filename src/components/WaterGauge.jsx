import { useEffect, useRef } from 'react'

// เสาวัดระดับน้ำด้านขวาของจอ — น้ำค่อย ๆ สูงขึ้นตามการเลื่อนหน้า (0.00 → 3.00 m)
const MAX_M = 3
export default function WaterGauge() {
  const fill = useRef(null)
  const label = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
      if (fill.current) fill.current.style.transform = `scaleY(${p})`
      if (label.current) label.current.textContent = `+${(p * MAX_M).toFixed(2)} m`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div className="gauge" aria-hidden="true">
      <div className="gauge-staff">
        {Array.from({ length: MAX_M * 2 + 1 }, (_, i) => (
          <span key={i} className={`gauge-tick ${i % 2 === 0 ? 'major' : ''}`} style={{ bottom: `${(i / (MAX_M * 2)) * 100}%` }}>
            {i % 2 === 0 ? `${i / 2}` : ''}
          </span>
        ))}
        <div className="gauge-water" ref={fill} />
      </div>
      <span className="gauge-label" ref={label}>+0.00 m</span>
    </div>
  )
}
