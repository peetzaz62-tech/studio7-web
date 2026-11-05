import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContentState } from '../content.jsx'
import { DEFAULT_CONTENT, CONTENT_KEYS, mergeContent } from '../data/index.js'
import { navigate } from '../router.js'
import { imgUrl } from '../media.js'
import { Field } from './Editor.jsx'
import { SECTIONS, KEY_TITLES, blank } from './schema.js'
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

function Login({ onDone, configured }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    try { await api('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) }); onDone() } catch (x) { setErr(x.message) } finally { setBusy(false) }
  }
  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={submit}>
        <img src={imgUrl('logo-7.png')} alt="" className="ad-login-logo" />
        <h1>Studio 7 Admin</h1>
        <p>เข้าสู่ระบบเพื่อแก้ไขเนื้อหาเว็บไซต์</p>
        {!configured && (
          <p className="ad-warn">Worker ยังไม่เห็นรหัสผ่าน admin — ใน Cloudflare → rmuttstudio7-web → Settings → Variables and Secrets เพิ่มชื่อ <code>ADMIN_PASSWORD</code> เลือก Type เป็น <b>Secret</b> แล้วกด <b>Deploy</b></p>
        )}
        <label htmlFor="ad-pw">รหัสผ่าน</label>
        <input id="ad-pw" type="password" autoComplete="current-password" className="ad-input" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        {err && <p className="ad-err" role="alert">{err}</p>}
        <button className="ad-btn ad-primary" disabled={busy || !pw}>{busy ? 'กำลังตรวจสอบ…' : 'เข้าสู่ระบบ'}</button>
        <a className="ad-back" href="/">← กลับไปหน้าเว็บ</a>
      </form>
    </div>
  )
}

