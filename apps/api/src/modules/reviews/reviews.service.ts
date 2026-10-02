import { prisma } from "../../config/prisma";
import { createNotification } from "../notifications/notifications.service";
import type { CreateReviewInput } from "./reviews.schema";

export class ReviewError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// Phụ huynh đánh giá gia sư — chỉ được đánh giá sau khi yêu cầu đã được gia sư nhận,
// mỗi yêu cầu chỉ đánh giá được 1 lần
export async function createReview(parentId: string, input: CreateReviewInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { request: { include: { parent: true } }, tutor: true },
  });
  if (!booking) throw new ReviewError("Không tìm thấy yêu cầu học này", 404);
  if (booking.request.parentId !== parentId) {
    throw new ReviewError("Bạn không có quyền đánh giá yêu cầu này", 403);
  }
  if (booking.status !== "ACCEPTED" && booking.status !== "COMPLETED") {
    throw new ReviewError("Chỉ có thể đánh giá sau khi gia sư đã nhận yêu cầu", 400);
  }

  const existing = await prisma.review.findFirst({
    where: { bookingId: booking.id, authorId: parentId },
  });
  if (existing) throw new ReviewError("Bạn đã đánh giá yêu cầu này rồi", 409);

  const targetUserId = booking.tutor.userId;

  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      authorId: parentId,
      targetId: targetUserId,
      rating: input.rating,
      qualityScore: input.qualityScore,
      attitudeScore: input.attitudeScore,
      comment: input.comment,
    },
  });

  // Tính lại điểm trung bình + số lượt đánh giá, lưu ngược vào TutorProfile
  const agg = await prisma.review.aggregate({
    where: { targetId: targetUserId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: {
      ratingAvg: agg._avg.rating ?? 0,
      ratingCount: agg._count.rating ?? 0,
    },
  });

  // Báo cho gia sư biết có đánh giá mới — docs GD3 mục 13
  await createNotification(targetUserId, "NEW_REVIEW", {
    rating: review.rating,
    authorName: booking.request.parent.fullName,
  });

  return {
    id: review.id,
    rating: review.rating,
    qualityScore: review.qualityScore,
    attitudeScore: review.attitudeScore,
    comment: review.comment,
    createdAt: review.createdAt,
  };
}

// Danh sách đánh giá công khai của 1 gia sư — hiển thị ở trang hồ sơ chi tiết
export async function listTutorReviews(tutorProfileId: string) {
  const tutor = await prisma.tutorProfile.findUnique({ where: { id: tutorProfileId } });
  if (!tutor) throw new ReviewError("Không tìm thấy gia sư", 404);

  const reviews = await prisma.review.findMany({
    where: { targetId: tutor.userId },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r: any) => ({
    id: r.id,
    rating: r.rating,
    qualityScore: r.qualityScore,
    attitudeScore: r.attitudeScore,
    comment: r.comment,
    createdAt: r.createdAt,
    authorName: r.author.fullName,
  }));
}

// Danh sách bookingId phụ huynh đã đánh giá — để frontend biết nút nào đã dùng rồi
export async function listMyReviewedBookingIds(parentId: string) {
  const reviews = await prisma.review.findMany({
    where: { authorId: parentId },
    select: { bookingId: true },
  });
  return reviews.map((r: { bookingId: string | null }) => r.bookingId).filter((id): id is string => Boolean(id));
}
