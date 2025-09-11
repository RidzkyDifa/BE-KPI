# Notification API Documentation

Base URL: `/api/notifications`

## Authentication
All endpoints require Bearer token authentication.

## Endpoints

### 1. Get All Notifications
```
GET /api/notifications
```

**Auth Required:** Yes (Bearer Token)  
**Admin Required:** No

**Request Headers:**
```json
{
  "Authorization": "Bearer <your_jwt_token>"
}
```

**Query Parameters:**
- `page` (optional, number): Page number for pagination (default: 1)

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-001",
        "userId": "user-001",
        "title": "KPI Assessment Reminder",
        "message": "Your Q1 2024 KPI assessment is due tomorrow",
        "type": "reminder",
        "isRead": false,
        "readAt": null,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "notif-002",
        "userId": "user-001",
        "title": "Performance Review Completed",
        "message": "Your performance review for Q4 2023 has been completed by Andi Dea",
        "type": "info",
        "isRead": true,
        "readAt": "2024-01-15T11:00:00.000Z",
        "createdAt": "2024-01-14T09:15:00.000Z",
        "updatedAt": "2024-01-15T11:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "total": 25,
      "pages": 3
    },
    "unreadCount": 5
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Gagal mengambil notifikasi"
}
```

---

### 2. Get Unread Count
```
GET /api/notifications/unread-count
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
  "success": true,
  "data": {
    "count": 3
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Gagal mengambil jumlah notifikasi"
}
```

---

### 3. Mark Notification as Read
```
PUT /api/notifications/:id/read
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
- `id` (string): Notification ID

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notifikasi ditandai sudah dibaca"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Gagal menandai notifikasi"
}
```

---

### 4. Mark All Notifications as Read
```
PUT /api/notifications/read-all
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
  "success": true,
  "message": "Semua notifikasi ditandai sudah dibaca"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Gagal menandai semua notifikasi"
}
```

---

### 5. Delete Notification
```
DELETE /api/notifications/:id
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
- `id` (string): Notification ID to delete

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notifikasi berhasil dihapus"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Gagal menghapus notifikasi"
}
```

---

## Common Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Sample Notification Types

### KPI Reminder
```json
{
  "id": "notif-003",
  "userId": "user-002",
  "title": "KPI Assessment Due",
  "message": "Hi Andi Dea 2, your Q1 2024 KPI assessment is now overdue. Please complete it as soon as possible.",
  "type": "warning",
  "isRead": false,
  "readAt": null,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:00.000Z"
}
```

### Performance Update
```json
{
  "id": "notif-004",
  "userId": "user-003",
  "title": "Performance Score Updated",
  "message": "Congratulations Andi Dea3! Your performance score has been updated to 95/100.",
  "type": "success",
  "isRead": false,
  "readAt": null,
  "createdAt": "2024-01-15T12:30:00.000Z",
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

### System Notification
```json
{
  "id": "notif-005",
  "userId": "user-001",
  "title": "System Maintenance",
  "message": "The system will undergo maintenance on January 20, 2024 from 02:00 to 04:00 AM.",
  "type": "info",
  "isRead": true,
  "readAt": "2024-01-15T14:20:00.000Z",
  "createdAt": "2024-01-15T07:00:00.000Z",
  "updatedAt": "2024-01-15T14:20:00.000Z"
}
```

## Notes
- Notifications are automatically filtered by user ID from JWT token
- Pagination shows 10 notifications per page by default
- All notifications are sorted by creation date (newest first)
- Users can only see, mark, and delete their own notifications
- `readAt` field is automatically set when marking as read
- Notification types: `info`, `warning`, `success`, `reminder`