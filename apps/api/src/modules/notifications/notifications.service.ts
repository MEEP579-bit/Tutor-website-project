import { prisma } from "../../config/prisma";

export class NotificationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type NotificationType =
  | "NEW_MATCHING_TUTOR"
  | "TUTOR_ACCEPTED_REQUEST"
  | "TUTOR_DECLINED_REQUEST"
  | "NEW_MESSAGE"
  | "UPCOMING_SESSION"
  | "SESSION_CANCELLED"
  | "NEW_REVIEW";

function toPublic(n: any) {
  return {
    id: n.id,
    type: n.type,
    payload: n.payload,
    readAt: n.readAt,
    createdAt: n.createdAt,
  };
}

// Hàm dùng chung để các module KHÁC gọi vào khi có sự kiện cần báo (booking, chat, reviews...)
// Chỉ tạo kênh IN_APP — email/push/SMS chưa triển khai vì chưa có dịch vụ gửi email/SMS thật.
export async function createNotification(userId: string, type: NotificationType, payload?: Record<string, unknown>) {
  return prisma.notification.create({
    data: { userId, type, channel: "IN_APP", payload: payload as any },
  });
}

export async function listMine(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return notifications.map(toPublic);
}

export async function unreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, readAt: null } });
}

export async function markAsRead(userId: string, id: string) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    throw new NotificationError("Không tìm thấy thông báo này", 404);
  }
  const updated = await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
  });
  return toPublic(updated);
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
  return { success: true };
}
