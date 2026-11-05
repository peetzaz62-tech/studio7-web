// ชื่อหน้า/คำอธิบาย/รูปพรีวิว สำหรับแต่ละหน้า (Worker ใช้ใส่ <meta> ให้ Google, LINE, Facebook; เว็บใช้ตั้ง document.title)
import { thumbUrl, imgUrl } from './media.js'

const SITE = 'Resilient Architecture by Studio 7'
const clip = (s = '', n = 180) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)

export function metaFor(route, c) {
  const base = { title: SITE, description: clip(c.HERO?.text), image: imgUrl(c.HERO?.image || 'hero-bg.jpg') }
  switch (route.page) {
    case 'events':
      return { ...base, title: `Events ${c.HERO?.eyebrow?.replace(/^Events\s*/i, '') || ''} | ${SITE}`.replace('  ', ' ') }
    case 'about-us':
      return { ...base, title: `About us | ${SITE}`, description: clip(c.ABOUT?.philosophy?.[0]), image: thumbUrl(c.ABOUT?.pillars?.[0]?.img) || base.image }
    case 'project': {
      const d = c.PROJECTS?.[route.year] || {}
      const cover = d.thesis?.[0]?.img || d.people?.find((p) => p.photo)?.photo
      return { title: `Projects ${route.year} | ${SITE}`, description: clip(d.intro?.[0] || d.subtitle), image: cover ? thumbUrl(cover) : base.image }
    }
    case 'thesis': {
      const t = c.THESIS?.[route.slug] || {}
      const cover = t.hero?.[0] || t.pages?.[0] || t.chart
      return { title: `${t.title} — ${t.by} | ${SITE}`, description: clip(t.text?.[0] || t.titleTh || t.title), image: cover ? thumbUrl(cover) : base.image }
    }
    case 'submission':
      return { ...base, title: `Submission | ${SITE}`, description: clip(c.SUBMISSION?.intro) }
    case 'alumni':
      return { ...base, title: `Alumni | ${SITE}`, description: clip(c.ALUMNI?.intro) }
    case 'download':
      return { ...base, title: `Download | ${SITE}`, description: clip(c.DOWNLOADS?.[0]?.title), image: thumbUrl(c.DOWNLOADS?.[0]?.cover) || base.image }
    case 'admin':
      return { ...base, title: `Admin | ${SITE}`, noindex: true }
    default:
      return { ...base, title: `ไม่พบหน้านี้ | ${SITE}`, noindex: true }
  }
}
