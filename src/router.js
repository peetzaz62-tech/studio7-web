import { useEffect, useState } from 'react'

// เส้นทางแบบ #ชื่อหน้า (เช่น #events, #about-us) — ใช้ได้ทั้งบนโฮสต์ทั่วไปและบน Artifact
export const DEFAULT_ROUTE = 'events'

const read = () => decodeURIComponent(window.location.hash.replace(/^#/, '')) || DEFAULT_ROUTE

export function useRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => { setRoute(read()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
