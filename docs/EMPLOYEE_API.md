# Employee API Documentation

## Base URL
```
/api/employees
```

---

## 1. Get All Employees

**Endpoint:** `GET /api/employees`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | string | "1" | Page number for pagination |
| `limit` | string | "10" | Number of items per page |
| `search` | string | "" | Search in employee number, PNOS number, or user name |
| `divisionId` | string | "" | Filter by division ID |
| `positionId` | string | "" | Filter by position ID |

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employees": [
      {
        "id": "emp-456",
        "employeeNumber": "EMP001",
        "pnosNumber": "PNOS001",
        "dateJoined": "2023-01-15T00:00:00.000Z",
        "positionId": "pos-001",
        "divisionId": "div-001",
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "position": {
          "id": "pos-001",
          "name": "Senior Developer",
          "description": "Lead software development projects"
        },
        "division": {
          "id": "div-001",
          "name": "IT Development",
          "description": "Software development and technology solutions",
          "weight": 25.5
        },
        "user": {
          "id": "user-123",
          "name": "Andi Dea",
          "email": "andi.dea@company.com",
          "role": "ADMIN",
          "verified": true
        },
        "_count": {
          "employeeKpis": 8
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalCount": 15,
      "limit": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 2. Get Employee by ID

**Endpoint:** `GET /api/employees/:id`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Path Parameters
- `id` (string, required): Employee ID

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employee": {
      "id": "emp-456",
      "employeeNumber": "EMP001",
      "pnosNumber": "PNOS001",
      "dateJoined": "2023-01-15T00:00:00.000Z",
      "positionId": "pos-001",
      "divisionId": "div-001",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "position": {
        "id": "pos-001",
        "name": "Senior Developer",
        "description": "Lead software development projects"
      },
      "division": {
        "id": "div-001",
        "name": "IT Development",
        "description": "Software development and technology solutions",
        "weight": 25.5
      },
      "user": {
        "id": "user-123",
        "name": "Andi Dea",
        "email": "andi.dea@company.com",
        "role": "ADMIN",
        "verified": true,
        "createdAt": "2024-11-01T10:00:00.000Z"
      },
      "employeeKpis": [
        {
          "id": "assessment-123",
          "employeeId": "emp-456",
          "kpiId": "kpi-789",
          "weight": 25.5,
          "target": 100.0,
          "actual": 85.0,
          "score": 85.0,
          "achievement": 21.675,
          "period": "2024-11-01T00:00:00.000Z",
          "createdAt": "2024-11-01T10:00:00.000Z",
          "updatedAt": "2024-11-01T10:00:00.000Z",
          "kpi": {
            "id": "kpi-789",
            "name": "Code Quality Score"
          }
        }
      ]
    }
  }
}
```

### Error Response (404)
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

## 3. Create Employee

**Endpoint:** `POST /api/employees`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Request Body
```json
{
  "employeeNumber": "EMP003",
  "pnosNumber": "PNOS003",
  "positionId": "pos-003",
  "divisionId": "div-003",
  "userId": "user-125"
}
```

**Field Details:**
- `employeeNumber`: Optional, must be unique if provided
- `pnosNumber`: Optional  
- `positionId`: Optional, must exist in positions table
- `divisionId`: Optional, must exist in divisions table
- `userId`: Optional, must exist and not already linked to another employee

### Success Response (201)
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Employee created successfully",
    "employee": {
      "id": "emp-890",
      "employeeNumber": "EMP003",
      "pnosNumber": "PNOS003",
      "dateJoined": "2024-12-01T11:00:00.000Z",
      "positionId": "pos-003",
      "divisionId": "div-003",
      "createdAt": "2024-12-01T11:00:00.000Z",
      "updatedAt": "2024-12-01T11:00:00.000Z",
      "position": {
        "id": "pos-003",
        "name": "HR Specialist",
        "description": "Handle recruitment and employee relations"
      },
      "division": {
        "id": "div-003",
        "name": "Human Resources",
        "description": "Employee management and organizational development"
      },
      "user": {
        "id": "user-125",
        "name": "Andi Dea3",
        "email": "andi.dea3@company.com",
        "role": "USER"
      }
    }
  }
}
```

