import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    // Request isi untuk mendaftarkan pengguna baru
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna baru ke database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Hapus password dari respons
    delete user.password;

    // Kembalikan respons sukses
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    // Tangani error
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Request isi untuk login pengguna
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // Cek apakah pengguna ada di database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Verifikasi password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid email or password" });

    // Buat token
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.json({ message: "Login success", token });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ message: errorMessage });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    // Request isi untuk mengatur ulang password
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Cek apakah email terdaftar
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Email not found" });

    // Logika untuk mengirim email reset password (misalnya menggunakan nodemailer)

    // Mengembalikan pesan sukses
    res.json({ message: "Reset password link sent to email" });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ message: errorMessage });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Logika untuk mendapatkan profil pengguna
    res.json({ message: "User profile", user: req.user });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ message: errorMessage });
  }
};

export const logout = (req: Request, res: Response) => {
  // Logika untuk logout pengguna
  res.json({ message: "Logout success" });
};
