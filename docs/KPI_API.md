# KPI API Documentation

Base URL: `/api/kpis`

## Authentication
All endpoints require Bearer token authentication.
Admin endpoints require admin role.

## Endpoints

### 1. Get All KPIs
```
GET /api/kpis
```

**Auth Required:** Yes (Bearer Token)  
**Admin Required:** No

**Request Headers:**
```json
{
  "Authorization": "Bearer <your_jwt_token>"
}
```

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "kpis": [
      {
        "id": "kpi-001",
        "name": "Sales Performance",
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T08:00:00.000Z",
        "employeeKpis": [
          {
            "id": "emp-kpi-001",
            "score": 85,
            "period": "2024-Q1",
            "employee": {
              "id": "emp-001",
              "user": {
                "id": "user-001",
                "name": "Andi Dea",
                "email": "andi.dea@company.com"
              },
              "division": {
                "id": "div-001",
                "name": "Sales"
              },
              "position": {
                "id": "pos-001",
                "name": "Sales Manager"
              }
            }
          }
        ]
      }
    ],
    "total": 1
  }
}
```

**Error Response (500):**
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

### 2. Get KPI by ID
```
GET /api/kpis/:id
```

**Auth Required:** Yes (Bearer Token)  
**Admin Required:** No

**Request Headers:**
```json
{
  "Authorization": "Bearer <your_jwt_token>"
}
```

**URL Parameters:**
- `id` (string): KPI ID

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "kpi": {
      "id": "kpi-001",
      "name": "Sales Performance",
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T08:00:00.000Z",
      "employeeKpis": [
        {
          "id": "emp-kpi-001",
          "score": 85,
          "period": "2024-Q1",
          "employee": {
            "id": "emp-001",
            "user": {
              "id": "user-001",
              "name": "Andi Dea",
              "email": "andi.dea@company.com"
            },
            "division": {
              "id": "div-001",
              "name": "Sales"
            },
            "position": {
              "id": "pos-001",
              "name": "Sales Manager"
            }
          }
        },
        {
          "id": "emp-kpi-002",
          "score": 92,
          "period": "2024-Q2",
          "employee": {
            "id": "emp-002",
            "user": {
              "id": "user-002",
              "name": "Andi Dea 2",
              "email": "andi.dea2@company.com"
            },
            "division": {
              "id": "div-001",
              "name": "Sales"
            },
            "position": {
              "id": "pos-002",
              "name": "Sales Executive"
            }
          }
        }
      ]
    }
  }
}
```

**Error Response (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "kpi": ["KPI not found"]
  }
}
```

---

### 3. Create New KPI
```
POST /api/kpis
```

**Auth Required:** Yes (Bearer Token)  
**Admin Required:** Yes

**Request Headers:**
```json
{
  "Authorization": "Bearer <your_admin_jwt_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "Customer Satisfaction"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "KPI created successfully",
    "kpi": {
      "id": "kpi-002",
      "name": "Customer Satisfaction",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  }
}
```

**Validation Error Response (422):**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["Name must be at least 2 characters"]
  }
}
```

**Duplicate Name Error Response (422):**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["KPI name already exists"]
  }
}
```

---

### 4. Update KPI
```
PUT /api/kpis/:id
```

**Auth Required:** Yes (Bearer Token)  
**Admin Required:** Yes

**Request Headers:**
```json
{
  "Authorization": "Bearer <your_admin_jwt_token>",
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` (string): KPI ID to update

**Request Body:**
```json
{
  "name": "Updated Customer Satisfaction"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "KPI updated successfully",
    "kpi": {
      "id": "kpi-002",
      "name": "Updated Customer Satisfaction",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**KPI Not Found Error Response (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "kpi": ["KPI not found"]
  }
}
```

**Validation Error Response (422):**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["Name must be at least 2 characters"]
  }
}
```

---

### 5. Delete KPI
```
DELETE /api/kpis/:id
```

**Auth Required:** Yes (Bearer Token)  
**Admin Required:** Yes

**Request Headers:**
```json
{
  "Authorization": "Bearer <your_admin_jwt_token>"
}
```

**URL Parameters:**
- `id` (string): KPI ID to delete

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "KPI deleted successfully"
  }
}
```

**KPI Not Found Error Response (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "kpi": ["KPI not found"]
  }
}
```

**Cannot Delete Error Response (400):**
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "kpi": ["Cannot delete KPI that has assessments associated with it"]
  }
}
```

---

## Common Error Responses

### Unauthorized (401)
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "auth": ["Unauthorized - Invalid or missing token"]
  }
}
```

### Forbidden (403)
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "auth": ["Forbidden - Admin access required"]
  }
}
```

### Server Error (500)
```json
{
  "status": "error",
  "code": 500,
  "errors": {
    "server": ["Internal server error"]
  }
}
```

## Notes
- All timestamps are in ISO 8601 format
- KPI names must be at least 2 characters long
- KPI names must be unique
- KPIs with existing assessments cannot be deleted
- Employee KPIs are sorted by period (newest first) in single KPI view