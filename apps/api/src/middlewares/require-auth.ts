import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../config/prisma";

export interface AuthedRequest extends Request {
  userId?: string;
  role?: "PARENT" | "TUTOR" | "ADMIN";
}

// Kiểm tra token HỢP LỆ, và tra database để chắc chắn tài khoản KHÔNG BỊ KHÓA —
// bắt buộc phải tra DB (không chỉ tin vào token) vì token cũ (hạn tới 30 ngày)
// vẫn còn hiệu lực ngay cả sau khi admin khóa tài khoản đó.
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: AuthedRequest["role"] };

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { suspendedAt: true },
    });
    if (!user) {
      return res.status(401).json({ message: "Tài khoản không còn tồn tại" });
    }
    if (user.suspendedAt) {
      return res.status(403).json({ message: "Tài khoản này đã bị khóa. Vui lòng liên hệ quản trị viên." });
    }

    req.userId = payload.sub;
    req.role = payload.role;
    next();
  } catch {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}

export function requireRole(...roles: AuthedRequest["role"][]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
}
