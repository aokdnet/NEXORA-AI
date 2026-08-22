# NEXORA ยามอุบากอง AI 🔮✨

NEXORA เป็นแพลตฟอร์ม Web Application สายมูเตลู (Astrology Tech) ที่ผสมผสานภูมิปัญญาโบราณอย่าง "ยามอุบากอง" เข้ากับเทคโนโลยีปัญญาประดิษฐ์ (AI) ที่ล้ำสมัย เพื่อให้คำแนะนำเรื่องฤกษ์ยาม การเดินทาง และความสำเร็จในชีวิตประจำวัน

## 🌟 ฟีเจอร์หลัก (Core Features)

1. **Dashboard อัจฉริยะแบบ Real-time:** แสดงยามอุบากอง ณ เวลาปัจจุบัน พร้อมไฮไลท์ช่วงเวลาที่ดีที่สุดในแต่ละวัน
2. **AI Birth Profile (ผูกดวงด้วย AI):** นำวันเดือนปีและเวลาเกิดมาให้ AI ประมวลผลและสร้างโปรไฟล์คะแนนความมงคล
3. **AI Palm Reading (วิเคราะห์ลายมือ):** อัปโหลดรูปฝ่ามือ เพื่อให้ Vision AI วิเคราะห์เส้นชีวิต สมอง หัวใจ และวาสนา
4. **AI Assistant Chat:** แชทบอทให้คำปรึกษาเรื่องฤกษ์ยามและแนะนำเวลาออกเดินทางแบบเฉพาะเจาะจง
5. **AI Auspicious Calendar:** ปฏิทินแสดงภาพรวมวันมงคลทั้งเดือน พร้อมซิงก์เข้า Google Calendar
6. **Progressive Web App (PWA):** รองรับการกด Add to Home Screen เพื่อใช้งานเหมือนแอปพลิเคชันบนมือถือโดยไม่ต้องผ่าน App Store

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** Next.js (App Router), React, CSS Modules (Glassmorphism UI)
- **Backend (API):** Next.js Route Handlers
- **AI Integration:** OpenAI API (GPT-4o & Vision Model)
- **PWA:** Service Worker & Web Manifest

## 🚀 การติดตั้งและเรียกใช้งาน (Getting Started)

1. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

2. **ตั้งค่า Environment Variables:**
   สร้างไฟล์ `.env.local` ในโฟลเดอร์ root ของโปรเจกต์ และใส่ API Key ของ OpenAI:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```
   *(หากไม่มี API Key ระบบจะทำงานในโหมด Mockup อัตโนมัติ ป้องกันไม่ให้แอปแครช)*

3. **รันเซิร์ฟเวอร์จำลอง (Development):**
   ```bash
   npm run dev
   ```
   จากนั้นเปิดเว็บบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 🌐 การนำขึ้นระบบจริง (Deployment)

โปรเจกต์นี้รองรับการ Deploy ทั้งบน Vercel และ **Railway.app** (แนะนำสำหรับ Database)

### ตัวเลือกที่ 1: การ Deploy บน Railway (แนะนำ)
Railway สะดวกมากเพราะมี Database (PostgreSQL) ให้ในตัวเลย:
1. นำโค้ดโปรเจกต์นี้อัปโหลดขึ้น **GitHub Repository**
2. สมัครและเข้าสู่ระบบ [Railway.app](https://railway.app/)
3. กด **New Project** > เลือก **Deploy from GitHub repo**
4. เลือก Repository ของโปรเจกต์ NEXORA
5. (กด Add > Database > Add PostgreSQL เพื่อสร้างฐานข้อมูล)
6. ไปที่แท็บ **Variables** ในโปรเจกต์หลัก และเพิ่มตัวแปร (Environment Variables) ดังนี้:
   - `OPENAI_API_KEY` = (คีย์ของคุณ)
   - `STRIPE_SECRET_KEY` = (คีย์ Stripe ของคุณ)
   - `DATABASE_URL` = (Copy มาจากหน้าจอตั้งค่า PostgreSQL ใน Railway)
   - `NEXTAUTH_SECRET` = (สุ่มตัวอักษรอะไรก็ได้ เช่น `my-super-secret-key-123`)
   - `NEXTAUTH_URL` = (URL ของเว็บคุณหลังจากได้โดเมนจาก Railway)
7. รอจนระบบ Build เสร็จ (Railway จะทำการรัน `prisma generate` และ `next build` ให้อัตโนมัติ)
8. **เสร็จสิ้น!** คุณจะได้ลิงก์โดเมนที่เปิดใช้งานได้จริง

### ตัวเลือกที่ 2: การ Deploy บน Vercel
1. สมัครและเข้าสู่ระบบ [Vercel.com](https://vercel.com)
2. กด `Add New...` > `Project` และเลือก GitHub Repository ของคุณ
3. ในขั้นตอน Configure Project ให้ใส่ **Environment Variables** (แบบเดียวกับข้อ 6 ด้านบน)
4. กด Deploy!

---
**Developed by:** Narong Preedarat
