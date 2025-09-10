// routes/notificationRoutes.ts
import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} from "../controllers/notificationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);           // GET /api/notifications
router.get("/unread-count", authMiddleware, getUnreadCount); // GET /api/notifications/unread-count
router.put("/:id/read", authMiddleware, markAsRead);         // PUT /api/notifications/:id/read
router.put("/read-all", authMiddleware, markAllAsRead);      // PUT /api/notifications/read-all
router.delete("/:id", authMiddleware, deleteNotification);  // DELETE /api/notifications/:id

export default router;