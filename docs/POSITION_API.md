# Position API Documentation

Base URL: `/api/positions`

## Authentication
All endpoints require Bearer token authentication.
Admin endpoints require admin role.

## Endpoints

### 1. Get All Positions
```
GET /api/positions
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
    "positions": [
      {
        "id": "pos-001",
        "name": "Sales Manager",
        "description": "Responsible for managing sales team and achieving sales targets",
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T08:00:00.000Z",
        "employees": [
          {
            "id": "emp-001",
            "user": {
              "id": "user-001",
              "name": "Andi Dea",
              "email": "andi.dea@company.com"
            }
          },
          {
            "id": "emp-002",
            "user": {
              "id": "user-002",
              "name": "Andi Dea 2",
              "email": "andi.dea2@company.com"
            }
          }
        ]
      },
      {
        "id": "pos-002",
        "name": "HR Specialist",
        "description": "Handle recruitment, employee relations, and HR policies",
        "createdAt": "2024-01-15T07:30:00.000Z",
        "updatedAt": "2024-01-15T07:30:00.000Z",
        "employees": [
          {
            "id": "emp-003",
            "user": {
              "id": "user-003",
              "name": "Andi Dea3",
              "email": "andi.dea3@company.com"
            }
          }
        ]
      }
    ],
    "total": 2
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

### 2. Get Position by ID
```
GET /api/positions/:id
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
- `id` (string): Position ID

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "position": {
      "id": "pos-001",
      "name": "Sales Manager",
      "description": "Responsible for managing sales team and achieving sales targets",
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T08:00:00.000Z",
      "employees": [
        {
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
          }
        },
        {
          "id": "emp-002",
          "user": {
            "id": "user-002",
            "name": "Andi Dea 2",
            "email": "andi.dea2@company.com"
          },
          "division": {
            "id": "div-001",
            "name": "Sales Department",
            "description": "Handles all sales activities"
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
    "position": ["Position not found"]
  }
}
```

---

### 3. Create New Position
```
POST /api/positions
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
  "name": "Software Engineer",
  "description": "Develop and maintain software applications"
}
```

**Fields:**
- `name` (string, required): Position name (minimum 2 characters)
- `description` (string, optional): Position description

**Success Response (201):**
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "Position created successfully",
    "position": {
      "id": "pos-003",
      "name": "Software Engineer",
      "description": "Develop and maintain software applications",
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
    "name": ["Position name already exists"]
  }
}
```

---

### 4. Update Position
```
PUT /api/positions/:id
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
- `id` (string): Position ID to update

**Request Body:**
```json
{
  "name": "Senior Software Engineer",
  "description": "Lead software development projects and mentor junior developers"
}
```

**Fields:**
- `name` (string, required): Position name (minimum 2 characters)
- `description` (string, optional): Position description

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Position updated successfully",
    "position": {
      "id": "pos-003",
      "name": "Senior Software Engineer",
      "description": "Lead software development projects and mentor junior developers",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Position Not Found Error Response (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "position": ["Position not found"]
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

### 5. Delete Position
```
DELETE /api/positions/:id
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
- `id` (string): Position ID to delete

**Request Body:** None

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Position deleted successfully"
  }
}
```

**Position Not Found Error Response (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "position": ["Position not found"]
  }
}
```

**Cannot Delete Error Response (400):**
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

---

## Sample Position Data

### Technical Positions
```json
{
  "id": "pos-004",
  "name": "Frontend Developer",
  "description": "Build responsive user interfaces using React and modern web technologies",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z",
  "employees": []
}
```

### Management Positions
```json
{
  "id": "pos-005",
  "name": "Project Manager",
  "description": "Plan, execute, and oversee projects from initiation to completion",
  "createdAt": "2024-01-15T11:30:00.000Z",
  "updatedAt": "2024-01-15T11:30:00.000Z",
  "employees": []
}
```

### Operations Positions
```json
{
  "id": "pos-006",
  "name": "Operations Specialist",
  "description": "Optimize business processes and ensure smooth daily operations",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z",
  "employees": []
}
```

## Notes
- All timestamps are in ISO 8601 format
- Position names must be at least 2 characters long
- Position names must be unique
- Description field is optional and can be null
- Positions with assigned employees cannot be deleted
- Positions are sorted by creation date (newest first)
- Employee data includes user information and division details in single position view