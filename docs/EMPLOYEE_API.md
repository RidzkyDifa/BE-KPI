# 👥 Dokumentasi API Employee (Karyawan)

Dokumentasi lengkap REST API untuk manajemen data karyawan dalam Sistem KPI.

## 🔐 **Autentikasi Diperlukan**

Semua endpoint memerlukan token autentikasi di header:
```javascript
headers: {
  'Authorization': 'Bearer your-jwt-token',
  'Content-Type': 'application/json'
}
```

---

## **1. 📋 Ambil Semua Data Karyawan**

**Endpoint:** `GET /api/employees`  
**Autentikasi:** 🔒 Harus login (USER/ADMIN)

**Parameter Query**
- `page` (opsional): Nomor halaman, default: 1
- `limit` (opsional): Jumlah data per halaman, default: 10  
- `search` (opsional): Cari berdasarkan nama, nomor karyawan, atau PNOS
- `divisionId` (opsional): Filter berdasarkan ID divisi
- `positionId` (opsional): Filter berdasarkan ID posisi

**Contoh Penggunaan Fetch**
```javascript
const getAllEmployees = async (page = 1, limit = 10, search = '', filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(filters.divisionId && { divisionId: filters.divisionId }),
      ...(filters.positionId && { positionId: filters.positionId })
    });

    const response = await fetch(`http://localhost:3000/api/employees?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Employees loaded:', data.data.employees);
      return data.data;
    } else {
      console.error('Failed to load employees:', data.errors);
      throw new Error('Failed to fetch employees');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan saat memuat data karyawan.');
  }
};

// Contoh penggunaan di React
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        const result = await getAllEmployees(1, 10, searchTerm, { divisionId, positionId });
        setEmployees(result.employees);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [searchTerm, divisionId, positionId]);
};
```

**Response (Respon)**

**✅ Berhasil (200)**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employees": [
      {
        "id": "emp-uuid-1",
        "employeeNumber": "EMP001",
        "pnosNumber": "PNOS2024001",
        "dateJoined": "2020-01-15T00:00:00.000Z",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "position": {
          "id": "pos-uuid-1",
          "name": "General Manager",
          "description": "Memimpin operasional perusahaan"
        },
        "division": {
          "id": "div-uuid-1", 
          "name": "Operations",
          "description": "Operasional harian dan quality control",
          "weight": 10
        },
        "user": {
          "id": "user-uuid-1",
          "name": "Budi Santoso",
          "email": "budi.santoso@technocore.co.id",
          "role": "ADMIN",
          "verified": true
        },
        "_count": {
          "employeeKpis": 24
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 45,
      "limit": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## **2. 👤 Ambil Data Karyawan Berdasarkan ID**

**Endpoint:** `GET /api/employees/:id`  
**Autentikasi:** 🔒 Harus login (USER/ADMIN)

**Contoh Penggunaan Fetch**
```javascript
const getEmployeeById = async (employeeId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Employee detail:', data.data.employee);
      return data.data.employee;
    } else {
      console.error('Employee not found:', data.errors);
      throw new Error('Employee not found');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan saat memuat detail karyawan.');
  }
};

// Contoh komponen React
const EmployeeDetail = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employeeData = await getEmployeeById(employeeId);
        setEmployee(employeeData);
      } catch (error) {
        console.error('Failed to load employee:', error);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);
};
```

**Response (Respon)**

**✅ Berhasil (200)**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employee": {
      "id": "emp-uuid-1",
      "employeeNumber": "EMP015",
      "pnosNumber": null,
      "dateJoined": "2023-08-15T00:00:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "position": {
        "id": "pos-uuid-2",
        "name": "Senior Staff",
        "description": "Staf senior dengan pengalaman 3+ tahun"
      },
      "division": {
        "id": "div-uuid-2",
        "name": "Information Technology",
        "description": "Pengembangan sistem dan infrastruktur IT",
        "weight": 25
      },
      "user": {
        "id": "user-uuid-2",
        "name": "Ahmad Rizki",
        "email": "ahmad.rizki@technocore.co.id",
        "role": "USER",
        "verified": true,
        "createdAt": "2024-01-10T08:00:00.000Z"
      },
      "employeeKpis": [
        {
          "id": "kpi-uuid-1",
          "score": 95.0,
          "period": "2024-08-01T00:00:00.000Z",
          "createdAt": "2024-09-05T10:30:00.000Z",
          "updatedAt": "2024-09-05T10:30:00.000Z",
          "createdBy": "admin-uuid",
          "updatedBy": null,
          "kpi": {
            "id": "kpi-master-1",
            "name": "Kehadiran Bulanan"
          }
        }
      ]
    }
  }
}
```

