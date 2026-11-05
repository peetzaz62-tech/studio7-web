// หน้าโหลดครั้งแรก (#boot ใน index.html) — แสดงเฉพาะการเข้าเว็บครั้งแรก หรือห่างจากครั้งล่าสุดเกิน 30 วัน
// (สคริปต์ใน <head> ตัดสินใจแล้วใส่ class "no-intro" หรือ "boot-lock" ให้ <html>)
// ปิดเมื่อฟอนต์และรูปหลักพร้อม: อย่างน้อย 2.4 วิ (ให้ animation ครบ) ไม่เกิน 5 วิ
const MIN_SHOW = 2400
const MAX_WAIT = 5000

function imageReady(img) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve()
  return new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }) })
}

function markBooted() {
  const root = document.documentElement
  root.classList.remove('boot-lock')
  root.classList.add('booted')
  window.dispatchEvent(new Event('s7:booted'))
}

export function finishBoot() {
  const el = document.getElementById('boot')
  const root = document.documentElement
  if (!el || root.classList.contains('no-intro') || location.pathname.startsWith('/admin')) {
    el?.remove()
    markBooted()
    return
  }
  const heroSrc = getComputedStyle(document.querySelector('.hero-bg') || document.body).backgroundImage.match(/url\("?([^")]+)/)?.[1]
  const heroImg = heroSrc ? Object.assign(new Image(), { src: heroSrc }) : document.querySelector('main img')
  const timer = (ms) => new Promise((r) => setTimeout(r, ms))
  const ready = Promise.all([document.fonts?.ready, imageReady(heroImg)])
  Promise.all([Promise.race([ready, timer(MAX_WAIT)]), timer(Math.max(0, MIN_SHOW - performance.now()))]).then(() => {
    try { localStorage.setItem('s7-intro', String(Date.now())) } catch { /* ไม่มี storage ก็แสดงครั้งต่อไปอีก */ }
    el.classList.add('done')
    markBooted()
    setTimeout(() => el.remove(), 1100)
  })
}
