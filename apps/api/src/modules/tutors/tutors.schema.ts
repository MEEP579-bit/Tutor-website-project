import { z } from "zod";

// Cập nhật hồ sơ gia sư — khớp với model TutorProfile trong prisma/schema.prisma
export const updateTutorProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  subjects: z.array(z.string()).min(1, "Chọn ít nhất 1 môn dạy"),
  classGroups: z.array(z.string()).optional(),
  region: z.string().min(2, "Vui lòng nhập khu vực dạy"),
  teachingMode: z.enum(["ONLINE", "OFFLINE", "BOTH"]),
  hourlyRate: z.number().int().min(0, "Học phí không hợp lệ"),
  experienceYears: z.number().int().min(0).optional(),
  educationLevel: z.string().optional(),
  schoolStudiedAt: z.string().optional(),
  achievements: z.string().optional(),
  certificates: z.array(z.string()).optional(),
});
export type UpdateTutorProfileInput = z.infer<typeof updateTutorProfileSchema>;
