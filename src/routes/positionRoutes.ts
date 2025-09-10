import express from "express";
import {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} from "../controllers/positionController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getAllPositions); // GET /api/positions - View all positions (requires login)
router.get("/:id", authMiddleware, getPositionById); // GET /api/positions/:id - View position details (requires login)
router.post("/", authMiddleware, requireAdmin, createPosition); // POST /api/positions - Create new position (ADMIN only)
router.put("/:id", authMiddleware, requireAdmin, updatePosition); // PUT /api/positions/:id - Update position (ADMIN only)
router.delete("/:id", authMiddleware, requireAdmin, deletePosition); // DELETE /api/positions/:id - Delete position (ADMIN only)

export default router;