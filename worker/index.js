// Cloudflare Worker: เสิร์ฟเว็บ + API สำหรับ dashboard admin
// - เนื้อหาเก็บใน KV (binding SITE) คีย์ "content" และประวัติย้อนหลัง "history:<เวลา>"
// - รูปที่อัปโหลดเก็บใน KV คีย์ "media:<id>" เสิร์ฟที่ /media/<id>
// - ล็อกอินด้วยรหัสผ่านใน secret ADMIN_PASSWORD (ตั้งใน Cloudflare → Worker → Settings → Variables and Secrets)
import { mergeContent, CONTENT_KEYS } from '../src/data/index.js'
import { parsePath, allPaths } from '../src/routes.js'
import { metaFor } from '../src/meta.js'

const COOKIE = 's7_admin'
const UI_COOKIE = 's7_admin_ui'
const SESSION_DAYS = 7
const HISTORY_KEEP = 30
const MAX_UPLOAD = 10 * 1024 * 1024
const MAX_CONTENT = 5 * 1024 * 1024

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } })

// อ่านรหัสผ่าน admin — ยอมรับชื่อที่พิมพ์ต่างเล็กน้อย เช่น admin_password, "ADMIN_PASSWORD " , ADMIN-PASSWORD
function adminPassword(env) {
  if (typeof env.ADMIN_PASSWORD === 'string' && env.ADMIN_PASSWORD.trim()) return env.ADMIN_PASSWORD.trim()
  for (const [k, v] of Object.entries(env)) {
    if (typeof v === 'string' && /^admin[\s_-]*password$/i.test(k.trim()) && v.trim()) return v.trim()
  }
  return ''
}

// ---------- session ----------
const enc = new TextEncoder()
async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode('s7:' + secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg))
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' })[c])
}
function safeEqual(a, b) {
  const x = enc.encode(a), y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0)
  return diff === 0
}
function readCookie(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return m ? m[1] : null
}
async function isAdmin(req, env) {
  if (!adminPassword(env)) return false
  const tok = readCookie(req, COOKIE)
  if (!tok) return false
  const [exp, sig] = tok.split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  return safeEqual(sig, await hmac(adminPassword(env), exp))
}
function sessionCookies(value, maxAge) {
  const h = new Headers()
  h.append('set-cookie', `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`)
  h.append('set-cookie', `${UI_COOKIE}=${maxAge ? 1 : ''}; Path=/; Secure; SameSite=Strict; Max-Age=${maxAge}`)
  return h
}

// ---------- content ----------
async function getStored(env) {
  return env.SITE.get('content', { type: 'json' })
}
async function saveContent(env, data, note) {
  const at = new Date().toISOString()
  const body = JSON.stringify(data)
  await env.SITE.put('content', body)
  await env.SITE.put(`history:${at}`, body, { metadata: { at, note: note || '', size: body.length } })
  const { keys } = await env.SITE.list({ prefix: 'history:' })
  const old = keys.map((k) => k.name).sort().slice(0, Math.max(0, keys.length - HISTORY_KEEP))
  await Promise.all(old.map((k) => env.SITE.delete(k)))
  return at
}
function validContent(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'ข้อมูลต้องเป็น object'
  for (const k of Object.keys(data)) if (!CONTENT_KEYS.includes(k)) return `ไม่รู้จักหัวข้อ "${k}"`
  return null
}

// ---------- HTML ----------
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

