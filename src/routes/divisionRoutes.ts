import express from "express";
import {
  createDivision,
  getAllDivisions,
  getDivisionById,
  updateDivision,
  deleteDivision,
} from "../controllers/divisionController";

const router = express.Router();

router.post("/create", createDivision);
router.get("/get", getAllDivisions);
router.get("/get/:id", getDivisionById);
router.put("/update/:id", updateDivision);
router.delete("/delete/:id", deleteDivision);

export default router;
