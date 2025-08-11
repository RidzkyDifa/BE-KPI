import express from "express";
import {
  register,
  login,
  forgotPassword,
  logout,
  getProfile,
} from "../controller/authController";
import { authMiddleware } from "../middleware/authMidlleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/profile", getProfile);
router.post("/logout", authMiddleware, logout);

export default router;