function History({ onRestore, onClose }) {
  const [list, setList] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => { api('/api/history').then(setList).catch((x) => setErr(x.message)) }, [])
  return (
    <div className="ad-modal" role="dialog" aria-modal="true" aria-labelledby="ad-hist-title" onClick={onClose}>
      <div className="ad-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-head">
          <h2 id="ad-hist-title">ประวัติการบันทึก</h2>
          <button className="ad-btn ad-ghost" onClick={onClose}>ปิด</button>
        </div>
        <p className="ad-hint">เก็บ 30 ครั้งล่าสุด กู้คืนแล้วเว็บจะกลับเป็นเวอร์ชันนั้นทันที (การกู้คืนก็ถูกบันทึกเป็นประวัติด้วย ย้อนกลับได้)</p>
        {err && <p className="ad-err">{err}</p>}
        {!list && !err && <p>กำลังโหลด…</p>}
        {list && !list.length && <p>ยังไม่มีประวัติ — ระบบจะเริ่มเก็บเมื่อบันทึกครั้งแรก</p>}
        <ul className="ad-history">
          {list?.map((h) => (
            <li key={h.key}>
              <span><strong>{fmtTime(h.at || h.key.slice(8))}</strong>{h.note && <em> · {h.note}</em>}</span>
              <button className="ad-btn" onClick={() => onRestore(h.key)}>กู้คืน</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function NewEntry({ section, existing, onCreate }) {
  const [v, setV] = useState('')
  const isYear = section.map === 'PROJECTS'
  const ok = isYear ? /^\d{4}$/.test(v) : /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)
  const taken = existing.includes(v)
  return (
    <form className="ad-new" onSubmit={(e) => { e.preventDefault(); if (ok && !taken) { onCreate(v); setV('') } }}>
      <input className="ad-input" value={v} onChange={(e) => setV(e.target.value.trim().toLowerCase())} placeholder={isYear ? 'ปี เช่น 2028' : 'ชื่อลิงก์ เช่น p1-2027'} aria-label={isYear ? 'ปีใหม่' : 'ชื่อลิงก์ thesis ใหม่'} />
      <button className="ad-btn" disabled={!ok || taken}>＋ เพิ่ม</button>
      {taken && <small className="ad-err">มีอยู่แล้ว</small>}
      {!isYear && v && !ok && <small className="ad-err">ใช้ a-z, 0-9 และ - เท่านั้น</small>}
    </form>
  )
}

export default function Admin() {
  const { content, setContent, saved, setSaved, dirty } = useContentState()
  const [me, setMe] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const params = new URLSearchParams(location.search)
  const [sid, setSid] = useState(params.get('s') || 'events')
  const [entry, setEntry] = useState(params.get('k') || '')
  const section = SECTIONS.find((s) => s.id === sid) || SECTIONS[0]

  const checkMe = useCallback(() => api('/api/me').then(setMe).catch(() => setMe({ admin: false, configured: true })), [])
  useEffect(() => { checkMe() }, [checkMe])

  // โหลดเนื้อหาล่าสุดจากเซิร์ฟเวอร์ (ถ้ายังไม่มีงานที่แก้ค้างไว้)
  useEffect(() => {
    if (!me?.admin || saved !== null) return
    api('/api/content').then((c) => { setContent(c); setSaved(JSON.stringify(c)) }).catch((x) => setError(x.message))
  }, [me])

  useEffect(() => {
    const p = new URLSearchParams({ s: sid, ...(entry ? { k: entry } : {}) })
    history.replaceState({}, '', `/admin?${p}`)
  }, [sid, entry])

  // เลือกรายการแรกอัตโนมัติสำหรับ Projects/Thesis
  const entries = section.map ? Object.keys(content[section.map] || {}) : []
  useEffect(() => {
    if (section.map && !entries.includes(entry)) setEntry(section.map === 'PROJECTS' ? entries[entries.length - 1] || '' : entries[0] || '')
  }, [sid])

  const save = useCallback(async () => {
    setSaving(true); setError(''); setStatus('')
    try {
      const note = prompt('บันทึกสั้น ๆ ว่าแก้อะไร (ไม่ใส่ก็ได้)', '') ?? null
      if (note === null) { setSaving(false); return }
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

  const restore = async (key) => {
    if (!confirm('กู้คืนเวอร์ชันนี้? การแก้ไขที่ยังไม่บันทึกจะหายไป')) return
    try {
      const r = await api('/api/history/restore', { method: 'POST', body: JSON.stringify({ key }) })
      setContent(r.content); setSaved(JSON.stringify(r.content)); setShowHistory(false)
      setStatus(`กู้คืนแล้ว ${fmtTime(r.at)}`)
    } catch (x) { setError(x.message) }
  }
  const discard = () => {
    if (confirm('ยกเลิกการแก้ไขทั้งหมดที่ยังไม่บันทึก?')) setContent(mergeContent(JSON.parse(saved)))
  }
  const logout = async () => {
    if (dirty && !confirm('ยังมีการแก้ไขที่ไม่ได้บันทึก ออกจากระบบเลยไหม?')) return
    await api('/api/logout', { method: 'POST' }).catch(() => {})
    setSaved(null); setMe({ admin: false, configured: true })
  }

  const setKey = (k, v) => setContent((c) => ({ ...c, [k]: v }))
  const setEntryValue = (v) => setContent((c) => ({ ...c, [section.map]: { ...c[section.map], [entry]: v } }))
  const resetKey = (k) => { if (confirm(`คืนค่า "${KEY_TITLES[k] || k}" กลับเป็นค่าเริ่มต้นจากตอนสร้างเว็บ?`)) setKey(k, structuredClone(DEFAULT_CONTENT[k])) }
  const createEntry = (key) => {
    const map = content[section.map]
    const sample = Object.values(map)[0]
    const fresh = blank(sample)
    if (section.map === 'THESIS') fresh.year = Object.keys(content.PROJECTS).slice(-1)[0] || ''
    if (section.map === 'PROJECTS') fresh.accent = 'cyan'
    setContent((c) => ({ ...c, [section.map]: { ...c[section.map], [key]: fresh } }))
    setEntry(key)
  }
  const removeEntry = () => {
    if (!confirm(`ลบ "${entry}" ทั้งหน้า? (ยังกู้คืนได้จากประวัติหลังบันทึก)`)) return
    setContent((c) => { const { [entry]: _, ...rest } = c[section.map]; return { ...c, [section.map]: rest } })
    setEntry('')
  }
  const entryLabel = (k) => {
    const v = content[section.map]?.[k]
    return section.map === 'THESIS' ? `${v?.title || k}` : `Projects ${k}`
  }
  const viewPath = typeof section.view === 'function' ? (entry ? section.view(entry) : '/') : section.view
  const sortedEntries = useMemo(() => (section.map === 'THESIS'
    ? [...entries].sort((a, b) => (content.THESIS[a].year + a).localeCompare(content.THESIS[b].year + b))
    : entries), [entries.join(), sid])

  if (!me) return <p className="admin-loading">กำลังโหลด…</p>
  if (!me.admin) return <Login configured={me.configured} onDone={checkMe} />

  return (
    <div className="ad-shell">
      <header className="ad-top">
        <button className="ad-btn ad-ghost ad-menu" aria-expanded={navOpen} onClick={() => setNavOpen((o) => !o)}>☰ เมนู</button>
        <strong className="ad-brand">Studio 7 Admin</strong>
        <span className={`ad-state ${dirty ? 'dirty' : ''}`} aria-live="polite">{dirty ? '● ยังไม่บันทึก' : saved ? '✓ บันทึกแล้ว' : ''}</span>
        <div className="ad-actions">
          <button className="ad-btn ad-ghost" onClick={() => navigate(viewPath)} title="ดูหน้าเว็บพร้อมการแก้ไข (ยังไม่บันทึกก็ดูได้)">ดูหน้าเว็บ ↗</button>
          <button className="ad-btn ad-ghost" onClick={() => setShowHistory(true)}>ประวัติ</button>
          {dirty && <button className="ad-btn ad-ghost" onClick={discard}>ยกเลิกการแก้ไข</button>}
          <button className="ad-btn ad-primary" disabled={!dirty || saving} onClick={save}>{saving ? 'กำลังบันทึก…' : 'บันทึก'}</button>
          <button className="ad-btn ad-ghost" onClick={logout}>ออกจากระบบ</button>
        </div>
      </header>

      {(status || error) && <div className={`ad-banner ${error ? 'err' : ''}`} role="status">{error || status}</div>}

      <div className="ad-body">
        <nav className={`ad-side ${navOpen ? 'open' : ''}`} aria-label="ส่วนของเว็บ">
          {SECTIONS.map((s) => (
            <div key={s.id}>
              <button className={`ad-side-item ${s.id === sid ? 'on' : ''}`} onClick={() => { setSid(s.id); if (!s.map) { setEntry(''); setNavOpen(false) } }}>{s.label}</button>
              {s.id === sid && s.map && (
                <div className="ad-sub">
                  {sortedEntries.map((k) => (
                    <button key={k} className={`ad-sub-item ${k === entry ? 'on' : ''}`} onClick={() => { setEntry(k); setNavOpen(false) }}>
                      {section.map === 'THESIS' && <small>{content.THESIS[k]?.year}</small>} {entryLabel(k)}
                    </button>
                  ))}
                  <NewEntry section={s} existing={entries} onCreate={createEntry} />
                </div>
              )}
            </div>
          ))}
        </nav>

        <main className="ad-main">
          <div className="ad-main-head">
            <div>
              <h1>{section.map ? (entry ? entryLabel(entry) : section.label) : section.label}</h1>
              <a className="ad-viewlink" href={viewPath}>{viewPath} ↗</a>
            </div>
            {section.map && entry && <button className="ad-btn ad-danger" onClick={removeEntry}>ลบหน้านี้</button>}
          </div>

          {section.map
            ? (entry && content[section.map][entry]
              ? <Field top k={section.map === 'THESIS' ? 'thesis' : 'project'} value={content[section.map][entry]} onChange={setEntryValue} />
              : <p>เลือกรายการจากเมนูด้านซ้าย หรือเพิ่มใหม่</p>)
            : section.keys.map((k) => (
              <section key={k} className="ad-section">
                <div className="ad-section-head">
                  <h2>{KEY_TITLES[k] || k}</h2>
                  {JSON.stringify(content[k]) !== JSON.stringify(DEFAULT_CONTENT[k]) && (
                    <button className="ad-link" onClick={() => resetKey(k)}>คืนค่าเริ่มต้น</button>
                  )}
                </div>
                <Field top k={k} value={content[k]} onChange={(v) => setKey(k, v)} />
              </section>
            ))}
        </main>
      </div>

      {showHistory && <History onRestore={restore} onClose={() => setShowHistory(false)} />}
    </div>
  )
}
