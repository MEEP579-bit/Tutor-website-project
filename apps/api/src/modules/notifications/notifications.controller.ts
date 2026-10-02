import { Response, NextFunction } from "express";
import * as notificationsService from "./notifications.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function listHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await notificationsService.listMine(req.userId!));
  } catch (err) {
    next(err);
  }
}

export async function unreadCountHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json({ count: await notificationsService.unreadCount(req.userId!) });
  } catch (err) {
    next(err);
  }
}

export async function markAsReadHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await notificationsService.markAsRead(req.userId!, req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function markAllAsReadHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await notificationsService.markAllAsRead(req.userId!));
  } catch (err) {
    next(err);
  }
}
