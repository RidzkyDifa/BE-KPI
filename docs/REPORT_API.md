# Reports API Documentation

Base URL: `/api/reports`

## Authentication
All endpoints require Bearer token authentication.

## Endpoints

### 1. Dashboard Overview
```
GET /api/reports/dashboard
```

**Auth Required:** Yes (Bearer Token)  
**Admin Required:** No

**Request Headers:**
```json
{
  "Authorization": "Bearer <your_jwt_token>"
}
```

**Query Parameters:**
- `year` (optional, number): Filter by year (e.g., 2024)
- `month` (optional, number): Filter by month (1-12)

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "overview": {
      "totalEmployees": 25,
      "totalDivisions": 5,
      "totalKPIs": 8,
      "totalAssessments": 45,
      "overallAchievement": 87.5,
      "overallScore": 82.3
    },
    "topPerformers": [
      {
        "id": "emp-kpi-001",
        "score": 95,
        "achievement": 98.5,
        "period": "2024-01-15T00:00:00.000Z",
        "employee": {
          "user": {
            "name": "Andi Dea"
          },
          "division": {
            "id": "div-001",
            "name": "Sales Department"
          }
        },
        "kpi": {
          "id": "kpi-001",
          "name": "Sales Performance"
        }
      },
      {
        "id": "emp-kpi-002",
        "score": 92,
        "achievement": 94.2,
        "period": "2024-01-15T00:00:00.000Z",
        "employee": {
          "user": {
            "name": "Andi Dea 2"
          },
          "division": {
            "id": "div-002",
            "name": "Marketing Department"
          }
        },
        "kpi": {
          "id": "kpi-002",
          "name": "Customer Satisfaction"
        }
      }
    ],
    "divisionPerformance": [
      {
        "divisionId": "div-001",
        "divisionName": "Sales Department",
        "assessmentCount": 15,
        "totalScore": 1245,
        "totalAchievement": 1312.5,
        "averageScore": 83.0,
        "averageAchievement": 87.5
      },
      {
        "divisionId": "div-002",
        "divisionName": "Marketing Department",
        "assessmentCount": 12,
        "totalScore": 1008,
        "totalAchievement": 1050.0,
        "averageScore": 84.0,
        "averageAchievement": 87.5
      }
    ]
  }
}
```

---

### 2. Employee Performance Report
```
GET /api/reports/employee/:employeeId
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
- `employeeId` (string): Employee ID

**Query Parameters:**
- `startDate` (optional, string): Start date filter (YYYY-MM-DD)
- `endDate` (optional, string): End date filter (YYYY-MM-DD)
- `year` (optional, number): Filter by year (e.g., 2024)
- `month` (optional, number): Filter by month (1-12)

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employee": {
      "id": "emp-001",
      "user": {
        "id": "user-001",
        "name": "Andi Dea",
        "email": "andi.dea@company.com"
      },
      "division": {
        "id": "div-001",
        "name": "Sales Department",
        "description": "Handles all sales activities"
      },
      "position": {
        "id": "pos-001",
        "name": "Sales Manager",
        "description": "Responsible for managing sales team"
      }
    },
    "summary": {
      "totalAssessments": 6,
      "totalAchievement": 520.5,
      "averageAchievement": 86.75,
      "averageScore": 84.33
    },
    "assessments": [
      {
        "id": "emp-kpi-001",
        "score": 95,
        "achievement": 98.5,
        "period": "2024-01-15T00:00:00.000Z",
        "target": 100,
        "actual": 98.5,
        "kpi": {
          "id": "kpi-001",
          "name": "Sales Performance"
        }
      },
      {
        "id": "emp-kpi-002",
        "score": 85,
        "achievement": 87.0,
        "period": "2023-12-15T00:00:00.000Z",
        "target": 100,
        "actual": 87.0,
        "kpi": {
          "id": "kpi-001",
          "name": "Sales Performance"
        }
      }
    ],
    "performanceByPeriod": [
      {
        "period": "2024-01",
        "assessments": [
          {
            "id": "emp-kpi-001",
            "score": 95,
            "achievement": 98.5,
            "kpi": {
              "name": "Sales Performance"
            }
          }
        ],
        "totalAchievement": 98.5,
        "averageScore": 95.0
      },
      {
        "period": "2023-12",
        "assessments": [
          {
            "id": "emp-kpi-002",
            "score": 85,
            "achievement": 87.0,
            "kpi": {
              "name": "Sales Performance"
            }
          }
        ],
        "totalAchievement": 87.0,
        "averageScore": 85.0
      }
    ]
  }
}
```

**Error Response (404):**
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

### 3. Division Performance Report
```
GET /api/reports/division/:divisionId
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
- `divisionId` (string): Division ID

