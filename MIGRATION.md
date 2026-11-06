# ย้ายบัญชี GitHub + Cloudflare

ข้อมูลที่ต้องย้ายมี 2 ชุด:

| ข้อมูล | อยู่ที่ไหน | วิธีย้าย |
|---|---|---|
| โค้ดเว็บ, ข้อความและรูปเริ่มต้นทั้งหมด | GitHub repo `studio7-web` | โอน repo (ขั้นที่ 2) |
| สิ่งที่แก้ใน dashboard, รูปที่อัปโหลด, ประวัติ | KV ในบัญชี Cloudflare เดิม | ไฟล์สำรอง (ขั้นที่ 1 และ 5) |
| รหัสผ่าน admin (`ADMIN_PASSWORD`) | Secret ในบัญชี Cloudflare เดิม | ตั้งใหม่ในบัญชีใหม่ (ขั้นที่ 4) |

> ให้ทำตามลำดับ และ **อย่าลบอะไรในบัญชีเดิม** จนกว่าจะเสร็จขั้นที่ 6

## 1. สำรองข้อมูลจากเว็บเดิม
1. เข้า `https://rmuttstudio7-web.peetzaz.workers.dev/admin` แล้วล็อกอิน
2. กด **ประวัติ · สำรอง** → **↓ ดาวน์โหลดไฟล์สำรอง**
3. เก็บไฟล์ `studio7-backup-YYYY-MM-DD.json` ไว้ในเครื่อง
4. หลังจากนี้อย่าแก้เนื้อหาในเว็บเดิมอีก ถ้าแก้ไปแล้ว ให้ดาวน์โหลดไฟล์สำรองใหม่

## 2. ย้าย GitHub repo
**กรณีบัญชีใหม่เป็นของคุณเอง (แนะนำ)**
1. ที่ repo เดิม ไปที่ Settings → General → Danger Zone → **Transfer ownership**
2. ใส่ชื่อบัญชีใหม่ แล้วรับคำเชิญในบัญชีใหม่
3. ประวัติ commit และ branch จะย้ายไปครบ และลิงก์เดิมจะ redirect ไปที่ใหม่ให้อัตโนมัติ

**กรณีโอนไม่ได้:** สร้าง repo ว่างชื่อ `studio7-web` ในบัญชีใหม่ แล้ว push โค้ดขึ้นไป (ให้ Claude ทำให้ได้ ถ้าบัญชีใหม่เชื่อมกับ Claude แล้ว)

**หลังย้าย**
- ติดตั้ง Claude GitHub App ในบัญชีใหม่ ที่ claude.ai → Settings → Connectors → GitHub และให้สิทธิ์เข้าถึง repo `studio7-web`
- session ต่อไปของ Claude จะได้ใช้ repo ใหม่ได้

## 3. สร้าง Worker ในบัญชี Cloudflare ใหม่
1. ไปที่ Workers & Pages → **Create** → **Import a repository**
2. เชื่อม GitHub บัญชีใหม่ แล้วเลือก repo `studio7-web`
3. ตั้งค่าดังนี้:
   - Project name: `rmuttstudio7-web` (ต้องตรงกับ `name` ใน `wrangler.jsonc` ถ้าเปลี่ยนชื่อ ต้องแก้ไฟล์นั้นด้วย)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Production branch: `main`
4. กด **Deploy** แล้ว Cloudflare จะสร้าง KV (`SITE`) ให้อัตโนมัติ
5. ลิงก์ใหม่จะเป็น `rmuttstudio7-web.<ชื่อบัญชีใหม่>.workers.dev`

## 4. ตั้งรหัสผ่าน admin
1. ไปที่ Worker → Settings → **Variables and Secrets** (ส่วน Runtime **ไม่ใช่** Build)
2. กด **Add** แล้วตั้งค่า:
   - Type: **Secret**
   - Name: `ADMIN_PASSWORD`
   - Value: รหัสผ่าน
3. กด **Deploy**
4. เปิด `/admin` ในเว็บใหม่ ต้องเห็นว่ารหัสผ่าน ✓ และที่เก็บข้อมูล ✓

## 5. นำเข้าข้อมูลที่เว็บใหม่
1. ล็อกอิน `/admin` ในเว็บใหม่
2. กด **ประวัติ · สำรอง** → **↑ นำเข้าไฟล์สำรอง** แล้วเลือกไฟล์จากขั้นที่ 1
3. ระบบจะแจ้งจำนวนรูปและเวอร์ชันประวัติที่นำเข้า
4. เปิดหน้าเว็บที่เคยแก้ และหน้าที่มีรูปอัปโหลด เพื่อตรวจว่าแสดงครบ

## 6. ปิดของเก่า (หลังตรวจเว็บใหม่เรียบร้อยแล้ว)
- **Cloudflare เดิม:**
  - ลบ Worker `rmuttstudio7-web`
  - ลบ KV namespace ที่ชื่อขึ้นต้นด้วย `rmuttstudio7-web`
  - ลิงก์ `…peetzaz.workers.dev` จะใช้ไม่ได้อีก ต้องแจ้งลิงก์ใหม่ให้ทุกคน
- แก้ลิงก์ในไฟล์ `README.md` และ `CLAUDE.md` ให้เป็นลิงก์ใหม่
- ถ้าจะผูกโดเมนของตัวเอง ทำได้ที่ Worker → Settings → Domains & Routes เมื่อย้ายบัญชีครั้งต่อไป ลิงก์จะได้ไม่เปลี่ยน
