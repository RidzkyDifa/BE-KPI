# Assessment API Documentation

## Base URL
```
/api/assessments
```

---

## 1. Get All Assessments

**Endpoint:** `GET /api/assessments`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Query Parameters
```json
{
  "employeeId": "string (optional)",
  "kpiId": "string (optional)", 
  "period": "string (optional) - ISO date format",
  "startDate": "string (optional) - ISO date format",
  "endDate": "string (optional) - ISO date format"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "assessments": [
      {
        "id": "assessment-123",
        "employeeId": "emp-456",
        "kpiId": "kpi-789",
        "weight": 25.5,
        "target": 100.0,
        "actual": 85.0,
        "score": 85.0,
        "achievement": 21.675,
        "period": "2024-12-01T00:00:00.000Z",
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "employee": {
          "id": "emp-456",
          "employeeNumber": "EMP001",
          "user": {
            "id": "user-123",
            "name": "Andi Dea",
            "email": "andi.dea@company.com"
          },
          "division": {
            "id": "div-001",
            "name": "IT Development"
          },
          "position": {
            "id": "pos-001", 
            "name": "Senior Developer"
          }
        },
        "kpi": {
          "id": "kpi-789",
          "name": "Code Quality Score",
          "description": "Measure code quality and best practices"
        }
      }
    ],
    "total": 1
  }
}
```

### Error Response (500)
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

## 2. Get Assessment by ID

**Endpoint:** `GET /api/assessments/:id`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Path Parameters
- `id` (string, required): Assessment ID

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "assessment": {
      "id": "assessment-123",
      "employeeId": "emp-456",
      "kpiId": "kpi-789", 
      "weight": 25.5,
      "target": 100.0,
      "actual": 85.0,
      "score": 85.0,
      "achievement": 21.675,
      "period": "2024-12-01T00:00:00.000Z",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "employee": {
        "id": "emp-456",
        "employeeNumber": "EMP002",
        "user": {
          "id": "user-124",
          "name": "Andi Dea 2",
          "email": "andi.dea2@company.com"
        },
        "division": {
          "id": "div-002",
          "name": "Marketing"
        },
        "position": {
          "id": "pos-002",
          "name": "Marketing Manager"
        }
      },
      "kpi": {
        "id": "kpi-789",
        "name": "Sales Target Achievement",
        "description": "Monthly sales target completion rate"
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
    "assessment": ["Assessment not found"]
  }
}
```

---

## 3. Create Assessment

**Endpoint:** `POST /api/assessments`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Request Body
```json
{
  "employeeId": "emp-456",
  "kpiId": "kpi-789",
  "weight": 25.5,
  "target": 100.0,
  "actual": 85.0,
  "period": "2024-12-01T00:00:00.000Z"
}
```

### Success Response (201)
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Assessment created successfully",
    "assessment": {
      "id": "assessment-124",
      "employeeId": "emp-456",
      "kpiId": "kpi-789",
      "weight": 25.5,
      "target": 100.0,
      "actual": 85.0,
      "score": 85.0,
      "achievement": 21.675,
      "period": "2024-12-01T00:00:00.000Z",
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z",
      "employee": {
        "id": "emp-456",
        "employeeNumber": "EMP003",
        "user": {
          "id": "user-125",
          "name": "Andi Dea3",
          "email": "andi.dea3@company.com"
        },
        "division": {
          "id": "div-003",
          "name": "Human Resources"
        },
        "position": {
          "id": "pos-003",
          "name": "HR Specialist"
        }
      },
      "kpi": {
        "id": "kpi-789",
        "name": "Employee Satisfaction Score",
        "description": "Quarterly employee satisfaction survey results"
      }
    }
  }
}
```

### Error Response (422)
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "employeeId": ["Employee ID is required"],
    "kpiId": ["KPI ID is required"],
    "weight": ["Weight must be between 0.1 and 100"],
    "target": ["Target must be greater than 0"],
    "actual": ["Actual value must be 0 or greater"],
    "period": ["Period is required"],
    "assessment": ["Assessment for this employee, KPI, and period already exists"]
  }
}
```

---

## 4. Update Assessment

**Endpoint:** `PUT /api/assessments/:id`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Assessment ID

### Request Body
```json
{
  "weight": 30.0,
  "target": 120.0,
  "actual": 95.0
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Assessment updated successfully",
    "assessment": {
      "id": "assessment-123",
      "employeeId": "emp-456",
      "kpiId": "kpi-789",
      "weight": 30.0,
      "target": 120.0,
      "actual": 95.0,
      "score": 79.17,
      "achievement": 23.75,
      "period": "2024-12-01T00:00:00.000Z",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T11:00:00.000Z",
      "employee": {
        "id": "emp-456",
        "employeeNumber": "EMP001",
        "user": {
          "id": "user-123",
          "name": "Andi Dea",
          "email": "andi.dea@company.com"
        },
        "division": {
          "id": "div-001",
          "name": "IT Development"
        },
        "position": {
          "id": "pos-001",
          "name": "Senior Developer"
        }
      },
      "kpi": {
        "id": "kpi-789",
        "name": "Code Quality Score",
        "description": "Measure code quality and best practices"
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
    "assessment": ["Assessment not found"]
  }
}
```

### Error Response (422)
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "weight": ["Weight must be between 0.1 and 100"],
    "target": ["Target must be greater than 0"],
    "actual": ["Actual value must be 0 or greater"]
  }
}
```

---

## 5. Delete Assessment

**Endpoint:** `DELETE /api/assessments/:id`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Assessment ID

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Assessment deleted successfully"
  }
}
```

### Error Response (404)
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "assessment": ["Assessment not found"]
  }
}
```

---

## 6. Get Assessments by Employee

**Endpoint:** `GET /api/assessments/employee/:employeeId`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Path Parameters
- `employeeId` (string, required): Employee ID

### Query Parameters
```json
{
  "period": "string (optional) - ISO date format",
  "startDate": "string (optional) - ISO date format", 
  "endDate": "string (optional) - ISO date format"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employee": {
      "id": "emp-456",
      "employeeNumber": "EMP002",
      "pnosNumber": "PNOS001",
      "dateJoined": "2023-01-15T00:00:00.000Z"
    },
    "assessments": [
      {
        "id": "assessment-123",
        "employeeId": "emp-456",
        "kpiId": "kpi-789",
        "weight": 25.5,
        "target": 100.0,
        "actual": 85.0,
        "score": 85.0,
        "achievement": 21.675,
        "period": "2024-12-01T00:00:00.000Z",
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "employee": {
          "id": "emp-456",
          "employeeNumber": "EMP002",
          "user": {
            "id": "user-124",
            "name": "Andi Dea 2",
            "email": "andi.dea2@company.com"
          },
          "division": {
            "id": "div-002",
            "name": "Marketing"
          },
          "position": {
            "id": "pos-002",
            "name": "Marketing Manager"
          }
        },
        "kpi": {
          "id": "kpi-789",
          "name": "Sales Target Achievement",
          "description": "Monthly sales target completion rate"
        }
      }
    ],
    "summary": {
      "totalAssessments": 1,
      "averageScore": 85.0,
      "totalAchievement": 21.68
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

## Authentication

Semua endpoint memerlukan Bearer Token di header:
```
Authorization: Bearer <your-jwt-token>
```

## Admin Requirements

Endpoint yang memerlukan role admin:
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/:id` - Update assessment  
- `DELETE /api/assessments/:id` - Delete assessment

## Error Codes

- **200** - Success
- **201** - Created successfully
- **404** - Resource not found
- **422** - Validation error
- **500** - Internal server error