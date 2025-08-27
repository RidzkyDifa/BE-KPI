import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // sosse (8/12): Simpan hasil decode ke req.use r contohnya nanti userId akan diambil di getProfile (getProfile yang ada di authController.ts)
    // sosse (8/12): Gunanya untuk keamanan, dibanding langsung req.body untuk ambil userId nya
    (req as any).user = decoded;

    // fungsi next() adalah lanjut ke controller jika berhasil melewati middleware ini sesuai yang ada di authRoutes
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
