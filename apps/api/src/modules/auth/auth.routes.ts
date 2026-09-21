import { Router } from "express";
import * as controller from "./auth.controller";

// Đăng ký, đăng nhập, xác thực email/sđt (OTP), quên mật khẩu, JWT
export const authRouter = Router();

// TODO: định nghĩa endpoint thực tế, ví dụ:
// authRouter.get("/", controller.list);
// authRouter.post("/", controller.create);
