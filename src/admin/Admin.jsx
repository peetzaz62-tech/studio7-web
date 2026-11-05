import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContentState } from '../content.jsx'
import { DEFAULT_CONTENT, CONTENT_KEYS, mergeContent } from '../data/index.js'
import { navigate } from '../router.js'
import Logo from '../components/Logo.jsx'
import { Field } from './Editor.jsx'
import { SECTIONS, CATEGORIES, KEY_TITLES, KEY_DESC, FIELD_GROUPS, LABELS, blank } from './schema.js'
import './admin.css'

const api = async (path, opts = {}) => {
  const res = await fetch(path, { credentials: 'same-origin', ...opts, headers: { 'content-type': 'application/json', ...(opts.headers || {}) } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || `เกิดข้อผิดพลาด (${res.status})`), { status: res.status })
  return data
}

// บันทึกเฉพาะหัวข้อที่ต่างจากค่าเริ่มต้นในโค้ด
const changedKeys = (c) => Object.fromEntries(CONTENT_KEYS.filter((k) => JSON.stringify(c[k]) !== JSON.stringify(DEFAULT_CONTENT[k])).map((k) => [k, c[k]]))
const fmtTime = (iso) => new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })
const countOf = (v) => (Array.isArray(v) ? `${v.length} รายการ` : null)
const sectionById = (id) => SECTIONS.find((s) => s.id === id)

