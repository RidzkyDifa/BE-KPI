import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import jwt from "jsonwebtoken";
import {
  EmailSendError,
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from "../services/emailService";
import {
  TokenExpiredCustomError,
  TokenInvalidError,
  verifyToken,
} from "../utils/verifyJWT";
import { Request, Response } from "express";
import { randomBytes } from "crypto";

const SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    const errors: { [key: string]: string[] } = {};
    
    if (!name) {
      errors.name = ["Name is required"];
    }
    
    if (!email) {
      errors.email = ["Email is required"];
    } else {
      // sosse (8/13): Perlukah validasi format email juga disini? atau cuma di client?
      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = ["Email must be a valid email address"];
      }
    }
    
    if (!password) {
      errors.password = ["Password is required"];
    } else if (password.length < 8) {
      // sosse (8/13): Ini juga butuhkah?, kalau iya berapa minimalnya?
      errors.password = ["Password must be at least 8 characters"];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        code: 409,
        errors: {
          email: ["Email already registered"]
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token dan set expiry 1 jam
    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 1);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
        verified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        divisi: true,
      }
    });

    // sosse (8/13): apakah akan tetap begini? atau langsung select/filter aja datanya dari prisma
    // kirim verifikasi ke email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "User registered successfully. Please check your email to verify your account.",
        user
      }
    });
  } catch (err) {
    if (err instanceof EmailSendError) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          email: [err.message]
        }
      });
    }

    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params; // sosse (8/13): Apakah menggunakan param seperti ini untuk menerima token? Kalau pun tetap begini maka /api/auth/verify-email/<token>

    if (!token) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors: {
          token: ["Verification token is required"]
        }
      });
    }

    // Cari user dengan token verifikasi yang valid dan belum expired
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(),
        },
        verified: false,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          token: ["Invalid or expired verification token"]
        }
      });
    }

    if (user.verified) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          email: ["Email already verified"]
        }
      });
    }

    // Update user: set verified = true, hapus token dan expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    // sosse (8/13): apakah akan tetap begini? atau langsung select/filter aja datanya dari prisma
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Email verified successfully. You can now login."
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// sosse (8/13): api ini fungsinya untuk mengirim ulang verifikasi link bagi yang sudah mendaftar akun tapi belum verifikasi emailnya, karena sudah ada email dia di database, otomatis tidak bisa lagi trigger di api /register
export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors: {
          email: ["Email is required"]
        }
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors: {
          email: ["Email must be a valid email address"]
        }
      });
    }

    // Cari user yang belum verified
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          email: ["User not found"]
        }
      });
    }

    if (user.verified) {
      return res.status(400).json({
        status: "error",
        code: 400,
        errors: {
          email: ["Email already verified"]
        }
      });
    }

    // Generate token baru dan set expiry 1 jam
    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 1);

    // Update user dengan token baru
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires,
      },
    });

    // kirim verifikasi ulang ke email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Verification email sent successfully"
      }
    });
  } catch (err) {
    if (err instanceof EmailSendError) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          email: [err.message]
        }
      });
    }

    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// sosse (8/13): Disinilah token JWT dikirimkan ke client, bukan langsung dari /register atau /verify-email, melainkan lewat /login
// sosse (8/13): Biasanya /login bisa di trigger berkali kali meski masih ada token yang belum expired di client, tapi agar aman mungkin bisa tambah if conditional di client agar tidak ke trigger login berkali-kali meski biasanya aman
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    const errors: { [key: string]: string[] } = {};
    
    if (!email) {
      errors.email = ["Email is required"];
    }
    
    if (!password) {
      errors.password = ["Password is required"];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors
      });
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: {
        divisi: true
      }
    });
    
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        errors: {
          credentials: ["Invalid email or password"]
        }
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        status: "error",
        code: 401,
        errors: {
          credentials: ["Invalid email or password"]
        }
      });
    }

    // validasi email
    if (!user.verified) {
      return res.status(403).json({
        status: "error",
        code: 403,
        errors: {
          email: ["Please verify your email address first. Check your inbox or request a new verification email."]
        }
      });
    }

    if (!SECRET) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          server: ["JWT_SECRET is not defined in environment variables"]
        }
      });
    }

    const token = jwt.sign({ userId: user.id }, SECRET as string, {
      expiresIn: "1h",
    });

    // Exclude password from response
    const { password: _, verificationToken: __, verificationTokenExpires: ___, ...userResponse } = user;

    // sosse (8/12): Server mengirim token, dan client simpan di entah localStorage, sessionStorage, atau cookie
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Login successful",
        user: userResponse,
        token
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

