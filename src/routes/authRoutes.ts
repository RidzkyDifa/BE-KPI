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
// sosse (8/12): Jika belum login, maka tidak bisa, akan diblok sama authMiddleware

router.post("/register", register); // POST /api/auth/register - Daftar akun baru (tidak perlu login)
router.post("/login", login); // POST /api/auth/login - Masuk ke sistem (tidak perlu login)
router.post("/logout", authMiddleware, logout); // POST /api/auth/logout - Keluar dari sistem (butuh login)
router.get("/profile", authMiddleware, getProfile); // GET /api/auth/profile - Lihat profil user yang sedang login (butuh login)
router.get("/verify-email/:token", verifyEmail); // GET /api/auth/verify-email/:token - Verifikasi email dengan token (tidak perlu login)
router.post("/resend-verification", resendVerification); // POST /api/auth/resend-verification - Kirim ulang email verifikasi (tidak perlu login)
router.post("/forgot-password", forgotPassword); // POST /api/auth/forgot-password - Minta reset password via email (tidak perlu login)
router.post("/reset-password", resetPassword); // POST /api/auth/reset-password - Reset password dengan token (tidak perlu login)

export default router;
