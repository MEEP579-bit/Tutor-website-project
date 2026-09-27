import { z } from "zod";

// Phụ huynh đánh giá gia sư sau khi yêu cầu đã được nhận — GD3 mục 9
export const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  qualityScore: z.number().int().min(1).max(5).optional(),
  attitudeScore: z.number().int().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
