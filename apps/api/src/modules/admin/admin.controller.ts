import { Response, NextFunction } from "express";
import * as adminService from "./admin.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function overviewHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await adminService.getOverview());
  } catch (err) {
    next(err);
  }
}

export async function listTutorsHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await adminService.listTutors());
  } catch (err) {
    next(err);
  }
}

export async function listParentsHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await adminService.listParents());
  } catch (err) {
    next(err);
  }
}

export async function suspendUserHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await adminService.suspendUser(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function unsuspendUserHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await adminService.unsuspendUser(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function deleteReviewHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    res.json(await adminService.deleteReview(req.params.id));
  } catch (err) {
    next(err);
  }
}
