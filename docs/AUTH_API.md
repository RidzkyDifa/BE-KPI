# Authentication API Documentation

## Base URL
```
/api/auth
```

---

## 1. Register

**Endpoint:** `POST /api/auth/register`  
**Auth:** No  
**Admin:** No  

### Request Body
```json
{
  "name": "Andi Dea",
  "email": "andi.dea@company.com",
  "password": "password123"
}
```

### Success Response (201)
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "User registered successfully. Please check your email to verify your account.",
    "user": {
      "id": "user-123",
      "name": "Andi Dea",
      "email": "andi.dea@company.com",
      "verified": false,
      "createdAt": "2024-12-01T10:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z"
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
    "name": ["Name is required"],
    "email": ["Email must be a valid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

### Error Response (409) - Email Already Exists
```json
{
  "status": "error",
  "code": 409,
  "errors": {
    "email": ["Email already registered"]
  }
}
```

---

## 2. Verify Email

**Endpoint:** `GET /api/auth/verify-email/:token`  
**Auth:** No  
**Admin:** No  

### Path Parameters
- `token` (string, required): Email verification token

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Email verified successfully. You can now login."
  }
}
```

### Error Response (422) - Missing Token
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "token": ["Verification token is required"]
  }
}
```

### Error Response (400) - Invalid/Expired Token
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "token": ["Invalid or expired verification token"]
  }
}
```

### Error Response (400) - Already Verified
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "email": ["Email already verified"]
  }
}
```

---

## 3. Resend Verification

**Endpoint:** `POST /api/auth/resend-verification`  
**Auth:** No  
**Admin:** No  

### Request Body
```json
{
  "email": "andi.dea2@company.com"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Verification email sent successfully"
  }
}
```

### Error Response (422) - Validation Error
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "email": ["Email must be a valid email address"]
  }
}
```

### Error Response (404) - User Not Found
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "email": ["User not found"]
  }
}
```

### Error Response (400) - Already Verified
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "email": ["Email already verified"]
  }
}
```

---

## 4. Login

**Endpoint:** `POST /api/auth/login`  
**Auth:** No  
**Admin:** No  

### Request Body
```json
{
  "email": "andi.dea3@company.com",
  "password": "password123"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Login successful",
    "user": {
      "id": "user-125",
      "name": "Andi Dea3",
      "email": "andi.dea3@company.com",
      "verified": true,
      "isAdmin": false,
      "createdAt": "2024-12-01T09:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "employee": {
        "id": "emp-789",
        "employeeNumber": "EMP003",
        "pnosNumber": "PNOS003",
        "dateJoined": "2023-06-01T00:00:00.000Z",
        "division": {
          "id": "div-003",
          "name": "Human Resources",
          "code": "HR"
        },
        "position": {
          "id": "pos-003",
          "name": "HR Specialist",
          "level": "Staff"
        }
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response (422) - Validation Error
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "email": ["Email is required"],
    "password": ["Password is required"]
  }
}
```

### Error Response (401) - Invalid Credentials
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "credentials": ["Invalid email or password"]
  }
}
```

### Error Response (403) - Email Not Verified
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "email": ["Please verify your email address first. Check your inbox or request a new verification email."]
  }
}
```

---

## 5. Logout

**Endpoint:** `POST /api/auth/logout`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Logout successful"
  }
}
```

---

## 6. Get Profile

**Endpoint:** `GET /api/auth/profile`  
**Auth:** Bearer Token Required  
**Admin:** No  

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "user": {
      "id": "user-123",
      "name": "Andi Dea",
      "email": "andi.dea@company.com",
      "verified": true,
      "isAdmin": true,
      "createdAt": "2024-12-01T09:00:00.000Z",
      "updatedAt": "2024-12-01T10:00:00.000Z",
      "employee": {
        "id": "emp-456",
        "employeeNumber": "EMP001",
        "pnosNumber": "PNOS001",
        "dateJoined": "2023-01-15T00:00:00.000Z",
        "division": {
          "id": "div-001",
          "name": "IT Development",
          "code": "IT"
        },
        "position": {
          "id": "pos-001",
          "name": "Senior Developer",
          "level": "Senior"
        }
      }
    }
  }
}
```

### Error Response (401) - Unauthorized
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "auth": ["Unauthorized"]
  }
}
```

### Error Response (404) - User Not Found
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "user": ["User not found"]
  }
}
```

---

## 7. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`  
**Auth:** No  
**Admin:** No  

### Request Body
```json
{
  "email": "andi.dea2@company.com"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Reset password link sent to email"
  }
}
```

### Error Response (422) - Validation Error
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "email": ["Email must be a valid email address"]
  }
}
```

### Error Response (404) - Email Not Found
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "email": ["Email not found"]
  }
}
```

---

## 8. Reset Password

**Endpoint:** `POST /api/auth/reset-password`  
**Auth:** Bearer Token Required (from email link)  
**Admin:** No  

### Headers
```
Authorization: Bearer <reset-token-from-email>
```

### Request Body
```json
{
  "password": "newpassword123"
}
```

### Success Response (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Password updated successfully"
  }
}
```

### Error Response (422) - Validation Error
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "password": ["Password must be at least 8 characters"],
    "token": ["Authorization header missing"]
  }
}
```

### Error Response (400) - Token Expired
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "token": ["Verification link expired"]
  }
}
```

### Error Response (400) - Invalid Token
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "token": ["Invalid verification link"]
  }
}
```

### Error Response (404) - User Not Found
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "user": ["User not found"]
  }
}
```

---

## Authentication Flow

### Registration & Email Verification
1. `POST /api/auth/register` - Register new user
2. Check email for verification link
3. `GET /api/auth/verify-email/:token` - Verify email
4. If verification email expired, use `POST /api/auth/resend-verification`

### Login
1. `POST /api/auth/login` - Login with email & password
2. Save the returned JWT token for authenticated requests
3. Use `GET /api/auth/profile` to get current user data
4. Use `POST /api/auth/logout` to logout (client should delete token)

### Password Reset
1. `POST /api/auth/forgot-password` - Request password reset
2. Check email for reset link with token
3. `POST /api/auth/reset-password` - Reset password using token from email

---

## Authentication Headers

For protected endpoints, include JWT token:
```
Authorization: Bearer <your-jwt-token>
```

## Token Expiry
- **Login JWT Token**: 1 hour
- **Email Verification Token**: 1 hour  
- **Password Reset Token**: 10 minutes

## Validation Rules
- **Email**: Must be valid email format
- **Password**: Minimum 8 characters
- **Name**: Required field

## Error Codes

- **200** - Success
- **201** - Created successfully
- **400** - Bad request (invalid/expired token, already verified)
- **401** - Unauthorized (invalid credentials)
- **403** - Forbidden (email not verified)
- **404** - Not found (user/email not found)
- **409** - Conflict (email already registered)
- **422** - Validation error
- **500** - Internal server error