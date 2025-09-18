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
        "weight": 25.0,
        "target": 100.0,
        "actual": 95.0,
        "score": 95,
        "achievement": 23.75,
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
            "name": "Andi Dea"
          },
          "division": {
            "id": "div-001",
            "name": "Sales Department",
            "weight": 30
          },
          "position": {
            "id": "pos-001",
            "name": "Sales Manager"
          }
        },
        "kpi": {
          "id": "kpi-001",
          "name": "Sales Performance"
        }
      },
      {
        "id": "emp-kpi-002",
        "weight": 30.0,
        "target": 150.0,
        "actual": 138.0,
        "score": 92,
        "achievement": 27.6,
        "period": "2024-01-01T00:00:00.000Z",
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
            "name": "Andi Dea 2"
          },
          "division": {
            "id": "div-002",
            "name": "Marketing Department",
            "weight": 25
          },
          "position": {
            "id": "pos-002",
            "name": "Sales Executive"
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
        "name": "Sales Department",
        "description": "Handles all sales activities",
        "weight": 30
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
        "weight": 25.0,
        "target": 100.0,
        "actual": 95.0,
        "score": 95,
        "achievement": 23.75,
        "period": "2024-01-01T00:00:00.000Z",
        "createdBy": "user-admin-001",
        "updatedBy": "user-admin-001",
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T08:00:00.000Z",
        "kpi": {
          "id": "kpi-001",
          "name": "Sales Performance"
        }
      },
      {
        "id": "emp-kpi-002",
        "weight": 20.0,
        "target": 100.0,
        "actual": 85.0,
        "score": 85,
        "achievement": 17.0,
        "period": "2023-12-01T00:00:00.000Z",
        "createdBy": "user-admin-001",
        "updatedBy": "user-admin-001",
        "createdAt": "2023-12-15T08:00:00.000Z",
        "updatedAt": "2023-12-15T08:00:00.000Z",
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
            "weight": 25.0,
            "target": 100.0,
            "actual": 95.0,
            "score": 95,
            "achievement": 23.75,
            "period": "2024-01-01T00:00:00.000Z",
            "kpi": {
              "id": "kpi-001",
              "name": "Sales Performance"
            }
          }
        ],
        "totalAchievement": 23.75,
        "averageScore": 95.0
      },
      {
        "period": "2023-12",
        "assessments": [
          {
            "id": "emp-kpi-002",
            "weight": 20.0,
            "target": 100.0,
            "actual": 85.0,
            "score": 85,
            "achievement": 17.0,
            "period": "2023-12-01T00:00:00.000Z",
            "kpi": {
              "id": "kpi-001",
              "name": "Sales Performance"
            }
          }
        ],
        "totalAchievement": 17.0,
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
      "weight": 30,
      "employees": [
        {
          "id": "emp-001",
          "employeeNumber": "EMP001",
          "pnosNumber": "PNOS001",
          "dateJoined": "2023-01-15T08:00:00.000Z",
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
          "employeeNumber": "EMP002",
          "pnosNumber": "PNOS002",
          "dateJoined": "2023-03-01T08:00:00.000Z",
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
          "employeeNumber": "EMP001",
          "pnosNumber": "PNOS001",
          "dateJoined": "2023-01-15T08:00:00.000Z",
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
            "weight": 25.0,
            "target": 100.0,
            "actual": 95.0,
            "score": 95,
            "achievement": 23.75,
            "period": "2024-01-01T00:00:00.000Z",
            "kpi": {
              "id": "kpi-001",
              "name": "Sales Performance"
            }
          }
        ],
        "totalAchievement": 23.75,
        "averageScore": 95.0
      },
      {
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
          "position": {
            "id": "pos-002",
            "name": "Sales Executive"
          }
        },
        "assessments": [
          {
            "id": "emp-kpi-002",
            "weight": 30.0,
            "target": 150.0,
            "actual": 132.0,
            "score": 88,
            "achievement": 26.4,
            "period": "2024-01-01T00:00:00.000Z",
            "kpi": {
              "id": "kpi-002",
              "name": "Customer Satisfaction"
            }
          }
        ],
        "totalAchievement": 26.4,
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
        "weight": 25.0,
        "target": 100.0,
        "actual": 95.0,
        "score": 95,
        "achievement": 23.75,
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
            "name": "Sales Department",
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
        "score": 92,
        "achievement": 27.6,
        "period": "2024-01-01T00:00:00.000Z",
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
            "name": "Sales Department",
            "weight": 30
          },
          "position": {
            "id": "pos-002",
            "name": "Sales Executive"
          }
        }
      }
    ],
    "worstPerformers": [
      {
        "id": "emp-kpi-010",
        "weight": 20.0,
        "target": 100.0,
        "actual": 65.0,
        "score": 65,
        "achievement": 13.0,
        "period": "2024-01-01T00:00:00.000Z",
        "createdBy": "user-admin-001",
        "updatedBy": "user-admin-001",
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T08:00:00.000Z",
        "employee": {
          "id": "emp-010",
          "employeeNumber": "EMP010",
          "pnosNumber": "PNOS010",
          "dateJoined": "2023-05-01T08:00:00.000Z",
          "user": {
            "id": "user-010",
            "name": "Andi Dea 3",
            "email": "andi.dea3@company.com"
          },
          "division": {
            "id": "div-003",
            "name": "Operations Department",
            "weight": 20
          },
          "position": {
            "id": "pos-010",
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
            "weight": 25.0,
            "target": 100.0,
            "actual": 95.0,
            "score": 95,
            "achievement": 23.75
          },
          {
            "weight": 30.0,
            "target": 150.0,
            "actual": 132.0,
            "score": 88,
            "achievement": 26.4
          }
        ],
        "totalAchievement": 50.15,
        "averageScore": 91.5,
        "employeeCount": 2
      },
      {
        "period": "2023-12",
        "assessments": [
          {
            "weight": 20.0,
            "target": 100.0,
            "actual": 82.0,
            "score": 82,
            "achievement": 16.4
          }
        ],
        "totalAchievement": 16.4,
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

## Business Logic & Calculations

### KPI Performance Metrics
- **Score**: `(actual / target) * 100` - Raw performance percentage
- **Achievement**: `(weight * score) / 100` - Weighted contribution to overall performance
- **Top Performers**: Ranked by highest `score` (not achievement)
- **Worst Performers**: Ranked by lowest `score` (not achievement)

### Dashboard Overview
- **Overall Achievement**: Average of all achievement values in the period
- **Overall Score**: Average of all score values in the period
- **Top Performers**: Top 5 highest scoring assessments across all KPIs
- **Division Performance**: Aggregated metrics per division

### Report Filtering
- **Date Range**: `startDate` and `endDate` parameters (inclusive)
- **Year/Month**: Specific year and/or month filtering
- **Default Period**: Dashboard defaults to current month if no filters provided

## Notification Features
- Division performance reports automatically send notifications to all employees in the division
- Notifications include the reporting period information

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

## Additional Notes
- All date filters use inclusive ranges
- If no date filter is provided, all available data is returned
- Achievement values are rounded to 2 decimal places
- Performance data is sorted by period (newest first) 
- Best/worst performers are limited to top 5 results
- All timestamps are in ISO 8601 format
- Period grouping uses YYYY-MM format for monthly aggregation
- Employee information includes `employeeNumber`, `pnosNumber`, and `dateJoined` fields
- Division weights are included for performance calculation context

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