import { prisma } from "../../config/prisma";

export class ChatError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const CHATTABLE_STATUSES = ["ACCEPTED", "COMPLETED"] as const;

// Một cuộc trò chuyện = một CẶP (phụ huynh, gia sư), dù họ có bao nhiêu yêu cầu học với nhau.
// Điều kiện được chat: cặp này có ÍT NHẤT 1 yêu cầu học đã được nhận.
// bookingId trên URL chỉ là "cửa vào" — server luôn gộp tin nhắn của mọi yêu cầu cùng cặp.
async function assertParticipant(userId: string, bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { request: true, tutor: true },
  });
  if (!booking) throw new ChatError("Không tìm thấy cuộc trò chuyện này", 404);

  const isParent = booking.request.parentId === userId;
  const isTutor = booking.tutor.userId === userId;
  if (!isParent && !isTutor) throw new ChatError("Bạn không có quyền truy cập cuộc trò chuyện này", 403);

  if (!CHATTABLE_STATUSES.includes(booking.status as (typeof CHATTABLE_STATUSES)[number])) {
    throw new ChatError("Chỉ có thể trò chuyện sau khi yêu cầu học đã được nhận", 403);
  }

  return booking;
}

// Tất cả yêu cầu học (đã nhận) giữa đúng cặp phụ huynh – gia sư này
async function getPairBookingIds(parentUserId: string, tutorUserId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: [...CHATTABLE_STATUSES] },
      request: { parentId: parentUserId },
      tutor: { userId: tutorUserId },
    },
    select: { id: true },
  });
  return bookings.map((b) => b.id);
}

export async function listMessages(userId: string, bookingId: string) {
  const booking = await assertParticipant(userId, bookingId);
  const pairIds = await getPairBookingIds(booking.request.parentId, booking.tutor.userId);

  // Đánh dấu đã đọc toàn bộ tin của phía bên kia gửi, ngay khi mở cuộc trò chuyện
  await prisma.message.updateMany({
    where: { bookingId: { in: pairIds }, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });

  const messages = await prisma.message.findMany({
    where: { bookingId: { in: pairIds } },
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

interface ConversationGroup {
  otherPartyName: string;
  otherPartyAvatarUrl: string | null;
  repBookingId: string; // yêu cầu gần nhất — dùng làm "cửa vào" cuộc trò chuyện
  bookingIds: string[];
}

// Danh sách cuộc trò chuyện của người dùng hiện tại — MỖI NGƯỜI CHỈ XUẤT HIỆN 1 LẦN
export async function listConversations(userId: string) {
  const groups = new Map<string, ConversationGroup>();

  // Phía phụ huynh: gom các yêu cầu theo gia sư
  const asParent = await prisma.booking.findMany({
    where: { status: { in: [...CHATTABLE_STATUSES] }, request: { parentId: userId } },
    include: { tutor: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  for (const b of asParent) {
    const key = b.tutor.userId;
    if (!groups.has(key)) {
      groups.set(key, {
        otherPartyName: b.tutor.user.fullName,
        otherPartyAvatarUrl: b.tutor.user.avatarUrl,
        repBookingId: b.id,
        bookingIds: [],
      });
    }
    groups.get(key)!.bookingIds.push(b.id);
  }

  // Phía gia sư: gom các yêu cầu theo phụ huynh
  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (tutorProfile) {
    const asTutor = await prisma.booking.findMany({
      where: { status: { in: [...CHATTABLE_STATUSES] }, tutorId: tutorProfile.id },
      include: { request: { include: { parent: true } } },
      orderBy: { createdAt: "desc" },
    });
    for (const b of asTutor) {
      const key = b.request.parentId;
      if (!groups.has(key)) {
        groups.set(key, {
          otherPartyName: b.request.parent.fullName,
          otherPartyAvatarUrl: b.request.parent.avatarUrl,
          repBookingId: b.id,
          bookingIds: [],
        });
      }
      groups.get(key)!.bookingIds.push(b.id);
    }
  }

  const conversations = await Promise.all(
    Array.from(groups.values()).map(async (g) => {
      const lastMessage = await prisma.message.findFirst({
        where: { bookingId: { in: g.bookingIds } },
        orderBy: { createdAt: "desc" },
      });
      const unreadCount = await prisma.message.count({
        where: { bookingId: { in: g.bookingIds }, senderId: { not: userId }, readAt: null },
      });
      return {
        bookingId: g.repBookingId,
        otherPartyName: g.otherPartyName,
        otherPartyAvatarUrl: g.otherPartyAvatarUrl,
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
