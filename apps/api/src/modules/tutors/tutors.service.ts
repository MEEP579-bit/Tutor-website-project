import { prisma } from "../../config/prisma";
import type { UpdateTutorProfileInput } from "./tutors.schema";

export class TutorError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function toPublic(profile: any) {
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
    experienceYears: profile.experienceYears,
    educationLevel: profile.educationLevel,
    schoolStudiedAt: profile.schoolStudiedAt,
    achievements: profile.achievements,
    certificates: profile.certificates,
    studentsAccepted: profile.studentsAccepted,
    ratingAvg: profile.ratingAvg,
    ratingCount: profile.ratingCount,
  };
}

// Danh sách/tìm kiếm gia sư — công khai, không cần đăng nhập (GD3 mục 3-4)
export interface TutorSearchFilters {
  subject?: string;
  classGroup?: string;
  region?: string;
  mode?: "ONLINE" | "OFFLINE";
  maxBudget?: number;
  minRating?: number;
  minExperience?: number;
}

export async function listTutors(filters: TutorSearchFilters) {
  const where: any = {
    // Chỉ hiện gia sư đã điền hồ sơ đầy đủ tối thiểu (có học phí > 0)
    hourlyRate: { gt: 0, ...(filters.maxBudget ? { lte: filters.maxBudget } : {}) },
  };
  if (filters.subject) where.subjects = { has: filters.subject };
  if (filters.classGroup) where.classGroups = { has: filters.classGroup };
  if (filters.region) where.region = { contains: filters.region, mode: "insensitive" };
  if (filters.mode === "ONLINE") where.teachingMode = { in: ["ONLINE", "BOTH"] };
  if (filters.mode === "OFFLINE") where.teachingMode = { in: ["OFFLINE", "BOTH"] };
  if (filters.minRating) where.ratingAvg = { gte: filters.minRating };
  if (filters.minExperience) where.experienceYears = { gte: filters.minExperience };

  const profiles = await prisma.tutorProfile.findMany({
    where,
    include: { user: true },
    orderBy: { ratingAvg: "desc" },
  });
  return profiles.map(toPublic);
}

// Xem hồ sơ chi tiết 1 gia sư — công khai (GD3 mục 5)
export async function getTutorById(id: string) {
  const profile = await prisma.tutorProfile.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!profile) throw new TutorError("Không tìm thấy gia sư", 404);
  return toPublic(profile);
}

// Lấy hồ sơ gia sư của chính người đang đăng nhập — tự tạo hồ sơ trống nếu chưa có
export async function getMyProfile(userId: string) {
  let profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!profile) {
    profile = await prisma.tutorProfile.create({
      data: { userId, subjects: [], certificates: [] },
      include: { user: true },
    });
  }

  return toPublic(profile);
}

// Cập nhật hồ sơ gia sư (GD3 mục 2)
export async function updateMyProfile(userId: string, data: UpdateTutorProfileInput) {
  const profile = await prisma.tutorProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
    include: { user: true },
  });
  return toPublic(profile);
}
