import { Router } from "express";
import { createHandler, listForTutorHandler, myReviewedHandler } from "./reviews.controller";
import { requireAuth, requireRole } from "../../middlewares/require-auth";

// Đánh giá gia sư — GD3 mục 9
export const reviewsRouter = Router();

reviewsRouter.post("/", requireAuth, requireRole("PARENT"), createHandler);
reviewsRouter.get("/mine", requireAuth, requireRole("PARENT"), myReviewedHandler);
reviewsRouter.get("/tutor/:tutorId", listForTutorHandler);
