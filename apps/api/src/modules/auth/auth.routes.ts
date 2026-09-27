import { Router } from "express";
import { registerHandler, loginHandler, meHandler } from "./auth.controller";
import { requireAuth } from "../../middlewares/require-auth";

// Đăng ký, đăng nhập, phiên đăng nhập hiện tại (docs/03 mục 1-2)
export const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/me", requireAuth, meHandler);