### Error Response (422) - Validation Error
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "employeeNumber": ["Employee number already exists"],
    "positionId": ["Position not found"],
    "divisionId": ["Division not found"],
    "userId": ["User already linked to another employee"]
  }
}
```

---

## 4. Update Employee

**Endpoint:** `PUT /api/employees/:id`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Employee ID

### Request Body
```json
{
  "employeeNumber": "EMP003-UPDATED",
  "pnosNumber": "PNOS003-NEW",
  "dateJoined": "2023-07-01T00:00:00.000Z",
  "positionId": "pos-004",
  "divisionId": "div-002"
}
```

**Field Details:**
- All fields are optional - only provided fields will be updated
- `employeeNumber`: Must be unique (excluding current employee)
- `dateJoined`: ISO date format, can be null to remove date
- `positionId`: Must exist if provided, can be null to remove position
- `divisionId`: Must exist if provided, can be null to remove division

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee updated successfully",
    "employee": {
      "id": "emp-890",
      "employeeNumber": "EMP003-UPDATED",
      "pnosNumber": "PNOS003-NEW",
      "dateJoined": "2023-07-01T00:00:00.000Z",
      "positionId": "pos-004",
      "divisionId": "div-002",
      "createdAt": "2024-12-01T11:00:00.000Z",
      "updatedAt": "2024-12-01T11:30:00.000Z",
      "position": {
        "id": "pos-004",
        "name": "Junior Developer",
        "description": "Support software development activities"
      },
      "division": {
        "id": "div-002",
        "name": "Marketing",
        "description": "Brand promotion and customer acquisition"
      },
      "user": {
        "id": "user-125",
        "name": "Andi Dea3",
        "email": "andi.dea3@company.com",
        "role": "USER"
      }
    }
  }
}
```

### Error Response (404)
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "employee": ["Employee not found"]
  }
}
```

### Error Response (422) - Validation Error
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "employeeNumber": ["Employee number already exists"],
    "positionId": ["Position not found"],
    "divisionId": ["Division not found"]
  }
}
```

---

## 5. Delete Employee

**Endpoint:** `DELETE /api/employees/:id`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Employee ID

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee deleted successfully"
  }
}
```

### Error Response (404)
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "employee": ["Employee not found"]
  }
}
```

### Error Response (409) - Cannot Delete
```json
{
  "status": "error",
  "code": 409,
  "errors": {
    "employee": ["Cannot delete employee with existing KPI records (8 records). All KPI data will be permanently deleted. Use with caution."]
  }
}
```

---

## 6. Link Employee to User

**Endpoint:** `POST /api/employees/:id/link-user`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Employee ID

### Request Body
```json
{
  "userId": "user-126"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee linked to user successfully",
    "employee": {
      "id": "emp-891",
      "employeeNumber": "EMP004",
      "pnosNumber": "PNOS004",
      "dateJoined": "2023-08-10T00:00:00.000Z",
      "positionId": "pos-002",
      "divisionId": "div-001",
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T11:45:00.000Z",
      "position": {
        "id": "pos-002",
        "name": "Marketing Manager",
        "description": "Lead marketing campaigns and strategies"
      },
      "division": {
        "id": "div-001",
        "name": "IT Development",
        "description": "Software development and technology solutions"
      },
      "user": {
        "id": "user-126",
        "name": "Andi Dea 2",
        "email": "andi.dea2.new@company.com",
        "role": "USER",
        "verified": true
      }
    }
  }
}
```

### Error Responses
- **404** - Employee not found
- **404** - User not found  
- **400** - User already linked to another employee
- **400** - Employee already linked to a user

---

## 7. Unlink Employee from User

**Endpoint:** `POST /api/employees/:id/unlink-user`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Employee ID

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Employee unlinked from user successfully"
  }
}
```

### Error Responses
- **404** - Employee not found
- **400** - Employee is not linked to any user

---

## Search & Filter Examples

```bash
# Search employees by name, employee number, or PNOS number
GET /api/employees?search=EMP001

# Filter by division
GET /api/employees?divisionId=div-001

# Filter by position and division
GET /api/employees?positionId=pos-001&divisionId=div-001

# Combined query with pagination
GET /api/employees?search=Andi&divisionId=div-001&page=1&limit=5
```

---

## Business Rules

1. **Employee Number Uniqueness** - No two employees can have the same employee number
2. **User Linking** - One user can only be linked to one employee, and vice versa  
3. **Position/Division Validation** - Must exist in respective tables if provided
4. **KPI Protection** - Cannot delete employees with existing KPI records
5. **Auto Unlink** - When employee is deleted, user link is automatically removed
6. **Search Functionality** - Searches across employee number, PNOS number, and linked user name
7. **Notification** - Admin receives notification when new employee is created

---

## Authentication

All endpoints require Bearer Token:
```
Authorization: Bearer <your-jwt-token>
```

## Admin Requirements

Endpoints requiring admin role:
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee  
- `DELETE /api/employees/:id` - Delete employee
- `POST /api/employees/:id/link-user` - Link employee to user
- `POST /api/employees/:id/unlink-user` - Unlink employee from user

## Error Codes

- **200** - Success
- **201** - Created successfully
- **400** - Bad request (linking conflicts)
- **404** - Employee/User not found
- **409** - Conflict (cannot delete with KPI records)
- **422** - Validation error
- **500** - Internal server error