# KPI Management System API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Position Management](#position-management)
- [KPI Management](#kpi-management)
- [Assessment Management](#assessment-management)
- [Report Management](#report-management)
- [Error Responses](#error-responses)

---

## Authentication

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

Some endpoints require ADMIN role for access.

---

## Position Management

### 1. Get All Positions
**GET** `/api/positions`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "positions": [
      {
        "id": "uuid",
        "name": "Software Engineer",
        "description": "Develops software applications",
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "employees": [
          {
            "id": "uuid",
            "employeeNumber": "EMP001",
            "user": {
              "id": "uuid",
              "name": "John Doe",
              "email": "john@example.com"
            }
          }
        ]
      }
    ],
    "total": 1
  }
}
```

### 2. Get Position by ID
**GET** `/api/positions/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "position": {
      "id": "uuid",
      "name": "Software Engineer",
      "description": "Develops software applications",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "employees": [
        {
          "id": "uuid",
          "employeeNumber": "EMP001",
          "user": {
            "id": "uuid",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "division": {
            "id": "uuid",
            "name": "IT Department"
          }
        }
      ]
    }
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "position": ["Position not found"]
  }
}
```

### 3. Create Position
**POST** `/api/positions`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Request Body:**
```json
{
  "name": "Software Engineer",
  "description": "Develops software applications"
}
```

**Response Success (201):**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Position created successfully",
    "position": {
      "id": "uuid",
      "name": "Software Engineer",
      "description": "Develops software applications",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z"
    }
  }
}
```

**Response Error (422):**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["Name must be at least 2 characters"]
  }
}
```

### 4. Update Position
**PUT** `/api/positions/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Request Body:**
```json
{
  "name": "Senior Software Engineer",
  "description": "Leads software development projects"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Position updated successfully",
    "position": {
      "id": "uuid",
      "name": "Senior Software Engineer",
      "description": "Leads software development projects",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T11:00:00.000Z"
    }
  }
}
```

### 5. Delete Position
**DELETE** `/api/positions/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Position deleted successfully"
  }
}
```

**Response Error (400):**
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "position": ["Cannot delete position that has employees assigned to it"]
  }
}
```

---

## KPI Management

### 1. Get All KPIs
**GET** `/api/kpis`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "kpis": [
      {
        "id": "uuid",
        "name": "Code Quality",
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "employeeKpis": [
          {
            "id": "uuid",
            "weight": 25.0,
            "target": 85.0,
            "actual": 90.0,
            "score": 105.88,
            "achievement": 26.47,
            "period": "2024-12-01T00:00:00.000Z",
            "employee": {
              "id": "uuid",
              "user": {
                "id": "uuid",
                "name": "John Doe",
                "email": "john@example.com"
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

### 2. Get KPI by ID
**GET** `/api/kpis/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "kpi": {
      "id": "uuid",
      "name": "Code Quality",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "employeeKpis": [
        {
          "id": "uuid",
          "weight": 25.0,
          "target": 85.0,
          "actual": 90.0,
          "score": 105.88,
          "achievement": 26.47,
          "period": "2024-12-01T00:00:00.000Z",
          "employee": {
            "id": "uuid",
            "user": {
              "name": "John Doe"
            },
            "division": {
              "name": "IT Department"
            }
          }
        }
      ]
    }
  }
}
```

### 3. Create KPI
**POST** `/api/kpis`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Request Body:**
```json
{
  "name": "Code Quality"
}
```

**Response Success (201):**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "KPI created successfully",
    "kpi": {
      "id": "uuid",
      "name": "Code Quality",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z"
    }
  }
}
```

