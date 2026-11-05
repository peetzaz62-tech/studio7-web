// แปลง URL path → หน้า (ใช้ทั้งฝั่งเว็บและฝั่ง Worker) — ไม่มี React เพื่อให้ Worker import ได้
export const STATIC_PAGES = ['about-us', 'submission', 'alumni', 'download', 'admin']

export function parsePath(pathname, content) {
  const p = (pathname || '/').replace(/\/+$/, '') || '/'
  if (p === '/' || p === '/events') return { page: 'events' }
  let m
  if ((m = p.match(/^\/projects\/(\d{4})$/))) {
    return content && !content.PROJECTS?.[m[1]] ? { page: 'notfound' } : { page: 'project', year: m[1] }
  }
  if ((m = p.match(/^\/thesis\/([a-z0-9-]+)$/))) {
    return content && !content.THESIS?.[m[1]] ? { page: 'notfound' } : { page: 'thesis', slug: m[1] }
  }
  const s = p.slice(1)
  if (STATIC_PAGES.includes(s)) return { page: s }
  return { page: 'notfound' }
}

// ลิงก์เก่าแบบ #thesis-tinn (จากเวอร์ชันก่อน) → /thesis/tinn
export function legacyHashToPath(hash) {
  const h = (hash || '').replace(/^#/, '')
  if (!h) return null
  if (h === 'events') return '/'
  let m
  if ((m = h.match(/^projects-(\d{4})$/))) return `/projects/${m[1]}`
  if ((m = h.match(/^thesis-([a-z0-9-]+)$/))) return `/thesis/${m[1]}`
  if (STATIC_PAGES.includes(h)) return `/${h}`
  return null
}

export function allPaths(content) {
  return [
    '/', '/about-us', '/submission', '/alumni', '/download',
    ...Object.keys(content.PROJECTS || {}).map((y) => `/projects/${y}`),
    ...Object.keys(content.THESIS || {}).map((s) => `/thesis/${s}`),
  ]
}