**❌ Tidak Ditemukan (404)**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "employee": ["Employee not found"]
  }
}
```

---

## **3. ➕ Buat Karyawan Baru**

**Endpoint:** `POST /api/employees`  
**Autentikasi:** 🔒 Harus Admin

**Request Body (Data yang Dikirim)**
```json
{
  "employeeNumber": "EMP025",
  "pnosNumber": "PNOS2024025",
  "dateJoined": "2024-09-01",
  "positionId": "position-uuid",
  "divisionId": "division-uuid",
  "userId": "user-uuid"
}
```

**Aturan Validasi**
- `employeeNumber` (opsional): Harus unik jika diisi
- `pnosNumber` (opsional): Nomor PNOS perusahaan
- `dateJoined` (opsional): Format tanggal yang valid (YYYY-MM-DD)
- `positionId` (opsional): Harus ada di tabel posisi
- `divisionId` (opsional): Harus ada di tabel divisi
- `userId` (opsional): Harus ada dan belum terhubung ke karyawan lain

**Contoh Penggunaan Fetch**
```javascript
const createEmployee = async (employeeData) => {
  try {
    const response = await fetch('http://localhost:3000/api/employees', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Employee created successfully:', data.data.employee);
      alert('Karyawan berhasil dibuat!');
      return data.data.employee;
    } else {
      console.error('Validation errors:', data.errors);
      handleValidationErrors(data.errors);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan saat membuat karyawan baru.');
  }
};

// Contoh form React
const CreateEmployeeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    employeeNumber: '',
    pnosNumber: '',
    dateJoined: '',
    positionId: '',
    divisionId: '',
    userId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const newEmployee = await createEmployee(formData);
      if (newEmployee) {
        onSuccess?.(newEmployee);
        setFormData({ employeeNumber: '', pnosNumber: '', dateJoined: '', positionId: '', divisionId: '', userId: '' });
      }
    } catch (error) {
      console.error('Failed to create employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidationErrors = (validationErrors) => {
    setErrors(validationErrors);
  };
};
```

**Response (Respon)**

**✅ Berhasil (201)**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Employee created successfully",
    "employee": {
      "id": "new-emp-uuid",
      "employeeNumber": "EMP025",
      "pnosNumber": "PNOS2024025",
      "dateJoined": "2024-09-01T00:00:00.000Z",
      "createdAt": "2024-09-15T14:20:00.000Z",
      "updatedAt": "2024-09-15T14:20:00.000Z",
      "position": {
        "id": "pos-uuid",
        "name": "Staff",
        "description": "Staf regular pelaksana tugas harian"
      },
      "division": {
        "id": "div-uuid",
        "name": "Sales & Marketing",
        "description": "Penjualan produk dan strategi pemasaran"
      },
      "user": {
        "id": "user-uuid",
        "name": "Maya Putri",
        "email": "maya.putri@technocore.co.id",
        "role": "USER"
      }
    }
  }
}
```

**❌ Error Validasi (422)**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "employeeNumber": ["Employee number already exists"],
    "positionId": ["Position not found"],
    "userId": ["User already linked to another employee"]
  }
}
```

**❌ Tidak Diizinkan (403)**
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "auth": ["Access denied. Admin role required"]
  }
}
```

---

## **4. ✏️ Update Data Karyawan**

**Endpoint:** `PUT /api/employees/:id`  
**Autentikasi:** 🔒 Harus Admin

**Request Body (Data yang Dikirim)**
```json
{
  "employeeNumber": "EMP025-UPDATED",
  "pnosNumber": "PNOS2024025-NEW",
  "dateJoined": "2024-09-15",
  "positionId": "new-position-uuid",
  "divisionId": "new-division-uuid"
}
```

