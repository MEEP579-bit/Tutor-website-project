import { Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import * as authService from "./auth.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function registerHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function meHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.userId!);
    res.json(user);
  } catch (err) {
    next(err);
  }
}
