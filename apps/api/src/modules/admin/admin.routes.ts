import { Router } from "express";
import * as controller from "./admin.controller";

// Dashboard, duyệt hồ sơ gia sư, quản lý môn học/bài đăng, báo cáo, khóa tài khoản
export const adminRouter = Router();

// TODO: định nghĩa endpoint thực tế, ví dụ:
// adminRouter.get("/", controller.list);
// adminRouter.post("/", controller.create);
