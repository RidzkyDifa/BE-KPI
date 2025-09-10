// controllers/notificationController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ambil semua notifikasi user
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
        skip,
        take: limit
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } })
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil notifikasi"
    });
  }
};

// Tandai sudah dibaca
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() }
    });

    res.json({
      success: true,
      message: "Notifikasi ditandai sudah dibaca"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menandai notifikasi"
    });
  }
};

// Tandai semua sudah dibaca
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() }
    });

    res.json({
      success: true,
      message: "Semua notifikasi ditandai sudah dibaca"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menandai semua notifikasi"
    });
  }
};

// Ambil jumlah yang belum dibaca
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const count = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil jumlah notifikasi"
    });
  }
};

// Hapus notifikasi
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await prisma.notification.deleteMany({
      where: { id, userId }
    });

    res.json({
      success: true,
      message: "Notifikasi berhasil dihapus"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus notifikasi"
    });
  }
};