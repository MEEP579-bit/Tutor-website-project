import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import type { RegisterInput, LoginInput } from "./auth.schema";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function signToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function toPublicUser(user: { id: string; fullName: string; email: string; role: string; avatarUrl: string | null }) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };
}

// Đăng ký — tạo tài khoản phụ huynh hoặc gia sư (docs/03-tinh-nang-va-du-lieu.md mục 1-2)
export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AuthError("Email này đã được đăng ký", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        passwordHash,
        role: input.role,
        // Nếu là gia sư, tự tạo hồ sơ gia sư trống để hoàn thiện sau (GD3 mục 2)
        ...(input.role === "TUTOR"
          ? { tutorProfile: { create: { subjects: [], certificates: [] } } }
          : {}),
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const field = (err.meta?.target as string[] | undefined)?.[0];
      if (field === "phone") {
        throw new AuthError("Số điện thoại này đã được đăng ký cho tài khoản khác", 409);
      }
      throw new AuthError("Thông tin đã được đăng ký cho tài khoản khác", 409);
    }
    throw err;
  }

  const token = signToken(user.id, user.role);
  return { token, user: toPublicUser(user) };
}

// Đăng nhập — dùng chung cho phụ huynh/gia sư/admin
export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AuthError("Email hoặc mật khẩu không đúng", 401);
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AuthError("Email hoặc mật khẩu không đúng", 401);
  }

  if (user.suspendedAt) {
    throw new AuthError("Tài khoản này đã bị khóa. Vui lòng liên hệ quản trị viên.", 403);
  }

  const token = signToken(user.id, user.role);
  return { token, user: toPublicUser(user) };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("Không tìm thấy người dùng", 404);
  return toPublicUser(user);
}
