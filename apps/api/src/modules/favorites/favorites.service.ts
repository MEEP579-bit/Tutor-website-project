import { prisma } from "../../config/prisma";

function toPublicTutor(profile: any) {
  return {
    id: profile.id,
    fullName: profile.user?.fullName,
    avatarUrl: profile.user?.avatarUrl,
    bio: profile.bio,
    subjects: profile.subjects,
    classGroups: profile.classGroups,
    region: profile.region,
    teachingMode: profile.teachingMode,
    hourlyRate: profile.hourlyRate,
    educationLevel: profile.educationLevel,
    ratingAvg: profile.ratingAvg,
    ratingCount: profile.ratingCount,
  };
}

// Danh sách gia sư yêu thích của phụ huynh — docs mục "F. Yêu thích"
export async function listFavorites(parentId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { parentId },
    orderBy: { createdAt: "desc" },
  });
  if (favorites.length === 0) return [];

  const tutorIds = favorites.map((f) => f.tutorId);
  const profiles = await prisma.tutorProfile.findMany({
    where: { id: { in: tutorIds } },
    include: { user: true },
  });

  // Giữ đúng thứ tự lưu gần nhất lên đầu
  const order = new Map(tutorIds.map((id, idx) => [id, idx]));
  return profiles
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
    .map(toPublicTutor);
}

export async function addFavorite(parentId: string, tutorId: string) {
  await prisma.favorite.upsert({
    where: { parentId_tutorId: { parentId, tutorId } },
    update: {},
    create: { parentId, tutorId },
  });
}

export async function removeFavorite(parentId: string, tutorId: string) {
  await prisma.favorite.deleteMany({ where: { parentId, tutorId } });
}
