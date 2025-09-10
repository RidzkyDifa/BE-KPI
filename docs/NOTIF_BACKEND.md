# 🚀 Backend Notification System - Setup & Testing Guide

## 📦 1. Installation & Setup

### Install Dependencies
```bash
npm install socket.io @types/socket.io
# atau
yarn add socket.io @types/socket.io
```

### Update package.json
Pastikan dependencies ini ada di `package.json`:
```json
{
  "dependencies": {
    "socket.io": "^4.7.2",
    "@types/socket.io": "^3.0.2"
  }
}
```

## 🗄️ 2. Database Setup

### Update Prisma Schema
Tambahkan model `Notification` dan update model `User`:

```prisma
// Tambahkan ke schema.prisma
model Notification {
  id          String    @id @default(uuid())
  title       String    
  message     String    
  isRead      Boolean   @default(false)
  readAt      DateTime?
  
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  
  @@index([userId])
  @@index([isRead])
  @@map("notifications")
}

// Update model User yang sudah ada
model User {
  // ... field yang sudah ada ...
  
  // Tambahkan relasi ini
  notifications Notification[]
}
```

### Run Migration
```bash
npx prisma migrate dev --name add-notifications
npx prisma generate
```

## 📁 3. File Structure

Buat file-file berikut di project Anda:

```
src/
├── services/
│   └── notificationService.ts     # Service untuk create & send notifications
├── controllers/
│   └── notificationController.ts  # API controllers
├── routes/
│   └── notificationRoutes.ts      # API routes
└── app.ts                         # Update dengan Socket.IO setup
```

## 🔧 4. Implementation Files

### A. Notification Service (`services/notificationService.ts`)
```typescript
import { PrismaClient } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";

const prisma = new PrismaClient();
let io: SocketIOServer | null = null;

export const setSocketIO = (socketInstance: SocketIOServer) => {
  io = socketInstance;
};

class NotificationService {
  // Buat notifikasi untuk satu user
  async create(userId: string, title: string, message: string) {
    const notification = await prisma.notification.create({
      data: { userId, title, message }
    });

    // Kirim real-time via Socket.IO
    if (io) {
      io.to(`user_${userId}`).emit('new_notification', {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt
      });
      
      const count = await this.getUnreadCount(userId);
      io.to(`user_${userId}`).emit('unread_count', count);
    }

    return notification;
  }

  // Buat notifikasi untuk multiple users
  async createForUsers(userIds: string[], title: string, message: string) {
    const notifications = userIds.map(userId => ({ userId, title, message }));
    await prisma.notification.createMany({ data: notifications });

    // Kirim real-time ke semua user
    if (io) {
      userIds.forEach(async (userId) => {
        io?.to(`user_${userId}`).emit('new_notification', { title, message, createdAt: new Date() });
        const count = await this.getUnreadCount(userId);
        io?.to(`user_${userId}`).emit('unread_count', count);
      });
    }
  }

  // Hitung unread count
  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  // Helper methods untuk use case spesifik
  async employeeCreated(employeeName: string) {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    const adminIds = admins.map(admin => admin.id);
    await this.createForUsers(adminIds, 'Karyawan Baru', `Karyawan "${employeeName}" telah ditambahkan`);
  }

  async kpiAssessed(employeeId: string, kpiName: string, score: number) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true }
    });

    if (employee?.user) {
      const status = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement';
      await this.create(employee.user.id, 'Penilaian KPI Baru', `KPI "${kpiName}" dinilai ${score}% (${status})`);
    }
  }
}

export default new NotificationService();
```

### B. Controller (`controllers/notificationController.ts`)
```typescript
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip, take: limit
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);

    res.json({
      success: true,
      data: { notifications, pagination: { page, total, pages: Math.ceil(total / limit) }, unreadCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil notifikasi" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() }
    });

    res.json({ success: true, message: "Notifikasi ditandai sudah dibaca" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menandai notifikasi" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });

    res.json({ success: true, message: "Semua notifikasi ditandai sudah dibaca" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal menandai semua notifikasi" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const count = await prisma.notification.count({ where: { userId, isRead: false } });
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil jumlah notifikasi" });
  }
};
```

### C. Routes (`routes/notificationRoutes.ts`)
```typescript
import express from "express";
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notificationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);           
router.get("/unread-count", authMiddleware, getUnreadCount); 
router.put("/:id/read", authMiddleware, markAsRead);         
router.put("/read-all", authMiddleware, markAllAsRead);      

export default router;
```

