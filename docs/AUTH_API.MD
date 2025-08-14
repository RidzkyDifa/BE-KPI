# 🔐 Auth API Documentation

Base URL: `http://localhost:3000/api/auth`

## 📋 Overview
API untuk autentikasi user dengan JWT token dan sistem verifikasi email. Semua response menggunakan format JSON yang konsisten dengan `status`, `code`, dan `data/errors`.

---

## 🎯 Response Format

### ✅ Success Response
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Success message",
    "user": { /* user object */ },
    "token": "jwt.token.here"
  }
}
```

### ❌ Error Response
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "email": ["The email must be a valid address."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

## 1. 📝 Register User

**Endpoint:** `POST /register`  
**Authentication:** ❌ Tidak perlu token

### Request Body
```json
{
  "name": "Andi Dea",
  "email": "andi.dea@example.com",
  "password": "password123"
}
```

### Validation Rules
- **name**: Required
- **email**: Required, valid email format
- **password**: Required, minimal 8 karakter

### Fetch Example
```javascript
const registerUser = async (name, email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Registration successful:', data);
      alert('Akun berhasil dibuat! Cek email Anda untuk verifikasi.');
      // Redirect ke halaman info verifikasi atau login
      window.location.href = '/verify-notice';
    } else {
      console.error('Registration failed:', data.errors);
      handleValidationErrors(data.errors);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
  }
};

// Handle validation errors
const handleValidationErrors = (errors) => {
  Object.keys(errors).forEach(field => {
    const errorMessages = errors[field];
    // Display error untuk setiap field
    document.getElementById(`error-${field}`).textContent = errorMessages[0];
  });
};
```

### Response

#### ✅ Success (201)
```json
{
  "status": "success",
  "code": 201,
  "data": {
    "message": "User registered successfully. Please check your email to verify your account.",
    "user": {
      "id": "uuid-string",
      "name": "Andi Dea",
      "email": "andi.dea@example.com",
      "verified": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z",
      "divisi": null
    }
  }
}
```

#### ❌ Validation Error (422)
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

#### ❌ Email Already Exists (409)
```json
{
  "status": "error",
  "code": 409,
  "errors": {
    "email": ["Email already registered"]
  }
}
```

**📧 Note:** Setelah register berhasil, user akan menerima email verifikasi yang berlaku selama 1 jam.

---

## 2. ✅ Verify Email

**Endpoint:** `GET /verify-email/:token`  
**Authentication:** ❌ Tidak perlu token

### URL Parameter
- `token`: Token verifikasi yang dikirim via email

### Browser Access Example
```
http://localhost:3000/api/auth/verify-email/abc123token456
```

### Fetch Example
```javascript
const verifyEmail = async (token) => {
  try {
    const response = await fetch(`http://localhost:3000/api/auth/verify-email/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Email verified successfully');
      alert('Email berhasil diverifikasi! Silakan login.');
      window.location.href = '/login';
    } else {
      console.error('Verification failed:', data.errors);
      alert('Verifikasi gagal. Token tidak valid atau sudah expired.');
      window.location.href = '/resend-verification';
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage: ambil token dari URL params
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
if (token) {
  verifyEmail(token);
}
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Email verified successfully. You can now login."
  }
}
```

#### ❌ Invalid/Expired Token (400)
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "token": ["Invalid or expired verification token"]
  }
}
```

#### ❌ Already Verified (400)
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

## 3. 🔄 Resend Verification Email

**Endpoint:** `POST /resend-verification`  
**Authentication:** ❌ Tidak perlu token

### Request Body
```json
{
  "email": "andi.dea@example.com"
}
```

### Fetch Example
```javascript
const resendVerification = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Verification email resent');
      alert('Email verifikasi baru telah dikirim. Cek inbox Anda.');
    } else {
      console.error('Failed to resend:', data.errors);
      if (data.errors.email) {
        alert(data.errors.email[0]);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Verification email sent successfully"
  }
}
```

#### ❌ User Not Found (404)
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "email": ["User not found"]
  }
}
```

#### ❌ Already Verified (400)
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

## 4. 🔑 Login User

**Endpoint:** `POST /login`  
**Authentication:** ❌ Tidak perlu token

### Request Body
```json
{
  "email": "andi.dea@example.com",
  "password": "password123"
}
```

### Fetch Example
```javascript
const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // SIMPAN TOKEN DI LOCALSTORAGE
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      console.log('Login successful');
      alert(`Selamat datang, ${data.data.user.name}!`);
      
      // Redirect ke dashboard
      window.location.href = '/dashboard';
    } else {
      console.error('Login failed:', data.errors);
      
      // Handle berbagai jenis error
      if (data.errors.credentials) {
        alert('Email atau password salah!');
      } else if (data.errors.email && data.errors.email[0].includes('verify')) {
        const resend = confirm('Email belum diverifikasi. Kirim ulang email verifikasi?');
        if (resend) {
          resendVerification(email);
        }
      }
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
  }
};
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Login successful",
    "user": {
      "id": "uuid-string",
      "name": "Andi Dea",
      "email": "andi.dea@example.com",
      "verified": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z",
      "divisi": {
        "id": "divisi-uuid",
        "nama": "IT Development"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### ❌ Invalid Credentials (401)
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "credentials": ["Invalid email or password"]
  }
}
```

