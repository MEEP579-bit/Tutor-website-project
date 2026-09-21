import { Router } from "express";
import * as controller from "./notifications.controller";

// Bắn & liệt kê thông báo (in-app/email/push), theo các sự kiện trong docs/03
export const notificationsRouter = Router();

// TODO: định nghĩa endpoint thực tế, ví dụ:
// notificationsRouter.get("/", controller.list);
// notificationsRouter.post("/", controller.create);
