# Division API Documentation

API untuk manajemen divisi perusahaan. Semua endpoint memerlukan authentication, dan operasi create/update/delete memerlukan role ADMIN.

## Base URL
```
http://localhost:3000/api/divisions
```

## Authentication
Semua endpoint memerlukan header Authorization dengan JWT token:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. GET /api/divisions - List Semua Divisi

**Permission**: User (butuh login)  
**Method**: GET

### Query Parameters (Optional)
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Halaman ke berapa |
| limit | number | 10 | Jumlah data per halaman |
| search | string | "" | Cari di nama/deskripsi divisi |
| includeEmployees | boolean | false | Sertakan data karyawan |

### Contoh Request
```javascript
// React/JavaScript
const response = await fetch('/api/divisions?page=1&limit=5&search=IT&includeEmployees=true', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Response Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "divisions": [
      {
        "id": "div-123-uuid",
        "name": "IT Department",
        "description": "Divisi Teknologi Informasi",
        "weight": 85,
        "createdAt": "2024-01-15T08:30:00.000Z",
        "updatedAt": "2024-01-15T08:30:00.000Z",
        "_count": {
          "employees": 12
        },
        "employees": [
          {
            "id": "emp-456-uuid",
            "employeeNumber": "EMP001",
            "user": {
              "id": "user-789-uuid",
              "name": "Andi Dea",
              "email": "andi.dea@company.com"
            },
            "position": {
              "id": "pos-101-uuid",
              "name": "Senior Developer"
            }
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 15,
      "limit": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 2. GET /api/divisions/:id - Detail Divisi

**Permission**: User (butuh login)  
**Method**: GET

### Contoh Request
```javascript
const response = await fetch('/api/divisions/div-123-uuid', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Response Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "division": {
      "id": "div-123-uuid",
      "name": "IT Department",
      "description": "Divisi Teknologi Informasi dan Sistem",
      "weight": 85,
      "createdAt": "2024-01-15T08:30:00.000Z",
      "updatedAt": "2024-01-15T08:30:00.000Z",
      "_count": {
        "employees": 12
      },
      "employees": [
        {
          "id": "emp-456-uuid",
          "employeeNumber": "EMP001",
          "user": {
            "id": "user-789-uuid",
            "name": "Andi Dea",
            "email": "andi.dea@company.com",
            "role": "USER",
            "verified": true
          },
          "position": {
            "id": "pos-101-uuid",
            "name": "Senior Developer",
            "description": "Pengembang sistem senior"
          }
        }
      ]
    }
  }
}
```

### Response Error (404)
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "division": ["Division not found"]
  }
}
```

---

## 3. POST /api/divisions - Buat Divisi Baru

**Permission**: Admin only  
**Method**: POST

### Request Body
```json
{
  "name": "Marketing Department",
  "description": "Divisi Pemasaran dan Promosi",
  "weight": 75
}
```

### Validasi
- `name`: Required, minimal 2 karakter, harus unique
- `description`: Optional
- `weight`: Optional, harus angka positif

### Contoh Request
```javascript
const response = await fetch('/api/divisions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Marketing Department",
    description: "Divisi Pemasaran dan Promosi",
    weight: 75
  })
});
```

### Response Success (201)
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Division created successfully",
    "division": {
      "id": "div-new-uuid",
      "name": "Marketing Department",
      "description": "Divisi Pemasaran dan Promosi",
      "weight": 75,
      "createdAt": "2024-01-16T10:15:00.000Z",
      "updatedAt": "2024-01-16T10:15:00.000Z"
    }
  }
}
```

### Response Error (422)
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["Division name already exists"],
    "weight": ["Weight must be a positive number"]
  }
}
```

---

## 4. PUT /api/divisions/:id - Update Divisi

**Permission**: Admin only  
**Method**: PUT

### Request Body (semua field optional)
```json
{
  "name": "IT & Digital Department",
  "description": "Divisi Teknologi Informasi dan Digital",
  "weight": 90
}
```

### Contoh Request
```javascript
const response = await fetch('/api/divisions/div-123-uuid', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "IT & Digital Department",
    weight: 90
  })
});
```

### Response Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Division updated successfully",
    "division": {
      "id": "div-123-uuid",
      "name": "IT & Digital Department",
      "description": "Divisi Teknologi Informasi dan Digital",
      "weight": 90,
      "createdAt": "2024-01-15T08:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z",
      "_count": {
        "employees": 12
      }
    }
  }
}
```

---

## 5. DELETE /api/divisions/:id - Hapus Divisi

**Permission**: Admin only  
**Method**: DELETE

### Contoh Request
```javascript
const response = await fetch('/api/divisions/div-123-uuid', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Response Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Division deleted successfully"
  }
}
```

### Response Error (409) - Masih ada karyawan
```json
{
  "status": "error",
  "code": 409,
  "errors": {
    "division": [
      "Cannot delete division with existing employees (12 employees). Please reassign or remove employees first."
    ]
  }
}
```

---

## Error Responses

### 401 Unauthorized - Belum login
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "auth": ["Authentication required"]
  }
}
```

### 403 Forbidden - Bukan admin
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "auth": ["Admin access required"]
  }
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "code": 500,
  "errors": {
    "server": ["Database connection failed"]
  }
}
```

---

## React Hook Example

```javascript
import { useState, useEffect } from 'react';

// Custom hook untuk division management
export const useDivisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all divisions
  const fetchDivisions = async (params = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/divisions?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setDivisions(data.data.divisions);
      } else {
        setError(data.errors);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Create division
  const createDivision = async (divisionData) => {
    try {
      const response = await fetch('/api/divisions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(divisionData)
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        await fetchDivisions(); // Refresh list
        return { success: true, data: data.data };
      } else {
        return { success: false, errors: data.errors };
      }
    } catch (err) {
      return { success: false, errors: { network: ['Connection failed'] } };
    }
  };

  return {
    divisions,
    loading,
    error,
    fetchDivisions,
    createDivision
  };
};

// Usage dalam component
const DivisionList = () => {
  const { divisions, loading, error, fetchDivisions } = useDivisions();

  useEffect(() => {
    fetchDivisions({ 
      page: 1, 
      limit: 10, 
      includeEmployees: true 
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div>
      {divisions.map(division => (
        <div key={division.id}>
          <h3>{division.name}</h3>
          <p>{division.description}</p>
          <small>{division._count.employees} karyawan</small>
        </div>
      ))}
    </div>
  );
};
```

---

## Tips untuk Frontend Developer

1. **Error Handling**: Selalu cek `data.status` untuk menentukan success/error
2. **Loading State**: Implement loading indicator untuk UX yang baik  
3. **Pagination**: Gunakan pagination info untuk navigasi halaman
4. **Search**: Debounce search input untuk mengurangi API calls
5. **Token Management**: Simpan JWT token di localStorage/sessionStorage
6. **Admin Check**: Cek role user sebelum menampilkan tombol create/edit/delete