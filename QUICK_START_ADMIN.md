# EduPro Admin Portal — Quick Start

## 🌐 URLs at a Glance

| Portal        | URL                              |
|---------------|----------------------------------|
| Homepage      | `http://localhost:3000/`         |
| Student Login | `http://localhost:3000/auth/login` |
| Teacher Login | `http://localhost:3000/auth/login` |
| **Admin Login** | **`http://localhost:3000/admin/login`** |

---

## 🔐 Admin Login Credentials

| Field    | Value                            |
|----------|----------------------------------|
| Email    | `murtazamahmood640@gmail.com`    |
| Password | `Shoaib12$`                      |
| User ID  | `ADM001`                         |

> Admin login is on a **separate, isolated page** (`/admin/login`).  
> It does **not** use Firebase. It authenticates directly against MongoDB via the Node.js backend.

---

## 🚀 How to Start

### 1. Backend
```bash
cd backend
node server.js
# or with nodemon:
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Frontend
```bash
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 📊 Admin Sections

| Section      | URL                        | Function                  |
|--------------|----------------------------|---------------------------|
| Dashboard    | `/admin/dashboard`         | Overview & Stats          |
| Students     | `/admin/students`          | Manage students (STU IDs) |
| Teachers     | `/admin/teachers`          | Manage teachers (TNR IDs) |
| Courses      | `/admin/courses`           | Manage courses            |
| Payments     | `/admin/payments`          | Track payments            |
| Results      | `/admin/results`           | View quiz results         |
| Certificates | `/admin/certificates`      | Issue & verify certs      |
| Analytics    | `/admin/analytics`         | Platform analytics        |

---

## 🆔 User ID Format

| Role    | Format  | Example  |
|---------|---------|----------|
| Admin   | ADM###  | ADM001   |
| Student | STU###  | STU001   |
| Teacher | TNR###  | TNR001   |

IDs are auto-generated when a user is created (either via Firebase signup or the seeder).

---

## 🔄 Re-seed Admin (if needed)
```bash
cd backend
npm run seed:admin
```
Will skip if the admin already exists.