**Query Parameters:**
- `startDate` (optional, string): Start date filter (YYYY-MM-DD)
- `endDate` (optional, string): End date filter (YYYY-MM-DD)
- `year` (optional, number): Filter by year (e.g., 2024)
- `month` (optional, number): Filter by month (1-12)

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "division": {
      "id": "div-001",
      "name": "Sales Department",
      "description": "Handles all sales activities",
      "employees": [
        {
          "id": "emp-001",
          "user": {
            "id": "user-001",
            "name": "Andi Dea",
            "email": "andi.dea@company.com"
          },
          "position": {
            "id": "pos-001",
            "name": "Sales Manager"
          }
        },
        {
          "id": "emp-002",
          "user": {
            "id": "user-002",
            "name": "Andi Dea 2",
            "email": "andi.dea2@company.com"
          },
          "position": {
            "id": "pos-002",
            "name": "Sales Executive"
          }
        }
      ]
    },
    "summary": {
      "totalEmployees": 2,
      "totalAssessments": 8,
      "totalAchievement": 696.0,
      "averageAchievement": 87.0,
      "averageScore": 85.5
    },
    "performanceByEmployee": [
      {
        "employee": {
          "id": "emp-001",
          "user": {
            "id": "user-001",
            "name": "Andi Dea",
            "email": "andi.dea@company.com"
          },
          "position": {
            "id": "pos-001",
            "name": "Sales Manager"
          }
        },
        "assessments": [
          {
            "id": "emp-kpi-001",
            "score": 95,
            "achievement": 98.5,
            "kpi": {
              "name": "Sales Performance"
            }
          }
        ],
        "totalAchievement": 98.5,
        "averageScore": 95.0
      },
      {
        "employee": {
          "id": "emp-002",
          "user": {
            "id": "user-002",
            "name": "Andi Dea 2",
            "email": "andi.dea2@company.com"
          },
          "position": {
            "id": "pos-002",
            "name": "Sales Executive"
          }
        },
        "assessments": [
          {
            "id": "emp-kpi-002",
            "score": 88,
            "achievement": 90.0,
            "kpi": {
              "name": "Customer Satisfaction"
            }
          }
        ],
        "totalAchievement": 90.0,
        "averageScore": 88.0
      }
    ]
  }
}
```

**Error Response (404):**
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

### 4. KPI Performance Report
```
GET /api/reports/kpi/:kpiId
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
- `kpiId` (string): KPI ID

**Query Parameters:**
- `startDate` (optional, string): Start date filter (YYYY-MM-DD)
- `endDate` (optional, string): End date filter (YYYY-MM-DD)
- `year` (optional, number): Filter by year (e.g., 2024)
- `month` (optional, number): Filter by month (1-12)

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
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "summary": {
      "totalAssessments": 12,
      "totalAchievement": 1044.0,
      "averageAchievement": 87.0,
      "averageScore": 84.5
    },
    "bestPerformers": [
      {
        "id": "emp-kpi-001",
        "score": 95,
        "achievement": 98.5,
        "period": "2024-01-15T00:00:00.000Z",
        "employee": {
          "user": {
            "name": "Andi Dea"
          },
          "division": {
            "name": "Sales Department"
          },
          "position": {
            "name": "Sales Manager"
          }
        }
      },
      {
        "id": "emp-kpi-002",
        "score": 92,
        "achievement": 94.2,
        "period": "2024-01-15T00:00:00.000Z",
        "employee": {
          "user": {
            "name": "Andi Dea 2"
          },
          "division": {
            "name": "Sales Department"
          },
          "position": {
            "name": "Sales Executive"
          }
        }
      }
    ],
    "worstPerformers": [
      {
        "id": "emp-kpi-010",
        "score": 65,
        "achievement": 68.0,
        "period": "2024-01-15T00:00:00.000Z",
        "employee": {
          "user": {
            "name": "Andi Dea3"
          },
          "division": {
            "name": "Operations Department"
          },
          "position": {
            "name": "Operations Specialist"
          }
        }
      }
    ],
    "performanceByPeriod": [
      {
        "period": "2024-01",
        "assessments": [
          {
            "score": 95,
            "achievement": 98.5
          },
          {
            "score": 88,
            "achievement": 90.0
          }
        ],
        "totalAchievement": 188.5,
        "averageScore": 91.5,
        "employeeCount": 2
      },
      {
        "period": "2023-12",
        "assessments": [
          {
            "score": 82,
            "achievement": 85.0
          }
        ],
        "totalAchievement": 85.0,
        "averageScore": 82.0,
        "employeeCount": 1
      }
    ]
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

---

## Query Examples

### Filter by Date Range
```
GET /api/reports/employee/emp-001?startDate=2024-01-01&endDate=2024-03-31
```

### Filter by Year and Month
```
GET /api/reports/division/div-001?year=2024&month=1
```

### Filter by Year Only
```
GET /api/reports/kpi/kpi-001?year=2024
```

### Dashboard for Specific Period
```
GET /api/reports/dashboard?year=2024&month=2
```

## Notes
- All date filters use inclusive ranges
- If no date filter is provided, all available data is returned
- Dashboard overview defaults to current month if no filters specified
- Achievement values are rounded to 2 decimal places
- Performance data is sorted by period (newest first)
- Best/worst performers are limited to top 5 results
- Division reports automatically send notifications to employees
- All timestamps are in ISO 8601 format
- Period grouping uses YYYY-MM format for monthly aggregation