import { z } from "zod";

// Cập nhật thông tin tài khoản cơ bản (docs/03 mục 1: "chỉnh sửa thông tin cá nhân")
export const updateMeSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn").optional(),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").optional(),
  region: z.string().min(2, "Khu vực không hợp lệ").optional(),
});
export type UpdateMeInput = z.infer<typeof updateMeSchema>;

// Đổi mật khẩu — yêu cầu nhập đúng mật khẩu cũ
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(6, "Mật khẩu mới cần ít nhất 6 ký tự"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
