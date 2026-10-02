import { prisma } from "../../config/prisma";
import { createNotification } from "../notifications/notifications.service";
import type { CreateBookingInput } from "./booking.schema";

export class BookingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function toPublicForParent(booking: any) {
  return {
    id: booking.id,
    status: booking.status,
    createdAt: booking.createdAt,
    subject: booking.request.subject,
    classGroup: booking.request.classGroup,
    goal: booking.request.goal,
    mode: booking.request.mode,
    sessionsPerWeek: booking.request.sessionsPerWeek,
    budget: booking.request.budget,
    requirements: booking.request.requirements,
    notes: booking.request.notes,
    tutor: {
      id: booking.tutor.id,
      fullName: booking.tutor.user.fullName,
      avatarUrl: booking.tutor.user.avatarUrl,
    },
  };
}

function toPublicForTutor(booking: any) {
  return {
    id: booking.id,
    status: booking.status,
    createdAt: booking.createdAt,
    subject: booking.request.subject,
    classGroup: booking.request.classGroup,
    goal: booking.request.goal,
    mode: booking.request.mode,
    sessionsPerWeek: booking.request.sessionsPerWeek,
    budget: booking.request.budget,
    requirements: booking.request.requirements,
    notes: booking.request.notes,
    parent: {
      fullName: booking.request.parent.fullName,
      phone: booking.request.parent.phone,
    },
  };
}

// Phụ huynh gửi yêu cầu học tới 1 gia sư cụ thể
export async function createBooking(parentId: string, input: CreateBookingInput) {
  const tutor = await prisma.tutorProfile.findUnique({ where: { id: input.tutorId } });
  if (!tutor) throw new BookingError("Không tìm thấy gia sư", 404);

  const request = await prisma.tutoringRequest.create({
    data: {
      parentId,
      subject: input.subject,
      classGroup: input.classGroup,
      goal: input.goal,
      mode: input.mode,
      sessionsPerWeek: input.sessionsPerWeek,
      budget: input.budget,
      requirements: input.requirements,
      notes: input.notes,
    },
  });

  const booking = await prisma.booking.create({
    data: { requestId: request.id, tutorId: input.tutorId, status: "PENDING" },
    include: { request: true, tutor: { include: { user: true } } },
  });

  return toPublicForParent(booking);
}

// Danh sách yêu cầu phụ huynh đã gửi
export async function listSentBookings(parentId: string) {
  const bookings = await prisma.booking.findMany({
    where: { request: { parentId } },
    include: { request: true, tutor: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return bookings.map(toPublicForParent);
}

// Danh sách yêu cầu gia sư nhận được
export async function listReceivedBookings(tutorUserId: string) {
  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: tutorUserId } });
  if (!tutorProfile) return [];

  const bookings = await prisma.booking.findMany({
    where: { tutorId: tutorProfile.id },
    include: { request: { include: { parent: true } } },
    orderBy: { createdAt: "desc" },
  });
  return bookings.map(toPublicForTutor);
}

// Gia sư chấp nhận/từ chối yêu cầu
export async function updateBookingStatus(
  tutorUserId: string,
  bookingId: string,
  status: "ACCEPTED" | "DECLINED"
) {
  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: tutorUserId } });
  if (!tutorProfile) throw new BookingError("Không tìm thấy hồ sơ gia sư", 404);

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.tutorId !== tutorProfile.id) {
    throw new BookingError("Không tìm thấy yêu cầu này", 404);
  }

  // Chỉ tăng "học sinh đã nhận" khi thực sự CHUYỂN từ PENDING sang ACCEPTED lần đầu
  // (tránh cộng trùng nếu lỡ gọi lại API nhiều lần)
  if (status === "ACCEPTED" && booking.status === "PENDING") {
    await prisma.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: { studentsAccepted: { increment: 1 } },
    });
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: { request: { include: { parent: true } }, tutor: { include: { user: true } } },
  });

  // Báo cho phụ huynh biết gia sư đã chấp nhận/từ chối — docs GD3 mục 13
  await createNotification(
    updated.request.parentId,
    status === "ACCEPTED" ? "TUTOR_ACCEPTED_REQUEST" : "TUTOR_DECLINED_REQUEST",
    { bookingId: updated.id, tutorName: updated.tutor.user.fullName, subject: updated.request.subject }
  );

  return toPublicForTutor(updated);
}
