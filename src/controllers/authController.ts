import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Hapus password dari respons
    delete (user as any).password;

    res.status(201).json({
      status: "success",
      message: "User registered",
      user,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      message: errorMessage,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    if (!SECRET) {
      return res.status(500).json({
        status: "error",
        message: "JWT_SECRET is not defined in environment variables",
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    // Server mengirim token, dan client simpan, entah localStorage, sessionStorage, atau cookie
    res.json({
      status: "success",
      message: "Login success",
      token,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      message: errorMessage,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  // Response disini hanya formalitas
  // Logika Client lah yang akan menghapus tokennya dari localStorage, sessionStorage, atau cookie untuk membuat user logout
  res.json({
    status: "success",
    message: "Logout success",
  });
};

// Ambil profile user saat ini
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Ambil userId dari req.user yang sudah diset di authMiddleware
    const userId = (req as any).user.userId; // Sesuaikan key dengan yang kamu sign di JWT

    if (!userId) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    res.json({
      status: "success",
      message: "User profile",
      user,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      message: errorMessage,
    });
  }
};

// Logika Reset Sandi
export const forgotPassword = async (req: Request, res: Response) => {
  const clientURL = process.env.CLIENT_URL;

  try {
    if (!req.body.email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Email not found",
      });
    }

    if (!SECRET) {
      return res.status(500).json({
        status: "error",
        message: "JWT secret for reset password is not set",
      });
    }

    if (!clientURL) {
      return res.status(500).json({
        status: "error",
        message: "Client URL not found",
      });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    // NANTI SETELAH INI, LINKNYA KIRIM KE EMAIL USER...
    // Kemudian diklik dan di Client akan mengambil tokennya saja dari URLnya
    // Client akan mengirim tokennya menggunakan Header Authorization Bearer <token>

    res.json({
      status: "success",
      message: "Reset password link sent to email",
      resetLink: resetLink,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      message: errorMessage,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers["authorization"];

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required",
      });
    }

    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token format",
      });
    }

    // Ambil tokennya aja karena bentuk value authHeader aslinya: Bearer <token> 
    const token = authHeader.split(" ")[1];

    if (!SECRET) {
      return res.status(500).json({
        status: "error",
        message: "JWT secret for reset password is not set",
      });
    }

    const decodedId = jwt.verify(token, SECRET) as { id: string };
    const numberedId = Number(decodedId.id);

    const user = await prisma.user.findUnique({ where: { id: numberedId } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: numberedId },
      data: { password: hashedPassword },
    });

    res.json({
      status: "success",
      message: "Password updated",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};
