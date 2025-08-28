import express from "express";
import {
  createDivision,
  getAllDivisions,
  getDivisionById,
  updateDivision,
  deleteDivision,
} from "../controllers/divisionController";
import { requireAdmin } from "../middleware/roleMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getAllDivisions); // GET /api/divisions - Lihat semua divisi (butuh login)
router.get("/:id", authMiddleware, getDivisionById); // GET /api/divisions/:id - Lihat detail divisi (butuh login)
router.post("/", authMiddleware, requireAdmin, createDivision); // POST /api/divisions - Tambah divisi baru (hanya ADMIN)
router.put("/:id", authMiddleware, requireAdmin, updateDivision); // PUT /api/divisions/:id - Update divisi (hanya ADMIN)
router.delete("/:id", authMiddleware, requireAdmin, deleteDivision); // DELETE /api/divisions/:id - Hapus divisi (hanya ADMIN)

export default router;