async function renderPage(req, env, url) {
  const stored = await getStored(env)
  const content = mergeContent(stored)
  const route = parsePath(url.pathname, content)
  const meta = metaFor(route, content)
  const shell = await env.ASSETS.fetch(new Request(new URL('/', url), req))
  const abs = (p) => (p ? new URL(p, url.origin).href : '')
  const tags = [
    `<meta name="description" content="${esc(meta.description)}">`,
    `<link rel="canonical" href="${esc(url.origin + (url.pathname === '/events' ? '/' : url.pathname))}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Resilient Architecture by Studio 7">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(url.href)}">`,
    meta.image ? `<meta property="og:image" content="${esc(abs(meta.image))}">` : '',
    `<meta name="twitter:card" content="summary_large_image">`,
    meta.noindex ? `<meta name="robots" content="noindex">` : '',
    stored ? `<script id="site-content" type="application/json">${JSON.stringify(stored).replace(/</g, '\\u003c')}</script>` : '',
  ].join('')
  const res = new HTMLRewriter()
    .on('title', { element: (el) => el.setInnerContent(meta.title) })
    .on('meta[name="description"]', { element: (el) => el.remove() })
    .on('head', { element: (el) => el.append(tags, { html: true }) })
    .transform(shell)
  const headers = new Headers(res.headers)
  headers.set('cache-control', 'no-cache')
  if (meta.noindex) headers.set('x-robots-tag', 'noindex')
  return new Response(res.body, { status: route.page === 'notfound' ? 404 : 200, headers })
}