### 4. Update KPI
**PUT** `/api/kpis/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Request Body:**
```json
{
  "name": "Code Quality & Testing"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "KPI updated successfully",
    "kpi": {
      "id": "uuid",
      "name": "Code Quality & Testing",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T11:00:00.000Z"
    }
  }
}
```

### 5. Delete KPI
**DELETE** `/api/kpis/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "KPI deleted successfully"
  }
}
```

**Response Error (400):**
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

## Assessment Management

### 1. Get All Assessments
**GET** `/api/assessments`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `employeeId` (optional): Filter by employee ID
- `kpiId` (optional): Filter by KPI ID
- `period` (optional): Filter by specific period (YYYY-MM-DD)
- `startDate` (optional): Filter from start date (YYYY-MM-DD)
- `endDate` (optional): Filter to end date (YYYY-MM-DD)

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "assessments": [
      {
        "id": "uuid",
        "weight": 25.0,
        "target": 85.0,
        "actual": 90.0,
        "score": 105.88,
        "achievement": 26.47,
        "period": "2024-12-01T00:00:00.000Z",
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "createdBy": "uuid",
        "updatedBy": null,
        "employee": {
          "id": "uuid",
          "employeeNumber": "EMP001",
          "user": {
            "id": "uuid",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "division": {
            "id": "uuid",
            "name": "IT Department"
          },
          "position": {
            "id": "uuid",
            "name": "Software Engineer"
          }
        },
        "kpi": {
          "id": "uuid",
          "name": "Code Quality"
        }
      }
    ],
    "total": 1
  }
}
```

### 2. Get Assessment by ID
**GET** `/api/assessments/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "assessment": {
      "id": "uuid",
      "weight": 25.0,
      "target": 85.0,
      "actual": 90.0,
      "score": 105.88,
      "achievement": 26.47,
      "period": "2024-12-01T00:00:00.000Z",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "createdBy": "uuid",
      "updatedBy": null,
      "employee": {
        "id": "uuid",
        "employeeNumber": "EMP001",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "division": {
          "name": "IT Department"
        },
        "position": {
          "name": "Software Engineer"
        }
      },
      "kpi": {
        "id": "uuid",
        "name": "Code Quality"
      }
    }
  }
}
```

### 3. Get Assessments by Employee
**GET** `/api/assessments/employee/:employeeId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period` (optional): Filter by specific period (YYYY-MM-DD)
- `startDate` (optional): Filter from start date (YYYY-MM-DD)
- `endDate` (optional): Filter to end date (YYYY-MM-DD)

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employee": {
      "id": "uuid",
      "employeeNumber": "EMP001",
      "pnosNumber": "PNOS001",
      "dateJoined": "2020-01-15T00:00:00.000Z"
    },
    "assessments": [
      {
        "id": "uuid",
        "weight": 25.0,
        "target": 85.0,
        "actual": 90.0,
        "score": 105.88,
        "achievement": 26.47,
        "period": "2024-12-01T00:00:00.000Z",
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "employee": {
          "id": "uuid",
          "employeeNumber": "EMP001",
          "user": {
            "id": "uuid",
            "name": "John Doe",
            "email": "john@example.com"
          },
          "division": {
            "id": "uuid",
            "name": "IT Department"
          },
          "position": {
            "id": "uuid",
            "name": "Software Engineer"
          }
        },
        "kpi": {
          "id": "uuid",
          "name": "Code Quality"
        }
      }
    ],
    "summary": {
      "totalAssessments": 12,
      "averageScore": 94.5,
      "totalAchievement": 284.7
    }
  }
}
```

**Response Error (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "employee": ["Employee not found"]
  }
}
```

### 4. Create Assessment
**POST** `/api/assessments`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Request Body:**
```json
{
  "employeeId": "uuid",
  "kpiId": "uuid",
  "weight": 25.0,
  "target": 85.0,
  "actual": 90.0,
  "period": "2024-12-01"
}
```

**Response Success (201):**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Assessment created successfully",
    "assessment": {
      "id": "uuid",
      "weight": 25.0,
      "target": 85.0,
      "actual": 90.0,
      "score": 105.88,
      "achievement": 26.47,
      "period": "2024-12-01T00:00:00.000Z",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "createdBy": "uuid",
      "updatedBy": null,
      "employee": {
        "id": "uuid",
        "employeeNumber": "EMP001",
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "division": {
          "id": "uuid",
          "name": "IT Department"
        },
        "position": {
          "id": "uuid",
          "name": "Software Engineer"
        }
      },
      "kpi": {
        "id": "uuid",
        "name": "Code Quality"
      }
    }
  }
}
```

**Response Error (422):**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "weight": ["Weight must be between 0.1 and 100"],
    "target": ["Target must be greater than 0"],
    "actual": ["Actual value must be 0 or greater"],
    "employeeId": ["Employee not found"],
    "kpiId": ["KPI not found"],
    "assessment": ["Assessment for this employee, KPI, and period already exists"]
  }
}
```

