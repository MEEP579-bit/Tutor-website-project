import { Response, NextFunction } from "express";
import { updateMeSchema, changePasswordSchema } from "./users.schema";
import * as usersService from "./users.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function updateMeHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = updateMeSchema.parse(req.body);
    const user = await usersService.updateMe(req.userId!, input);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = changePasswordSchema.parse(req.body);
    const result = await usersService.changePassword(req.userId!, input);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