// ---------- router ----------
export default {
  async fetch(req, env) {
    const url = new URL(req.url)
    const { pathname } = url
    const method = req.method

    if (pathname.startsWith('/api/')) {
      // กันการเรียกข้ามเว็บ: คำขอที่แก้ข้อมูลต้องมาจากโดเมนเดียวกัน
      if (method !== 'GET' && req.headers.get('origin') && req.headers.get('origin') !== url.origin) {
        return json({ error: 'คำขอไม่ได้มาจากเว็บนี้' }, 403)
      }

      if (pathname === '/api/login' && method === 'POST') {
        if (!adminPassword(env)) return json({ error: 'ยังไม่ได้ตั้งรหัสผ่าน admin (ADMIN_PASSWORD) ใน Cloudflare' }, 503)
        const { password } = await req.json().catch(() => ({}))
        if (typeof password !== 'string' || !safeEqual(password.trim(), adminPassword(env))) {
          await new Promise((r) => setTimeout(r, 800))
          return json({ error: 'รหัสผ่านไม่ถูกต้อง' }, 401)
        }
        const exp = String(Date.now() + SESSION_DAYS * 864e5)
        const tok = `${exp}.${await hmac(adminPassword(env), exp)}`
        const h = sessionCookies(tok, SESSION_DAYS * 86400)
        h.set('content-type', 'application/json')
        h.set('cache-control', 'no-store')
        return new Response('{"ok":true}', { headers: h })
      }
      if (pathname === '/api/logout' && method === 'POST') {
        const h = sessionCookies('', 0); h.set('content-type', 'application/json')
        return new Response('{"ok":true}', { headers: h })
      }
      if (pathname === '/api/me') {
        // สถานะระบบสำหรับหน้าล็อกอิน (บอกแค่ว่ามี/ไม่มี ไม่เปิดเผยค่าจริง)
        return json({ admin: await isAdmin(req, env), configured: !!adminPassword(env), storage: !!env.SITE })
      }
      if (!env.SITE) return json({ error: 'ยังไม่มีที่เก็บข้อมูล (KV binding SITE) — ดูวิธีแก้ใน README' }, 503)
      if (pathname === '/api/content' && method === 'GET') return json(mergeContent(await getStored(env)))

      // ---- ต้องล็อกอิน ----
      if (!(await isAdmin(req, env))) return json({ error: 'กรุณาเข้าสู่ระบบใหม่' }, 401)

      if (pathname === '/api/content' && method === 'PUT') {
        const text = await req.text()
        if (text.length > MAX_CONTENT) return json({ error: 'ข้อมูลใหญ่เกินไป' }, 413)
        let data
        try { data = JSON.parse(text) } catch { return json({ error: 'ข้อมูลไม่ใช่ JSON' }, 400) }
        const err = validContent(data.content)
        if (err) return json({ error: err }, 400)
        const at = await saveContent(env, data.content, data.note)
        return json({ ok: true, at })
      }
      if (pathname === '/api/history' && method === 'GET') {
        const { keys } = await env.SITE.list({ prefix: 'history:' })
        return json(keys.map((k) => ({ key: k.name, ...(k.metadata || {}) })).sort((a, b) => (a.key < b.key ? 1 : -1)))
      }
      if (pathname === '/api/history/restore' && method === 'POST') {
        const { key } = await req.json().catch(() => ({}))
        if (!/^history:/.test(key || '')) return json({ error: 'ไม่พบเวอร์ชันนี้' }, 400)
        const data = await env.SITE.get(key, { type: 'json' })
        if (!data) return json({ error: 'ไม่พบเวอร์ชันนี้' }, 404)
        const at = await saveContent(env, data, `กู้คืนจาก ${key.slice(8)}`)
        return json({ ok: true, at, content: mergeContent(data) })
      }
      if (pathname === '/api/upload' && method === 'POST') {
        const type = req.headers.get('content-type') || ''
        const ext = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif' }[type]
        if (!ext) return json({ error: 'รองรับเฉพาะไฟล์รูป JPG, PNG, WebP หรือ GIF' }, 415)
        const buf = await req.arrayBuffer()
        if (buf.byteLength > MAX_UPLOAD) return json({ error: 'รูปใหญ่เกิน 10 MB' }, 413)
        // ?thumb=<id ของรูปเต็ม> = อัปโหลดรูปย่อของรูปนั้น เก็บเป็น <ชื่อ>-sm.<นามสกุล>
        const thumbOf = url.searchParams.get('thumb')
        let id
        if (thumbOf) {
          if (!/^[a-z0-9]+-[a-z0-9]{8}\.(webp|jpg|png|gif)$/.test(thumbOf)) return json({ error: 'รหัสรูปไม่ถูกต้อง' }, 400)
          if (ext !== 'webp') return json({ error: 'รูปย่อต้องเป็น WebP' }, 415)
          id = thumbOf.replace(/\.(\w+)$/, '-sm.webp')
        } else {
          id = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${ext}`
        }
        await env.SITE.put(`media:${id}`, buf, { metadata: { type, size: buf.byteLength, at: new Date().toISOString() } })
        return json({ ok: true, id, url: `/media/${id}`, size: buf.byteLength })
      }
      return json({ error: 'ไม่พบ API นี้' }, 404)
    }

    if (pathname.startsWith('/media/')) {
      const id = pathname.slice(7)
      if (!env.SITE || !/^[a-z0-9-]+\.(webp|jpg|png|gif)$/.test(id)) return new Response('Not found', { status: 404 })
      let hit = await env.SITE.getWithMetadata(`media:${id}`, { type: 'arrayBuffer', cacheTtl: 86400 })
      // รูปที่อัปโหลดก่อนมีระบบรูปย่อ: ขอ -sm แล้วไม่มี → ส่งรูปเต็มแทน
      if (!hit.value && /-sm\.\w+$/.test(id)) {
        const base = id.replace(/-sm(\.\w+)$/, '')
        const { keys } = await env.SITE.list({ prefix: `media:${base}.` })
        if (keys[0]) hit = await env.SITE.getWithMetadata(keys[0].name, { type: 'arrayBuffer', cacheTtl: 86400 })
      }
      if (!hit.value) return new Response('Not found', { status: 404 })
      return new Response(hit.value, { headers: { 'content-type': hit.metadata?.type || 'application/octet-stream', 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff' } })
    }

    if (pathname === '/sitemap.xml') {
      const content = mergeContent(env.SITE ? await getStored(env) : null)
      const urls = allPaths(content).map((p) => `<url><loc>${url.origin}${p}</loc></url>`).join('')
      return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'content-type': 'application/xml' } })
    }

    // ไฟล์จริง (js/css/รูป) ส่งต่อให้ static assets; หน้าเว็บทุกหน้าใส่ meta + เนื้อหาล่าสุด
    const accept = req.headers.get('accept') || ''
    if (method === 'GET' && accept.includes('text/html') && !/\.[a-z0-9]+$/i.test(pathname)) {
      if (!env.SITE) return env.ASSETS.fetch(req)
      return renderPage(req, env, url)
    }
    return env.ASSETS.fetch(req)
  },
}