### 5. Update Assessment
**PUT** `/api/assessments/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Request Body:**
```json
{
  "weight": 30.0,
  "target": 90.0,
  "actual": 95.0
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Assessment updated successfully",
    "assessment": {
      "id": "uuid",
      "weight": 30.0,
      "target": 90.0,
      "actual": 95.0,
      "score": 105.56,
      "achievement": 31.67,
      "period": "2024-12-01T00:00:00.000Z",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T11:00:00.000Z",
      "createdBy": "uuid",
      "updatedBy": "uuid",
      "employee": {
        "id": "uuid",
        "employeeNumber": "EMP001",
        "user": {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "division": {
          "id": "uuid",
          "name": "IT Department"
        },
        "position": {
          "id": "uuid",
          "name": "Software Engineer"
        }
      },
      "kpi": {
        "id": "uuid",
        "name": "Code Quality"
      }
    }
  }
}
```

### 6. Delete Assessment
**DELETE** `/api/assessments/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Permissions:** ADMIN only

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Assessment deleted successfully"
  }
}
```

---

## Report Management

### 1. Dashboard Overview
**GET** `/api/reports/dashboard`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `year` (optional): Filter by year (YYYY)
- `month` (optional): Filter by month (MM)

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "overview": {
      "totalEmployees": 50,
      "totalDivisions": 5,
      "totalKPIs": 10,
      "totalAssessments": 125,
      "overallAchievement": 87.5,
      "overallScore": 92.3
    },
    "topPerformers": [
      {
        "id": "uuid",
        "score": 110.5,
        "achievement": 33.15,
        "employee": {
          "user": {
            "name": "Jane Smith"
          },
          "division": {
            "name": "IT Department"
          }
        },
        "kpi": {
          "name": "Code Quality"
        }
      }
    ],
    "divisionPerformance": [
      {
        "divisionId": "uuid",
        "divisionName": "IT Department",
        "assessmentCount": 25,
        "averageScore": 95.2,
        "averageAchievement": 28.56
      }
    ]
  }
}
```

### 2. Employee Performance Report
**GET** `/api/reports/employee/:employeeId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `startDate` (optional): Start date for report (YYYY-MM-DD)
- `endDate` (optional): End date for report (YYYY-MM-DD)
- `year` (optional): Filter by year (YYYY)
- `month` (optional): Filter by month (MM)

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "employee": {
      "id": "uuid",
      "employeeNumber": "EMP001",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "division": {
        "id": "uuid",
        "name": "IT Department"
      },
      "position": {
        "id": "uuid",
        "name": "Software Engineer"
      }
    },
    "summary": {
      "totalAssessments": 5,
      "totalAchievement": 142.35,
      "averageAchievement": 28.47,
      "averageScore": 94.5
    },
    "assessments": [
      {
        "id": "uuid",
        "weight": 25.0,
        "target": 85.0,
        "actual": 90.0,
        "score": 105.88,
        "achievement": 26.47,
        "period": "2024-12-01T00:00:00.000Z",
        "kpi": {
          "name": "Code Quality"
        }
      }
    ],
    "performanceByPeriod": [
      {
        "period": "2024-12",
        "assessments": [
          {
            "id": "uuid",
            "score": 105.88,
            "achievement": 26.47
          }
        ],
        "totalAchievement": 142.35,
        "averageScore": 94.5
      }
    ]
  }
}
```

### 3. Division Performance Report
**GET** `/api/reports/division/:divisionId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `startDate` (optional): Start date for report (YYYY-MM-DD)
- `endDate` (optional): End date for report (YYYY-MM-DD)
- `year` (optional): Filter by year (YYYY)
- `month` (optional): Filter by month (MM)

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "division": {
      "id": "uuid",
      "name": "IT Department",
      "description": "Information Technology Division",
      "weight": 100,
      "employees": [
        {
          "id": "uuid",
          "employeeNumber": "EMP001",
          "user": {
            "name": "John Doe"
          },
          "position": {
            "name": "Software Engineer"
          }
        }
      ]
    },
    "summary": {
      "totalEmployees": 10,
      "totalAssessments": 50,
      "totalAchievement": 1423.5,
      "averageAchievement": 28.47,
      "averageScore": 94.5
    },
    "performanceByEmployee": [
      {
        "employee": {
          "id": "uuid",
          "user": {
            "name": "John Doe"
          },
          "position": {
            "name": "Software Engineer"
          }
        },
        "assessments": [
          {
            "id": "uuid",
            "score": 105.88,
            "achievement": 26.47
          }
        ],
        "totalAchievement": 142.35,
        "averageScore": 94.5
      }
    ]
  }
}
```

