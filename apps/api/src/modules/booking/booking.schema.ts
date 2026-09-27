import { z } from "zod";

// Phụ huynh gửi yêu cầu học tới 1 gia sư cụ thể — GD3 mục 6-7, 12
export const createBookingSchema = z.object({
  tutorId: z.string().min(1),
  subject: z.string().min(1, "Chọn môn học"),
  classGroup: z.string().optional(),
  goal: z.string().optional(),
  mode: z.enum(["ONLINE", "OFFLINE"]),
  sessionsPerWeek: z.number().int().min(1).max(14).optional(),
  budget: z.number().int().min(0).optional(),
  requirements: z.string().optional(),
  notes: z.string().optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Gia sư chấp nhận/từ chối yêu cầu
export const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"]),
});
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
