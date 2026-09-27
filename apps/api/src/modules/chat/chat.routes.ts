import { Router } from "express";
import { listHandler, sendHandler, listConversationsHandler } from "./chat.controller";
import { requireAuth } from "../../middlewares/require-auth";

// Chat theo từng yêu cầu học (booking) — cả phụ huynh & gia sư đều dùng chung route này,
// quyền truy cập được kiểm tra trong service (chỉ 2 người liên quan, yêu cầu đã "Đã nhận")
export const chatRouter = Router();

chatRouter.get("/", requireAuth, listConversationsHandler);
chatRouter.get("/:bookingId", requireAuth, listHandler);
chatRouter.post("/:bookingId", requireAuth, sendHandler);