### D. Update App.ts dengan Socket.IO
```typescript
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { setSocketIO } from "./services/notificationService";

// Import routes yang sudah ada
import authRoutes from "./routes/authRoutes";
import notificationRoutes from "./routes/notificationRoutes";
// ... routes lainnya

const app = express();
const server = createServer(app);

// Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

setSocketIO(io); // Inject ke notification service

// Socket.IO Auth & Connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token"));
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    socket.userId = user.id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected`);
  socket.join(`user_${socket.userId}`);
  
  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Middleware & Routes
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
// ... routes lainnya

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

## 🧪 5. Testing Guide

### A. Manual Testing dengan Postman/Thunder Client

#### 1. Test Get Notifications
```
GET http://localhost:5000/api/notifications
Headers: Authorization: Bearer YOUR_JWT_TOKEN

Expected Response:
{
  "success": true,
  "data": {
    "notifications": [...],
    "pagination": {...},
    "unreadCount": 5
  }
}
```

#### 2. Test Mark as Read
```
PUT http://localhost:5000/api/notifications/NOTIFICATION_ID/read
Headers: Authorization: Bearer YOUR_JWT_TOKEN

Expected Response:
{
  "success": true,
  "message": "Notifikasi ditandai sudah dibaca"
}
```

#### 3. Test Unread Count
```
GET http://localhost:5000/api/notifications/unread-count
Headers: Authorization: Bearer YOUR_JWT_TOKEN

Expected Response:
{
  "success": true,
  "data": { "count": 3 }
}
```

### B. Test Notification Creation

#### 1. Test di Controller Lain (contoh: employeeController.ts)
```typescript
import notificationService from "../services/notificationService";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    // ... kode create employee yang sudah ada ...
    
    // Test notifikasi
    if (newEmployee) {
      await notificationService.employeeCreated(newEmployee.employeeNumber || 'Karyawan Baru');
    }
    
    // ... sisa kode ...
  } catch (error) {
    // ... error handling ...
  }
};
```

#### 2. Test Manual di API Endpoint
Buat endpoint temporary untuk testing:

```typescript
// Tambahkan di routes/notificationRoutes.ts
router.post("/test", authMiddleware, async (req: Request, res: Response) => {
  try {
    await notificationService.create(
      req.user?.id!, 
      "Test Notification", 
      "This is a test message"
    );
    res.json({ success: true, message: "Test notification sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send test notification" });
  }
});
```

### C. Test Socket.IO Real-time

#### 1. Test dengan Browser Console
```javascript
// Di browser console (setelah login)
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('new_notification', (data) => {
  console.log('New notification:', data);
});

socket.on('unread_count', (count) => {
  console.log('Unread count:', count);
});
```

#### 2. Test dengan Node.js Script
Buat file `test-socket.js`:

```javascript
const { io } = require('socket.io-client');

const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => {
  console.log('✅ Connected to server');
});

socket.on('new_notification', (data) => {
  console.log('📬 New notification:', data);
});

socket.on('unread_count', (count) => {
  console.log('🔢 Unread count:', count);
});

socket.on('connect_error', (error) => {
  console.log('❌ Connection error:', error.message);
});
```

Run dengan: `node test-socket.js`

## 🐛 6. Troubleshooting

### Common Issues:

#### 1. Socket.IO Connection Error
```
Error: No token / Invalid token
```
**Solution:** Pastikan JWT token valid dan dikirim di `auth.token`

#### 2. Notification tidak muncul real-time
**Check:**
- Server Socket.IO berjalan di port yang benar
- User join ke room `user_${userId}` 
- Frontend connect ke Socket.IO dengan token valid

#### 3. Database Error
```
Error: Table 'notifications' doesn't exist
```
**Solution:** Run migration: `npx prisma migrate dev`

#### 4. CORS Error di Socket.IO
**Solution:** Update CORS config di Socket.IO setup:
```typescript
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

## ✅ 7. Quick Checklist

- [ ] Dependencies installed (`socket.io`, `@types/socket.io`)
- [ ] Prisma schema updated & migrated
- [ ] notificationService.ts created
- [ ] notificationController.ts created  
- [ ] notificationRoutes.ts created
- [ ] app.ts updated with Socket.IO
- [ ] Routes added to app.ts
- [ ] Test API endpoints work
- [ ] Test Socket.IO connection
- [ ] Test real-time notifications

Selesai! Backend notification system siap digunakan 🚀