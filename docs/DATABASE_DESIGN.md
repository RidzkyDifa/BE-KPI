# Database Sistem KPI Karyawan

Dokumentasi untuk struktur database sistem penilaian kinerja karyawan.

## 📋 Tentang Sistem

Sistem ini digunakan untuk mengelola penilaian KPI (Key Performance Indicator) karyawan di perusahaan. Sistem dapat mencatat nilai kinerja setiap karyawan berdasarkan periode tertentu dengan fitur autentikasi pengguna yang lengkap.

## 🗄️ Struktur Database

### Konfigurasi Database
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Enum
```prisma
enum Role {
  USER
  ADMIN
}
```

### 1. **User** - Sistem Autentikasi
Tabel untuk menyimpan akun pengguna dengan sistem autentikasi lengkap.

```prisma
model User {
  id         String    @id @default(uuid())
  name       String
  email      String    @unique
  password   String
  role       Role      @default(USER)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  
  // Email verification
  verificationToken        String?
  verificationTokenExpires DateTime?
  verified                 Boolean   @default(false)
  
  // Relasi ke Employee (optional - tidak semua user harus punya data employee)
  employee   Employee? @relation(fields: [employeeId], references: [id])
  employeeId String?   @unique

  @@map("users")
}
```

**Fitur Utama**:
- Sistem autentikasi berbasis email dan password
- Role-based access (USER/ADMIN)
- Email verification dengan token dan expiry
- UUID sebagai primary key untuk keamanan
- Timestamp tracking (createdAt, updatedAt)

**Relasi**: 1 User ⇔ 1 Employee (one-to-one optional)  
**Catatan**: Tidak semua user harus memiliki data employee (admin bisa tidak punya data karyawan)

### 2. **Employee** - Data Karyawan
Tabel utama yang berisi data karyawan perusahaan.

```prisma
model Employee {
  id             String        @id @default(uuid())
  employeeNumber String?       @unique  // nomor/ID karyawan perusahaan
  pnosNumber     String?       // nomor PNOS (optional)
  dateJoined     DateTime?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  
  // Relasi ke Position dan Division
  position   Position? @relation(fields: [positionId], references: [id])
  positionId String?
  division   Division? @relation(fields: [divisionId], references: [id])
  divisionId String?
  
  // Relasi balik ke User (optional)
  user User?
  
  // Relasi ke EmployeeKPI
  employeeKpis EmployeeKPI[]

  @@map("employees")
}
```

**Berisi data**:
- Nomor pegawai unik dan nomor PNOS
- Tanggal masuk kerja
- Hubungan ke posisi dan divisi
- Timestamp tracking

**Relasi**:
- **Employee ⇔ Position** (many-to-one) → banyak karyawan bisa punya posisi yang sama
- **Employee ⇔ Division** (many-to-one) → banyak karyawan bisa di divisi yang sama  
- **Employee ⇔ EmployeeKPI** (one-to-many) → satu karyawan punya banyak nilai KPI
- **Employee ⇔ User** (one-to-one optional) → karyawan bisa punya atau tidak punya akun user

### 3. **Position** - Jabatan/Posisi
Master data posisi atau jabatan di perusahaan.

```prisma
model Position {
  id          String     @id @default(uuid())
  name        String
  description String?
  employees   Employee[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("positions")
}
```

**Contoh data**: Software Engineer, Manager, HR Specialist  
**Relasi**: 1 Position ⇔ banyak Employees  
**Fitur**: UUID primary key, timestamp tracking

### 4. **Division** - Divisi/Bagian
Master data divisi atau departemen perusahaan.

```prisma
model Division {
  id          String     @id @default(uuid())
  name        String
  description String?
  weight      Int?
  employees   Employee[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("divisions")
}
```

**Contoh data**: IT, HR, Finance, Marketing  
**Relasi**: 1 Division ⇔ banyak Employees  
**Fitur**: Sistem bobot divisi, UUID primary key, timestamp tracking

### 5. **KPI** - Jenis Indikator Penilaian
Master data jenis-jenis KPI yang digunakan untuk penilaian.

```prisma
model KPI {
  id           String        @id @default(uuid())
  name         String
  employeeKpis EmployeeKPI[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@map("kpis")
}
```

**Contoh data**: Disiplin, Kehadiran, Target, Kualitas Pekerjaan  
**Relasi**: 1 KPI ⇔ banyak EmployeeKPI  
**Fitur**: UUID primary key, timestamp tracking

