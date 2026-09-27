import { apiFetch } from "./api";

export interface ApiTutorSummary {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  subjects: string[];
  classGroups: string[];
  region: string | null;
  teachingMode: "ONLINE" | "OFFLINE" | "BOTH";
  hourlyRate: number | null;
  educationLevel: string | null;
  ratingAvg: number;
  ratingCount: number;
}

export interface ApiTutorDetail extends ApiTutorSummary {
  schoolStudiedAt: string | null;
  achievements: string | null;
  certificates: string[];
  experienceYears: number | null;
  studentsAccepted: number;
}

export interface TutorSearchParams {
  subject?: string;
  classGroup?: string;
  region?: string;
  mode?: "ONLINE" | "OFFLINE";
  maxBudget?: number;
  minRating?: number;
  minExperience?: number;
}

export async function fetchTutors(params: TutorSearchParams = {}): Promise<ApiTutorSummary[]> {
  const qs = new URLSearchParams();
  if (params.subject) qs.set("subject", params.subject);
  if (params.classGroup) qs.set("classGroup", params.classGroup);
  if (params.region) qs.set("region", params.region);
  if (params.mode) qs.set("mode", params.mode);
  if (params.maxBudget) qs.set("maxBudget", String(params.maxBudget));
  if (params.minRating) qs.set("minRating", String(params.minRating));
  if (params.minExperience) qs.set("minExperience", String(params.minExperience));
  const query = qs.toString();
  return apiFetch<ApiTutorSummary[]>(`/api/tutors${query ? `?${query}` : ""}`);
}

export async function fetchTutorById(id: string): Promise<ApiTutorDetail> {
  return apiFetch<ApiTutorDetail>(`/api/tutors/${id}`);
}

// Chữ viết tắt hiển thị trong vòng tròn avatar khi chưa có ảnh thật
export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
