import { Router } from "express";
import { createHandler, sentHandler, receivedHandler, statusHandler } from "./booking.controller";
import { requireAuth, requireRole } from "../../middlewares/require-auth";

// Yêu cầu học giữa phụ huynh & gia sư — GD3 mục 6-7, 12
export const bookingRouter = Router();

bookingRouter.post("/", requireAuth, requireRole("PARENT"), createHandler);
bookingRouter.get("/sent", requireAuth, requireRole("PARENT"), sentHandler);
bookingRouter.get("/received", requireAuth, requireRole("TUTOR"), receivedHandler);
bookingRouter.patch("/:id/status", requireAuth, requireRole("TUTOR"), statusHandler);
