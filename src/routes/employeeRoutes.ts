import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  linkEmployeeToUser,
  unlinkEmployeeFromUser
} from "../controllers/employeeController";
import { requireAdmin } from "../middleware/roleMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getAllEmployees); // GET /api/employees - Lihat semua karyawan (butuh login)
router.get("/:id", authMiddleware, getEmployeeById); // GET /api/employees/:id - Lihat detail karyawan (butuh login)
router.post("/", authMiddleware, requireAdmin, createEmployee); // POST /api/employees - Tambah karyawan baru (hanya ADMIN)
router.put("/:id", authMiddleware, requireAdmin, updateEmployee); // PUT /api/employees/:id - Update karyawan (hanya ADMIN)
router.delete("/:id", authMiddleware, requireAdmin, deleteEmployee); // DELETE /api/employees/:id - Hapus karyawan (hanya ADMIN)
router.post("/:id/link-user", authMiddleware, requireAdmin, linkEmployeeToUser); // POST /api/employees/:id/link-user - Link karyawan ke user (hanya ADMIN)
router.post("/:id/unlink-user", authMiddleware, requireAdmin, unlinkEmployeeFromUser); // POST /api/employees/:id/unlink-user - Unlink karyawan dari user (hanya ADMIN)

export default router;