#### ❌ Email Belum Terverifikasi (403)
```json
{
  "status": "error",
  "code": 403,
  "errors": {
    "email": ["Please verify your email address first. Check your inbox or request a new verification email."]
  }
}
```

#### ❌ Validation Error (422)
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

---

## 5. 👤 Get User Profile

**Endpoint:** `GET /profile`  
**Authentication:** ✅ Perlu Bearer Token

### Fetch Example
```javascript
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No token found');
      window.location.href = '/login';
      return;
    }
    
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('User profile:', data.data.user);
      displayUserProfile(data.data.user);
    } else {
      console.error('Failed to get profile:', data.errors);
      
      // Token mungkin expired, redirect ke login
      if (data.code === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        alert('Sesi telah berakhir. Silakan login kembali.');
        window.location.href = '/login';
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

const displayUserProfile = (user) => {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userDivisi').textContent = user.divisi?.nama || 'Tidak ada divisi';
  document.getElementById('verificationStatus').textContent = user.verified ? 'Terverifikasi' : 'Belum terverifikasi';
};
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "user": {
      "id": "uuid-string",
      "name": "Andi Dea",
      "email": "andi.dea@example.com",
      "verified": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z",
      "divisi": {
        "id": "divisi-uuid",
        "nama": "IT Development"
      }
    }
  }
}
```

#### ❌ Unauthorized (401)
```json
{
  "status": "error",
  "code": 401,
  "errors": {
    "auth": ["Unauthorized"]
  }
}
```

#### ❌ User Not Found (404)
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

## 6. 🚪 Logout User

**Endpoint:** `POST /logout`  
**Authentication:** ✅ Perlu Bearer Token

### Fetch Example
```javascript
const logoutUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // HAPUS SEMUA DATA AUTH DARI LOCALSTORAGE
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      console.log('Logout successful');
      alert('Anda telah logout.');
      
      // Redirect ke login page
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Network error:', error);
    // Tetap hapus token meskipun ada error
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
```

### Response

#### ✅ Success (200)
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

## 7. 📧 Forgot Password

**Endpoint:** `POST /forgot-password`  
**Authentication:** ❌ Tidak perlu token

### Request Body
```json
{
  "email": "andi.dea@example.com"
}
```

### Fetch Example
```javascript
const forgotPassword = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Reset link sent');
      alert('Link reset password telah dikirim ke email Anda. Link akan expired dalam 10 menit.');
    } else {
      console.error('Failed:', data.errors);
      if (data.errors.email) {
        alert(data.errors.email[0]);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Reset password link sent to email"
  }
}
```

#### ❌ Email Not Found (404)
```json
{
  "status": "error",
  "code": 404,
  "errors": {
    "email": ["Email not found"]
  }
}
```

#### ❌ Validation Error (422)
```json
{
  "status": "error",
  "code": 422,
  "errors": {
    "email": ["Email must be a valid email address"]
  }
}
```

---

## 8. 🔄 Reset Password

**Endpoint:** `POST /reset-password`  
**Authentication:** ✅ Perlu Bearer Token (dari reset link)

### Request Body
```json
{
  "password": "newpassword123"
}
```

### Fetch Example
```javascript
const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resetToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: newPassword })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Password updated successfully');
      alert('Password berhasil diubah! Silakan login dengan password baru.');
      window.location.href = '/login';
    } else {
      console.error('Failed to reset password:', data.errors);
      
      if (data.errors.token) {
        alert('Reset password gagal. Token tidak valid atau sudah expired.');
      } else if (data.errors.password) {
        alert(data.errors.password[0]);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage di reset password page
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Form submit handler
document.getElementById('resetForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const newPassword = document.getElementById('newPassword').value;
  
  if (token && newPassword) {
    resetPassword(token, newPassword);
  } else {
    alert('Token tidak ditemukan atau password kosong');
  }
});
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "code": 200,
  "data": {
    "message": "Password updated successfully"
  }
}
```

#### ❌ Validation Error (422)
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

#### ❌ Expired Token (400)
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "token": ["Verification link expired"]
  }
}
```

#### ❌ Invalid Token (400)
```json
{
  "status": "error",
  "code": 400,
  "errors": {
    "token": ["Invalid verification link"]
  }
}
```

---

## 🛡️ Error Handling Best Practices

### 1. Consistent Error Handling
```javascript
const handleApiResponse = async (response) => {
  const data = await response.json();
  
  if (data.status === 'success') {
    return { success: true, data: data.data };
  } else {
    return { success: false, errors: data.errors, code: data.code };
  }
};

