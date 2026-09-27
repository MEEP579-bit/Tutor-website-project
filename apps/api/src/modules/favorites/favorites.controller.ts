import { Response, NextFunction } from "express";
import * as favoritesService from "./favorites.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function listHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const favorites = await favoritesService.listFavorites(req.userId!);
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

export async function addHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    await favoritesService.addFavorite(req.userId!, req.params.tutorId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function removeHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    await favoritesService.removeFavorite(req.userId!, req.params.tutorId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
