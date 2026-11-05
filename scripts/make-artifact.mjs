// สร้าง artifact/index.html (CSS + JS ฝังในไฟล์เดียว) จาก dist-artifact/ — ใช้ตอนเผยแพร่บน claude.ai
import fs from 'node:fs'
const dist = new URL('../dist-artifact/', import.meta.url)
const out = new URL('../artifact/', import.meta.url)
let html = fs.readFileSync(new URL('index.html', dist), 'utf8')
const css = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)">/)
const js = html.match(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/)
const cssText = fs.readFileSync(new URL(css[1], dist), 'utf8')
const jsText = fs.readFileSync(new URL(js[1], dist), 'utf8').replace(/<\/script/gi, '<\\/script')
const head = html.match(/<head>([\s\S]*)<\/head>/)[1]
  .replace(css[0], '').replace(js[0], '')
  .replace(/<meta charset[^>]*>\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '')
  .replace(/<link rel="icon"[^>]*>\s*/, '')
const body = html.match(/<body>([\s\S]*)<\/body>/)[1]
const page = `${head.trim()}
<meta name="claude:viewport-fit-sides" content="cover">
<style>${cssText}</style>
${body.trim()}
<script type="module">${jsText}</script>
`
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(new URL('index.html', out), page)
console.log('artifact/index.html', (page.length / 1024).toFixed(0) + ' KB')
