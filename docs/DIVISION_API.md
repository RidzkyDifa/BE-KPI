# Division API Documentation

## Base URL
```
/api/divisions
```

---

## 1. Get All Divisions

**Endpoint:** `GET /api/divisions`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Query Parameters
```json
{
  "page": "string (optional, default: 1)",
  "limit": "string (optional, default: 10)",
  "search": "string (optional, default: '')",
  "includeEmployees": "string (optional, default: 'false')"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "divisions": [
      {
        "id": "div-001",
        "name": "IT Development",
        "description": "Software development and technology solutions",
        "weight": 25.5,
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z",
        "_count": {
          "employees": 8
        }
      },
      {
        "id": "div-002",
        "name": "Marketing",
        "description": "Brand promotion and customer acquisition",
        "weight": 20.0,
        "createdAt": "2024-12-01T09:30:00.000Z",
        "updatedAt": "2024-12-01T09:30:00.000Z",
        "_count": {
          "employees": 5
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

### Success Response with Employees (200)
When `includeEmployees=true`:
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "divisions": [
      {
        "id": "div-003",
        "name": "Human Resources",
        "description": "Employee management and organizational development",
        "weight": 15.0,
        "createdAt": "2024-12-01T08:00:00.000Z",
        "updatedAt": "2024-12-01T08:00:00.000Z",
        "_count": {
          "employees": 3
        },
        "employees": [
          {
            "id": "emp-789",
            "employeeNumber": "EMP003",
            "pnosNumber": "PNOS003",
            "dateJoined": "2023-06-01T00:00:00.000Z",
            "user": {
              "id": "user-125",
              "name": "Andi Dea3",
              "email": "andi.dea3@company.com"
            },
            "position": {
              "id": "pos-003",
              "name": "HR Specialist"
            }
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 3,
      "limit": 10,
      "hasNext": false,
      "hasPrev": false
    }
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

## 2. Get Division by ID

**Endpoint:** `GET /api/divisions/:id`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Path Parameters
- `id` (string, required): Division ID

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "division": {
      "id": "div-001",
      "name": "IT Development",
      "description": "Software development and technology solutions",
      "weight": 25.5,
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "_count": {
        "employees": 8
      },
      "employees": [
        {
          "id": "emp-456",
          "employeeNumber": "EMP001",
          "pnosNumber": "PNOS001",
          "dateJoined": "2023-01-15T00:00:00.000Z",
          "user": {
            "id": "user-123",
            "name": "Andi Dea",
            "email": "andi.dea@company.com",
            "role": "ADMIN",
            "verified": true
          },
          "position": {
            "id": "pos-001",
            "name": "Senior Developer",
            "description": "Lead software development projects"
          }
        },
        {
          "id": "emp-457",
          "employeeNumber": "EMP004",
          "pnosNumber": "PNOS004",
          "dateJoined": "2023-08-10T00:00:00.000Z",
          "user": {
            "id": "user-126",
            "name": "Andi Dea 2",
            "email": "andi.dea2@company.com",
            "role": "USER",
            "verified": true
          },
          "position": {
            "id": "pos-004",
            "name": "Junior Developer",
            "description": "Support software development activities"
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
    "division": ["Division not found"]
  }
}
```

---

## 3. Create Division

**Endpoint:** `POST /api/divisions`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Request Body
```json
{
  "name": "Quality Assurance",
  "description": "Software testing and quality control",
  "weight": 18.5
}
```

### Success Response (201)
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Division created successfully",
    "division": {
      "id": "div-004",
      "name": "Quality Assurance",
      "description": "Software testing and quality control",
      "weight": 18.5,
      "createdAt": "2024-12-01T11:00:00.000Z",
      "updatedAt": "2024-12-01T11:00:00.000Z"
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
    "name": ["Name must be at least 2 characters"],
    "weight": ["Weight must be a positive number"]
  }
}
```

### Error Response (422) - Duplicate Name
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["Division name already exists"]
  }
}
```

---

## 4. Update Division

**Endpoint:** `PUT /api/divisions/:id`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Division ID

### Request Body
```json
{
  "name": "Digital Marketing",
  "description": "Online marketing and social media management",
  "weight": 22.0
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Division updated successfully",
    "division": {
      "id": "div-002",
      "name": "Digital Marketing",
      "description": "Online marketing and social media management",
      "weight": 22.0,
      "createdAt": "2024-12-01T09:30:00.000Z",
      "updatedAt": "2024-12-01T11:15:00.000Z",
      "_count": {
        "employees": 5
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
    "division": ["Division not found"]
  }
}
```

### Error Response (422) - Validation Error
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["Name must be at least 2 characters"],
    "weight": ["Weight must be a positive number"]
  }
}
```

### Error Response (422) - Duplicate Name
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "name": ["Division name already exists"]
  }
}
```

---

## 5. Delete Division

**Endpoint:** `DELETE /api/divisions/:id`  
**Auth:** Bearer Token Required  
**Admin:** Yes  

### Path Parameters
- `id` (string, required): Division ID

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Division deleted successfully"
  }
}
```

### Error Response (404)
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "division": ["Division not found"]
  }
}
```

### Error Response (409) - Cannot Delete
```json
{
  "status": "error",
  "code": 409,
  "errors": {
    "division": ["Cannot delete division with existing employees (5 employees). Please reassign or remove employees first."]
  }
}
```

---

## Query Parameters Details

### GET /api/divisions

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | string | "1" | Page number for pagination |
| `limit` | string | "10" | Number of items per page |
| `search` | string | "" | Search in division name and description |
| `includeEmployees` | string | "false" | Include employee details in response |

### Search Examples
```bash
# Search for divisions containing "IT"
GET /api/divisions?search=IT

# Get page 2 with 5 items per page
GET /api/divisions?page=2&limit=5

# Include employee details
GET /api/divisions?includeEmployees=true

# Combined query
GET /api/divisions?search=Marketing&page=1&limit=20&includeEmployees=true
```

---

## Validation Rules

### Division Name
- **Required**: Yes
- **Minimum**: 2 characters (after trim)
- **Unique**: Must be unique across all divisions
- **Trim**: Whitespace removed from start and end

### Description
- **Required**: No
- **Nullable**: Yes (can be null or empty)
- **Trim**: Whitespace removed from start and end

### Weight
- **Required**: No
- **Type**: Number
- **Minimum**: Must be positive (>= 0)
- **Nullable**: Yes

---

## Authentication

All endpoints require Bearer Token:
```
Authorization: Bearer <your-jwt-token>
```

## Admin Requirements

Endpoints requiring admin role:
- `POST /api/divisions` - Create division
- `PUT /api/divisions/:id` - Update division
- `DELETE /api/divisions/:id` - Delete division

## Business Rules

1. **Division names must be unique** - No two divisions can have the same name
2. **Cannot delete divisions with employees** - Must reassign or remove employees first
3. **Soft validation on weight** - Weight is optional but must be positive if provided
4. **Search is case-insensitive** - Search works across name and description fields

## Error Codes

- **200** - Success
- **201** - Created successfully
- **404** - Division not found
- **409** - Conflict (cannot delete division with employees)
- **422** - Validation error
- **500** - Internal server error

## Response Pagination

The `getAllDivisions` endpoint includes pagination metadata:
- `currentPage` - Current page number
- `totalPages` - Total number of pages
- `totalCount` - Total number of divisions
- `limit` - Items per page
- `hasNext` - Boolean indicating if next page exists
- `hasPrev` - Boolean indicating if previous page exists