// Usage
const result = await handleApiResponse(response);
if (result.success) {
  // Handle success
  console.log('Success:', result.data);
} else {
  // Handle error
  displayErrors(result.errors);
}
```

### 2. Display Validation Errors
```javascript
const displayErrors = (errors) => {
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  
  // Display new errors
  Object.keys(errors).forEach(field => {
    const errorElement = document.getElementById(`error-${field}`);
    if (errorElement) {
      errorElement.textContent = errors[field][0]; // Show first error message
      errorElement.style.color = 'red';
    }
  });
};
```

### 3. Token Management
```javascript
const TokenManager = {
  set: (token) => {
    localStorage.setItem('authToken', token);
  },
  
  get: () => {
    return localStorage.getItem('authToken');
  },
  
  remove: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  isValid: async () => {
    const token = TokenManager.get();
    if (!token) return false;
    
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};
```

### 4. Handle 401 Unauthorized Globally
```javascript
const apiCall = async (url, options = {}) => {
  const token = TokenManager.get();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    // Handle 401 globally
    if (data.code === 401) {
      TokenManager.remove();
      alert('Sesi telah berakhir. Silakan login kembali.');
      window.location.href = '/login';
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
    return null;
  }
};
```

### 5. Complete Auth Flow Example
```javascript
class AuthService {
  static async register(name, email, password) {
    const data = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    return data;
  }
  
  static async login(email, password) {
    const data = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data?.status === 'success') {
      TokenManager.set(data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }
  
  static async getProfile() {
    const data = await apiCall('/api/auth/profile');
    return data;
  }
  
  static async logout() {
    const data = await apiCall('/api/auth/logout', { method: 'POST' });
    TokenManager.remove();
    return data;
  }
  
  static async forgotPassword(email) {
    const data = await apiCall('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    return data;
  }
  
  static async resetPassword(token, password) {
    const data = await apiCall('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ password })
    });
    
    return data;
  }
}
```

---

## 📱 Frontend Integration Examples

### 1. Login Form Component
```html
<form id="loginForm">
  <div class="form-group">
    <input type="email" id="email" placeholder="Email" required>
    <span class="error-message" id="error-email"></span>
  </div>
  
  <div class="form-group">
    <input type="password" id="password" placeholder="Password" required>
    <span class="error-message" id="error-password"></span>
  </div>
  
  <button type="submit">Login</button>
  <span class="error-message" id="error-credentials"></span>
</form>

<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = await AuthService.login(email, password);
  
  if (result?.status === 'success') {
    window.location.href = '/dashboard';
  } else {
    displayErrors(result?.errors || {});
  }
});
</script>
```

### 2. Protected Page Check
```javascript
// Check auth status on page load
document.addEventListener('DOMContentLoaded', async () => {
  const isAuthenticated = await TokenManager.isValid();
  
  if (!isAuthenticated) {
    window.location.href = '/login';
    return;
  }
  
  // Load user profile
  const profileData = await AuthService.getProfile();
  if (profileData?.status === 'success') {
    displayUserInfo(profileData.data.user);
  }
});
```

### 3. Auto Logout on Token Expiry
```javascript
// Check token validity every 5 minutes
setInterval(async () => {
  const isValid = await TokenManager.isValid();
  if (!isValid && TokenManager.get()) {
    alert('Sesi telah berakhir. Anda akan diarahkan ke halaman login.');
    TokenManager.remove();
    window.location.href = '/login';
  }
}, 5 * 60 * 1000); // 5 minutes
```

---

## ⚠️ Important Notes

### 🔐 Security
1. **Token Storage**: Gunakan `localStorage` untuk development. Untuk production pertimbangkan `httpOnly cookies`
2. **HTTPS**: Selalu gunakan HTTPS di production
3. **Password**: Password minimal 8 karakter, validasi di backend
4. **Email Verification**: User tidak bisa login sebelum email diverifikasi

### ⏰ Token Expiry
1. **Login Token**: Expired dalam 1 jam (`expiresIn: "1h"`)
2. **Reset Password Token**: Expired dalam 10 menit (`expiresIn: "10m"`)
3. **Verification Token**: Expired dalam 1 jam (randomBytes token)

### 📧 Email Integration
1. **SMTP Setup**: Environment variables email sudah dikonfigurasi
2. **Email Templates**: HTML templates yang responsif dan professional
3. **Links**: Email links mengarah ke `CLIENT_URL` environment variable
4. **Expiry Info**: Email mencantumkan info durasi berlaku token

### 🔄 Workflow
1. **Register** → **Verify Email** → **Login** → **Access Protected Routes**
2. **Forgot Password** → **Check Email** → **Reset Password** → **Login**
3. **Resend Verification** tersedia jika user belum dapat email verifikasi
4. **Logout** → Clear localStorage → Redirect to login

### 🎯 Response Status Codes
- **200**: Success (login, profile, logout, verify, etc.)
- **201**: Created (register)
- **400**: Bad request (invalid token, already verified)
- **401**: Unauthorized (invalid credentials, expired token)
- **403**: Forbidden (email not verified)
- **404**: Not found (user/email not found)
- **409**: Conflict (email already registered)
- **422**: Validation error (missing fields, invalid format)
- **500**: Server error (email send error, JWT secret missing)

**Happy Coding! 🚀**

---

## 🎉 Changelog

**v2.0** - Updated Response Format
- ✅ Consistent JSON response structure
- ✅ Proper HTTP status codes
- ✅ Field-specific error messages
- ✅ Better validation handling
- ✅ Enhanced security practices