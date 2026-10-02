import { prisma } from "../../config/prisma";
import type { SubmitDocumentInput } from "./verification.schema";

export class VerificationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// Mỗi loại giấy tờ tương ứng 1 huy hiệu được cấp khi duyệt (docs "A. Xác minh gia sư")
// Chứng chỉ & Giấy xác nhận đều quy về "Đã xác minh kinh nghiệm" vì BadgeType chỉ có 4 loại
// còn DocType có 5 loại — quyết định map do chưa có quy định rõ trong kế hoạch gốc.
const BADGE_FOR_DOC_TYPE: Record<string, "IDENTITY" | "STUDENT" | "DEGREE" | "EXPERIENCE"> = {
  CCCD: "IDENTITY",
  STUDENT_CARD: "STUDENT",
  DEGREE: "DEGREE",
  CERTIFICATE: "EXPERIENCE",
  CONFIRMATION_LETTER: "EXPERIENCE",
};

function toPublicDocument(doc: any) {
  return {
    id: doc.id,
    type: doc.type,
    fileUrl: doc.fileUrl,
    status: doc.status,
    reviewedAt: doc.reviewedAt,
    createdAt: doc.createdAt,
  };
}

// Gia sư nộp 1 giấy tờ xác minh
export async function submitDocument(tutorUserId: string, input: SubmitDocumentInput) {
  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: tutorUserId } });
  if (!tutorProfile) throw new VerificationError("Bạn cần tạo hồ sơ gia sư trước khi nộp giấy tờ", 400);

  const doc = await prisma.verificationDocument.create({
    data: { tutorId: tutorProfile.id, type: input.type, fileUrl: input.fileUrl, status: "PENDING" },
  });
  return toPublicDocument(doc);
}

// Gia sư xem danh sách giấy tờ đã nộp + trạng thái
export async function listMyDocuments(tutorUserId: string) {
  const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: tutorUserId } });
  if (!tutorProfile) return [];

  const docs = await prisma.verificationDocument.findMany({
    where: { tutorId: tutorProfile.id },
    orderBy: { createdAt: "desc" },
  });
  return docs.map(toPublicDocument);
}

// [ADMIN] Danh sách giấy tờ đang chờ duyệt, kèm thông tin gia sư nộp
export async function listPendingDocuments() {
  const docs = await prisma.verificationDocument.findMany({
    where: { status: "PENDING" },
    include: { tutor: { include: { user: true } } },
    orderBy: { createdAt: "asc" },
  });
  return docs.map((d: any) => ({
    ...toPublicDocument(d),
    tutor: {
      id: d.tutor.id,
      fullName: d.tutor.user.fullName,
      email: d.tutor.user.email,
    },
  }));
}

// [ADMIN] Duyệt/từ chối 1 giấy tờ — duyệt xong tự cấp huy hiệu tương ứng
export async function reviewDocument(adminUserId: string, documentId: string, status: "APPROVED" | "REJECTED") {
  const doc = await prisma.verificationDocument.findUnique({ where: { id: documentId } });
  if (!doc) throw new VerificationError("Không tìm thấy giấy tờ này", 404);
  if (doc.status !== "PENDING") throw new VerificationError("Giấy tờ này đã được xử lý trước đó", 409);

  const updated = await prisma.verificationDocument.update({
    where: { id: documentId },
    data: { status, reviewedById: adminUserId, reviewedAt: new Date() },
  });

  if (status === "APPROVED") {
    const badgeType = BADGE_FOR_DOC_TYPE[doc.type];
    await prisma.tutorBadge.upsert({
      where: { tutorId_type: { tutorId: doc.tutorId, type: badgeType } },
      update: {},
      create: { tutorId: doc.tutorId, type: badgeType },
    });
  }

  return toPublicDocument(updated);
}
