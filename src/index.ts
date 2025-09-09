import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import divisionRoutes from "./routes/divisionRoutes";
import kpiRoutes from "./routes/kpiRoutes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // Autentikasi User
app.use("/api/employees", employeeRoutes); // CRUD Karyawan
app.use("/api/divisions", divisionRoutes); // CRUD Divisi
app.use("/api/kpi", kpiRoutes); // CRUD KPI

// Master data routes ( Belum dibuat )
// app.use("/api/positions", positionRoutes);
// app.use("/api/kpis", kpiRoutes);

// Assessment routes (penilaian KPI - Belum dibuat)
// app.use("/api/assessments", assessmentRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
