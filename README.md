# GymTrack

**Platform kebugaran berbasis web** untuk memantau progres gym secara personal sesuai target (bulking, cutting, maintaining).

> UAS Pemrograman Berbasis Web — SINF2032 — Semester Genap 2025/2026

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | MySQL |
| Auth | JWT (JSON Web Token) + bcrypt |

## Fitur Utama

- **Autentikasi** — Register & Login dengan JWT
- **Kalkulator** — BMR, TDEE, Makronutrien (protein/karbo/lemak), Water Intake, Estimasi Body Fat
- **Body Measurements** — CRUD log berat & ukuran tubuh + grafik progres
- **Workout Log** — CRUD sesi latihan dengan filter kategori
- **Nutrition Log** — CRUD log kalori & makro harian
- **Fitness Goals** — CRUD target kebugaran dengan status aktif/nonaktif
- **Reminders** — CRUD pengingat latihan, air, protein, cek progres
- **Profil** — Update data diri & ubah password

## Struktur Database

- `users` — Data akun & profil fisik
- `body_measurements` — Riwayat pengukuran tubuh
- `workout_logs` — Log sesi latihan
- `nutrition_logs` — Log nutrisi harian
- `fitness_goals` — Target kebugaran
- `reminders` — Jadwal pengingat

## Cara Menjalankan

### Prasyarat
- Node.js >= 18
- MySQL (running)

### 1. Clone & Setup

```bash
git clone https://github.com/irfnqdfi/UAS_PrakPBW_KLP16.git
cd UAS_PrakPBW_KLP16
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env: isi DATABASE_URL dengan koneksi MySQL kamu

npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

Server: `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### 4. Akun Demo

| Email | Password | Goal |
|-------|----------|------|
| irfan@gymtrack.com | password123 | Bulking |
| khalish@gymtrack.com | password123 | Cutting |
| budi@gymtrack.com | password123 | Maintaining |

## Struktur Folder

```
gymtrack/
├── server/                 # Backend
│   ├── prisma/             # Schema & seed
│   ├── controllers/        # Business logic
│   ├── routes/             # API routes
│   ├── middleware/         # JWT auth
│   └── index.js
└── client/                 # Frontend
    └── src/
        ├── pages/          # Semua halaman
        ├── components/     # UI components
        ├── context/        # AuthContext
        ├── services/       # API calls
        └── utils/          # Kalkulasi & formatter
```

## Library yang Digunakan

**Backend:** express, @prisma/client, jsonwebtoken, bcryptjs, cors, dotenv

**Frontend:** react, react-router-dom, axios, recharts, lucide-react, tailwindcss
