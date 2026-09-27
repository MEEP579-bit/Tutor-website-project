import Link from "next/link";
import { fetchTutorById, getInitials } from "@/lib/tutors-api";
import { RatingStars } from "@/components/ui/RatingStars";
import { FavoriteButton } from "@/components/gia-su/FavoriteButton";
import { BookingRequestButton } from "@/components/gia-su/BookingRequestButton";
import { ApiError } from "@/lib/api";
import { CLASS_GROUPS } from "@/lib/constants";
import { fetchTutorReviews } from "@/lib/reviews-api";

const MODE_LABEL: Record<string, string> = {
  ONLINE: "Dạy online",
  OFFLINE: "Dạy tại nhà",
  BOTH: "Online & tại nhà",
};

// Hồ sơ chi tiết gia sư — GD3 mục 5
export default async function TutorProfilePage({ params }: { params: { id: string } }) {
  let tutor;
  try {
    tutor = await fetchTutorById(params.id);
  } catch (err) {
    const notFound = err instanceof ApiError && err.status === 404;
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-medium text-ink">
          {notFound ? "Không tìm thấy gia sư này" : "Có lỗi khi tải hồ sơ"}
        </h1>
        <p className="mt-2 text-muted">
          {notFound
            ? "Hồ sơ có thể đã bị gỡ hoặc đường dẫn không đúng."
            : "Kiểm tra API đã chạy chưa, hoặc thử lại sau."}
        </p>
        <Link href="/tim-gia-su" className="mt-4 inline-block font-medium text-brand-deep hover:underline">
          ← Quay lại tìm gia sư
        </Link>
      </main>
    );
  }

  const reviews = await fetchTutorReviews(tutor.id).catch(() => []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/tim-gia-su" className="text-sm text-muted hover:text-brand-deep">
        ← Quay lại tìm gia sư
      </Link>

      <div className="mt-4 flex flex-col gap-6 rounded-xl border border-line bg-paper-raised p-6 sm:flex-row sm:items-start">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-semibold text-white"
          aria-hidden="true"
        >
          {getInitials(tutor.fullName)}
        </div>

        <div className="flex-1">
          <h1 className="font-display text-2xl font-medium text-ink">{tutor.fullName}</h1>
          {tutor.educationLevel && <p className="mt-0.5 text-muted">{tutor.educationLevel}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
            <RatingStars value={tutor.ratingAvg} count={tutor.ratingCount} />
            <span>·</span>
            <span>{tutor.region ?? "Chưa cập nhật khu vực"}</span>
            <span>·</span>
            <span>{MODE_LABEL[tutor.teachingMode]}</span>
          </div>

          {tutor.subjects.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tutor.subjects.map((s) => (
                <span key={s} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink">
                  {s}
                </span>
              ))}
            </div>
          )}

          {tutor.classGroups.length > 0 && (
            <p className="mt-2 text-sm text-muted">
              Nhận dạy: {tutor.classGroups.map((g) => CLASS_GROUPS.find((c) => c.value === g)?.label ?? g).join(", ")}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          {tutor.hourlyRate != null && (
            <div className="font-display text-xl font-medium text-brand-deep">
              {tutor.hourlyRate.toLocaleString("vi-VN")}đ
              <span className="text-sm font-sans font-normal text-muted">/buổi</span>
            </div>
          )}
          <div className="mt-3">
            <FavoriteButton tutorId={tutor.id} />
          </div>
        </div>
      </div>

      <BookingRequestButton tutorId={tutor.id} subjects={tutor.subjects} />

      {tutor.bio && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-medium text-ink">Giới thiệu</h2>
          <p className="mt-2 whitespace-pre-line text-ink/90">{tutor.bio}</p>
        </section>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-line bg-paper-raised p-4 text-sm sm:grid-cols-4">
        <div>
          <div className="text-muted">Kinh nghiệm</div>
          <div className="mt-0.5 font-medium text-ink">
            {tutor.experienceYears != null ? `${tutor.experienceYears} năm` : "Chưa cập nhật"}
          </div>
        </div>
        <div>
          <div className="text-muted">Học sinh đã nhận</div>
          <div className="mt-0.5 font-medium text-ink">{tutor.studentsAccepted}</div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-muted">Từng học tại</div>
          <div className="mt-0.5 font-medium text-ink">{tutor.schoolStudiedAt ?? "Chưa cập nhật"}</div>
        </div>
      </div>

      {tutor.achievements && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-medium text-ink">Thành tích</h2>
          <p className="mt-2 whitespace-pre-line text-ink/90">{tutor.achievements}</p>
        </section>
      )}

      {tutor.certificates.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-medium text-ink">Chứng chỉ</h2>
          <ul className="mt-2 list-inside list-disc text-ink/90">
            {tutor.certificates.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="font-display text-lg font-medium text-ink">
          Đánh giá từ phụ huynh {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {reviews.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Chưa có đánh giá nào.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-line bg-paper-raised p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">{r.authorName}</span>
                  <RatingStars value={r.rating} />
                </div>
                {r.comment && <p className="mt-1.5 text-sm text-ink/90">{r.comment}</p>}
                <p className="mt-1.5 text-xs text-muted">
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
