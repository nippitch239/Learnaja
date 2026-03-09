# 📚 Learnaja — CMS Web Application

## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|---|----|
| Frontend | React 19, Vite, TailwindCSS |
| Backend | Node.js, Express, better-sqlite3 |
| Database | SQLite (ไฟล์ `backend/database/learnaja.db`) |
| Auth | JWT (Access + Refresh Token), bcrypt |

---

## ⚙️ Requirements


- [Node.js](https://nodejs.org/) v18 ขึ้นไป
- Windows (สำหรับ `run.bat`)

---

## 🚀 วิธีรันโปรเจกต์

ให้พิมพ์ `run` ใน command prompt (CMD) **เท่านั้น**

หรือสามารถรันโปรแกรมผ่าน ```.\Learnaja\run.bat```

ระบบจะเปิด 2 หน้าต่าง CMD อัตโนมัติ:
- **Frontend** → ติดตั้ง dependencies และรัน Vite dev server
- **Backend** → ติดตั้ง dependencies และรัน nodemon

---

## 🌐 URL หลังรัน

| บริการ | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3200 |

---

## 📁 โครงสร้างโปรเจกต์

```
Learnaja/
├── run.bat                  ← รันทั้ง frontend + backend
├── frontend/                ← React + Vite
│   ├── src/
│   │   ├── pages/           ← หน้าต่างๆ ของแอป
│   │   ├── components/      ← Component ที่ใช้ซ้ำ
│   │   ├── context/         ← AuthContext
│   │   └── services/        ← API service (axios)
│   └── package.json
├── backend/                 ← Express API Server
│   ├── index.js             ← จุดเริ่มต้น API routes ทั้งหมด
│   ├── database.js          ← SQLite wrapper
│   ├── database/
│   │   └── learnaja.db      ← ไฟล์ฐานข้อมูล SQLite
│   ├── uploads/             ← ไฟล์ที่ upload ขึ้นมา
│   └── .env                 ← Environment variables
└── README.md
```

---

## 👤 บทบาทผู้ใช้ (Roles)

| Role | สิทธิ์ |
|------|--------|
| `admin` | จัดการผู้ใช้, อนุมัติครู, จัดการคอร์สทั้งหมด |
| `teacher` | สร้างและจัดการคอร์สของตัวเอง, สร้าง instance |
| `student` | เรียน, ทำแบบทดสอบ, ส่งงาน |

---

