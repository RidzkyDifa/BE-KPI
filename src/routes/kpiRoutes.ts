import express from "express";

import {
  createKPI,
  getKPIById,
  updateKPI,
  getKPIReport,
  deleteKPI,
} from "../controllers/kpiController";

const router = express.Router();

router.post("/create", createKPI); // POST /api/kpi/create - Membuat KPI baru
router.get("/:id", getKPIById); // GET /api/kpi/:id - Ambil KPI pake ID
router.put("/update/:id", updateKPI); // PUT /api/kpi/update/:id - update KPI pake ID
router.get("/report", getKPIReport); // GET /api/kpi/report - Ambil laporan KPI
router.delete("/delete/:id", deleteKPI); // DELETE /api/kpi/delete/:id - Hapus KPI pake ID

export default router;
