import { z } from "zod";

// Gửi tin nhắn trong 1 cuộc trò chuyện gắn với 1 yêu cầu học (booking)
export const sendMessageSchema = z.object({
  content: z.string().min(1, "Không được để trống").max(2000),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