/* ------------------------------------------------------------------ login */
function Login({ onDone, configured, storage, unreachable }) {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      await api('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) })
      const me = await api('/api/me')
      if (!me.admin) setErr('รหัสผ่านถูกต้อง แต่เบราว์เซอร์ไม่บันทึกการเข้าสู่ระบบ (cookie) — ลองปิดโหมดบล็อกคุกกี้ หรือใช้เบราว์เซอร์อื่น')
      else onDone()
    } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <div className="ad-root ad-login">
      <div className="ad-login-sheet">
        <span className="ad-guide h" style={{ top: 0 }} /><span className="ad-guide h" style={{ bottom: 0 }} />
        <span className="ad-guide v" style={{ left: 0 }} /><span className="ad-guide v" style={{ right: 0 }} />
        <form className="ad-login-card" onSubmit={submit}>
          <Logo className="ad-login-logo" />
          <p className="ad-eyebrow">Resilient Architecture · Studio 7</p>
          <h1>เข้าสู่ระบบผู้ดูแล</h1>
          <p className="ad-login-sub">สำหรับแก้ไขเนื้อหาเว็บไซต์ เช่น กิจกรรม ผลงาน และรูปภาพ</p>
          {!configured && !unreachable && (
            <p className="ad-warn">ยังไม่ได้ตั้งรหัสผ่าน admin — ใน Cloudflare → rmuttstudio7-web → Settings → Variables and Secrets เพิ่ม <code>ADMIN_PASSWORD</code> แบบ <b>Secret</b> แล้วกด <b>Deploy</b></p>
          )}
          <label htmlFor="ad-pw" className="ad-label">รหัสผ่าน</label>
          <div className="ad-pw">
            <input id="ad-pw" type={show ? 'text' : 'password'} autoComplete="current-password" className="ad-input" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
            <button type="button" className="ad-pw-toggle" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? 'ซ่อน' : 'แสดง'}</button>
          </div>
          {err && <p className="ad-err" role="alert">{err}</p>}
          <button className="ad-btn ad-primary ad-block" disabled={busy || !pw}>{busy ? 'กำลังตรวจสอบ…' : 'เข้าสู่ระบบ →'}</button>
          <div className="ad-login-foot">
            <a href="/">← กลับไปหน้าเว็บ</a>
            <span className="ad-status" aria-label="สถานะระบบ">
              <span className={configured ? 'ok' : 'no'}>{configured ? '●' : '○'} รหัสผ่าน</span>
              <span className={storage ? 'ok' : 'no'}>{storage ? '●' : '○'} ที่เก็บข้อมูล</span>
              {unreachable && <span className="no">○ เซิร์ฟเวอร์</span>}
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- history */
function History({ onRestore, onClose }) {
  const [list, setList] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api('/api/history').then(setList).catch((x) => setErr(x.message)) }, [])
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  return (
    <div className="ad-modal" role="dialog" aria-modal="true" aria-labelledby="ad-hist-title" onClick={onClose}>
      <div className="ad-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-head">
          <h2 id="ad-hist-title">ประวัติการบันทึก</h2>
          <button className="ad-btn ad-ghost" onClick={onClose}>ปิด</button>
        </div>
        <p className="ad-hint">เก็บ 30 ครั้งล่าสุด — กู้คืนแล้วเว็บจะกลับเป็นเวอร์ชันนั้นทันที และการกู้คืนก็ถูกเก็บเป็นประวัติด้วย จึงย้อนกลับได้เสมอ</p>
        {err && <p className="ad-err">{err}</p>}
        {!list && !err && <p className="ad-hint">กำลังโหลด…</p>}
        {list && !list.length && <p className="ad-empty">ยังไม่มีประวัติ — ระบบจะเริ่มเก็บเมื่อบันทึกครั้งแรก</p>}
        <ol className="ad-history">
          {list?.map((h, i) => (
            <li key={h.key}>
              <span className="ad-history-when"><strong>{fmtTime(h.at || h.key.slice(8))}</strong>{i === 0 && <em className="ad-badge">ล่าสุด</em>}</span>
              <span className="ad-history-note">{h.note || <i>ไม่มีบันทึก</i>}</span>
              <button className="ad-btn ad-small" onClick={() => onRestore(h.key)} disabled={i === 0}>กู้คืน</button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- new entry */
function NewEntry({ map, existing, onCreate }) {
  const [v, setV] = useState('')
  const [open, setOpen] = useState(false)
  const isYear = map === 'PROJECTS'
  const ok = isYear ? /^\d{4}$/.test(v) : /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)
  const taken = existing.includes(v)
  if (!open) return <button type="button" className="ad-side-add" onClick={() => setOpen(true)}>＋ {isYear ? 'เพิ่มปีใหม่' : 'เพิ่ม Thesis ใหม่'}</button>
  return (
    <form className="ad-new" onSubmit={(e) => { e.preventDefault(); if (ok && !taken) { onCreate(v); setV(''); setOpen(false) } }}>
      <label className="ad-hint" htmlFor="ad-new-key">{isYear ? 'ปี (ค.ศ.) เช่น 2028' : 'ชื่อลิงก์ภาษาอังกฤษ เช่น p1-2027 → /thesis/p1-2027'}</label>
      <input id="ad-new-key" className="ad-input" value={v} autoFocus onChange={(e) => setV(e.target.value.trim().toLowerCase())} placeholder={isYear ? '2028' : 'p1-2027'} />
      {taken && <small className="ad-err">มีอยู่แล้ว</small>}
      {!isYear && v && !ok && <small className="ad-err">ใช้ a-z, 0-9 และ - เท่านั้น</small>}
      <div className="ad-row">
        <button className="ad-btn ad-small ad-primary" disabled={!ok || taken}>สร้าง</button>
        <button type="button" className="ad-btn ad-small ad-ghost" onClick={() => { setOpen(false); setV('') }}>ยกเลิก</button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ panel */
// การ์ดพับได้ หนึ่งการ์ดต่อหนึ่งหัวข้อ
function Panel({ id, title, desc, count, changed, onReset, defaultOpen, children }) {
  return (
    <details className="ad-panel" id={id} open={defaultOpen}>
      <summary>
        <span className="ad-panel-title">
          <strong>{title}</strong>
          {count && <span className="ad-count">{count}</span>}
          {changed && <span className="ad-badge" title="แก้จากค่าเริ่มต้นแล้ว">แก้ไขแล้ว</span>}
        </span>
        {desc && <span className="ad-panel-desc">{desc}</span>}
        <span className="ad-panel-caret" aria-hidden="true" />
      </summary>
      <div className="ad-panel-body">
        {children}
        {onReset && changed && (
          <p className="ad-panel-foot"><button type="button" className="ad-link" onClick={onReset}>คืนค่าเริ่มต้นของหัวข้อนี้</button></p>
        )}
      </div>
    </details>
  )
}

// หน้า Projects / Thesis: แบ่งช่องเป็นกลุ่ม
function GroupedEntry({ map, value, all, onChange }) {
  const groups = FIELD_GROUPS[map] || []
  const siblingKeys = [...new Set(Object.values(all).flatMap((v) => Object.keys(v || {})))]
  const template = (k) => blank(Object.values(all).find((v) => v?.[k] !== undefined)?.[k] ?? '')
  const grouped = new Set(groups.flatMap((g) => g.keys))
  const rest = { label: 'อื่น ๆ', desc: 'ช่องอื่นที่ไม่อยู่ในกลุ่มด้านบน', keys: Object.keys(value).filter((k) => !grouped.has(k)) }
  const set = (k, x) => onChange({ ...value, [k]: x })
  const remove = (k) => { const { [k]: _, ...r } = value; onChange(r) }
  return [...groups, rest].map((g, gi) => {
    const present = g.keys.filter((k) => value[k] !== undefined)
    const missing = g.keys.filter((k) => value[k] === undefined && siblingKeys.includes(k))
    if (!present.length && !missing.length) return null
    return (
      <Panel key={g.label} id={`ad-g-${gi}`} title={g.label} desc={g.desc} defaultOpen={gi === 0}>
        <div className="ad-fields">
          {present.map((k) => <Field key={k} k={k} value={value[k]} onChange={(x) => set(k, x)} onRemove={() => remove(k)} />)}
        </div>
        {missing.length > 0 && (
          <div className="ad-missing">
            <span>เพิ่มช่อง:</span>
            {missing.map((k) => <button type="button" key={k} className="ad-chip" onClick={() => set(k, template(k))}>＋ {LABELS[k] || k}</button>)}
          </div>
        )}
      </Panel>
    )
  })
}

/* --------------------------------------------------------------- overview */
function Overview({ content, go, onHistory }) {
  const [last, setLast] = useState(null)
  useEffect(() => { api('/api/history').then((l) => setLast(l[0] || false)).catch(() => setLast(false)) }, [])
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = content.EVENTS.filter((e) => (e.endDate || e.date) >= today).sort((a, b) => a.date.localeCompare(b.date))
  const thesisCount = Object.keys(content.THESIS).length
  const stats = [
    { n: upcoming.length, l: 'กิจกรรมที่กำลังจะมาถึง', go: () => go('events', 'EVENTS') },
    { n: thesisCount, l: 'หน้า Thesis', go: () => go('thesis') },
    { n: Object.keys(content.PROJECTS).length, l: 'ปีของ Projects', go: () => go('projects') },
    { n: content.GALLERY.length, l: 'รูป Workshop หน้าแรก', go: () => go('events', 'GALLERY') },
  ]
  const tasks = [
    { t: 'เพิ่มหรือแก้กิจกรรม', d: 'วันที่ เวลา ลิงก์ Google Meet', go: () => go('events', 'EVENTS') },
    { t: 'อัปโหลดรูป Workshop', d: 'เลือกได้หลายรูป ระบบย่อขนาดให้', go: () => go('events', 'GALLERY') },
    { t: 'เพิ่ม Thesis ใหม่', d: 'สร้างหน้าผลงานของนักศึกษา', go: () => go('thesis') },
    { t: 'แก้รายชื่อผู้เข้าร่วม', d: 'รูปและชื่อในหน้า Projects', go: () => go('projects') },
    { t: 'แก้ข้อความส่วนหัวหน้าแรก', d: 'หัวข้อ ภาคเรียน รูปพื้นหลัง', go: () => go('events', 'HERO') },
    { t: 'แก้อีเมลและที่อยู่', d: 'ข้อมูลท้ายเว็บ', go: () => go('site', 'FOOTER') },
  ]
  return (
    <>
      <header className="ad-page-head">
        <p className="ad-eyebrow">ภาพรวม</p>
        <h1>สวัสดี 👋 วันนี้อยากแก้อะไร</h1>
        <p className="ad-page-desc">
          {last === null ? 'กำลังโหลด…' : last ? <>บันทึกล่าสุด {fmtTime(last.at || last.key.slice(8))}{last.note && <> · “{last.note}”</>} · <button className="ad-link" onClick={onHistory}>ดูประวัติ</button></> : 'ยังไม่เคยบันทึกจาก dashboard — ตอนนี้เว็บใช้เนื้อหาตั้งต้นทั้งหมด'}
        </p>
      </header>
      <div className="ad-stats">
        {stats.map((s) => (
          <button key={s.l} className="ad-stat" onClick={s.go}><b>{s.n}</b><span>{s.l}</span></button>
        ))}
      </div>
      {upcoming[0] && (
        <div className="ad-next">
          <span className="ad-eyebrow">กิจกรรมถัดไป</span>
          <strong>{upcoming[0].title}</strong>
          <span>{upcoming[0].date}{upcoming[0].time ? ` · ${upcoming[0].time} น.` : ''} · {upcoming[0].tag}</span>
        </div>
      )}
      <h2 className="ad-h2">งานที่ทำบ่อย</h2>
      <div className="ad-tasks">
        {tasks.map((t) => (
          <button key={t.t} className="ad-task" onClick={t.go}><strong>{t.t}</strong><span>{t.d}</span><i aria-hidden="true">→</i></button>
        ))}
      </div>
      <div className="ad-tips">
        <h2 className="ad-h2">วิธีใช้</h2>
        <ol>
          <li>เลือกหน้าจากเมนูซ้าย แล้วกดเปิดหัวข้อที่ต้องการแก้</li>
          <li>กด <b>ดูหน้าเว็บ</b> เพื่อดูผลก่อนบันทึก (คนอื่นยังไม่เห็น)</li>
          <li>กด <b>บันทึก</b> หรือ Ctrl+S — ทุกคนเห็นภายใน 1 นาที</li>
          <li>แก้ผิด? กด <b>ประวัติ</b> แล้วกู้คืนเวอร์ชันก่อนหน้า</li>
        </ol>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------- main */
export default function Admin() {
  const { content, setContent, saved, setSaved, dirty } = useContentState()
  const [me, setMe] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const params = new URLSearchParams(location.search)
  const [sid, setSid] = useState(params.get('s') || 'home')
  const [entry, setEntry] = useState(params.get('k') || '')
  const [focusKey, setFocusKey] = useState(null)
  const section = sectionById(sid)

  const checkMe = useCallback(() => api('/api/me').then(setMe).catch(() => setMe({ admin: false, configured: false, storage: false, unreachable: true })), [])
  useEffect(() => { checkMe() }, [checkMe])

  useEffect(() => {
    if (!me?.admin || saved !== null) return
    api('/api/content').then((c) => { setContent(c); setSaved(JSON.stringify(c)) }).catch((x) => setError(x.message))
  }, [me])

  useEffect(() => {
    const p = new URLSearchParams({ s: sid, ...(entry ? { k: entry } : {}) })
    history.replaceState({}, '', `/admin?${p}`)
  }, [sid, entry])

  const entries = section?.map ? Object.keys(content[section.map] || {}) : []
  useEffect(() => {
    if (section?.map && !entries.includes(entry)) setEntry(section.map === 'PROJECTS' ? entries[entries.length - 1] || '' : entries[0] || '')
    if (!section?.map) setEntry('')
    scrollTo(0, 0)
  }, [sid])

  // เปิดและเลื่อนไปยังการ์ดที่เลือกจากทางลัด
  useEffect(() => {
    if (!focusKey) return
    const el = document.getElementById(`ad-k-${focusKey}`)
    if (el) { el.open = true; setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60) }
    setFocusKey(null)
  }, [focusKey, sid])

  const go = (id, key) => { setSid(id); setNavOpen(false); if (key) setFocusKey(key) }

  const save = useCallback(async () => {
    setError(''); setStatus('')
    const note = prompt('บันทึกสั้น ๆ ว่าแก้อะไร (ไม่ใส่ก็ได้) — ช่วยให้หาในประวัติง่ายขึ้น', '')
    if (note === null) return
    setSaving(true)
    try {
      const r = await api('/api/content', { method: 'PUT', body: JSON.stringify({ content: changedKeys(content), note }) })
      setSaved(JSON.stringify(content))
      setStatus(`บันทึกแล้ว ${fmtTime(r.at)} — หน้าเว็บอัปเดตภายใน 1 นาที`)
    } catch (x) {
      setError(x.message)
      if (x.status === 401) checkMe()
    } finally { setSaving(false) }
  }, [content])

  useEffect(() => {
    const key = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (dirty && !saving) save() } }
    const leave = (e) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    addEventListener('keydown', key); addEventListener('beforeunload', leave)
    return () => { removeEventListener('keydown', key); removeEventListener('beforeunload', leave) }
  }, [dirty, saving, save])

  useEffect(() => { if (!status) return; const t = setTimeout(() => setStatus(''), 6000); return () => clearTimeout(t) }, [status])

  const restore = async (key) => {
    if (!confirm('กู้คืนเวอร์ชันนี้? การแก้ไขที่ยังไม่บันทึกจะหายไป')) return
    try {
      const r = await api('/api/history/restore', { method: 'POST', body: JSON.stringify({ key }) })
      setContent(r.content); setSaved(JSON.stringify(r.content)); setShowHistory(false)
      setStatus(`กู้คืนแล้ว ${fmtTime(r.at)}`)
    } catch (x) { setError(x.message) }
  }
  const discard = () => { if (confirm('ยกเลิกการแก้ไขทั้งหมดที่ยังไม่บันทึก?')) setContent(mergeContent(JSON.parse(saved))) }
  const logout = async () => {
    if (dirty && !confirm('ยังมีการแก้ไขที่ไม่ได้บันทึก ออกจากระบบเลยไหม?')) return
    await api('/api/logout', { method: 'POST' }).catch(() => {})
    setSaved(null); checkMe()
  }

  const setKey = (k, v) => setContent((c) => ({ ...c, [k]: v }))
  const setEntryValue = (v) => setContent((c) => ({ ...c, [section.map]: { ...c[section.map], [entry]: v } }))
  const resetKey = (k) => { if (confirm(`คืนค่า "${KEY_TITLES[k] || k}" กลับเป็นค่าเริ่มต้นจากตอนสร้างเว็บ?`)) setKey(k, structuredClone(DEFAULT_CONTENT[k])) }
  const createEntry = (key) => {
    const map = section.map
    const fresh = blank(Object.values(content[map])[0])
    if (map === 'THESIS') fresh.year = Object.keys(content.PROJECTS).slice(-1)[0] || ''
    if (map === 'PROJECTS') fresh.accent = 'cyan'
    setContent((c) => ({ ...c, [map]: { ...c[map], [key]: fresh } }))
    setEntry(key)
  }
  const removeEntry = () => {
    if (!confirm(`ลบ "${entryLabel(entry)}" ทั้งหน้า? (ยังกู้คืนได้จากประวัติหลังบันทึก)`)) return
    setContent((c) => { const { [entry]: _, ...rest } = c[section.map]; return { ...c, [section.map]: rest } })
    setEntry('')
  }
  const entryLabel = (k) => (section?.map === 'THESIS' ? content.THESIS[k]?.title || k : `Projects ${k}`)
  const viewPath = !section ? '/' : typeof section.view === 'function' ? (entry ? section.view(entry) : '/') : section.view

  // Thesis จัดกลุ่มตามปี
  const thesisByYear = useMemo(() => {
    const g = {}
    for (const [k, t] of Object.entries(content.THESIS)) (g[t.year || 'ไม่ระบุปี'] ||= []).push(k)
    return Object.entries(g).sort(([a], [b]) => a.localeCompare(b))
  }, [content.THESIS])

  if (!me) return <p className="admin-loading">กำลังโหลด…</p>
  if (!me.admin) return <Login configured={me.configured} storage={me.storage} unreachable={me.unreachable} onDone={checkMe} />

  const crumbs = sid === 'home' ? ['ภาพรวม'] : [CATEGORIES.find((c) => c.items.includes(sid))?.label, section.label, section.map && entry ? (section.map === 'THESIS' ? content.THESIS[entry]?.year : null) : null].filter(Boolean)

  return (
    <div className="ad-root ad-shell">
      <header className="ad-top">
        <button className="ad-menu" aria-expanded={navOpen} aria-controls="ad-side" onClick={() => setNavOpen((o) => !o)}>☰<span className="sr"> เมนู</span></button>
        <a className="ad-brand" href="/admin?s=home" onClick={(e) => { e.preventDefault(); go('home') }}>
          <Logo className="ad-brand-mark" /><span>Studio 7 <em>Admin</em></span>
        </a>
        <span className={`ad-state ${dirty ? 'dirty' : ''}`} aria-live="polite">{dirty ? '● ยังไม่บันทึก' : saved ? '✓ บันทึกล่าสุดแล้ว' : ''}</span>
        <div className="ad-actions">
          <button className="ad-btn ad-ghost" onClick={() => navigate(viewPath)} title="ดูหน้าเว็บพร้อมการแก้ไข (ยังไม่บันทึกก็ดูได้)">ดูหน้าเว็บ ↗</button>
          <button className="ad-btn ad-ghost" onClick={() => setShowHistory(true)}>ประวัติ</button>
          <button className="ad-btn ad-primary" disabled={!dirty || saving} onClick={save}>{saving ? 'กำลังบันทึก…' : 'บันทึก'}</button>
          <button className="ad-btn ad-ghost ad-logout" onClick={logout}>ออกจากระบบ</button>
        </div>
      </header>

      <div className="ad-body">
        {navOpen && <div className="ad-scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />}
        <nav id="ad-side" className={`ad-side ${navOpen ? 'open' : ''}`} aria-label="ส่วนของเว็บ">
          <button className={`ad-side-item ${sid === 'home' ? 'on' : ''}`} onClick={() => go('home')}><i aria-hidden="true">⌂</i>ภาพรวม</button>
          {CATEGORIES.map((cat) => (
            <div className="ad-cat" key={cat.id}>
              <p className="ad-cat-label">{cat.label}</p>
              {cat.items.map((id) => {
                const s = sectionById(id)
                const active = id === sid
                return (
                  <div key={id}>
                    <button className={`ad-side-item ${active ? 'on' : ''}`} onClick={() => go(id)}>
                      <i aria-hidden="true">{s.icon}</i>{s.label}
                      {s.map && <span className="ad-side-n">{Object.keys(content[s.map]).length}</span>}
                    </button>
                    {active && s.map === 'PROJECTS' && (
                      <div className="ad-sub">
                        {entries.map((k) => <button key={k} className={`ad-sub-item ${k === entry ? 'on' : ''}`} onClick={() => { setEntry(k); setNavOpen(false); scrollTo(0, 0) }}>Projects {k}</button>)}
                        <NewEntry map="PROJECTS" existing={entries} onCreate={createEntry} />
                      </div>
                    )}
                    {active && s.map === 'THESIS' && (
                      <div className="ad-sub">
                        {thesisByYear.map(([y, keys]) => (
                          <div key={y} className="ad-sub-group">
                            <p className="ad-sub-year">{y}</p>
                            {keys.map((k) => (
                              <button key={k} className={`ad-sub-item ${k === entry ? 'on' : ''}`} onClick={() => { setEntry(k); setNavOpen(false); scrollTo(0, 0) }}>
                                <span>{content.THESIS[k].title || k}</span>
                                <small>{content.THESIS[k].by}</small>
                              </button>
                            ))}
                          </div>
                        ))}
                        <NewEntry map="THESIS" existing={entries} onCreate={createEntry} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
          <button className="ad-side-item ad-side-logout" onClick={logout}><i aria-hidden="true">⎋</i>ออกจากระบบ</button>
        </nav>

        <main className="ad-main">
          <div className="ad-page">
            {(status || error) && <div className={`ad-banner ${error ? 'err' : ''}`} role="status">{error || status}<button onClick={() => { setStatus(''); setError('') }} aria-label="ปิด">×</button></div>}

            {sid === 'home' ? (
              <Overview content={content} go={go} onHistory={() => setShowHistory(true)} />
            ) : (
              <>
                <header className="ad-page-head">
                  <p className="ad-crumbs">{crumbs.map((c, i) => <span key={i}>{c}</span>)}</p>
                  <div className="ad-page-title">
                    <h1>{section.map ? (entry ? entryLabel(entry) : section.label) : section.label}</h1>
                    <div className="ad-row">
                      <a className="ad-btn ad-ghost ad-small" href={viewPath} onClick={(e) => { e.preventDefault(); navigate(viewPath) }}>เปิดหน้านี้บนเว็บ ↗</a>
                      {section.map && entry && <button className="ad-btn ad-danger ad-small" onClick={removeEntry}>ลบหน้านี้</button>}
                    </div>
                  </div>
                  <p className="ad-page-desc">
                    {section.map && entry && section.map === 'THESIS' ? <>{content.THESIS[entry]?.by} · ลิงก์ <code>{viewPath}</code></> : section.desc}
                  </p>
                </header>

                {section.keys && section.keys.length > 2 && (
                  <nav className="ad-jump" aria-label="ไปยังหัวข้อ">
                    {section.keys.map((k) => <button key={k} className="ad-chip" onClick={() => setFocusKey(k)}>{KEY_TITLES[k] || k}</button>)}
                  </nav>
                )}

                {section.map
                  ? (entry && content[section.map][entry]
                    ? <GroupedEntry map={section.map} value={content[section.map][entry]} all={content[section.map]} onChange={setEntryValue} />
                    : <p className="ad-empty">เลือกรายการจากเมนูด้านซ้าย หรือกด “＋ เพิ่ม” เพื่อสร้างใหม่</p>)
                  : section.keys.map((k, i) => (
                    <Panel key={k} id={`ad-k-${k}`} title={KEY_TITLES[k] || k} desc={KEY_DESC[k]} count={countOf(content[k])}
                      changed={JSON.stringify(content[k]) !== JSON.stringify(DEFAULT_CONTENT[k])} onReset={() => resetKey(k)}
                      defaultOpen={section.keys.length <= 2 || i === 0}>
                      <Field top k={k} value={content[k]} onChange={(v) => setKey(k, v)} />
                    </Panel>
                  ))}
              </>
            )}
          </div>
        </main>
      </div>

      {dirty && (
        <div className="ad-savebar" role="region" aria-label="การแก้ไขที่ยังไม่บันทึก">
          <span><b>มีการแก้ไขที่ยังไม่บันทึก</b> · กด “ดูหน้าเว็บ” เพื่อตรวจก่อนได้</span>
          <div className="ad-row">
            <button className="ad-btn ad-ghost ad-small" onClick={discard}>ยกเลิกการแก้ไข</button>
            <button className="ad-btn ad-primary ad-small" disabled={saving} onClick={save}>{saving ? 'กำลังบันทึก…' : 'บันทึก (Ctrl+S)'}</button>
          </div>
        </div>
      )}

      {showHistory && <History onRestore={restore} onClose={() => setShowHistory(false)} />}
    </div>
  )
}
