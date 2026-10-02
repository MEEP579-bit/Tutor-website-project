import { Router } from "express";
import { updateMeHandler, changePasswordHandler } from "./users.controller";
import { requireAuth } from "../../middlewares/require-auth";

// Tài khoản của tôi — sửa họ tên/SĐT/khu vực, đổi mật khẩu (GD3 mục 1)
// Xem thông tin hiện tại dùng chung GET /api/auth/me đã có sẵn.
export const usersRouter = Router();

usersRouter.put("/me", requireAuth, updateMeHandler);
usersRouter.post("/me/password", requireAuth, changePasswordHandler);
