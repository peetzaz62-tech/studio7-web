import { createContext, useContext, useState } from 'react'
import { mergeContent } from './data/index.js'

const Ctx = createContext(null)

function initial() {
  // Worker ฝังเนื้อหาล่าสุดจาก KV ไว้ใน <script id="site-content"> ของทุกหน้า
  try {
    const el = document.getElementById('site-content')
    return mergeContent(el ? JSON.parse(el.textContent) : null)
  } catch {
    return mergeContent(null)
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(initial)
  // saved = เนื้อหาล่าสุดที่บันทึกแล้ว (JSON) — ใช้เช็กว่า dashboard มีการแก้ที่ยังไม่บันทึกไหม
  const [saved, setSaved] = useState(null)
  const dirty = saved !== null && JSON.stringify(content) !== saved
  return <Ctx.Provider value={{ content, setContent, saved, setSaved, dirty }}>{children}</Ctx.Provider>
}

export const useContent = () => useContext(Ctx).content
export const useContentState = () => useContext(Ctx)

export function isAdminHint() {
  return /(?:^|;\s*)s7_admin_ui=1/.test(document.cookie)
}
