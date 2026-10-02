import { prisma } from "../../config/prisma";

export class AdminError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// Tổng quan dashboard — docs "hệ thống admin: dashboard"
export async function getOverview() {
  const [totalParents, totalTutors, pendingDocs, totalBookings, totalReviews] = await Promise.all([
    prisma.user.count({ where: { role: "PARENT" } }),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.verificationDocument.count({ where: { status: "PENDING" } }),
    prisma.booking.count(),
    prisma.review.count(),
  ]);

  return { totalParents, totalTutors, pendingDocs, totalBookings, totalReviews };
}

// Danh sách toàn bộ gia sư — docs "quản lí hs,ph và gia sư"
export async function listTutors() {
  const tutors = await prisma.tutorProfile.findMany({
    include: { user: true, badges: true },
    orderBy: { createdAt: "desc" },
  });
  return tutors.map((t: any) => ({
    id: t.id,
    fullName: t.user.fullName,
    email: t.user.email,
    subjects: t.subjects,
    ratingAvg: t.ratingAvg,
    ratingCount: t.ratingCount,
    badgeCount: t.badges.length,
    createdAt: t.user.createdAt,
    suspendedAt: t.user.suspendedAt,
  }));
}

// Danh sách toàn bộ phụ huynh
export async function listParents() {
  const parents = await prisma.user.findMany({
    where: { role: "PARENT" },
    orderBy: { createdAt: "desc" },
  });
  return parents.map((p: any) => ({
    id: p.id,
    fullName: p.fullName,
    email: p.email,
    phone: p.phone,
    createdAt: p.createdAt,
    suspendedAt: p.suspendedAt,
  }));
}

// Khóa 1 tài khoản — tài khoản bị khóa sẽ không đăng nhập được, và token đang có cũng bị từ chối
export async function suspendUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AdminError("Không tìm thấy người dùng này", 404);
  if (user.suspendedAt) throw new AdminError("Tài khoản này đã bị khóa từ trước", 409);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { suspendedAt: new Date() },
  });
  return { id: updated.id, suspendedAt: updated.suspendedAt };
}

// Mở khóa tài khoản
export async function unsuspendUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AdminError("Không tìm thấy người dùng này", 404);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { suspendedAt: null },
  });
  return { id: updated.id, suspendedAt: updated.suspendedAt };
}

// Xóa 1 đánh giá vi phạm — tính lại rating trung bình của gia sư sau khi xóa
export async function deleteReview(reviewId: string) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AdminError("Không tìm thấy đánh giá này", 404);

  await prisma.review.delete({ where: { id: reviewId } });

  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: review.targetId } });
  if (tutorProfile) {
    const agg = await prisma.review.aggregate({
      where: { targetId: review.targetId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count.rating ?? 0 },
    });
  }

  return { success: true };
}