### 4. KPI Performance Report
**GET** `/api/reports/kpi/:kpiId`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `startDate` (optional): Start date for report (YYYY-MM-DD)
- `endDate` (optional): End date for report (YYYY-MM-DD)
- `year` (optional): Filter by year (YYYY)
- `month` (optional): Filter by month (MM)

**Response Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "kpi": {
      "id": "uuid",
      "name": "Code Quality",
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z"
    },
    "summary": {
      "totalAssessments": 25,
      "totalAchievement": 711.75,
      "averageAchievement": 28.47,
      "averageScore": 94.5
    },
    "bestPerformers": [
      {
        "id": "uuid",
        "score": 110.5,
        "achievement": 33.15,
        "employee": {
          "user": {
            "name": "Jane Smith"
          },
          "division": {
            "name": "IT Department"
          },
          "position": {
            "name": "Senior Developer"
          }
        }
      }
    ],
    "worstPerformers": [
      {
        "id": "uuid",
        "score": 75.2,
        "achievement": 18.8,
        "employee": {
          "user": {
            "name": "Bob Johnson"
          },
          "division": {
            "name": "IT Department"
          },
          "position": {
            "name": "Junior Developer"
          }
        }
      }
    ],
    "performanceByPeriod": [
      {
        "period": "2024-12",
        "assessments": [
          {
            "id": "uuid",
            "score": 105.88
          }
        ],
        "totalAchievement": 142.35,
        "averageScore": 94.5,
        "employeeCount": 5
      }
    ]
  }
}
```

---

## Error Responses

### Common Error Formats

**Validation Error (422):**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "fieldName": ["Error message 1", "Error message 2"]
  }
}
```

**Authentication Error (401):**
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "auth": ["Token is required"]
  }
}
```

**Authorization Error (403):**
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "auth": ["Admin access required"]
  }
}
```

**Not Found Error (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "resource": ["Resource not found"]
  }
}
```

**Server Error (500):**
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

## Panduan Penggunaan Sistem

### Alur Kerja Umum:

#### 1. Setup Awal (Admin)
1. Login sebagai admin
2. Buat data master jabatan melalui `/api/positions`
3. Buat data master KPI melalui `/api/kpis`
4. Pastikan data karyawan sudah ada di sistem

#### 2. Proses Penilaian (Admin)
1. Setiap periode (biasanya bulanan), admin melakukan penilaian karyawan
2. Untuk setiap karyawan dan KPI, buat assessment melalui `/api/assessments`
3. Input data: weight, target, actual, periode
4. Sistem otomatis menghitung score dan achievement

#### 3. Monitoring dan Laporan (Admin/User)
1. Gunakan dashboard overview untuk melihat kondisi umum: `/api/reports/dashboard`
2. Lihat laporan per karyawan untuk performance review: `/api/reports/employee/:id`
3. Analisis kinerja divisi: `/api/reports/division/:id`
4. Evaluasi pencapaian KPI tertentu: `/api/reports/kpi/:id`

### Best Practices:

#### Untuk Assessment:
- Pastikan total weight semua KPI untuk satu karyawan dalam satu periode = 100%
- Gunakan target yang realistis dan terukur
- Dokumentasikan sumber data actual value
- Lakukan penilaian secara konsisten setiap periode

#### Untuk Pelaporan:
- Gunakan filter periode yang tepat untuk analisis yang akurat
- Bandingkan performance antar periode untuk melihat tren
- Identifikasi pattern dalam top/bottom performers
- Gunakan data untuk pengambilan keputusan yang objektif

### Sample Data & Testing:

#### Login Credentials (dari seed data):
```
Admin: admin@company.com / admin123
HR Manager: sarah.johnson@company.com / password123  
IT Staff: john.doe@company.com / password123
Finance Staff: alice.smith@company.com / password123
Marketing Manager: bob.wilson@company.com / password123
```

#### Sample Employee IDs:
- HR Employee: `hr-employee`
- IT Employee: `it-employee`
- Finance Employee: `finance-employee`
- Marketing Employee: `marketing-employee`

#### Sample KPI IDs:
- Attendance Rate: `attendance-kpi`
- Job Performance: `performance-kpi`
- Teamwork & Collaboration: `teamwork-
// To be continued ...