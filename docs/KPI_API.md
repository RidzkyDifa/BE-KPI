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
            "weight": 25.0,
            "target": 100.0,
            "actual": 85.0,
            "score": 85.0,
            "achievement": 21.25,
            "period": "2024-01-01T00:00:00.000Z",
            "createdBy": "user-admin-001",
            "updatedBy": "user-admin-001",
            "createdAt": "2024-01-15T08:00:00.000Z",
            "updatedAt": "2024-01-15T08:00:00.000Z",
            "employee": {
              "id": "emp-001",
              "employeeNumber": "EMP001",
              "pnosNumber": "PNOS001",
              "dateJoined": "2023-01-15T08:00:00.000Z",
              "user": {
                "id": "user-001",
                "name": "Andi Dea",
                "email": "andi.dea@company.com"
              },
              "division": {
                "id": "div-001",
                "name": "Sales",
                "weight": 30
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
          "weight": 25.0,
          "target": 100.0,
          "actual": 85.0,
          "score": 85.0,
          "achievement": 21.25,
          "period": "2024-01-01T00:00:00.000Z",
          "createdBy": "user-admin-001",
          "updatedBy": "user-admin-001",
          "createdAt": "2024-01-15T08:00:00.000Z",
          "updatedAt": "2024-01-15T08:00:00.000Z",
          "employee": {
            "id": "emp-001",
            "employeeNumber": "EMP001",
            "pnosNumber": "PNOS001",
            "dateJoined": "2023-01-15T08:00:00.000Z",
            "user": {
              "id": "user-001",
              "name": "Andi Dea",
              "email": "andi.dea@company.com"
            },
            "division": {
              "id": "div-001",
              "name": "Sales",
              "weight": 30
            },
            "position": {
              "id": "pos-001",
              "name": "Sales Manager"
            }
          }
        },
        {
          "id": "emp-kpi-002",
          "weight": 30.0,
          "target": 150.0,
          "actual": 138.0,
          "score": 92.0,
          "achievement": 27.6,
          "period": "2024-02-01T00:00:00.000Z",
          "createdBy": "user-admin-001",
          "updatedBy": "user-admin-002",
          "createdAt": "2024-02-15T08:00:00.000Z",
          "updatedAt": "2024-02-20T10:30:00.000Z",
          "employee": {
            "id": "emp-002",
            "employeeNumber": "EMP002",
            "pnosNumber": "PNOS002",
            "dateJoined": "2023-03-01T08:00:00.000Z",
            "user": {
              "id": "user-002",
              "name": "Andi Dea 2",
              "email": "andi.dea2@company.com"
            },
            "division": {
              "id": "div-001",
              "name": "Sales",
              "weight": 30
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
    "kpi": ["Cannot delete KPI that has employee KPI assessments associated with it"]
  }
}
```

---

## Employee KPI Data Structure

Based on the updated database schema, each `employeeKpi` object now contains the following fields:

### Core KPI Fields
- `id` (string): Unique identifier for the employee KPI record
- `weight` (float): Individual KPI weight as percentage (e.g., 25.0 for 25%)
- `target` (float): Target value set for this KPI
- `actual` (float): Actual achievement/realization value
- `score` (float): KPI score percentage (calculated as `actual / target * 100`)
- `achievement` (float): Final weighted achievement (calculated as `weight * score / 100`)
- `period` (DateTime): Assessment period (typically monthly)

### Audit Trail Fields
- `createdBy` (string): User ID who created this KPI assessment
- `updatedBy` (string): User ID who last updated this KPI assessment
- `createdAt` (DateTime): When the record was created
- `updatedAt` (DateTime): When the record was last updated

### Employee Information
- `employee.employeeNumber` (string): Company employee number/ID
- `employee.pnosNumber` (string): PNOS number (optional)
- `employee.dateJoined` (DateTime): Employee's joining date
- `employee.division.weight` (int): Division weight in overall assessment system

## Business Logic Notes

### KPI Calculation Formula
- **Score**: `(actual / target) * 100`
- **Achievement**: `(weight * score) / 100`

### Data Constraints
- Each employee can only have one KPI assessment per period (enforced by unique constraint on `employeeId`, `kpiId`, and `period`)
- KPI weight should typically be expressed as a percentage (e.g., 25.0 for 25%)
- Period is stored as DateTime but typically represents monthly assessments

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

## Additional Notes
- All timestamps are in ISO 8601 format
- KPI names must be at least 2 characters long and unique
- KPIs with existing employee assessments cannot be deleted
- Employee KPIs are sorted by period (newest first) in single KPI view
- The system supports audit trail tracking for all KPI assessments
- Division weights can be used for overall company performance calculations