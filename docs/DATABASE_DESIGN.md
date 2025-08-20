# Database Sistem KPI Karyawan

Dokumentasi untuk struktur database sistem penilaian kinerja karyawan.

## 📋 Tentang Sistem

Sistem ini digunakan untuk mengelola penilaian KPI (Key Performance Indicator) karyawan di perusahaan. Sistem dapat mencatat nilai kinerja setiap karyawan berdasarkan periode tertentu.

## 🗄️ Struktur Database

### Konfigurasi Database
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // bisa diganti ke "mysql" atau "sqlite"
  url      = env("DATABASE_URL")
}
```

### 1. **User** - Akun Login
Tabel untuk menyimpan akun login karyawan.

```prisma
model User {
  id         Int       @id @default(autoincrement())
  username   String    @unique
  password   String?   // simpan hashed password jika perlu
  employee   Employee? @relation(fields: [employeeId], references: [id])
  employeeId Int?      @unique
  createdAt  DateTime  @default(now())
}
```

**Tujuan**: Untuk sistem login karyawan  
**Relasi**: 1 User ⇔ 1 Employee (one-to-one)  
**Catatan**: Karyawan bisa punya akun login, tapi tidak wajib

### 2. **Employee** - Data Karyawan
Tabel utama yang berisi data karyawan perusahaan.

```prisma
model Employee {
  id             Int           @id @default(autoincrement())
  employeeNumber String?       @unique  // nomor/ID karyawan perusahaan
  pnosNumber     String?       // nomor PNOS (optional)
  position       Position?     @relation(fields: [positionId], references: [id])
  positionId     Int?
  division       Division?     @relation(fields: [divisionId], references: [id])
  divisionId     Int?
  dateJoined     DateTime?
  user           User?         // relasi balik ke User (one-to-one optional)
  employeeKpis   EmployeeKPI[] // relasi ke EmployeeKPI (many)
}
```

**Berisi data**:
- Nomor pegawai dan nomor PNOS
- Tanggal masuk kerja
- Hubungan ke posisi dan divisi

**Relasi**:
- **Employee ⇔ Position** (many-to-one) → banyak karyawan bisa punya posisi yang sama
- **Employee ⇔ Division** (many-to-one) → banyak karyawan bisa di divisi yang sama  
- **Employee ⇔ EmployeeKPI** (one-to-many) → satu karyawan punya banyak nilai KPI

### 3. **Position** - Jabatan/Posisi
Master data posisi atau jabatan di perusahaan.

```prisma
model Position {
  id          Int        @id @default(autoincrement())
  name        String
  description String?
  employees   Employee[] // one position ke many employees
}
```

**Contoh data**: Software Engineer, Manager, HR Specialist  
**Relasi**: 1 Position ⇔ banyak Employees

### 4. **Division** - Divisi/Bagian
Master data divisi atau departemen perusahaan.

```prisma
model Division {
  id          Int        @id @default(autoincrement())
  name        String
  description String?
  weight      Int?
  employees   Employee[] // one division ke many employees
}
```

**Contoh data**: IT, HR, Finance, Marketing  
**Relasi**: 1 Division ⇔ banyak Employees

### 5. **KPI** - Jenis Indikator Penilaian
Master data jenis-jenis KPI yang digunakan untuk penilaian.

```prisma
model KPI {
  id           Int           @id @default(autoincrement())
  name         String
  description  String?
  weight       Int?          // jika KPI punya bobot
  employeeKpis EmployeeKPI[] // relasi ke EmployeeKPI
}
```

**Contoh data**: Disiplin, Kehadiran, Target, Kualitas Pekerjaan  
**Relasi**: 1 KPI ⇔ banyak EmployeeKPI

### 6. **EmployeeKPI** - Nilai KPI Karyawan
Tabel untuk menyimpan nilai KPI setiap karyawan per periode.

```prisma
model EmployeeKPI {
  id         Int      @id @default(autoincrement())
  employee   Employee @relation(fields: [employeeId], references: [id])
  employeeId Int
  kpi        KPI      @relation(fields: [kpiId], references: [id])
  kpiId      Int
  score      Int
  period     DateTime
  @@index([employeeId])
  @@index([kpiId])
  @@unique([employeeId, kpiId, period]) // mencegah duplicate record
}
```

**Berisi**:
- Nilai/skor KPI
- Periode penilaian

**Relasi**:
- **EmployeeKPI ⇔ Employee** (many-to-one)
- **EmployeeKPI ⇔ KPI** (many-to-one)

**Constraint penting**: `unique (employeeId, kpiId, period)` → tidak boleh ada duplikat penilaian di periode yang sama

## 🎯 Contoh Kasus Nyata

Perusahaan ingin menilai **karyawan Budi Santoso** untuk periode **Januari 2025**. Budi bekerja di **Divisi IT** dengan jabatan **Software Engineer**.

### Data yang Tersimpan:

**1. User (Akun Login)**
- ID: 1
- Username: "budi123"
- Employee ID: 1

**2. Employee (Data Karyawan)**
- ID: 1
- Nomor Pegawai: "EMP001"
- Nomor PNOS: "PNOS-2025-01"
- Posisi ID: 1 (Software Engineer)
- Divisi ID: 1 (IT)
- Tanggal Masuk: 2023-06-15

**3. Position (Jabatan)**
- ID: 1
- Nama: "Software Engineer"
- Deskripsi: "Developer aplikasi internal perusahaan"

**4. Division (Divisi)**
- ID: 1
- Nama: "IT"
- Deskripsi: "Divisi Teknologi Informasi"
- Bobot: 3

**5. KPI (Jenis Penilaian)**
- ID 1: **Kehadiran**
- ID 2: **Kualitas Pekerjaan**
- ID 3: **Target Proyek**

**6. EmployeeKPI (Nilai KPI Budi di Januari 2025)**
- Kehadiran: Score 95
- Kualitas Pekerjaan: Score 88
- Target Proyek: Score 90
- Periode: 31 Januari 2025

### Hasil Laporan:
| Nama Karyawan | Divisi | Posisi | KPI | Nilai | Periode |
|---------------|--------|--------|-----|-------|---------|
| Budi Santoso | IT | Software Engineer | Kehadiran | 95 | Jan 2025 |
| Budi Santoso | IT | Software Engineer | Kualitas Pekerjaan | 88 | Jan 2025 |
| Budi Santoso | IT | Software Engineer | Target Proyek | 90 | Jan 2025 |

## 🔄 Cara Kerja Sistem

1. **Budi login** dengan username "budi123"
2. Sistem mengenali bahwa ini adalah karyawan dengan ID 1
3. Sistem mengambil data karyawan: divisi IT, posisi Software Engineer
4. Sistem menampilkan nilai KPI untuk periode Januari 2025
5. Sistem menggabungkan semua data untuk membuat laporan lengkap

## 📊 Penjelasan Per Tabel

### Tabel Master Data (jarang berubah):
- **Position**: Daftar jabatan di perusahaan
- **Division**: Daftar divisi/departemen  
- **KPI**: Jenis-jenis indikator penilaian

### Tabel Data Karyawan:
- **User**: Akun untuk login (fokus autentikasi)
- **Employee**: Profil karyawan internal (fokus data pegawai)

### Tabel Transaksi (sering berubah):
- **EmployeeKPI**: Nilai penilaian (ditambah/diupdate tiap periode)

---

*Database ini dirancang fleksibel dan mudah dikembangkan untuk sistem penilaian karyawan di berbagai jenis perusahaan.*
