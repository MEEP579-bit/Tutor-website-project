import { Router } from "express";
import * as controller from "./verification.controller";

// Upload & duyệt CCCD/thẻ SV/bằng cấp/chứng chỉ, cấp huy hiệu xác minh
export const verificationRouter = Router();

// TODO: định nghĩa endpoint thực tế, ví dụ:
// verificationRouter.get("/", controller.list);
// verificationRouter.post("/", controller.create);
