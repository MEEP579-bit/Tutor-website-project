import { z } from "zod";

// Gia sư nộp 1 giấy tờ xác minh — docs "A. Xác minh gia sư"
export const submitDocumentSchema = z.object({
  type: z.enum(["CCCD", "STUDENT_CARD", "DEGREE", "CERTIFICATE", "CONFIRMATION_LETTER"]),
  fileUrl: z.string().url("Đường dẫn file không hợp lệ"),
});
export type SubmitDocumentInput = z.infer<typeof submitDocumentSchema>;

// Admin duyệt/từ chối 1 giấy tờ
export const reviewDocumentSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});
export type ReviewDocumentInput = z.infer<typeof reviewDocumentSchema>;
