import express, { Application } from "express";
import cors from "cors";

import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { tutorsRouter } from "./modules/tutors/tutors.routes";
import { verificationRouter } from "./modules/verification/verification.routes";
import { bookingRouter } from "./modules/booking/booking.routes";
import { matchingRouter } from "./modules/matching/matching.routes";
import { notificationsRouter } from "./modules/notifications/notifications.routes";
import { reviewsRouter } from "./modules/reviews/reviews.routes";
import { favoritesRouter } from "./modules/favorites/favorites.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { aiRouter } from "./modules/ai/ai.routes";
import { errorHandler } from "./middlewares/error-handler";

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // GD3 — module theo tính năng (xem docs/03-tinh-nang-va-du-lieu.md)
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/tutors", tutorsRouter);
  app.use("/api/verification", verificationRouter);
  app.use("/api/booking", bookingRouter);
  app.use("/api/matching", matchingRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/reviews", reviewsRouter);
  app.use("/api/favorites", favoritesRouter);
  app.use("/api/admin", adminRouter);
  // GD6 — tính năng AI nâng cao (xem docs/06-nang-cao-ai.md)
  app.use("/api/ai", aiRouter);

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use(errorHandler);

  return app;
}
