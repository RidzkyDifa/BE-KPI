# 🔐 Auth API Documentation

Base URL: `http://localhost:3000/api/auth`

## 📋 Overview
API untuk autentikasi user dengan JWT token. Semua response menggunakan format JSON dengan `status` dan `message`.

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

### Fetch Example
```javascript
const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Andi Dea",
        email: "andi.dea@example.com",
        password: "password123"
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Registration successful:', data);
      // Redirect ke login page atau auto login
    } else {
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### Response

#### ✅ Success (201)
```json
{
  "status": "success",
  "message": "User registered",
  "user": {
    "id": 1,
    "name": "Andi Dea",
    "email": "andi.dea@example.com",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### ❌ Error (400)
```json
{
  "status": "error",
  "message": "Email already registered"
}
```

---

## 2. 🔑 Login User

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
const loginUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "andi.dea@example.com",
        password: "password123"
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // SIMPAN TOKEN DI LOCALSTORAGE
      localStorage.setItem('authToken', data.token);
      console.log('Login successful');
      // Redirect ke dashboard
    } else {
      console.error('Login failed:', data.message);
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
  "message": "Login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### ❌ Error (400)
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

---

## 3. 👤 Get User Profile

**Endpoint:** `GET /profile`  
**Authentication:** ✅ Perlu Bearer Token

### Fetch Example
```javascript
const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No token found');
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
      console.log('User profile:', data.user);
      // Display user info di UI
    } else {
      console.error('Failed to get profile:', data.message);
      // Token mungkin expired, redirect ke login
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
  "message": "User profile",
  "user": {
    "id": 1,
    "name": "Andi Dea",
    "email": "andi.dea@example.com",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### ❌ Error (401)
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```

---

## 4. 🚪 Logout User

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
      // HAPUS TOKEN DARI LOCALSTORAGE
      localStorage.removeItem('authToken');
      console.log('Logout successful');
      // Redirect ke login page
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Network error:', error);
    // Tetap hapus token meskipun ada error
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
};
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "message": "Logout success"
}
```

---

## 5. 📧 Forgot Password

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
const forgotPassword = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: "andi.dea@example.com"
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Reset link sent:', data.resetLink);
      // Show success message ke user
      alert('Reset password link telah dikirim ke email Anda');
    } else {
      console.error('Failed:', data.message);
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
  "message": "Reset password link sent to email",
  "resetLink": "http://localhost:3000/reset-password/eyJhbGciOiJIUzI1NiIs..."
}
```

#### ❌ Error (404)
```json
{
  "status": "error",
  "message": "Email not found"
}
```

---

## 6. 🔄 Reset Password

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
// Ambil token dari URL parameter
const resetPassword = async (resetToken) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resetToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: "newpassword123"
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('Password updated successfully');
      alert('Password berhasil diubah! Silakan login dengan password baru.');
      // Redirect ke login page
      window.location.href = '/login';
    } else {
      console.error('Failed to reset password:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage di reset password page
// const urlParams = new URLSearchParams(window.location.pathname);
// const token = urlParams.get('token'); // atau cara ambil token dari URL
// resetPassword(token);
```

### Response

#### ✅ Success (200)
```json
{
  "status": "success",
  "message": "Password updated"
}
```

#### ❌ Error (400)
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

---

## 🛡️ Error Handling Best Practices

### 1. Selalu Check Response Status
```javascript
const response = await fetch(url, options);
const data = await response.json();

if (data.status === 'success') {
  // Handle success
} else {
  // Handle error dengan data.message
}
```

### 2. Handle Network Errors
```javascript
try {
  // fetch code
} catch (error) {
  console.error('Network error:', error);
  // Show user-friendly error message
}
```

### 3. Token Management
```javascript
// Set token setelah login
localStorage.setItem('authToken', token);

// Get token untuk request yang perlu auth
const token = localStorage.getItem('authToken');

// Remove token saat logout atau token expired
localStorage.removeItem('authToken');
```

### 4. Handle 401 Unauthorized
```javascript
if (response.status === 401) {
  // Token expired atau invalid
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
```

---

## 📱 Frontend Integration Tips

### 1. Create Auth Context (React)
```javascript
// AuthContext.js
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  
  const login = async (email, password) => {
    // login logic here
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Protected Routes
```javascript
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

### 3. Axios Interceptor (Alternative)
```javascript
// Setup axios dengan auto token
axios.defaults.baseURL = 'http://localhost:3000/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## ⚠️ Important Notes

1. **Token Storage**: Gunakan `localStorage` untuk development, tapi untuk production pertimbangkan `httpOnly cookies` untuk security
2. **HTTPS**: Selalu gunakan HTTPS di production
3. **Error Messages**: Jangan expose sensitive info di error messages
4. **Token Expiry**: Handle token expiry dengan graceful logout
5. **CORS**: Pastikan CORS settings correct di backend

**Happy Coding! 🚀**