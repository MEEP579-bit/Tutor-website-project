"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchFavorites, removeFavorite } from "@/lib/favorites-api";
import { fetchSentBookings, type ApiBooking } from "@/lib/booking-api";
import { fetchMyReviewedBookingIds } from "@/lib/reviews-api";
import type { ApiTutorSummary } from "@/lib/tutors-api";
import { ApiError } from "@/lib/api";
import { CLASS_GROUPS } from "@/lib/constants";
import { TutorCard } from "@/components/gia-su/TutorCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReviewForm } from "@/components/gia-su/ReviewForm";

export default function ParentDashboardPage() {
  const [favorites, setFavorites] = useState<ApiTutorSummary[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [openReviewFor, setOpenReviewFor] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites()
      .then(setFavorites)
      .catch(() => {})
      .finally(() => setFavLoading(false));

    fetchSentBookings()
      .then(setBookings)
      .catch((err) => setBookingsError(err instanceof ApiError ? err.message : "Không tải được danh sách yêu cầu."))
      .finally(() => setBookingsLoading(false));

    fetchMyReviewedBookingIds()
      .then(setReviewedIds)
      .catch(() => {});
  }, []);

  async function handleRemoveFavorite(tutorId: string) {
    const prev = favorites;
    setFavorites((list) => list.filter((t) => t.id !== tutorId));
    try {
      await removeFavorite(tutorId);
    } catch {
      setFavorites(prev);
    }
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Yêu cầu đã gửi */}
      <section>
        <h1 className="font-display text-3xl font-medium text-ink">Yêu cầu học đã gửi</h1>
        <p className="mt-1 text-muted">Theo dõi trạng thái các yêu cầu bạn đã gửi tới gia sư.</p>

        {bookingsLoading && <p className="mt-6 text-muted">Đang tải...</p>}
        {bookingsError && (
          <p className="mt-6 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {bookingsError}
          </p>
        )}
        {!bookingsLoading && !bookingsError && bookings.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center text-muted">
            Bạn chưa gửi yêu cầu học nào.{" "}
            <Link href="/tim-gia-su" className="font-medium text-brand-deep hover:underline">
              Tìm gia sư ngay
            </Link>
          </div>
        )}
        {bookings.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            {bookings.map((b) => {
              const alreadyReviewed = reviewedIds.includes(b.id);
              const canReview = b.status === "ACCEPTED" || b.status === "COMPLETED";
              return (
                <div key={b.id} className="rounded-xl border border-line bg-paper-raised p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-medium text-ink">{b.subject}</span>
                      <span className="text-muted"> · gia sư {b.tutor?.fullName}</span>
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

                  {canReview && (
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/chat/${b.id}?with=${encodeURIComponent(b.tutor?.fullName ?? "")}`}
                        className="text-sm font-medium text-brand-deep hover:underline"
                      >
                        Nhắn tin với gia sư
                      </Link>

                      {!alreadyReviewed && openReviewFor !== b.id && (
                        <button
                          type="button"
                          onClick={() => setOpenReviewFor(b.id)}
                          className="text-sm font-medium text-brand-deep hover:underline"
                        >
                          Đánh giá gia sư
                        </button>
                      )}
                      {alreadyReviewed && (
                        <span className="text-sm text-brand-deep">✓ Bạn đã đánh giá yêu cầu này</span>
                      )}
                    </div>
                  )}
                  {openReviewFor === b.id && (
                    <ReviewForm
                      bookingId={b.id}
                      onDone={() => {
                        setReviewedIds((ids) => [...ids, b.id]);
                        setOpenReviewFor(null);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Gia sư yêu thích */}
      <section>
        <h2 className="font-display text-2xl font-medium text-ink">Gia sư yêu thích của tôi</h2>
        <p className="mt-1 text-muted">Danh sách gia sư bạn đã lưu để xem lại hoặc liên hệ sau.</p>

        {favLoading && <p className="mt-6 text-muted">Đang tải...</p>}
        {!favLoading && favorites.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center text-muted">
            Bạn chưa lưu gia sư nào.
          </div>
        )}
        {favorites.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((tutor) => (
              <div key={tutor.id} className="flex flex-col gap-2">
                <TutorCard tutor={tutor} />
                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(tutor.id)}
                  className="self-start text-sm text-muted hover:text-danger"
                >
                  Bỏ lưu
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
