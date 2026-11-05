import { useEffect } from 'react'

// องค์ประกอบที่มี data-reveal จะค่อย ๆ ปรากฏเมื่อเลื่อนมาถึง (เพิ่ม class "in")
// ถ้าไม่มี JavaScript หรือผู้ใช้ตั้งลดการเคลื่อนไหว เนื้อหาแสดงตามปกติ (ดู styles.css)
export function useReveal(dep) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 })
    const scan = () => document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => io.observe(el))
    scan()
    const main = document.getElementById('main')
    const mo = main ? new MutationObserver(scan) : null
    mo?.observe(main, { childList: true, subtree: true })
    return () => { io.disconnect(); mo?.disconnect() }
  }, [dep])
}

// ค่าตำแหน่งการเลื่อนของ element (0 = เพิ่งเข้าจอด้านล่าง, 1 = ออกจอด้านบน) ใส่เป็น CSS var --p
export function useScrollVar(ref) {
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)))
      el.style.setProperty('--p', p.toFixed(4))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [ref])
}
