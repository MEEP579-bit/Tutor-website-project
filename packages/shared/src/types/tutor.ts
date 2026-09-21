// Types dùng chung giữa apps/web và apps/api (đồng bộ với prisma/schema.prisma)

export type TeachingMode = "ONLINE" | "OFFLINE" | "BOTH";

export interface TutorSummary {
  id: string;
  fullName: string;
  avatarUrl?: string;
  subjects: string[];
  region?: string;
  hourlyRate?: number;
  ratingAvg: number;
  ratingCount: number;
}

export interface TutorProfileDetail extends TutorSummary {
  bio?: string;
  teachingMode: TeachingMode;
  experienceYears?: number;
  educationLevel?: string;
  schoolStudiedAt?: string;
  achievements?: string;
  studentsAccepted: number;
  certificates: string[];
  badges: string[]; // "IDENTITY" | "STUDENT" | "DEGREE" | "EXPERIENCE"
  introVideoUrl?: string;
}

export interface TutorSearchFilters {
  subject?: string;
  budgetMax?: number;
  region?: string;
  minExperienceYears?: number;
  gender?: string;
  educationLevel?: string;
  minRating?: number;
}
