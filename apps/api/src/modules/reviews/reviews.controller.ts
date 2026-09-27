import { Response, NextFunction } from "express";
import { createReviewSchema } from "./reviews.schema";
import * as reviewsService from "./reviews.service";
import type { AuthedRequest } from "../../middlewares/require-auth";

export async function createHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const input = createReviewSchema.parse(req.body);
    const review = await reviewsService.createReview(req.userId!, input);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

export async function listForTutorHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const reviews = await reviewsService.listTutorReviews(req.params.tutorId);
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function myReviewedHandler(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const bookingIds = await reviewsService.listMyReviewedBookingIds(req.userId!);
    res.json(bookingIds);
  } catch (err) {
    next(err);
  }
}
