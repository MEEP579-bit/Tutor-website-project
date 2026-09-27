import { Router } from "express";
import {
  listHandler,
  getByIdHandler,
  getMyProfileHandler,
  updateMyProfileHandler,
} from "./tutors.controller";
import { requireAuth, requireRole } from "../../middlewares/require-auth";

// Hồ sơ gia sư — GD3 mục 2-5
export const tutorsRouter = Router();

// Công khai — tìm kiếm & xem chi tiết, không cần đăng nhập
tutorsRouter.get("/", listHandler);

// Của chính gia sư đang đăng nhập — phải đặt TRƯỚC "/:id" bên dưới
tutorsRouter.get("/me", requireAuth, requireRole("TUTOR"), getMyProfileHandler);
tutorsRouter.put("/me", requireAuth, requireRole("TUTOR"), updateMyProfileHandler);

// Công khai — xem chi tiết 1 gia sư theo id (đặt CUỐI vì là route động)
tutorsRouter.get("/:id", getByIdHandler);
