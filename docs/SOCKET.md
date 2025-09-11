# Real-time Notification Documentation

## Backend Setup (Socket.IO Server)

### 1. Server Configuration
Backend runs Socket.IO server on the same port as Express API.

**Connection URL:** `http://localhost:5000`

**Authentication:** JWT token required in handshake
```javascript
// Server-side authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  socket.userId = user.id;
  next();
});
```

### 2. Socket Events

**Connection:**
```javascript
// User joins their personal room automatically
socket.join(`user_${socket.userId}`);
```

**Notification Event:**
```javascript
// Event name: "new_notification"
// Sent to: `user_${userId}` room
```

---

## Frontend Setup (Axios + Socket.IO Client)

### 1. Install Dependencies
```bash
npm install socket.io-client axios
```

### 2. Socket Connection
```javascript
import io from 'socket.io-client';

const token = localStorage.getItem('token');

const socket = io('http://localhost:5000', {
  auth: {
    token: token
  }
});

// Listen for real-time notifications
socket.on('new_notification', (notification) => {
  console.log('New notification:', notification);
  // Update UI, show toast, etc.
});

// Connection status
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

### 3. API Service with Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Get notifications
export const getNotifications = async (page = 1) => {
  const response = await api.get(`/notifications?page=${page}`);
  return response.data;
};

// Mark as read
export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

// Mark all as read
export const markAllAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

// Get unread count
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};
```

---

## Notification Types & Triggers

### 1. Employee Created
**Trigger:** When admin creates new employee  
**Recipients:** All admins  
**Payload:**
```json
{
  "id": "notif-001",
  "title": "Karyawan Baru",
  "message": "Karyawan \"Andi Dea\" berhasil ditambahkan",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. KPI Assigned
**Trigger:** When KPI is assigned to employee  
**Recipients:** The assigned employee  
**Payload:**
```json
{
  "id": "notif-002",
  "title": "KPI Baru",
  "message": "Anda mendapatkan KPI \"Sales Performance\"",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 3. KPI Assessed
**Trigger:** When employee KPI is scored  
**Recipients:** The assessed employee  
**Payload:**
```json
{
  "id": "notif-003",
  "title": "Penilaian KPI",
  "message": "KPI \"Sales Performance\" dinilai 85% (Sangat Baik)",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Report Generated
**Trigger:** When division report is generated  
**Recipients:** All employees in the division  
**Payload:**
```json
{
  "id": "notif-004",
  "title": "Laporan Baru",
  "message": "Laporan periode 2024-1 sudah tersedia",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 5. Role Changed
**Trigger:** When user role is updated  
**Recipients:** The user whose role changed  
**Payload:**
```json
{
  "id": "notif-005",
  "title": "Perubahan Role",
  "message": "Role akun Anda telah berubah menjadi \"ADMIN\"",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 6. Password Reset
**Trigger:** When password is reset  
**Recipients:** The user whose password was reset  
**Payload:**
```json
{
  "id": "notif-006",
  "title": "Reset Password",
  "message": "Password Anda berhasil direset",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 7. Email Verified
**Trigger:** When email verification is complete  
**Recipients:** The user whose email was verified  
**Payload:**
```json
{
  "id": "notif-007",
  "title": "Verifikasi Email",
  "message": "Email Anda berhasil diverifikasi",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Complete Frontend Example

### React Component
```jsx
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { getNotifications, markAsRead, getUnreadCount } from './api/notifications';

function NotificationComponent() {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize socket connection
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    // Listen for real-time notifications
    newSocket.on('new_notification', (notification) => {
      console.log('Real-time notification:', notification);
      
      // Add to notifications list
      setNotifications(prev => [notification, ...prev]);
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification or toast
      showToast(notification.title, notification.message);
    });

    setSocket(newSocket);

    // Load existing notifications
    loadNotifications();
    loadUnreadCount();

    return () => newSocket.close();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const showToast = (title, message) => {
    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
    
    // Or show custom toast component
    console.log(`Toast: ${title} - ${message}`);
  };

  return (
    <div>
      <h3>Notifications ({unreadCount})</h3>
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={notif.isRead ? 'read' : 'unread'}
          onClick={() => handleMarkAsRead(notif.id)}
        >
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
          <small>{new Date(notif.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default NotificationComponent;
```

---

## Testing Backend

### 1. Test Socket Connection
```bash
# Use a WebSocket client or browser console
const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token' }
});

socket.on('connect', () => console.log('Connected'));
socket.on('new_notification', (data) => console.log('Notification:', data));
```

### 2. Test Notification Service
```javascript
// In your controller or test file
import notificationService from './services/notificationService';

// Test employee creation notification
await notificationService.employeeCreated("Andi Dea");

// Test KPI assignment notification
await notificationService.kpiAssigned("user-001", "Sales Performance");

// Test KPI assessment notification
await notificationService.kpiAssessed("user-001", "Sales Performance", 85);
```

### 3. Manual API Testing
```bash
# Test get notifications
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/notifications

# Test mark as read
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/notifications/NOTIF_ID/read
```

---

## Notes
- Socket connection requires valid JWT token
- Users automatically join their personal room (`user_${userId}`)
- Real-time notifications are sent immediately when actions occur
- Frontend should handle both real-time events and API responses
- Browser notifications require user permission
- Unread count updates automatically with real-time events