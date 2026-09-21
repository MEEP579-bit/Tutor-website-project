import { Request, Response, NextFunction } from "express";
import * as service from "./notifications.service";

// Controller cho module "notifications" — Bắn & liệt kê thông báo (in-app/email/push), theo các sự kiện trong docs/03
// TODO: thêm các handler tương ứng với route trong notifications.routes.ts
