import { Request, Response, NextFunction } from "express";
import * as service from "./auth.service";

// Controller cho module "auth" — Đăng ký, đăng nhập, xác thực email/sđt (OTP), quên mật khẩu, JWT
// TODO: thêm các handler tương ứng với route trong auth.routes.ts
