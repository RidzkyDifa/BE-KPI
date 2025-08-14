import express from "express";

import {
  register,
  login,
  forgotPassword,
  logout,
  getProfile,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// sosse (8/12): router yang pakai authMiddleware adalah router yang hanya bisa diakses yang udah punya token JWT di Client alias yang udah login
// sosse (8/12) Jika belum login, maka tidak bisa, akan diblok sama authMiddleware
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/profile", authMiddleware, getProfile);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
