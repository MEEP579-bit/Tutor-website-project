import { Router } from "express";
import { submitHandler, listMineHandler, listPendingHandler, reviewHandler } from "./verification.controller";
import { requireAuth, requireRole } from "../../middlewares/require-auth";

// Xác minh gia sư — docs "A. Xác minh gia sư"
export const verificationRouter = Router();

verificationRouter.post("/", requireAuth, requireRole("TUTOR"), submitHandler);
verificationRouter.get("/me", requireAuth, requireRole("TUTOR"), listMineHandler);
verificationRouter.get("/pending", requireAuth, requireRole("ADMIN"), listPendingHandler);
verificationRouter.patch("/:id/review", requireAuth, requireRole("ADMIN"), reviewHandler);
