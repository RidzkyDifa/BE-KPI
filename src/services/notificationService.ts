// services/notificationService.ts
import { PrismaClient } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";

const prisma = new PrismaClient();
let io: SocketIOServer | null = null;

export const setSocketIO = (socketInstance: SocketIOServer) => {
  io = socketInstance;
};

class NotificationService {
  
  // Buat notifikasi baru
  async create(userId: string, title: string, message: string) {
    const notification = await prisma.notification.create({
      data: { userId, title, message }
    });

    // Kirim real-time ke user
    if (io) {
      io.to(`user_${userId}`).emit('new_notification', {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt
      });
      
      // Update unread count
      const count = await this.getUnreadCount(userId);
      io.to(`user_${userId}`).emit('unread_count', count);
    }

    return notification;
  }

  // Buat notifikasi untuk banyak user sekaligus
  async createForUsers(userIds: string[], title: string, message: string) {
    const notifications = userIds.map(userId => ({
      userId, title, message
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    // Kirim real-time ke semua user
    if (io) {
      userIds.forEach(async (userId) => {
        io?.to(`user_${userId}`).emit('new_notification', {
          title, message, createdAt: new Date()
        });
        
        const count = await this.getUnreadCount(userId);
        io?.to(`user_${userId}`).emit('unread_count', count);
      });
    }
  }

  // Hitung notifikasi yang belum dibaca
  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  // ===== CONTOH PENGGUNAAN =====
  
  // Notifikasi karyawan baru
  async employeeCreated(employeeName: string) {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    const adminIds = admins.map(admin => admin.id);
    await this.createForUsers(
      adminIds,
      'Karyawan Baru',
      `Karyawan baru "${employeeName}" telah ditambahkan`
    );
  }

  // Notifikasi penilaian KPI
  async kpiAssessed(employeeId: string, kpiName: string, score: number) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true }
    });

    if (employee?.user) {
      const status = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement';
      await this.create(
        employee.user.id,
        'Penilaian KPI Baru',
        `KPI "${kpiName}" Anda telah dinilai dengan skor ${score}% (${status})`
      );
    }
  }

  // Notifikasi reminder
  async kpiReminder(employeeId: string, kpiName: string) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true }
    });

    if (employee?.user) {
      await this.create(
        employee.user.id,
        'Pengingat KPI',
        `Jangan lupa untuk melengkapi penilaian "${kpiName}" Anda`
      );
    }
  }

  // Notifikasi user baru registrasi
  async userRegistered(userName: string, userEmail: string) {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    const adminIds = admins.map(admin => admin.id);
    await this.createForUsers(
      adminIds,
      'User Baru Terdaftar',
      `${userName} (${userEmail}) baru saja mendaftar`
    );
  }
}

export default new NotificationService();