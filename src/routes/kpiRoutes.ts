import express from "express";

import {
  createParamsKPI,
  updateParamsKPI,
  getAllParamsKPI,
  deleteParamsKPI,
  createKPI,
  getKPIById,
  updateKPI,
  getKPIReport,
  deleteKPI,
} from "../controllers/kpiController";

const router = express.Router();

router.get("/params", getAllParamsKPI); // GET /api/kpi/params - Ambil semua parameter KPI
router.post("/params/create", createParamsKPI); // POST /api/kpi/params/create - Membuat parameter KPI baru
router.put("/params/update/:id", updateParamsKPI); // PUT /api/kpi/params/update/:id - update parameter KPI pake ID
router.delete("/params/delete/:id", deleteParamsKPI); // DELETE /api/kpi/params/delete/:id - Hapus parameter KPI pake ID
router.post("/create", createKPI); // POST /api/kpi/create - Membuat KPI baru
router.get("/:id", getKPIById); // GET /api/kpi/:id - Ambil KPI pake ID
router.put("/update/:id", updateKPI); // PUT /api/kpi/update/:id - update KPI pake ID
router.get("/report", getKPIReport); // GET /api/kpi/report - Ambil laporan KPI
router.delete("/delete/:id", deleteKPI); // DELETE /api/kpi/delete/:id - Hapus KPI pake ID

export default router;
