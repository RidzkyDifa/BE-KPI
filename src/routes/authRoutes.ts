import express from "express";
import {
  register,
  login,
  forgotPassword,
  logout,
  getProfile,
  resetPassword,
} from "../controller/authController";
import { authMiddleware } from "../middleware/authMidlleware";

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
