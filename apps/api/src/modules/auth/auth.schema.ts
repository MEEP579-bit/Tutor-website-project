import { z } from "zod";

// Schema kiểm tra dữ liệu đăng ký/đăng nhập — dùng zod để validate trước khi chạm DB
export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").optional(),
  password: z.string().min(6, "Mật khẩu cần ít nhất 6 ký tự"),
  role: z.enum(["PARENT", "TUTOR"]),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
export type LoginInput = z.infer<typeof loginSchema>;
