// โหมดพรีวิวใน dashboard: หน้าเว็บถูกเปิดใน iframe (?preview=1) แล้วรับเนื้อหาฉบับร่างจาก dashboard ผ่าน postMessage
// และตีกรอบส่วนที่กำลังแก้ (องค์ประกอบที่มี data-edit="KEY ...")
import { useEffect } from 'react'
import { navigate } from './router.js'

export const IS_PREVIEW = typeof window !== 'undefined' && window.parent !== window && new URLSearchParams(location.search).has('preview')

let overlay = null
let target = null
let raf = 0

function place() {
  raf = 0
  if (!overlay) return
  if (!target || !target.isConnected) { overlay.style.display = 'none'; return }
  const r = target.getBoundingClientRect()
  Object.assign(overlay.style, { display: 'block', top: `${r.top}px`, left: `${r.left}px`, width: `${r.width}px`, height: `${r.height}px` })
}
const schedule = () => { if (!raf) raf = requestAnimationFrame(place) }

function findTarget(tokens) {
  for (const t of tokens) {
    const el = document.querySelector(`[data-edit~="${CSS.escape(t)}"]`)
    if (el) return el
  }
  return null
}

function highlight(tokens, label, scroll) {
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.className = 'pv-overlay'
    document.body.appendChild(overlay)
  }
  target = tokens?.length ? findTarget(tokens) : null
  overlay.dataset.label = label || ''
  schedule()
  if (target && scroll) {
    const y = target.getBoundingClientRect().top + scrollY - 90
    scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
}

export function usePreviewBridge(setContent) {
  useEffect(() => {
    if (!IS_PREVIEW) return
    document.documentElement.classList.add('is-preview')
    let last = { tokens: null, label: '' }
    const onMsg = (e) => {
      if (e.origin !== location.origin) return
      const m = e.data
      if (!m || m.type !== 's7-preview') return
      if (m.path && m.path !== location.pathname) navigate(`${m.path}?preview=1`)
      if (m.content) setContent(m.content)
      if ('highlight' in m) last = { tokens: m.highlight, label: m.label }
      // รอให้หน้าวาดใหม่เสร็จก่อนค่อยหาตำแหน่ง
      setTimeout(() => highlight(last.tokens, last.label, 'highlight' in m || !!m.path), m.path ? 350 : 60)
    }
    addEventListener('message', onMsg)
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    const tick = setInterval(schedule, 400) // เนื้อหาเปลี่ยนขนาด (รูปโหลด ฯลฯ)
    window.parent.postMessage({ type: 's7-preview-ready' }, location.origin)
    return () => { removeEventListener('message', onMsg); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); clearInterval(tick) }
  }, [setContent])
}
