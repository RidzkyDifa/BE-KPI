# Database Seeding (Dummy Data)

## Overview
Database seeding adalah proses memasukkan data dummy/sample ke dalam database untuk keperluan development dan testing.

## Setup Seeding

### 1. Konfigurasi package.json
Tambahkan konfigurasi seed di `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Catatan**: Ganti `seed.ts` dengan file seed yang ingin digunakan (contoh: `seed2.ts`, `seed-admin.ts`, dll)

### 2. Menjalankan Seed
```bash
npx prisma db seed
```

## Available Seed Files

### 📄 `seed.ts` - Complete Database Seed
**Data yang akan dibuat:**
- ✅ 4 Divisions (HR, IT, Finance, Marketing)
- ✅ 4 Positions (Staff, Senior Staff, Manager, Director)  
- ✅ 4 KPIs (Attendance Rate, Job Performance, Teamwork & Collaboration, Innovation & Creativity)
- ✅ 1 Admin User
- ✅ 4 Employee Users dengan data lengkap
- ✅ Sample Assessment Data (3 bulan terakhir)

**Login Credentials:**
```
Admin: admin@company.com / admin123
HR Manager: andi.dea1@company.com / password123
IT Staff: andi.dea2@company.com / password123
Finance Staff: andi.dea3@company.com / password123
Marketing Manager: andi.dea4@company.com / password123
```

### 📄 `seed2.ts` - Admin Only Seed
**Data yang akan dibuat:**
- ✅ 2 Admin Users saja

**Login Credentials:**
```
Admin1: admin1@gmail.com / admin123
Admin2: admin2@gmail.com / admin123
```

## Cara Menggunakan

### Option 1: Complete Data (Recommended untuk Development)
```bash
# Edit package.json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}

# Run seed
npx prisma db seed
```

### Option 2: Admin Only (Untuk setup minimal)
```bash
# Edit package.json  
"prisma": {
  "seed": "ts-node prisma/seed2.ts"
}

# Run seed
npx prisma db seed
```

## Prerequisites

### 1. Environment Variables
Pastikan file `.env` berisi:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 2. Dependencies
Install dependencies yang diperlukan:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

## Troubleshooting

### Error: Environment variable not found: DATABASE_URL
- Pastikan file `.env` ada dan berisi `DATABASE_URL`
- Restart terminal setelah membuat file `.env`

### Error: Command failed with exit code 1
- Pastikan database sudah dibuat
- Jalankan `npx prisma db push` untuk sync schema
- Pastikan dependencies ter-install dengan benar

### Error: Table 'xxx' doesn't exist
- Jalankan migration terlebih dahulu: `npx prisma db push`
- Atau reset database: `npx prisma db reset`

## Tips

1. **Reset Database**: Jika ingin menghapus semua data dan seed ulang
   ```bash
   npx prisma migrate reset
   npx prisma db push
   ```

2. **Custom Seed**: Buat file seed baru (contoh: `seed-custom.ts`) dan update `package.json`

3. **Multiple Environment**: Gunakan file seed yang berbeda untuk development dan production

4. **Data Safety**: Seed menggunakan `upsert()` jadi aman dijalankan berulang kali tanpa duplikat data

## Data Structure

```
seed.ts (Complete)
├── Master Data
│   ├── 4 Divisions (HR, IT, Finance, Marketing)
│   ├── 4 Positions (Staff, Senior, Manager, Director)
│   └── 4 KPIs (Attendance, Performance, Teamwork, Innovation)
├── User Data  
│   ├── 1 Admin User
│   └── 4 Employee Users
└── Assessment Data
    └── 3 months of sample KPI assessments

seed2.ts (Admin Only)
└── User Data
    ├── Admin1 (admin1@gmail.com)
    └── Admin2 (admin2@gmail.com)
```