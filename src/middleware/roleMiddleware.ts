import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";

// Middleware untuk cek role ADMIN
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ambil userId dari token yang sudah di-decode di authMiddleware
      const userId = (req as any).user.userId;
  
      if (!userId) {
        return res.status(401).json({
          status: "error",
          code: 401,
          errors: {
            auth: ["Unauthorized"]
          }
        });
      }
  
      // Cek user dan rolenya
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true }
      });
  
      if (!user) {
        return res.status(401).json({
          status: "error",
          code: 401,
          errors: {
            auth: ["User not found"]
          }
        });
      }
  
      // Cek apakah role ADMIN
      if (user.role !== "ADMIN") {
        return res.status(403).json({
          status: "error",
          code: 403,
          errors: {
            auth: ["Access denied. Admin role required"]
          }
        });
      }
  
      // fungsi next() adalah untuk lanjut ke controller sesuai yang ada di employeeRoutes (jika role ADMIN)
      next();
    } catch (err) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          server: ["Internal server error"]
        }
      });
    }
  };