**Contoh Penggunaan Fetch**
```javascript
const updateEmployee = async (employeeId, updateData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Employee updated successfully:', data.data.employee);
      alert('Data karyawan berhasil diperbarui!');
      return data.data.employee;
    } else {
      console.error('Update failed:', data.errors);
      handleValidationErrors(data.errors);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan saat memperbarui data karyawan.');
  }
};

// Contoh form edit React
const EditEmployeeForm = ({ employee, onSuccess }) => {
  const [formData, setFormData] = useState({
    employeeNumber: employee?.employeeNumber || '',
    pnosNumber: employee?.pnosNumber || '',
    dateJoined: employee?.dateJoined ? employee.dateJoined.split('T')[0] : '',
    positionId: employee?.positionId || '',
    divisionId: employee?.divisionId || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = await updateEmployee(employee.id, formData);
      if (updatedEmployee) {
        onSuccess?.(updatedEmployee);
      }
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };
};
```

**Response (Respon)**

**✅ Berhasil (200)**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee updated successfully",
    "employee": {
      "id": "emp-uuid",
      "employeeNumber": "EMP025-UPDATED",
      "pnosNumber": "PNOS2024025-NEW",
      "dateJoined": "2024-09-15T00:00:00.000Z",
      "updatedAt": "2024-09-20T11:15:00.000Z",
      "position": {
        "id": "new-pos-uuid",
        "name": "Team Leader"
      },
      "division": {
        "id": "new-div-uuid", 
        "name": "Human Resources & GA"
      },
      "user": {
        "id": "user-uuid",
        "name": "Maya Putri",
        "email": "maya.putri@technocore.co.id",
        "role": "USER"
      }
    }
  }
}
```

---

## **5. ❌ Hapus Karyawan**

**Endpoint:** `DELETE /api/employees/:id`  
**Autentikasi:** 🔒 Harus Admin

**Contoh Penggunaan Fetch**
```javascript
const deleteEmployee = async (employeeId) => {
  try {
    // Konfirmasi penghapusan
    const confirmDelete = window.confirm(
      'Apakah Anda yakin ingin menghapus karyawan ini? Semua data KPI akan ikut terhapus dan tidak dapat dikembalikan.'
    );
    
    if (!confirmDelete) return;

    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Employee deleted successfully');
      alert('Karyawan berhasil dihapus!');
      return true;
    } else {
      console.error('Delete failed:', data.errors);
      alert(data.errors.employee?.[0] || 'Gagal menghapus karyawan');
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan saat menghapus karyawan.');
    return false;
  }
};

// Contoh komponen React
const EmployeeDeleteButton = ({ employee, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const success = await deleteEmployee(employee.id);
      if (success) {
        onDeleted?.(employee.id);
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? 'Menghapus...' : 'Hapus'}
    </button>
  );
};
```

**Response (Respon)**

**✅ Berhasil (200)**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee deleted successfully"
  }
}
```

**❌ Memiliki Data KPI (400)**
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "employee": ["Cannot delete employee with existing KPI records (24 records). All KPI data will be permanently deleted. Use with caution."]
  }
}
```

---

## **6. 🔗 Hubungkan Karyawan ke User**

**Endpoint:** `POST /api/employees/:id/link-user`  
**Autentikasi:** 🔒 Harus Admin

**Request Body (Data yang Dikirim)**
```json
{
  "userId": "user-uuid-to-link"
}
```

**Contoh Penggunaan Fetch**
```javascript
const linkEmployeeToUser = async (employeeId, userId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}/link-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Employee linked successfully:', data.data.employee);
      alert('Karyawan berhasil di-link ke user!');
      return data.data.employee;
    } else {
      console.error('Link failed:', data.errors);
      alert(Object.values(data.errors)[0]?.[0] || 'Gagal link employee ke user');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan saat link employee ke user.');
  }
};

