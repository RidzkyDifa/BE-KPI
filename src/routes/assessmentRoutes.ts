import express from "express";
import {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getAssessmentsByEmployee
} from "../controllers/assessmentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getAllAssessments); // GET /api/assessments - View all assessments with filters (requires login)
router.get("/:id", authMiddleware, getAssessmentById); // GET /api/assessments/:id - View assessment details (requires login)
router.get("/employee/:employeeId", authMiddleware, getAssessmentsByEmployee); // GET /api/assessments/employee/:employeeId - View assessments by employee (requires login)
router.post("/", authMiddleware, requireAdmin, createAssessment); // POST /api/assessments - Create new assessment (ADMIN only)
router.put("/:id", authMiddleware, requireAdmin, updateAssessment); // PUT /api/assessments/:id - Update assessment (ADMIN only)
router.delete("/:id", authMiddleware, requireAdmin, deleteAssessment); // DELETE /api/assessments/:id - Delete assessment (ADMIN only)

export default router;