import { useEffect, useState, useCallback } from 'react'

import { imgUrl as img } from '../media.js'

function Lightbox({ items, index, onClose, onMove }) {
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose, onMove])
  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="lb-close" aria-label="ปิด" onClick={onClose}>×</button>
      <button className="lb-nav lb-prev" aria-label="ก่อนหน้า" onClick={(e) => { e.stopPropagation(); onMove(-1) }}>‹</button>
      <img src={img(items[index])} alt="" onClick={(e) => e.stopPropagation()} />
      <button className="lb-nav lb-next" aria-label="ถัดไป" onClick={(e) => { e.stopPropagation(); onMove(1) }}>›</button>
      <span className="lb-count">{index + 1} / {items.length}</span>
    </div>
  )
}

export function useLightbox(items) {
  const [i, setI] = useState(null)
  const close = useCallback(() => setI(null), [])
  const move = useCallback((d) => setI((x) => (x + d + items.length) % items.length), [items.length])
  const node = i === null ? null : <Lightbox items={items} index={i} onClose={close} onMove={move} />
  return [setI, node]
}


// ใช้ง่าย: const [show, node] = useGallery(); show(items, index)
export function useGallery() {
  const [items, setItems] = useState([])
  const [openAt, node] = useLightbox(items)
  const show = (list, i) => { setItems(list); openAt(i) }
  return [show, node]
}