// Contoh komponen React
const LinkUserModal = ({ employee, users, onSuccess, onClose }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const availableUsers = users.filter(user => !user.employeeId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setLoading(true);
    try {
      const linkedEmployee = await linkEmployeeToUser(employee.id, selectedUserId);
      if (linkedEmployee) {
        onSuccess?.(linkedEmployee);
        onClose?.();
      }
    } catch (error) {
      console.error('Failed to link employee:', error);
    } finally {
      setLoading(false);
    }
  };
};
```

**Response (Respon)**

**✅ Berhasil (200)**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee linked to user successfully",
    "employee": {
      "id": "emp-uuid",
      "employeeNumber": "EMP025",
      "user": {
        "id": "user-uuid",
        "name": "Maya Putri", 
        "email": "maya.putri@technocore.co.id",
        "role": "USER",
        "verified": true
      }
    }
  }
}
```

**❌ User Sudah Terhubung (400)**
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "user": ["User already linked to another employee"]
  }
}
```

---

## **7. 🔓 Putuskan Hubungan Karyawan dari User**

**Endpoint:** `POST /api/employees/:id/unlink-user`  
**Autentikasi:** 🔒 Harus Admin

**Contoh Penggunaan Fetch**
```javascript
const unlinkEmployeeFromUser = async (employeeId) => {
  try {
    const confirmUnlink = window.confirm(
      'Apakah Anda yakin ingin unlink employee dari user? User tidak akan bisa login sebagai karyawan ini lagi.'
    );
    
    if (!confirmUnlink) return;

    const response = await fetch(`http://localhost:3000/api/employees/${employeeId}/unlink-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Employee unlinked successfully');
      alert('Employee berhasil di-unlink dari user!');
      return true;
    } else {
      console.error('Unlink failed:', data.errors);
      alert(data.errors.employee?.[0] || 'Gagal unlink employee');
      return false;
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan saat unlink employee.');
    return false;
  }
};

// Contoh komponen React
const UnlinkUserButton = ({ employee, onUnlinked }) => {
  const [loading, setLoading] = useState(false);

  const handleUnlink = async () => {
    setLoading(true);
    try {
      const success = await unlinkEmployeeFromUser(employee.id);
      if (success) {
        onUnlinked?.(employee.id);
      }
    } catch (error) {
      console.error('Failed to unlink employee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!employee.user) {
    return <span className="text-gray-500">Not linked to any user</span>;
  }

  return (
    <button 
      onClick={handleUnlink} 
      disabled={loading}
      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:opacity-50"
    >
      {loading ? 'Unlinking...' : 'Unlink User'}
    </button>
  );
};
```

**Response (Respon)**

**✅ Berhasil (200)**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee unlinked from user successfully"
  }
}
```

**❌ Tidak Terhubung (400)**
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "employee": ["Employee is not linked to any user"]
  }
}
```

---

## 🔒 **Response Error yang Sering Muncul**

**❌ Tidak Terautentikasi (401)**
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "auth": ["Unauthorized"]
  }
}
```

**❌ Tidak Diizinkan (403)**
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "auth": ["Access denied. Admin role required"]
  }
}
```

**❌ Kesalahan Server (500)**
```json
{
  "status": "error",
  "code": 500,
  "errors": {
    "server": ["Internal server error"]
  }
}
```

---

## 📝 **Interface TypeScript**

```typescript
interface Employee {
  id: string;
  employeeNumber?: string;
  pnosNumber?: string;
  dateJoined?: Date;
  createdAt: Date;
  updatedAt: Date;
  position?: {
    id: string;
    name: string;
    description?: string;
  };
  division?: {
    id: string;
    name: string;
    description?: string;
    weight?: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    verified: boolean;
  };
  employeeKpis?: EmployeeKPI[];
  _count?: {
    employeeKpis: number;
  };
}

interface EmployeeKPI {
  id: string;
  score: number;
  period: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  kpi: {
    id: string;
    name: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

---

## 🎯 **Best Practice untuk Frontend**

1. **Selalu handle error autentikasi** - redirect ke login jika 401
2. **Tampilkan loading state** saat proses API call
3. **Tampilkan error validasi** dengan jelas ke user
4. **Konfirmasi aksi yang berbahaya** (hapus, unlink)
5. **Cache data karyawan** untuk mengurangi API call
6. **Gunakan pagination** untuk daftar karyawan yang banyak
7. **Implementasikan search/filter** untuk UX yang lebih baik
8. **Handle network error** dengan baik

**Selamat coding! 🚀**
