import { useEffect, useRef, useState } from 'react'

// กรอบพรีวิวด้านขวาของ dashboard: เปิดหน้าเว็บจริงใน iframe แล้วส่งเนื้อหาฉบับร่าง + ส่วนที่กำลังแก้ไปให้
const WIDTH = { desktop: 1280, mobile: 390 }

export default function PreviewPane({ path, content, active, device, setDevice, onClose }) {
  const frame = useRef(null)
  const stage = useRef(null)
  const firstSrc = useRef(`${path}?preview=1`)
  const [ready, setReady] = useState(0)
  const [size, setSize] = useState({ w: 600, h: 800 })

  const post = (m) => frame.current?.contentWindow?.postMessage({ type: 's7-preview', ...m }, location.origin)
  const hl = () => ({ highlight: active?.tokens || null, label: active?.label || '' })

  useEffect(() => {
    const on = (e) => { if (e.origin === location.origin && e.data?.type === 's7-preview-ready' && e.source === frame.current?.contentWindow) setReady((r) => r + 1) }
    addEventListener('message', on)
    return () => removeEventListener('message', on)
  }, [])
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(stage.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => { if (ready) post({ path, content, ...hl() }) }, [ready])
  useEffect(() => { if (!ready) return; const t = setTimeout(() => post({ content }), 150); return () => clearTimeout(t) }, [content])
  useEffect(() => { if (ready) post({ path, ...hl() }) }, [path])
  useEffect(() => { if (ready) post(hl()) }, [active])

  const w = WIDTH[device]
  const pad = device === 'mobile' ? 32 : 0
  const scale = Math.min(1, Math.max(0.2, (size.w - pad) / w))
  const h = Math.max(300, (size.h - pad) / scale)

  return (
    <aside className="ad-preview" aria-label="พรีวิวหน้าเว็บ">
      <div className="ad-pv-bar">
        <span className="ad-pv-path" title={path}>{path}</span>
        <div className="ad-seg" role="group" aria-label="ขนาดจอ">
          <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>คอม</button>
          <button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}>มือถือ</button>
        </div>
        <button type="button" className="ad-pv-x" onClick={onClose} aria-label="ปิดพรีวิว">×</button>
      </div>
      <div className={`ad-pv-stage is-${device}`} ref={stage}>
        <div className="ad-pv-device" style={{ width: w * scale, height: h * scale }}>
          <iframe ref={frame} src={firstSrc.current} title="พรีวิวหน้าเว็บ" style={{ width: w, height: h, transform: `scale(${scale})` }} />
        </div>
      </div>
      <p className="ad-pv-note">{active?.label ? <>กำลังแก้: <b>{active.label}</b> — กรอบสีฟ้าในพรีวิว</> : 'แสดงฉบับร่าง ยังไม่บันทึกก็เห็นผล'}</p>
    </aside>
  )
}
