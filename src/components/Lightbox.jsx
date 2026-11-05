import { useEffect, useState, useCallback, useRef } from 'react'
import { imgUrl as img, thumbUrl as thumb } from '../media.js'

// ดูรูปเต็มจอ: ปุ่มลูกศร / คีย์บอร์ด / ปัดนิ้ว + แถบรูปย่อ
function Lightbox({ items, index, onClose, onMove, onGo }) {
  const start = useRef(null)
  const strip = useRef(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    addEventListener('keydown', k)
    document.documentElement.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', k); document.documentElement.style.overflow = '' }
  }, [onClose, onMove])
  useEffect(() => {
    setLoaded(false)
    // โหลดรูปถัดไป/ก่อนหน้าไว้ล่วงหน้า
    ;[1, -1].forEach((d) => { const f = items[(index + d + items.length) % items.length]; if (f) new Image().src = img(f) })
    strip.current?.querySelector('.on')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [index, items])

  const down = (e) => { start.current = { x: e.clientX, y: e.clientY } }
  const up = (e) => {
    if (!start.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    start.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) onMove(dx < 0 ? 1 : -1)
    else if (dy > 90) onClose()
  }

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="ดูรูป" onClick={onClose}>
      <div className="lb-top" onClick={(e) => e.stopPropagation()}>
        <span className="lb-count">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <button className="lb-close" aria-label="ปิด" onClick={onClose}><span /><span /></button>
      </div>
      <div className="lb-stage" onPointerDown={down} onPointerUp={up}>
        <img key={items[index]} src={img(items[index])} alt="" className={loaded ? 'is-loaded' : ''} onLoad={() => setLoaded(true)} onClick={(e) => e.stopPropagation()} draggable="false" />
        {!loaded && <span className="lb-spin" aria-hidden="true" />}
      </div>
      {items.length > 1 && (
        <>
          <button className="lb-nav lb-prev" aria-label="รูปก่อนหน้า" onClick={(e) => { e.stopPropagation(); onMove(-1) }}><span>←</span></button>
          <button className="lb-nav lb-next" aria-label="รูปถัดไป" onClick={(e) => { e.stopPropagation(); onMove(1) }}><span>→</span></button>
          <div className="lb-strip" ref={strip} onClick={(e) => e.stopPropagation()}>
            {items.map((f, i) => (
              <button key={f + i} className={i === index ? 'on' : ''} onClick={() => onGo(i)} aria-label={`รูปที่ ${i + 1}`}>
                <img src={thumb(f)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function useLightbox(items) {
  const [i, setI] = useState(null)
  const close = useCallback(() => setI(null), [])
  const move = useCallback((d) => setI((x) => (x + d + items.length) % items.length), [items.length])
  const node = i === null ? null : <Lightbox items={items} index={i} onClose={close} onMove={move} onGo={setI} />
  return [setI, node]
}

// ใช้ง่าย: const [show, node] = useGallery(); show(items, index)
export function useGallery() {
  const [items, setItems] = useState([])
  const [openAt, node] = useLightbox(items)
  const show = (list, i) => { setItems(list); openAt(i) }
  return [show, node]
}
