import { useEffect, useRef, useState } from 'react'
import Logo from './Logo.jsx'

// โหลดเปลี่ยนหน้า: แสดงเฉพาะเมื่อรูปบนจอแรกของหน้าใหม่โหลดช้ากว่า 600ms (เน็ตช้า) — ปกติจะไม่เห็นเลย
export default function RouteLoader({ path }) {
  const [show, setShow] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    let alive = true
    let shownAt = 0
    const timer = setTimeout(() => { if (alive) { shownAt = performance.now(); setShow(true) } }, 600)
    const imgs = [...document.querySelectorAll('main img')].filter((i) => i.getBoundingClientRect().top < innerHeight * 1.1 && !(i.complete && i.naturalWidth))
    const waits = imgs.map((i) => new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }) }))
    Promise.race([Promise.all(waits), new Promise((r) => setTimeout(r, 3000))]).then(() => {
      clearTimeout(timer)
      const left = shownAt ? Math.max(0, 550 - (performance.now() - shownAt)) : 0
      setTimeout(() => { if (alive) setShow(false) }, left)
    })
    return () => { alive = false; clearTimeout(timer) }
  }, [path])

  return (
    <div className={`route-loader ${show ? 'on' : ''}`} aria-hidden={!show} role="status" aria-label={show ? 'กำลังโหลด' : undefined}>
      <div className="rl-mark">
        <Logo variant="outline" className="rl-outline" />
        <div className="rl-fill"><Logo /></div>
      </div>
    </div>
  )
}
