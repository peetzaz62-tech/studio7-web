// ปิดหน้าโหลด (#boot ใน index.html) เมื่อฟอนต์และรูปหลักของหน้าพร้อม
// ครั้งแรกของ session แสดงครบ animation (1.6 วิ) ครั้งต่อไปสั้นลง; ไม่เกิน 4.5 วิ แม้รูปยังโหลดไม่เสร็จ
const MIN_FIRST = 1600
const MIN_AGAIN = 700
const MAX_WAIT = 4500

function seen() {
  try { const v = sessionStorage.getItem('s7-boot'); sessionStorage.setItem('s7-boot', '1'); return !!v } catch { return false }
}

function imageReady(img) {
  if (!img || (img.complete && img.naturalWidth)) return Promise.resolve()
  return new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }) })
}

export function finishBoot() {
  const el = document.getElementById('boot')
  if (!el) { document.documentElement.classList.remove('boot-lock'); document.documentElement.classList.add('booted'); return }
  const min = seen() ? MIN_AGAIN : MIN_FIRST
  const heroSrc = getComputedStyle(document.querySelector('.hero-bg') || document.body).backgroundImage.match(/url\("?([^")]+)/)?.[1]
  const heroImg = heroSrc ? Object.assign(new Image(), { src: heroSrc }) : document.querySelector('main img')
  const ready = Promise.all([document.fonts?.ready, imageReady(heroImg)])
  const timer = (ms) => new Promise((r) => setTimeout(r, ms))
  Promise.all([Promise.race([ready, timer(MAX_WAIT)]), timer(Math.max(0, min - performance.now()))]).then(() => {
    el.classList.add('done')
    document.documentElement.classList.remove('boot-lock')
    document.documentElement.classList.add('booted')
    window.dispatchEvent(new Event('s7:booted'))
    setTimeout(() => el.remove(), 1000)
  })
}
