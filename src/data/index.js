// รวมเนื้อหาตั้งต้นทั้งหมดของเว็บ (ใช้เมื่อยังไม่เคยแก้ผ่าน dashboard หรือคีย์ไหนยังไม่เคยบันทึก)
import * as SITE from './site.js'
import { ABOUT } from './about.js'
import { PROJECTS } from './projects.js'
import { THESIS } from './thesis.js'
import { SUBMISSION, ALUMNI, DOWNLOADS } from './pages.js'

export const DEFAULT_CONTENT = { ...SITE, ABOUT, PROJECTS, THESIS, SUBMISSION, ALUMNI, DOWNLOADS }

export const CONTENT_KEYS = Object.keys(DEFAULT_CONTENT)

// เนื้อหาที่บันทึกใน KV ทับค่าเริ่มต้นทีละคีย์บนสุด
export function mergeContent(stored) {
  const out = { ...DEFAULT_CONTENT }
  if (stored && typeof stored === 'object') {
    for (const k of CONTENT_KEYS) if (stored[k] !== undefined) out[k] = stored[k]
  }
  return out
}
