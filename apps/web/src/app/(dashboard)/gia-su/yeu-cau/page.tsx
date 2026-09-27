"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchReceivedBookings, updateBookingStatus, type ApiBooking } from "@/lib/booking-api";
import { ApiError } from "@/lib/api";
import { CLASS_GROUPS } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TutorDashboardNav } from "@/components/gia-su/TutorDashboardNav";

export default function TutorRequestsPage() {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchReceivedBookings()
      .then(setBookings)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được danh sách yêu cầu."))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdate(id: string, status: "ACCEPTED" | "DECLINED") {
    setBusyId(id);
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((list) => list.map((b) => (b.id === id ? updated : b)));
    } catch {
      // giữ nguyên nếu lỗi
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <TutorDashboardNav current="yeu-cau" />
      <h1 className="font-display text-3xl font-medium text-ink">Yêu cầu học sinh</h1>
      <p className="mt-1 text-muted">Các yêu cầu học từ phụ huynh gửi trực tiếp tới bạn.</p>

      {loading && <p className="mt-6 text-muted">Đang tải...</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && bookings.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center text-muted">
          Chưa có yêu cầu học nào. Hoàn thiện hồ sơ đầy đủ để phụ huynh dễ tìm thấy bạn hơn.
        </div>
      )}

      {bookings.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-line bg-paper-raised p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-medium text-ink">{b.subject}</span>
                  <span className="text-muted"> · từ {b.parent?.fullName}</span>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {b.mode === "ONLINE" ? "Online" : "Tại nhà"}
                {b.sessionsPerWeek ? ` · ${b.sessionsPerWeek} buổi/tuần` : ""}
                {b.budget ? ` · ${b.budget.toLocaleString("vi-VN")}đ/buổi` : ""}
              </p>
              {b.classGroup && (
                <p className="mt-1 text-sm text-ink/80">
                  Lớp: {CLASS_GROUPS.find((c) => c.value === b.classGroup)?.label ?? b.classGroup}
                </p>
              )}
              {b.goal && <p className="mt-1 text-sm text-ink/80">Mục tiêu: {b.goal}</p>}
              {b.notes && <p className="mt-1 text-sm text-ink/80">Ghi chú: {b.notes}</p>}

              {b.status === "ACCEPTED" && b.parent?.phone && (
                <p className="mt-2 text-sm text-brand-deep">SĐT liên hệ: {b.parent.phone}</p>
              )}

              {b.status === "ACCEPTED" && (
                <Link
                  href={`/chat/${b.id}?with=${encodeURIComponent(b.parent?.fullName ?? "")}`}
                  className="mt-1 inline-block text-sm font-medium text-brand-deep hover:underline"
                >
                  Nhắn tin với phụ huynh
                </Link>
              )}

              {b.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => handleUpdate(b.id, "ACCEPTED")}
                    className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
                  >
                    Chấp nhận
                  </button>
                  <button
                    type="button"
                    disabled={busyId === b.id}
                    onClick={() => handleUpdate(b.id, "DECLINED")}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-danger hover:text-danger disabled:opacity-60"
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
