# Resilient Architecture by Studio 7

เว็บไซต์ของ Resilient Architecture by Studio 7 (Faculty of Architecture, RMUTT) ย้ายมาจาก Google Sites
(sites.google.com/view/deresilient) ทำด้วย React + Vite

## หน้าในเว็บ
| ลิงก์ | หน้า |
|---|---|
| `#events` | Events (หน้าแรก) |
| `#about-us` | About us |
| `#projects-2024` … `#projects-2027` | Projects แต่ละปี |
| `#thesis-p1-2024`, `#thesis-tinn` ฯลฯ | รายละเอียด Thesis ของนักศึกษา |
| `#submission` | Submission |
| `#alumni` | Alumni |
| `#download` | Download |

## เริ่มใช้งาน
```bash
npm install
npm run dev          # เปิดดูที่ http://localhost:5173
npm run build        # ได้เว็บพร้อมขึ้นโฮสต์ในโฟลเดอร์ dist/
```

## แก้เนื้อหา (ไม่ต้องแตะโค้ดหน้าเว็บ)
| ไฟล์ | เนื้อหา |
|---|---|
| `src/data/site.js` | เมนู, Events, วิดีโอ, เอกสารอ้างอิง, footer |
| `src/data/about.js` | About us |
| `src/data/projects.js` | Projects แต่ละปี (ผู้เข้าร่วม, workshop, thesis) |
| `src/data/thesis.js` | หน้าย่อย Thesis ของนักศึกษาแต่ละคน |
| `src/data/pages.js` | Submission, Alumni, Download |
| `public/img/` | รูปทั้งหมด |

## ขึ้นเว็บจริงด้วย Cloudflare Pages
1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. เลือก repo นี้
3. ตั้งค่า build:
   - Framework preset: **Vite** (หรือ None)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. กด **Save and Deploy** — ทุกครั้งที่ push ขึ้น `main` Cloudflare จะ build และอัปเดตเว็บให้อัตโนมัติ
5. (ถ้ามีโดเมน) Pages project → **Custom domains** → ใส่โดเมน เช่น `deresilient.com`

## เวอร์ชันพรีวิวบน claude.ai
`npm run build:artifact` สร้าง `artifact/index.html` (ฝัง CSS/JS ในไฟล์เดียว, แสดงวิดีโอเป็นลิงก์แทนการฝัง)
