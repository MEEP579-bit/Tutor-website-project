import { Router } from "express";
import {
  overviewHandler,
  listTutorsHandler,
  listParentsHandler,
  suspendUserHandler,
  unsuspendUserHandler,
  deleteReviewHandler,
} from "./admin.controller";
import { requireAuth, requireRole } from "../../middlewares/require-auth";

// Quản trị — docs "hệ thống admin"
// Duyệt giấy tờ xác minh dùng chung route bên module verification (GET /pending, PATCH /:id/review)
export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("ADMIN"));

adminRouter.get("/overview", overviewHandler);
adminRouter.get("/tutors", listTutorsHandler);
adminRouter.get("/parents", listParentsHandler);
adminRouter.patch("/users/:id/suspend", suspendUserHandler);
adminRouter.patch("/users/:id/unsuspend", unsuspendUserHandler);
adminRouter.delete("/reviews/:id", deleteReviewHandler);
