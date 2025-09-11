import { PrismaClient } from "@prisma/client";
import { Server as SocketIOServer } from "socket.io";

const prisma = new PrismaClient();
let io: SocketIOServer | null = null;

export const setSocketIO = (socketInstance: SocketIOServer) => {
  io = socketInstance;
};

class NotificationService {
  async create(userId: string, title: string, message: string) {
    const notif = await prisma.notification.create({
      data: { userId, title, message }
    });

    if (io) {
      io.to(`user_${userId}`).emit("new_notification", {
        id: notif.id,
        title: notif.title,
        message: notif.message,
        createdAt: notif.createdAt
      });
    }

    return notif;
  }

  async createForUsers(userIds: string[], title: string, message: string) {
    const data = userIds.map(userId => ({ userId, title, message }));
    await prisma.notification.createMany({ data });

    if (io) {
      userIds.forEach(userId => {
        io?.to(`user_${userId}`).emit("new_notification", { title, message, createdAt: new Date() });
      });
    }
  }

  // 🔔 Helper Notifikasi
  async employeeCreated(employeeName: string) {
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    const adminIds = admins.map(a => a.id);
    await this.createForUsers(adminIds, "Karyawan Baru", `Karyawan "${employeeName}" berhasil ditambahkan`);
  }

  async kpiAssigned(userId: string, kpiName: string) {
    await this.create(userId, "KPI Baru", `Anda mendapatkan KPI "${kpiName}"`);
  }

  async kpiAssessed(userId: string, kpiName: string, score: number) {
    const status = score >= 80 ? "Sangat Baik" : score >= 60 ? "Baik" : "Perlu Perbaikan";
    await this.create(userId, "Penilaian KPI", `KPI "${kpiName}" dinilai ${score}% (${status})`);
  }

  async reportGenerated(userIds: string[], period: string) {
    await this.createForUsers(userIds, "Laporan Baru", `Laporan periode ${period} sudah tersedia`);
  }

  async roleChanged(userId: string, newRole: string) {
    await this.create(userId, "Perubahan Role", `Role akun Anda telah berubah menjadi "${newRole}"`);
  }

  async passwordReset(userId: string) {
    await this.create(userId, "Reset Password", "Password Anda berhasil direset");
  }

  async emailVerified(userId: string) {
    await this.create(userId, "Verifikasi Email", "Email Anda berhasil diverifikasi");
  }
}

export default new NotificationService();