### 6. **EmployeeKPI** - Nilai KPI Karyawan
Tabel untuk menyimpan nilai KPI setiap karyawan per periode dengan audit trail.

```prisma
model EmployeeKPI {
  id         String   @id @default(uuid())
  score      Float    // nilai KPI (support decimal untuk perhitungan yang presisi)
  period     DateTime // periode penilaian (biasanya bulan)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relasi ke Employee dan KPI
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  employeeId String
  kpi        KPI      @relation(fields: [kpiId], references: [id])
  kpiId      String
  
  // Audit trail - siapa yang input/update nilai
  createdBy  String?  // bisa link ke User.id
  updatedBy  String?  // bisa link ke User.id
  
  // Indexing untuk performa
  @@index([employeeId])
  @@index([kpiId])
  @@index([period])
  
  // Constraint: tidak boleh ada duplikat penilaian di periode yang sama
  @@unique([employeeId, kpiId, period])
  @@map("employee_kpis")
}
```

**Fitur Utama**:
- Nilai berupa Float untuk presisi perhitungan
- Audit trail (createdBy, updatedBy) untuk tracking perubahan
- Multiple indexing untuk performa query
- Cascade delete jika employee dihapus
- UUID primary key untuk keamanan

**Relasi**:
- **EmployeeKPI ⇔ Employee** (many-to-one)
- **EmployeeKPI ⇔ KPI** (many-to-one)

**Constraint penting**: `unique (employeeId, kpiId, period)` → tidak boleh ada duplikat penilaian di periode yang sama

## 🎯 Contoh Kasus Nyata

Perusahaan ingin menilai **karyawan Budi Santoso** untuk periode **Januari 2025**. Budi bekerja di **Divisi IT** dengan jabatan **Software Engineer**.

### Data yang Tersimpan:

**1. User (Akun Login)**
- ID: "user-123-456-789"
- Name: "Budi Santoso"
- Email: "budi.santoso@company.com"
- Role: USER
- Verified: true
- Employee ID: "emp-abc-def-ghi"

**2. Employee (Data Karyawan)**
- ID: "emp-abc-def-ghi"
- Nomor Pegawai: "EMP001"
- Nomor PNOS: "PNOS-2025-01"
- Posisi ID: "pos-111-222-333"
- Divisi ID: "div-aaa-bbb-ccc"
- Tanggal Masuk: 2023-06-15

**3. Position (Jabatan)**
- ID: "pos-111-222-333"
- Nama: "Software Engineer"
- Deskripsi: "Developer aplikasi internal perusahaan"

**4. Division (Divisi)**
- ID: "div-aaa-bbb-ccc"
- Nama: "IT"
- Deskripsi: "Divisi Teknologi Informasi"
- Bobot: 3

**5. KPI (Jenis Penilaian)**
- ID "kpi-001": **Kehadiran**
- ID "kpi-002": **Kualitas Pekerjaan**
- ID "kpi-003": **Target Proyek**

**6. EmployeeKPI (Nilai KPI Budi di Januari 2025)**
- Kehadiran: Score 95.5
- Kualitas Pekerjaan: Score 88.0
- Target Proyek: Score 90.5
- Periode: 31 Januari 2025
- CreatedBy: "admin-user-id"

### Hasil Laporan:
| Nama Karyawan | Email | Divisi | Posisi | KPI | Nilai | Periode | Dibuat Oleh |
|---------------|-------|--------|--------|-----|-------|---------|-------------|
| Budi Santoso | budi.santoso@company.com | IT | Software Engineer | Kehadiran | 95.5 | Jan 2025 | Admin |
| Budi Santoso | budi.santoso@company.com | IT | Software Engineer | Kualitas Pekerjaan | 88.0 | Jan 2025 | Admin |
| Budi Santoso | budi.santoso@company.com | IT | Software Engineer | Target Proyek | 90.5 | Jan 2025 | Admin |

## 🔄 Cara Kerja Sistem

### Langkah 1: Login Pengguna
**Budi masukkan email dan password**
- Sistem cek di tabel **User** → ditemukan email "budi.santoso@company.com"
- Sistem verifikasi password dan cek status `verified = true`
- Sistem lihat field `employeeId` untuk mengetahui apakah user ini punya data employee
- ✅ Login berhasil, sistem tahu ini adalah user dengan role USER dan punya data employee

