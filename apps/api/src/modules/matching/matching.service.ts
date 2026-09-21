// Service (business logic) cho module "matching"
// Tính điểm matching giữa TutoringRequest và TutorProfile theo trọng số (GD6.A/B)
// Xem docs/06-nang-cao-ai.md để biết chi tiết trọng số

export const MATCH_WEIGHTS = {
  subject: 0.30,
  grade: 0.15,
  goal: 0.15,
  schedule: 0.15,
  location: 0.10,
  budget: 0.10,
  experience: 0.05,
} as const;

export interface MatchCriteriaScores {
  subject: number;    // 0-1
  grade: number;       // 0-1
  goal: number;         // 0-1
  schedule: number;    // 0-1
  location: number;    // 0-1
  budget: number;      // 0-1
  experience: number;  // 0-1
}

/**
 * Tính điểm matching tổng hợp (0-1) từ các điểm thành phần đã được chuẩn hóa.
 * TODO: viết các hàm scoreSubject(), scoreLocation()... để tính từng
 * điểm thành phần từ dữ liệu thật của TutoringRequest & TutorProfile.
 */
export function computeMatchScore(scores: MatchCriteriaScores): number {
  return (
    scores.subject * MATCH_WEIGHTS.subject +
    scores.grade * MATCH_WEIGHTS.grade +
    scores.goal * MATCH_WEIGHTS.goal +
    scores.schedule * MATCH_WEIGHTS.schedule +
    scores.location * MATCH_WEIGHTS.location +
    scores.budget * MATCH_WEIGHTS.budget +
    scores.experience * MATCH_WEIGHTS.experience
  );
}
