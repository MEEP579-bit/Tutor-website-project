import { apiFetchAuth } from "./api";
import type { ApiTutorSummary } from "./tutors-api";

export async function fetchFavorites(): Promise<ApiTutorSummary[]> {
  return apiFetchAuth<ApiTutorSummary[]>("/api/favorites");
}

export async function addFavorite(tutorId: string): Promise<void> {
  await apiFetchAuth(`/api/favorites/${tutorId}`, { method: "POST" });
}

export async function removeFavorite(tutorId: string): Promise<void> {
  await apiFetchAuth(`/api/favorites/${tutorId}`, { method: "DELETE" });
}
