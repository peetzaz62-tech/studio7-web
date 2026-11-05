import { useEffect, useState } from 'react'
import { legacyHashToPath } from './routes.js'

export function navigate(to) {
  const url = new URL(to, location.origin)
  if (url.pathname + url.search === location.pathname + location.search) {
    if (url.hash) scrollToId(url.hash.slice(1))
    else window.scrollTo(0, 0)
    return
  }
  history.pushState({}, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// path ปัจจุบัน + ดักคลิกลิงก์ภายใน (<a href="/...">) ให้เปลี่ยนหน้าโดยไม่โหลดใหม่
export function usePath() {
  const [path, setPath] = useState(() => {
    const legacy = legacyHashToPath(location.hash)
    if (legacy) history.replaceState({}, '', legacy)
    return location.pathname
  })
  useEffect(() => {
    const onPop = () => { setPath(location.pathname); if (!location.hash) window.scrollTo(0, 0) }
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a')
      if (!a || a.target || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      if (/^\/(api|media|img|assets)\//.test(href) || /\.(xml|txt|pdf)$/.test(href)) return
      e.preventDefault()
      navigate(href)
    }
    window.addEventListener('popstate', onPop)
    document.addEventListener('click', onClick)
    return () => { window.removeEventListener('popstate', onPop); document.removeEventListener('click', onClick) }
  }, [])
  return path
}

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
