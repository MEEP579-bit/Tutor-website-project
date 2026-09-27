import { apiFetch, apiFetchAuth } from "./api";

export interface ApiReview {
  id: string;
  rating: number;
  qualityScore: number | null;
  attitudeScore: number | null;
  comment: string | null;
  createdAt: string;
  authorName?: string;
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  qualityScore?: number;
  attitudeScore?: number;
  comment?: string;
}

export async function createReview(input: CreateReviewInput): Promise<ApiReview> {
  return apiFetchAuth<ApiReview>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchTutorReviews(tutorId: string): Promise<ApiReview[]> {
  return apiFetch<ApiReview[]>(`/api/reviews/tutor/${tutorId}`);
}

export async function fetchMyReviewedBookingIds(): Promise<string[]> {
  return apiFetchAuth<string[]>("/api/reviews/mine");
}
