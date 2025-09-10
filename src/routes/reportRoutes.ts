import express from "express";
import {
  getEmployeePerformanceReport,
  getDivisionPerformanceReport,
  getKPIPerformanceReport,
  getDashboardOverview
} from "../controllers/reportController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardOverview); // GET /api/reports/dashboard - Dashboard overview (requires login)
router.get("/employee/:employeeId", authMiddleware, getEmployeePerformanceReport); // GET /api/reports/employee/:employeeId - Employee performance report (requires login)
router.get("/division/:divisionId", authMiddleware, getDivisionPerformanceReport); // GET /api/reports/division/:divisionId - Division performance report (requires login)
router.get("/kpi/:kpiId", authMiddleware, getKPIPerformanceReport); // GET /api/reports/kpi/:kpiId - KPI performance report (requires login)

export default router;