export const logout = (req: Request, res: Response) => {
  // sosse (8/12): Response disini hanya formalitas
  // sosse (8/12): Logika client lah yang akan menentukan user logout dengan menghapus tokennya yg tersimpan, entah dari localStorage, sessionStorage, atau cookie
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: "Logout successful"
    }
  });
};

// sosse (8/13): Hanya mengambil data dari user yang sudah login saja
export const getProfile = async (req: Request, res: Response) => {
  try {
    // sosse (8/12): Ambil userId dari req.user.userId yang sudah diset di authMiddleware (jadi bukan langsung dengan req.body karena alasan keamanan)
    // sosse (8/12): Sesuaikan key dengan yang kamu sign di JWT (cek api /login, dia mengambil user.id untuk di signed)
    const userId = (req as any).user.userId;

    if (!userId) {
      return res.status(401).json({ 
        status: "error", 
        code: 401,
        errors: {
          auth: ["Unauthorized"]
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        divisi: true,
        // matriksKpi: true, // sosse(8/13) Uncomment jika perlu data KPI di profil
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          user: ["User not found"]
        }
      });
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        user
      }
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

// sosse (8/13): Logika lupa sandi mulai dari sini, forgotPassword mengirimkan URL dengan token lewat email, kemudian token diambil di client dan dikirim balik ke server, jika sesuai tokennya maka proses lanjut untuk ganti sandi
export const forgotPassword = async (req: Request, res: Response) => {
  const clientURL = process.env.CLIENT_URL;
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({
      status: "error",
      code: 422,
      errors: {
        email: ["Email is required"]
      }
    });
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(422).json({
      status: "error",
      code: 422,
      errors: {
        email: ["Email must be a valid email address"]
      }
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          email: ["Email not found"]
        }
      });
    }

    if (!SECRET) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          server: ["JWT secret for reset password is not set"]
        }
      });
    }

    if (!clientURL) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          server: ["Client URL not found"]
        }
      });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "10m" });

    // sosse (8/12): Kirim email dengan link reset
    await sendForgotPasswordEmail(email, token);

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Reset password link sent to email"
      }
    });
  } catch (err) {
    if (err instanceof EmailSendError) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          email: [err.message]
        }
      });
    }

    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({
      status: "error",
      code: 500,
      errors: {
        server: [errorMessage]
      }
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers["authorization"];

    // Validasi input
    const errors: { [key: string]: string[] } = {};
    
    if (!password) {
      errors.password = ["Password is required"];
    } else if (password.length < 8) {
      errors.password = ["Password must be at least 8 characters"];
    }

    if (!authHeader) {
      errors.token = ["Authorization header missing"];
    } else if (!authHeader.startsWith("Bearer ")) {
      errors.token = ["Invalid token format"];
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        status: "error",
        code: 422,
        errors
      });
    }

    // sosse (8/13): Ambil tokennya aja dari authHeader, karena bentuk value authHeader aslinya: Bearer <token>, jadi perlu dipotong dulu dengan .split(" ")[1]
    const token = authHeader!.split(" ")[1];

    if (!SECRET) {
      return res.status(500).json({
        status: "error",
        code: 500,
        errors: {
          server: ["JWT secret for reset password is not set"]
        }
      });
    }

    // sosse (8/13): Saya pakai seperti ini hanya untuk verifikasi token resetPassword agar dapat menerima error yang lebih spesifik dari sini (custom error) seperti yang ada didalam catch dibawah
    const decodedId = verifyToken<{ id: string }>(token as string, SECRET);

    const user = await prisma.user.findUnique({ where: { id: decodedId.id } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        errors: {
          user: ["User not found"]
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: decodedId.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        message: "Password updated successfully"
      }
    });
  } catch (err) {
    if (err instanceof TokenExpiredCustomError) {
      return res.status(400).json({ 
        status: "error", 
        code: 400,
        errors: {
          token: ["Verification link expired"]
        }
      });
    }

    if (err instanceof TokenInvalidError) {
      return res.status(400).json({
        status: "error", 
        code: 400,
        errors: {
          token: ["Invalid verification link"]
        }
      });
    }

    res.status(400).json({
      status: "error",
      code: 400,
      errors: {
        token: ["Invalid or expired token"]
      }
    });
  }
};1