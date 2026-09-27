import { Router } from "express";
import { listHandler, addHandler, removeHandler } from "./favorites.controller";
import { requireAuth, requireRole } from "../../middlewares/require-auth";

// Lưu/bỏ lưu gia sư yêu thích của phụ huynh — docs mục "F. Yêu thích"
export const favoritesRouter = Router();

favoritesRouter.get("/", requireAuth, requireRole("PARENT"), listHandler);
favoritesRouter.post("/:tutorId", requireAuth, requireRole("PARENT"), addHandler);
favoritesRouter.delete("/:tutorId", requireAuth, requireRole("PARENT"), removeHandler);
