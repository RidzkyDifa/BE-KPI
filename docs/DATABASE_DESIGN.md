# Database Sistem KPI Karyawan

Dokumentasi untuk struktur database sistem penilaian kinerja karyawan dengan sistem perhitungan KPI yang komprehensif.

## 📋 Tentang Sistem

Sistem ini digunakan untuk mengelola penilaian KPI (Key Performance Indicator) karyawan di perusahaan dengan sistem perhitungan yang akurat berdasarkan bobot, target, dan realisasi pencapaian. Sistem dapat mencatat nilai kinerja setiap karyawan berdasarkan periode tertentu dengan fitur autentikasi pengguna yang lengkap.

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

## 📚 Pengelompokan Tabel

### 🔐 TABEL AUTHENTICATION

#### 1. **User** - Sistem Autentikasi
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

### 🗂️ TABEL MASTER DATA

#### 2. **Division** - Divisi/Bagian
Master data divisi atau departemen perusahaan.

```prisma
model Division {
  id          String     @id @default(uuid())
  name        String    @unique
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
**Fitur**: 
- Nama divisi unik (`@unique`)
- Sistem bobot divisi untuk penilaian
- UUID primary key, timestamp tracking

#### 3. **Position** - Jabatan/Posisi
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

#### 4. **KPI** - Jenis Indikator Penilaian
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

**Contoh data**: Disiplin, Kehadiran, Target Penjualan, Kualitas Pekerjaan  
**Relasi**: 1 KPI ⇔ banyak EmployeeKPI  
**Fitur**: UUID primary key, timestamp tracking

### 👥 TABEL DATA KARYAWAN

#### 5. **Employee** - Data Karyawan
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

### 📊 TABEL PENILAIAN KPI

#### 6. **EmployeeKPI** - Nilai KPI Karyawan dengan Sistem Perhitungan Lengkap
Tabel untuk menyimpan nilai KPI setiap karyawan per periode dengan sistem perhitungan yang komprehensif dan audit trail.

```prisma
model EmployeeKPI {
  id          String   @id @default(uuid())
  weight      Float    // bobot KPI (%)
  target      Float    // target yang ditetapkan
  actual      Float    // realisasi (pencapaian nyata)
  achievement Float    // nilai akhir (weight * score )
  score       Float    // nilai KPI (persentase (actual / target * 100))
  period      DateTime // periode penilaian (biasanya bulan)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
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

**Sistem Perhitungan KPI Baru**:
- **weight**: Bobot KPI dalam persentase (contoh: 25% = 25.0)
- **target**: Target yang ditetapkan untuk KPI tersebut
- **actual**: Pencapaian/realisasi yang sebenarnya
- **score**: Persentase pencapaian = (actual / target × 100)
- **achievement**: Nilai akhir = (weight × score / 100)

**Fitur Utama**:
- Sistem perhitungan KPI yang komprehensif
- Audit trail (createdBy, updatedBy) untuk tracking perubahan
- Multiple indexing untuk performa query optimal
- Cascade delete jika employee dihapus
- UUID primary key untuk keamanan

**Relasi**:
- **EmployeeKPI ⇔ Employee** (many-to-one)
- **EmployeeKPI ⇔ KPI** (many-to-one)

**Constraint penting**: `unique (employeeId, kpiId, period)` → tidak boleh ada duplikat penilaian di periode yang sama

## 🎯 Contoh Kasus Nyata dengan Perhitungan KPI

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
- ID "kpi-002": **Kualitas Code Review**
- ID "kpi-003": **Target Bug Fix**

**6. EmployeeKPI (Nilai KPI Budi di Januari 2025)**

| KPI | Weight (%) | Target | Actual | Score (%) | Achievement |
|-----|------------|---------|---------|-----------|-------------|
| Kehadiran | 30.0 | 22 hari | 21 hari | 95.45 | 28.64 |
| Kualitas Code Review | 40.0 | 50 review | 48 review | 96.00 | 38.40 |
| Target Bug Fix | 30.0 | 25 bugs | 28 bugs | 112.00 | 33.60 |

### Perhitungan Detail:

#### 1. KPI Kehadiran:
- **Weight**: 30%
- **Target**: 22 hari kerja
- **Actual**: 21 hari hadir
- **Score**: (21/22) × 100 = 95.45%
- **Achievement**: 30 × (95.45/100) = 28.64

#### 2. KPI Kualitas Code Review:
- **Weight**: 40%
- **Target**: 50 code review
- **Actual**: 48 code review selesai
- **Score**: (48/50) × 100 = 96.00%
- **Achievement**: 40 × (96.00/100) = 38.40

#### 3. KPI Target Bug Fix:
- **Weight**: 30%
- **Target**: 25 bug
- **Actual**: 28 bug fixed
- **Score**: (28/25) × 100 = 112.00% (overachieve!)
- **Achievement**: 30 × (112.00/100) = 33.60

### Hasil Laporan KPI:
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
• Kehadiran (30%): 95.45% → Achievement: 28.64
• Kualitas Code Review (40%): 96.00% → Achievement: 38.40  
• Target Bug Fix (30%): 112.00% → Achievement: 33.60

📈 TOTAL ACHIEVEMENT: 100.64/100 (EXCEED TARGET! 🎉)
📊 RATA-RATA SCORE: 101.15%
📅 Terakhir Update: 2025-01-31
```

## 🔄 Cara Kerja Sistem dengan Perhitungan KPI

### Langkah 1: Input Data KPI
**Admin/Manager input target dan bobot untuk setiap KPI**
```sql
-- Contoh insert KPI Kehadiran untuk Budi
INSERT INTO employee_kpis VALUES (
  'kpi-emp-001', 
  30.0,        -- weight (30%)
  22.0,        -- target (22 hari)
  21.0,        -- actual (21 hari hadir)
  28.64,       -- achievement (dihitung: 30 × (21/22))
  95.45,       -- score (dihitung: 21/22 × 100)
  '2025-01-31', -- period
  'emp-abc-def-ghi', -- employeeId
  'kpi-001'    -- kpiId (Kehadiran)
);
```

### Langkah 2: Sistem Menghitung Otomatis
**Trigger atau aplikasi menghitung score dan achievement**
```javascript
// Pseudocode perhitungan
function calculateKPI(target, actual, weight) {
  const score = (actual / target) * 100;
  const achievement = (weight * score) / 100;
  
  return {
    score: parseFloat(score.toFixed(2)),
    achievement: parseFloat(achievement.toFixed(2))
  };
}
```

### Langkah 3: Agregasi Laporan
**Sistem menghitung total performance karyawan**
```sql
-- Query untuk mendapat total achievement per karyawan
SELECT 
  e.employeeNumber,
  u.name,
  SUM(ek.achievement) as totalAchievement,
  AVG(ek.score) as averageScore,
  COUNT(ek.id) as totalKPI
FROM employee_kpis ek
JOIN employees e ON ek.employeeId = e.id  
JOIN users u ON e.id = u.employeeId
WHERE ek.period = '2025-01-31'
GROUP BY e.id;
```

## 📊 Keunggulan Sistem Perhitungan Baru

### Sistem Perhitungan yang Akurat:
- **Weight-based calculation**: Setiap KPI punya bobot berbeda sesuai kepentingan
- **Target vs Actual tracking**: Jelas membedakan target dan pencapaian
- **Percentage scoring**: Mudah dipahami dalam bentuk persentase
- **Final achievement**: Nilai akhir yang sudah diperhitungkan bobotnya

### Fleksibilitas Penilaian:
- KPI bisa punya bobot berbeda (30%, 40%, 30%)
- Target bisa berupa angka apapun (hari, unit, persentase, dll)
- Pencapaian bisa melebihi target (overachieve)
- Support decimal untuk perhitungan presisi

### Audit & Tracking yang Lengkap:
- Semua komponen perhitungan tersimpan
- Audit trail untuk setiap perubahan
- Timestamp tracking untuk histori
- Relasi yang jelas untuk reporting

### Performa Database:
- Multiple indexing untuk query cepat
- UUID untuk keamanan data
- Unique constraint untuk data integrity
- Optimasi relasi untuk join yang efisien

## 🎯 Formula Perhitungan KPI

### Formula Dasar:
```
Score (%) = (Actual / Target) × 100
Achievement = (Weight × Score) / 100
Total KPI Score = Σ(Achievement₁ + Achievement₂ + ... + Achievementₙ)
```

### Contoh Implementasi:
```javascript
// Fungsi untuk menghitung KPI
function calculateEmployeeKPI(kpiData) {
  let totalAchievement = 0;
  let totalScore = 0;
  
  kpiData.forEach(kpi => {
    const score = (kpi.actual / kpi.target) * 100;
    const achievement = (kpi.weight * score) / 100;
    
    kpi.score = Math.round(score * 100) / 100; // 2 decimal places
    kpi.achievement = Math.round(achievement * 100) / 100;
    
    totalAchievement += kpi.achievement;
    totalScore += score;
  });
  
  return {
    kpiData: kpiData,
    totalAchievement: Math.round(totalAchievement * 100) / 100,
    averageScore: Math.round((totalScore / kpiData.length) * 100) / 100
  };
}
```

## 🚀 Keunggulan Sistem Lengkap

### Keamanan:
- UUID sebagai primary key (tidak mudah ditebak)
- Email verification system
- Role-based access control
- Password hashing (dalam implementasi)

### Performa:
- Multiple indexing pada tabel EmployeeKPI
- Optimasi query dengan relasi yang tepat
- Cascade delete untuk data integrity
- Unique constraint untuk mencegah duplikasi

### Audit & Tracking:
- Timestamp pada semua tabel (createdAt, updatedAt)
- Audit trail untuk perubahan nilai KPI (createdBy, updatedBy)
- Verification status tracking
- Histori lengkap perhitungan KPI

### Fleksibilitas & Skalabilitas:
- User tidak wajib memiliki data employee (untuk admin)
- Employee tidak wajib memiliki user account
- Sistem bobot yang fleksibel per KPI
- Support overachieve (pencapaian > target)
- Nama divisi unik untuk konsistensi data
- Sistem master data yang terorganisir

---

*Database ini dirancang dengan sistem perhitungan KPI yang modern, akurat, dan komprehensif dengan UUID, indexing optimal, audit trail, dan sistem autentikasi yang lengkap untuk perusahaan masa kini.*