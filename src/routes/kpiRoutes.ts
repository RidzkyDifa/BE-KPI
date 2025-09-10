import express from "express";
import {
  getAllKPIs,
  getKPIById,
  createKPI,
  updateKPI,
  deleteKPI
} from "../controllers/kpiController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getAllKPIs); // GET /api/kpis - View all KPIs (requires login)
router.get("/:id", authMiddleware, getKPIById); // GET /api/kpis/:id - View KPI details (requires login)
router.post("/", authMiddleware, requireAdmin, createKPI); // POST /api/kpis - Create new KPI (ADMIN only)
router.put("/:id", authMiddleware, requireAdmin, updateKPI); // PUT /api/kpis/:id - Update KPI (ADMIN only)
router.delete("/:id", authMiddleware, requireAdmin, deleteKPI); // DELETE /api/kpis/:id - Delete KPI (ADMIN only)

export default router;