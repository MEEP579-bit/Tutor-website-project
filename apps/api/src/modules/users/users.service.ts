import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import type { UpdateMeInput, ChangePasswordInput } from "./users.schema";

export class UserError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function toPublicUser(user: {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  region: string | null;
}) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    region: user.region,
  };
}

// Cập nhật thông tin tài khoản cơ bản — họ tên, SĐT, khu vực (GD3 mục 1)
// Việc XEM thông tin hiện tại dùng chung GET /api/auth/me đã có sẵn.
export async function updateMe(userId: string, input: UpdateMeInput) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: input.fullName,
        phone: input.phone,
        region: input.region,
      },
    });
    return toPublicUser(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new UserError("Số điện thoại này đã được dùng cho tài khoản khác", 409);
    }
    throw err;
  }
}

// Đổi mật khẩu — phải nhập đúng mật khẩu hiện tại
export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UserError("Không tìm thấy người dùng", 404);

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) throw new UserError("Mật khẩu hiện tại không đúng", 401);

  const passwordHash = await bcrypt.hash(input.newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { success: true };
}
