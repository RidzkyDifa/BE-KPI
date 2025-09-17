import { Request, Response } from "express";
import prisma from "../utils/prisma";
import notificationService from "../services/notificationService";

// PUT /api/users/:id/role - Update user role (ADMIN only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validasi role
    const validRoles = ["ADMIN", "USER"]; // sesuaikan dengan enum di schema.prisma
    if (!role || !validRoles.includes(role)) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors: { role: ["Invalid role value"] },
      });
    }

    // Cari user
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: { user: ["User not found"] },
      });
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    // 🔔 Kirim notifikasi
    await notificationService.roleChanged(updatedUser.id, updatedUser.role);

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "User role updated successfully",
        user: updatedUser,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: { server: [errorMessage] },
    });
  }
};
