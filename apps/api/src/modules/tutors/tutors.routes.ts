import { Router } from "express";
import * as controller from "./tutors.controller";

// Hồ sơ gia sư: CRUD, danh sách, tìm kiếm/lọc theo môn/ngân sách/khu vực/kinh nghiệm/trình độ/đánh giá
export const tutorsRouter = Router();

// TODO: định nghĩa endpoint thực tế, ví dụ:
// tutorsRouter.get("/", controller.list);
// tutorsRouter.post("/", controller.create);
