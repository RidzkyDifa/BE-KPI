import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import divisionRoutes from "./routes/divisionRoutes";
import positionRoutes from "./routes/positionRoutes"
import kpiRoutes from "./routes/kpiRoutes"
import assessmentRoutes from "./routes/assessmentRoutes"
import reportRoutes from "./routes/reportRoutes"
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // Autentikasi User
app.use("/api/employees", employeeRoutes); // CRUD Karyawan
app.use("/api/divisions", divisionRoutes); // CRUD Divisi

// Master data routes
app.use("/api/positions", positionRoutes);
app.use("/api/kpis", kpiRoutes);

// Assessment routes (penilaian KPI)
app.use("/api/assessments", assessmentRoutes);
app.use("/api/reports", reportRoutes)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
