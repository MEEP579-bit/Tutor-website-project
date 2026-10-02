import { Router } from "express";
import {
  listHandler,
  unreadCountHandler,
  markAsReadHandler,
  markAllAsReadHandler,
} from "./notifications.controller";
import { requireAuth } from "../../middlewares/require-auth";

// Thông báo — docs GD3 mục 13
export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get("/", listHandler);
notificationsRouter.get("/unread-count", unreadCountHandler);
notificationsRouter.patch("/:id/read", markAsReadHandler);
notificationsRouter.patch("/read-all", markAllAsReadHandler);