### Langkah 2: Ambil Data Profil Karyawan  
**Sistem baca tabel Employee berdasarkan employeeId dari User**
- Ditemukan data:
  - Nomor Pegawai: "EMP001"
  - Nomor PNOS: "PNOS-2025-01" 
  - Position ID: "pos-111-222-333"
  - Division ID: "div-aaa-bbb-ccc"
  - Tanggal Masuk: 15 Juni 2023

### Langkah 3: Ambil Data Jabatan dan Divisi
**Sistem JOIN dengan tabel Position dan Division**

Dari tabel **Position**:
- Nama Jabatan: "Software Engineer"
- Deskripsi: "Developer aplikasi internal perusahaan"

Dari tabel **Division**:  
- Nama Divisi: "IT"
- Deskripsi: "Divisi Teknologi Informasi"
- Bobot: 3

### Langkah 4: Ambil Nilai KPI untuk Periode Tertentu
**Sistem cari di tabel EmployeeKPI dengan indexing yang optimal**
- Filter: `employeeId = "emp-abc-def-ghi"` DAN `period = Januari 2025`
- Ditemukan 3 record nilai KPI:

| KPI ID | Score | Periode | Created By |
|--------|-------|---------|------------|
| kpi-001 | 95.5 | Jan 2025 | admin-user-id |
| kpi-002 | 88.0 | Jan 2025 | admin-user-id |
| kpi-003 | 90.5 | Jan 2025 | admin-user-id |

### Langkah 5: Ambil Nama KPI
**Sistem JOIN dengan tabel KPI**
- KPI ID "kpi-001" → "Kehadiran"  
- KPI ID "kpi-002" → "Kualitas Pekerjaan"
- KPI ID "kpi-003" → "Target Proyek"

### Langkah 6: Tampilkan Hasil Akhir
**Sistem gabungkan semua data menjadi laporan lengkap dengan audit trail**

```
👤 PROFIL KARYAWAN
Nama: Budi Santoso
Email: budi.santoso@company.com
Nomor Pegawai: EMP001
Divisi: IT (Divisi Teknologi Informasi)
Jabatan: Software Engineer
Bergabung: 15 Juni 2023
Status: Verified ✅

📊 NILAI KPI - JANUARI 2025
• Kehadiran: 95.5/100 (Dibuat: Admin)
• Kualitas Pekerjaan: 88.0/100 (Dibuat: Admin)
• Target Proyek: 90.5/100 (Dibuat: Admin)

📈 RATA-RATA: 91.3/100
📅 Terakhir Update: 2025-01-31
```

### 🔍 Yang Terjadi di Database:
1. **Query User** → Autentikasi dan dapat employeeId
2. **Query Employee** → Dapat positionId & divisionId  
3. **Query Position** → Dapat nama jabatan
4. **Query Division** → Dapat nama divisi
5. **Query EmployeeKPI dengan index** → Dapat daftar nilai KPI secara cepat
6. **Query KPI** → Dapat nama setiap KPI
7. **Gabungkan semua dengan audit info** → Tampilkan laporan

## 📊 Penjelasan Per Tabel

### Tabel Autentikasi:
- **User**: Sistem login dengan email verification dan role management

### Tabel Master Data (jarang berubah):
- **Position**: Daftar jabatan di perusahaan
- **Division**: Daftar divisi/departemen dengan sistem bobot
- **KPI**: Jenis-jenis indikator penilaian

### Tabel Data Karyawan:
- **Employee**: Profil karyawan internal dengan relasi opsional ke User

### Tabel Transaksi (sering berubah):
- **EmployeeKPI**: Nilai penilaian dengan audit trail dan indexing optimal

## 🚀 Keunggulan Sistem

### Keamanan:
- UUID sebagai primary key (tidak mudah ditebak)
- Email verification system
- Role-based access control
- Password hashing (dalam implementasi)

### Performa:
- Multiple indexing pada tabel EmployeeKPI
- Optimasi query dengan relasi yang tepat
- Cascade delete untuk data integrity

### Audit & Tracking:
- Timestamp pada semua tabel (createdAt, updatedAt)
- Audit trail untuk perubahan nilai KPI (createdBy, updatedBy)
- Verification status tracking

### Fleksibilitas:
- User tidak wajib memiliki data employee (untuk admin)
- Employee tidak wajib memiliki user account
- Nilai KPI dalam Float untuk presisi perhitungan
- Sistem bobot divisi untuk penilaian yang lebih kompleks

---

*Database ini dirancang modern dengan UUID, indexing optimal, audit trail, dan sistem autentikasi yang lengkap untuk perusahaan masa kini.*
