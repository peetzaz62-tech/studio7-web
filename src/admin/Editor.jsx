import { useId, useRef, useState } from 'react'
import { thumbUrl } from '../media.js'
import { uploadImage, formatSize } from './upload.js'
import {
  LABELS, HINTS, COLORS, blank, summary,
  isImageKey, isImageListKey, isImageValue, isLongKey, isLinkKey,
} from './schema.js'

const label = (k) => LABELS[k] || k
const move = (arr, i, d) => {
  const j = i + d
  if (j < 0 || j >= arr.length) return arr
  const out = [...arr]; [out[i], out[j]] = [out[j], out[i]]; return out
}

function Hint({ k }) {
  return HINTS[k] ? <small className="ad-hint">{HINTS[k]}</small> : null
}

function UploadButton({ multiple, onDone, children }) {
  const input = useRef(null)
  const [busy, setBusy] = useState('')
  const [err, setErr] = useState('')
  const [note, setNote] = useState('')
  const pick = async (e) => {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    setErr(''); setNote('')
    const urls = []
    const errors = []
    let before = 0
    let after = 0
    for (const [i, f] of files.entries()) {
      setBusy(files.length > 1 ? `กำลังอัปโหลด ${i + 1}/${files.length}…` : 'กำลังอัปโหลด…')
      try {
        const r = await uploadImage(f)
        urls.push(r.url); before += r.original; after += r.size
      } catch (x) { errors.push(x.message) }
    }
    setBusy('')
    if (urls.length) {
      onDone(urls)
      setNote(`อัปโหลดแล้ว ${urls.length} รูป · ${formatSize(before)} → ${formatSize(after)}`)
    }
    if (errors.length) setErr(errors.join(' · '))
  }
  return (
    <>
      <button type="button" className="ad-btn" disabled={!!busy} onClick={() => input.current.click()}>
        {busy || children}
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif" multiple={multiple} hidden onChange={pick} />
      {note && <span className="ad-ok" role="status">{note}</span>}
      {err && <span className="ad-err" role="alert">{err}</span>}
    </>
  )
}

function ImageField({ value, onChange, id }) {
  return (
    <div className="ad-image">
      <span className="ad-thumb">{value ? <img src={thumbUrl(value)} alt="" /> : <i>ไม่มีรูป</i>}</span>
      <div className="ad-image-ctl">
        <input id={id} className="ad-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="ชื่อไฟล์ หรือ /media/..." />
        <div className="ad-row">
          <UploadButton onDone={([u]) => onChange(u)}>อัปโหลดรูปใหม่</UploadButton>
          {value && <button type="button" className="ad-btn ad-ghost" onClick={() => onChange('')}>ลบรูป</button>}
        </div>
      </div>
    </div>
  )
}

function ImageList({ value, onChange }) {
  return (
    <div className="ad-imagelist">
      <div className="ad-imagegrid">
        {value.map((f, i) => (
          <figure key={f + i} className="ad-imgcell">
            <img src={thumbUrl(f)} alt="" loading="lazy" />
            <figcaption>
              <button type="button" aria-label="เลื่อนไปก่อนหน้า" onClick={() => onChange(move(value, i, -1))} disabled={i === 0}>←</button>
              <span>{i + 1}</span>
              <button type="button" aria-label="เลื่อนไปถัดไป" onClick={() => onChange(move(value, i, 1))} disabled={i === value.length - 1}>→</button>
              <button type="button" aria-label="ลบรูปนี้" className="ad-x" onClick={() => onChange(value.filter((_, j) => j !== i))}>✕</button>
            </figcaption>
          </figure>
        ))}
      </div>
      <UploadButton multiple onDone={(urls) => onChange([...value, ...urls])}>＋ อัปโหลดรูป (เลือกได้หลายรูป)</UploadButton>
    </div>
  )
}

function StringField({ k, value, onChange, id }) {
  if (isImageKey(k) || isImageValue(value)) return <ImageField id={id} value={value} onChange={onChange} />
  if (k === 'date' || k === 'endDate') return <input id={id} type="date" className="ad-input ad-short" value={value} onChange={(e) => onChange(e.target.value)} />
  if (k === 'color' || k === 'accent') {
    return (
      <div className="ad-colors" role="radiogroup" id={id}>
        {COLORS.map((c) => (
          <button key={c} type="button" role="radio" aria-checked={value === c} className={`ad-swatch tag-${c} ${value === c ? 'on' : ''}`} onClick={() => onChange(c)}>{c}</button>
        ))}
      </div>
    )
  }
  if (isLongKey(k) || value.length > 90) {
    return <textarea id={id} className="ad-input ad-text" rows={Math.min(12, Math.max(3, Math.ceil(value.length / 90)))} value={value} onChange={(e) => onChange(e.target.value)} />
  }
  return (
    <div className="ad-row ad-grow">
      <input id={id} className="ad-input" value={value} onChange={(e) => onChange(e.target.value)} />
      {isLinkKey(k) && value && /^(https?:|\/)/.test(value) && <a className="ad-open" href={value} target="_blank" rel="noreferrer">เปิด ↗</a>}
    </div>
  )
}

function Card({ title, index, count, onUp, onDown, onRemove, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`ad-card ${open ? 'open' : ''}`}>
      <div className="ad-card-head">
        <button type="button" className="ad-card-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="ad-caret" aria-hidden="true">{open ? '▾' : '▸'}</span>
          <span className="ad-card-no">{index + 1}</span>
          <span className="ad-card-title">{title}</span>
        </button>
        <div className="ad-card-tools">
          <button type="button" aria-label="เลื่อนขึ้น" onClick={onUp} disabled={index === 0}>↑</button>
          <button type="button" aria-label="เลื่อนลง" onClick={onDown} disabled={index === count - 1}>↓</button>
          <button type="button" aria-label="ลบรายการนี้" className="ad-x" onClick={onRemove}>✕</button>
        </div>
      </div>
      {open && <div className="ad-card-body">{children}</div>}
    </div>
  )
}

