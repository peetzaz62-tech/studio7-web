# Resilient Architecture by Studio 7

เว็บไซต์ของ Resilient Architecture by Studio 7 (Faculty of Architecture, RMUTT)
React + Vite + Cloudflare Worker — https://rmuttstudio7-web.peetzaz.workers.dev

ย้ายบัญชี GitHub/Cloudflare: ดู [MIGRATION.md](MIGRATION.md)

## หน้าในเว็บ
| ลิงก์ | หน้า |
|---|---|
| `/` | Events (หน้าแรก) |
| `/about-us` | About us |
| `/projects/2024` … `/projects/2027` | Projects แต่ละปี |
| `/thesis/p1-2024`, `/thesis/tinn` ฯลฯ | รายละเอียด Thesis |
| `/submission`, `/alumni`, `/download` | หน้าอื่น ๆ |
| `/admin` | **Dashboard แก้ไขเว็บ (เฉพาะ admin)** |

ลิงก์แบบเก่า (`/#thesis-tinn`) จะพาไปลิงก์ใหม่ให้อัตโนมัติ

## Dashboard (/admin)
- ล็อกอินด้วยรหัสผ่านเดียว ตั้งเป็น secret ชื่อ `ADMIN_PASSWORD` ใน Cloudflare:
  Workers & Pages → rmuttstudio7-web → Settings → Variables and Secrets → Add → Type: **Secret**
- แก้ได้ทุกส่วน: ข้อความ, วันที่, สีป้าย, ลิงก์, รูป (อัปโหลดได้ ระบบย่อเป็น WebP ให้), เพิ่ม/ลบ/เรียงรายการ, เพิ่มหน้า Thesis หรือ Projects ปีใหม่
- กด **ดูหน้าเว็บ** เพื่อดูตัวอย่างก่อนบันทึก (เห็นเฉพาะเครื่องตัวเอง) → **บันทึก** (หรือ Ctrl+S) แล้วทุกคนเห็นภายใน 1 นาที
- **ประวัติ**: เก็บ 30 เวอร์ชันล่าสุด กู้คืนได้
- เมื่อล็อกอินอยู่ ทุกหน้ามีปุ่ม **✎ แก้ไขหน้านี้** มุมขวาล่าง

## เก็บข้อมูลอย่างไร
- ค่าเริ่มต้นอยู่ในโค้ด `src/data/*.js`
- สิ่งที่แก้จาก dashboard เก็บใน Cloudflare KV (binding `SITE`) — ทับค่าเริ่มต้นเป็นรายหัวข้อ
  ถ้าแก้ `src/data` ในโค้ด แต่หัวข้อนั้นเคยถูกแก้จาก dashboard แล้ว ค่าใน KV จะชนะ (กด "คืนค่าเริ่มต้น" ใน dashboard เพื่อใช้ค่าจากโค้ด)
- รูปที่อัปโหลดเก็บใน KV เสิร์ฟที่ `/media/...`; รูปเดิมอยู่ใน `public/img/` (WebP 2 ขนาด: เต็ม และ `-sm`)

## พัฒนาในเครื่อง
```bash
npm install
cp .dev.vars.example .dev.vars   # ใส่รหัสผ่านทดสอบ
npm run dev:worker               # build แล้วรัน Worker + KV จำลองที่ http://localhost:8787
npm run dev                      # (เฉพาะหน้าเว็บ ไม่มี dashboard) http://localhost:5173
```

## Deploy
Cloudflare Workers Builds: ทุกครั้งที่ push ขึ้น `main` จะรัน `npm run build` แล้ว `npx wrangler deploy`
KV ถูกสร้างอัตโนมัติตอน deploy ครั้งแรก (ไม่ต้องใส่ id ใน `wrangler.jsonc`)
