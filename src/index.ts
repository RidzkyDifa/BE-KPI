import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes"
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // Autentikasi User
app.use("/api/employees", employeeRoutes); // CRUD Karyawan

// Master data routes ( Belum dibuat )
// app.use("/api/divisions", divisionRoutes);
// app.use("/api/positions", positionRoutes);
// app.use("/api/kpis", kpiRoutes);

// Assessment routes (penilaian KPI - Belum dibuat)
// app.use("/api/assessments", assessmentRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
