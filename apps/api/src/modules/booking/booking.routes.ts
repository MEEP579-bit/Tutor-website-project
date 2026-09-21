import { Router } from "express";
import * as controller from "./booking.controller";

// Đăng bài tìm gia sư (TutoringRequest), gửi/nhận/chấp nhận/từ chối yêu cầu dạy, lịch học
export const bookingRouter = Router();

// TODO: định nghĩa endpoint thực tế, ví dụ:
// bookingRouter.get("/", controller.list);
// bookingRouter.post("/", controller.create);
