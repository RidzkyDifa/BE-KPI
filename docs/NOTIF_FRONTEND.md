# 🔔 Simple Notification System - Frontend React

## 📦 Install Dependencies

```bash
npm install socket.io-client axios react-hot-toast
```

## 🔌 1. Socket Service (services/socket.js)

```javascript
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket?.connected) return this.socket;
    
    this.socket = io('http://localhost:5000', {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Listen untuk notifikasi baru
  onNewNotification(callback) {
    this.socket?.on('new_notification', callback);
  }

  // Listen untuk update count
  onUnreadCount(callback) {
    this.socket?.on('unread_count', callback);
  }
}

export default new SocketService();
```

## 🔗 2. Notification API (services/notificationApi.js)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Setup axios dengan token
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationApi = {
  getNotifications: (page = 1) => 
    api.get(`/notifications?page=${page}`),
    
  getUnreadCount: () => 
    api.get('/notifications/unread-count'),
    
  markAsRead: (id) => 
    api.put(`/notifications/${id}/read`),
    
  markAllAsRead: () => 
    api.put('/notifications/read-all'),
    
  deleteNotification: (id) => 
    api.delete(`/notifications/${id}`)
};
```

## 🎣 3. useNotification Hook (hooks/useNotification.js)

```javascript
import { useState, useEffect } from 'react';
import { notificationApi } from '../services/notificationApi';
import socketService from '../services/socket';
import toast from 'react-hot-toast';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotifications(page);
      setNotifications(response.data.data.notifications);
      setUnreadCount(response.data.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Gagal menandai notifikasi');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('Semua notifikasi ditandai sudah dibaca');
    } catch (error) {
      toast.error('Gagal menandai semua notifikasi');
    }
  };

  // Socket listeners
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
      
      // Listen new notification
      socketService.onNewNotification((notification) => {
        setNotifications(prev => [notification, ...prev]);
        toast.success(`New: ${notification.title}`);
      });

      // Listen unread count
      socketService.onUnreadCount((count) => {
        setUnreadCount(count);
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  };
};
```

## 🔔 4. Notification Bell Component (components/NotificationBell.jsx)

```javascript
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading,
    fetchNotifications, 
    markAsRead,
    markAllAsRead 
  } = useNotification();

  // Fetch saat pertama kali dibuka
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Auto mark all as read saat dibuka
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      setTimeout(markAllAsRead, 1000); // Delay 1 detik
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-gray-800"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    !notif.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <h4 className="font-medium text-sm">{notif.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notif.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to full notifications page
                window.location.href = '/notifications';
              }}
              className="w-full text-center text-sm text-blue-500 hover:text-blue-700 py-2"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
```

## 📱 6. Usage in App.js

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NotificationBell from './components/NotificationBell';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold">KPI System</h1>
              
              {/* Notification Bell di header */}
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-6">
          <Routes>
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* Routes lainnya */}
          </Routes>
        </main>

        {/* Toast Container */}
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
```

## 🚀 7. Quick Setup Steps

### Backend:
1. Install dependencies:
```bash
npm install socket.io @types/socket.io
```

2. Update Prisma schema dengan model Notification
3. Run migration:
```bash
npx prisma migrate dev --name add-notifications
```

4. Update your app.ts dengan Socket.IO setup
5. Add notification routes ke app.ts

### Frontend:
1. Install dependencies:
```bash
npm install socket.io-client axios react-hot-toast
```

2. Add socket service, notification API, dan hook
3. Add NotificationBell component ke header
4. Create NotificationsPage untuk halaman lengkap

## 📝 8. How to Use

### Kirim notifikasi dari backend:
```javascript
import notificationService from './services/notificationService';

// Notifikasi ke satu user
await notificationService.create(
  userId, 
  'Title', 
  'Message'
);

// Notifikasi ke multiple users
await notificationService.createForUsers(
  [userId1, userId2], 
  'Title', 
  'Message'
);
```

### Frontend otomatis akan:
- ✅ Terima notifikasi real-time
- ✅ Show toast notification
- ✅ Update unread count badge
- ✅ Auto mark as read saat buka dropdown/page

## 🎯 Features:
- ✅ Real-time notifications dengan Socket.IO
- ✅ Unread count badge di bell icon
- ✅ Toast notifications
- ✅ Auto mark as read
- ✅ Clean & simple UI
- ✅ Responsive design
- ✅ Easy to integrate

Sistem ini simpel tapi powerful! 🚀ificationBell;
```

## 📄 5. Full Notifications Page (pages/NotificationsPage.jsx)

```javascript
import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

const NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
    // Auto mark all as read saat halaman dibuka
    if (unreadCount > 0) {
      setTimeout(markAllAsRead, 2000);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications found
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border ${
                !notif.isRead 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{notif.title}</h3>
                  <p className="text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(notif.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!notif.isRead && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-blue-500 text-sm hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Not
// to be continued