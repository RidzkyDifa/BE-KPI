import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

// Import semua routes yang sudah ada
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import divisionRoutes from "./routes/divisionRoutes";
import positionRoutes from "./routes/positionRoutes";
import kpiRoutes from "./routes/kpiRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";
import reportRoutes from "./routes/reportRoutes";
import notificationRoutes from "./routes/notificationRoutes";

// Import notification service
import { setSocketIO } from "./services/notificationService";

const app = express();
const server = createServer(app);

// Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"]
  }
});

// Set socket ke notification service
setSocketIO(io);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO - Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("No token"));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    socket.userId = user.id;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// Socket.IO - Connection
io.on("connection", (socket) => {
  console.log(`User ${socket.userId} connected`);

  // Join user ke room mereka sendiri
  socket.join(`user_${socket.userId}`);

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/kpis", kpiRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

// Extend Socket interface
declare module "socket.io" {
  interface Socket {
    userId: string;
  }
}