function ArrayField({ k, value, onChange }) {
  const confirmRemove = (i) => {
    if (confirm(`ลบ "${summary(value[i], i)}" ?`)) onChange(value.filter((_, j) => j !== i))
  }
  if (isImageListKey(k) || (value.length && value.every(isImageValue))) return <ImageList value={value} onChange={onChange} />

  // คู่ข้อมูล เช่น facts: [["Location","..."], ...]
  if (value.length && value.every((v) => Array.isArray(v) && v.length === 2)) {
    return (
      <div className="ad-pairs">
        {value.map(([a, b], i) => (
          <div className="ad-pair" key={i}>
            <input className="ad-input ad-short" value={a} aria-label="หัวข้อ" onChange={(e) => onChange(value.map((v, j) => (j === i ? [e.target.value, b] : v)))} />
            <textarea className="ad-input ad-text" rows={2} value={b} aria-label="รายละเอียด" onChange={(e) => onChange(value.map((v, j) => (j === i ? [a, e.target.value] : v)))} />
            <button type="button" className="ad-btn ad-ghost ad-x" aria-label="ลบ" onClick={() => onChange(value.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        <button type="button" className="ad-btn" onClick={() => onChange([...value, ['', '']])}>＋ เพิ่ม</button>
      </div>
    )
  }

  // ลิสต์ข้อความ เช่น ย่อหน้า
  if (!value.length || value.every((v) => typeof v === 'string')) {
    return (
      <div className="ad-strings">
        {value.map((v, i) => (
          <div className="ad-string" key={i}>
            <StringField k={k} value={v} onChange={(x) => onChange(value.map((y, j) => (j === i ? x : y)))} />
            <div className="ad-card-tools">
              <button type="button" aria-label="เลื่อนขึ้น" onClick={() => onChange(move(value, i, -1))} disabled={i === 0}>↑</button>
              <button type="button" aria-label="เลื่อนลง" onClick={() => onChange(move(value, i, 1))} disabled={i === value.length - 1}>↓</button>
              <button type="button" aria-label="ลบ" className="ad-x" onClick={() => onChange(value.filter((_, j) => j !== i))}>✕</button>
            </div>
          </div>
        ))}
        <button type="button" className="ad-btn" onClick={() => onChange([...value, ''])}>＋ เพิ่ม{isLongKey(k) ? 'ย่อหน้า' : ''}</button>
      </div>
    )
  }

  // ลิสต์ของรายการ (การ์ด)
  const allKeys = [...new Set(value.flatMap((v) => (v && typeof v === 'object' ? Object.keys(v) : [])))]
  const template = Object.fromEntries(allKeys.map((key) => [key, blank(value.find((v) => v?.[key] !== undefined)?.[key])]))
  return (
    <div className="ad-list">
      {value.map((item, i) => (
        <Card key={i} index={i} count={value.length} title={summary(item, i)} defaultOpen={value.length <= 3}
          onUp={() => onChange(move(value, i, -1))} onDown={() => onChange(move(value, i, 1))} onRemove={() => confirmRemove(i)}>
          <ObjectField value={item} siblingKeys={allKeys} template={template} onChange={(x) => onChange(value.map((y, j) => (j === i ? x : y)))} />
        </Card>
      ))}
      <button type="button" className="ad-btn" onClick={() => onChange([...value, structuredClone(template)])}>＋ เพิ่มรายการ</button>
    </div>
  )
}

export function ObjectField({ value, onChange, siblingKeys = [], template = {} }) {
  const missing = siblingKeys.filter((k) => value[k] === undefined)
  return (
    <div className="ad-fields">
      {Object.entries(value).map(([k, v]) => (
        <Field key={k} k={k} value={v} onChange={(x) => onChange({ ...value, [k]: x })}
          onRemove={siblingKeys.length ? () => { const { [k]: _, ...rest } = value; onChange(rest) } : null} />
      ))}
      {missing.length > 0 && (
        <div className="ad-missing">
          <span>เพิ่มช่อง:</span>
          {missing.map((k) => (
            <button type="button" key={k} className="ad-chip" onClick={() => onChange({ ...value, [k]: structuredClone(template[k] ?? '') })}>＋ {label(k)}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Field({ k, value, onChange, onRemove, top }) {
  const id = useId()
  let control
  if (Array.isArray(value)) control = <ArrayField k={k} value={value} onChange={onChange} />
  else if (value && typeof value === 'object') control = <ObjectField value={value} onChange={onChange} />
  else if (typeof value === 'boolean') control = <input id={id} type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
  else if (typeof value === 'number') control = <input id={id} type="number" step="any" className="ad-input ad-short" value={value} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
  else control = <StringField k={k} id={id} value={value ?? ''} onChange={onChange} />

  const group = Array.isArray(value) || (value && typeof value === 'object')
  return (
    <div className={`ad-field ${group ? 'ad-group' : ''} ${top ? 'ad-root' : ''}`}>
      <div className="ad-label-row">
        {group ? <span className="ad-label">{label(k)}</span> : <label className="ad-label" htmlFor={id}>{label(k)}</label>}
        {onRemove && <button type="button" className="ad-link" onClick={onRemove}>ลบช่องนี้</button>}
      </div>
      <Hint k={k} />
      {control}
    </div>
  )
}
