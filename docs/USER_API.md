# User Role API Documentation

Base URL: `/api/users`

## Authentication
All endpoints require Bearer token authentication.
This endpoint requires admin role.

## Endpoint

### Update User Role
```
PUT /api/users/:id/role
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
- `id` (string): User ID to update

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

**Fields:**
- `role` (string, required): User role - valid values: `"ADMIN"`, `"USER"`

**Success Response (200):**
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "User role updated successfully",
    "user": {
      "id": "user-001",
      "name": "Andi Dea",
      "email": "andi.dea@company.com",
      "role": "ADMIN"
    }
  }
}
```

**User Not Found Error Response (404):**
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "user": ["User not found"]
  }
}
```

**Invalid Role Error Response (422):**
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "role": ["Invalid role value"]
  }
}
```

**Unauthorized Error Response (401):**
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "auth": ["Unauthorized - Invalid or missing token"]
  }
}
```

**Forbidden Error Response (403):**
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "auth": ["Forbidden - Admin access required"]
  }
}
```

**Server Error Response (500):**
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

## Real-time Notification

When user role is updated successfully, the affected user will receive a real-time notification via Socket.IO:

**Socket Event:** `new_notification`
**Target:** `user_${userId}` room

**Notification Payload:**
```json
{
  "id": "notif-008",
  "title": "Perubahan Role",
  "message": "Role akun Anda telah berubah menjadi \"ADMIN\"",
  "createdAt": "2024-01-15T14:30:00.000Z"
}
```

---

## Usage Examples

### Promote USER to Admin
```javascript
// Request
const response = await axios.put('/api/users/user-001/role', {
  role: 'ADMIN'
}, {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

// Response
console.log(response.data);
// {
//   "status": "success",
//   "code": 200,
//   "data": {
//     "message": "User role updated successfully",
//     "user": {
//       "id": "user-001",
//       "name": "Andi Dea",
//       "email": "andi.dea@company.com",
//       "role": "ADMIN"
//     }
//   }
// }
```

### Demote Admin to User
```javascript
// Request
const response = await axios.put('/api/users/user-002/role', {
  role: 'USER'
}, {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

// Response
console.log(response.data);
// {
//   "status": "success",
//   "code": 200,
//   "data": {
//     "message": "User role updated successfully",
//     "user": {
//       "id": "user-002",
//       "name": "Andi Dea 2", 
//       "email": "andi.dea2@company.com",
//       "role": "USER"
//     }
//   }
// }
```

### Error Handling
```javascript
try {
  const response = await axios.put('/api/users/user-003/role', {
    role: 'INVALID_ROLE'
  }, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
} catch (error) {
  console.error(error.response.data);
  // {
  //   "status": "error",
  //   "code": 422,
  //   "errors": {
  //     "role": ["Invalid role value"]
  //   }
  // }
}
```

---

## Notes
- Only users with ADMIN role can update user roles
- Valid roles are: `"ADMIN"`, `"USER"` 
- User receives real-time notification when their role changes
- Response only includes basic user info (no sensitive data)
- Role changes are logged and tracked in the system
- Updated user info excludes password and other sensitive fields