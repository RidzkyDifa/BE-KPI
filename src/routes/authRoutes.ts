import express from "express";
import { forgotPassword, getProfile, login, logout, register, resetPassword } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";


const router = express.Router();

// router yang pakai authMiddleware adalah router yang hanya bisa diakses yang udah punya token JWT di Client alias yang udah login
// Jika belum login, maka tidak bisa, akan diblok sama authMiddleware
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
