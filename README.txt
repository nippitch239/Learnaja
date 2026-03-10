========================================
  Learnaja — CMS Web Application
========================================


TECH STACK
----------
  Frontend   : React 19, Vite, TailwindCSS
  Backend    : Node.js, Express, better-sqlite3
  Database   : SQLite (ไฟล์ backend/database/learnaja.db)
  Auth       : JWT (Access + Refresh Token), bcrypt


REQUIREMENTS
------------
  - Node.js v18 ขึ้นไป  (https://nodejs.org/)
  - Windows (สำหรับ run.bat)


วิธีรันโปรเจกต์
---------------
  ให้พิมพ์ใน Command Prompt (CMD) เท่านั้น:

    1. cd Learnaja/
    2. run

  หรือรันผ่าน:  .\Learnaja\run.bat

  ระบบจะเปิด 2 หน้าต่าง CMD อัตโนมัติ:
    - Frontend  → ติดตั้ง dependencies และรัน Vite dev server
    - Backend   → ติดตั้ง dependencies และรัน nodemon


URL หลังรัน
-----------
  Frontend     : http://localhost:5173
  Backend API  : http://localhost:3200


โครงสร้างโปรเจกต์
-----------------
  Learnaja/
  ├── run.bat                  <- รันทั้ง frontend + backend
  ├── frontend/                <- React + Vite
  │   ├── src/
  │   │   ├── pages/           <- หน้าต่างๆ ของแอป
  │   │   ├── components/      <- Component ที่ใช้ซ้ำ
  │   │   ├── context/         <- AuthContext
  │   │   └── services/        <- API service (axios)
  │   └── package.json
  ├── backend/                 <- Express API Server
  │   ├── index.js             <- จุดเริ่มต้น API routes ทั้งหมด
  │   ├── database.js          <- SQLite wrapper
  │   ├── database/
  │   │   └── learnaja.db      <- ไฟล์ฐานข้อมูล SQLite
  │   ├── uploads/             <- ไฟล์ที่ upload ขึ้นมา
  │   └── .env                 <- Environment variables
  └── README.md


บทบาทผู้ใช้ (Roles)
--------------------
  admin    : จัดการผู้ใช้, อนุมัติครู, จัดการคอร์สทั้งหมด
  teacher  : สร้างและจัดการคอร์สของตัวเอง, สร้าง instance
  student  : เรียน, ทำแบบทดสอบ, ส่งงาน


Account ที่เตรียมไว้
--------------------
  Role: Student
    Username: student1  |  Password: 1234
    Username: student2  |  Password: 1234

  Role: Teacher
    Username: teacher1  |  Password: 1234

  Role: Admin
    Username: admin     |  Password: admin


รายงานโปรเจกต์
--------------
  https://kmitlthailand-my.sharepoint.com/:w:/g/personal/67070091_kmitl_ac_th/IQDFiHwILo-1RpBeGx17TPRsAad5bDiJEIQF-mUarQrJKrY?e=k0ufOk


Presentation
------------
  https://www.canva.com/design/DAHC_qIEp0g/XLoiHcYlct71x47ZyxjCjQ/edit?utm_content=DAHC_qIEp0g&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

========================================
