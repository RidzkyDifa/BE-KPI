import { Router } from "express";
import { updateUserRole } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";

const router = Router();

// Update user role (ADMIN only)
router.put("/:id/role", authMiddleware, requireAdmin, updateUserRole);

export default router;
