import { apiFetchAuth } from "./api";

export type BookingStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED" | "COMPLETED";

export interface ApiBooking {
  id: string;
  status: BookingStatus;
  createdAt: string;
  subject: string;
  classGroup: string | null;
  goal: string | null;
  mode: "ONLINE" | "OFFLINE" | "BOTH";
  sessionsPerWeek: number | null;
  budget: number | null;
  requirements: string | null;
  notes: string | null;
  tutor?: { id: string; fullName: string; avatarUrl: string | null };
  parent?: { fullName: string; phone: string | null };
}

export interface CreateBookingInput {
  tutorId: string;
  subject: string;
  classGroup?: string;
  goal?: string;
  mode: "ONLINE" | "OFFLINE";
  sessionsPerWeek?: number;
  budget?: number;
  requirements?: string;
  notes?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<ApiBooking> {
  return apiFetchAuth<ApiBooking>("/api/booking", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchSentBookings(): Promise<ApiBooking[]> {
  return apiFetchAuth<ApiBooking[]>("/api/booking/sent");
}

export async function fetchReceivedBookings(): Promise<ApiBooking[]> {
  return apiFetchAuth<ApiBooking[]>("/api/booking/received");
}

export async function updateBookingStatus(id: string, status: "ACCEPTED" | "DECLINED"): Promise<ApiBooking> {
  return apiFetchAuth<ApiBooking>(`/api/booking/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Đang chờ phản hồi",
  ACCEPTED: "Đã nhận",
  DECLINED: "Đã từ chối",
  CANCELLED: "Đã huỷ",
  COMPLETED: "Hoàn thành",
};

export const STATUS_STYLE: Record<BookingStatus, string> = {
  PENDING: "bg-accent-tint text-brand-deep",
  ACCEPTED: "bg-brand-tint text-brand-deep",
  DECLINED: "bg-danger/10 text-danger",
  CANCELLED: "bg-line text-muted",
  COMPLETED: "bg-brand-tint text-brand-deep",
};
