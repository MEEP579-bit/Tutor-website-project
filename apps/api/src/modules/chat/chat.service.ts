import { prisma } from "../../config/prisma";

export class ChatError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// Chỉ đúng 2 người liên quan tới 1 yêu cầu học ĐÃ ĐƯỢC NHẬN mới được xem/gửi tin
async function assertParticipant(userId: string, bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { request: { include: { parent: true } }, tutor: { include: { user: true } } },
  });
  if (!booking) throw new ChatError("Không tìm thấy cuộc trò chuyện này", 404);

  const isParent = booking.request.parentId === userId;
  const isTutor = booking.tutor.userId === userId;
  if (!isParent && !isTutor) throw new ChatError("Bạn không có quyền truy cập cuộc trò chuyện này", 403);

  if (booking.status !== "ACCEPTED" && booking.status !== "COMPLETED") {
    throw new ChatError("Chỉ có thể trò chuyện sau khi yêu cầu học đã được nhận", 403);
  }

  return { booking, isParent };
}

export async function listMessages(userId: string, bookingId: string) {
  const { booking } = await assertParticipant(userId, bookingId);

  // Đánh dấu đã đọc toàn bộ tin của phía bên kia gửi, ngay khi mở cuộc trò chuyện
  await prisma.message.updateMany({
    where: { bookingId: booking.id, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });

  const messages = await prisma.message.findMany({
    where: { bookingId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt,
    senderId: m.senderId,
    senderName: m.sender.fullName,
  }));
}

export async function sendMessage(userId: string, bookingId: string, content: string) {
  await assertParticipant(userId, bookingId);

  const message = await prisma.message.create({
    data: { bookingId, senderId: userId, content },
    include: { sender: true },
  });

  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    senderId: message.senderId,
    senderName: message.sender.fullName,
  };
}

// Danh sách tất cả cuộc trò chuyện của người dùng hiện tại (mọi yêu cầu học đã "Đã nhận")
export async function listConversations(userId: string) {
  const bookingsAsParent = await prisma.booking.findMany({
    where: { status: "ACCEPTED", request: { parentId: userId } },
    include: { request: true, tutor: { include: { user: true } } },
  });
  const bookingsAsTutorProfile = await prisma.tutorProfile.findUnique({ where: { userId } });
  const bookingsAsTutor = bookingsAsTutorProfile
    ? await prisma.booking.findMany({
        where: { status: "ACCEPTED", tutorId: bookingsAsTutorProfile.id },
        include: { request: { include: { parent: true } }, tutor: { include: { user: true } } },
      })
    : [];

  const items: Array<{
    bookingId: string;
    otherPartyName: string;
    otherPartyAvatarUrl: string | null;
  }> = [
    ...bookingsAsParent.map((b) => ({
      bookingId: b.id,
      otherPartyName: b.tutor.user.fullName,
      otherPartyAvatarUrl: b.tutor.user.avatarUrl,
    })),
    ...bookingsAsTutor.map((b) => ({
      bookingId: b.id,
      otherPartyName: b.request.parent.fullName,
      otherPartyAvatarUrl: b.request.parent.avatarUrl,
    })),
  ];

  const conversations = await Promise.all(
    items.map(async (item) => {
      const lastMessage = await prisma.message.findFirst({
        where: { bookingId: item.bookingId },
        orderBy: { createdAt: "desc" },
      });
      const unreadCount = await prisma.message.count({
        where: { bookingId: item.bookingId, senderId: { not: userId }, readAt: null },
      });
      return {
        bookingId: item.bookingId,
        otherPartyName: item.otherPartyName,
        otherPartyAvatarUrl: item.otherPartyAvatarUrl,
        lastMessage: lastMessage?.content ?? null,
        lastMessageAt: lastMessage?.createdAt ?? null,
        unreadCount,
      };
    })
  );

  // Cuộc trò chuyện có tin nhắn gần nhất lên đầu; chưa có tin nhắn nào thì xuống cuối
  conversations.sort((a, b) => {
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });

  return conversations;
}
