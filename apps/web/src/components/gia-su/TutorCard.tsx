import Link from "next/link";
import type { ApiTutorSummary } from "@/lib/tutors-api";
import { getInitials } from "@/lib/tutors-api";
import { RatingStars } from "@/components/ui/RatingStars";
import { CLASS_GROUPS } from "@/lib/constants";

const MODE_LABEL: Record<ApiTutorSummary["teachingMode"], string> = {
  ONLINE: "Dạy online",
  OFFLINE: "Dạy tại nhà",
  BOTH: "Online & tại nhà",
};

// Card gia sư trong danh sách/kết quả tìm kiếm — GD3 mục 3
export function TutorCard({ tutor }: { tutor: ApiTutorSummary }) {
  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-line bg-paper-raised p-5 transition-colors hover:border-brand">
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
          aria-hidden="true"
        >
          {getInitials(tutor.fullName)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-medium text-ink">{tutor.fullName}</h3>
          {tutor.educationLevel && <p className="truncate text-sm text-muted">{tutor.educationLevel}</p>}
        </div>
      </div>

      {tutor.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tutor.subjects.map((s) => (
            <span key={s} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink">
              {s}
            </span>
          ))}
        </div>
      )}

      {tutor.bio && <p className="line-clamp-2 text-sm text-ink/80">{tutor.bio}</p>}

      {tutor.classGroups.length > 0 && (
        <p className="text-xs text-muted">
          Dạy: {tutor.classGroups.map((g) => CLASS_GROUPS.find((c) => c.value === g)?.label ?? g).join(", ")}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted">
            {tutor.region ?? "Chưa cập nhật khu vực"} · {MODE_LABEL[tutor.teachingMode]}
          </span>
          <RatingStars value={tutor.ratingAvg} count={tutor.ratingCount} />
        </div>
        {tutor.hourlyRate != null && (
          <div className="text-right">
            <div className="font-display text-base font-medium text-brand-deep">
              {tutor.hourlyRate.toLocaleString("vi-VN")}đ
              <span className="text-xs font-sans font-normal text-muted">/buổi</span>
            </div>
          </div>
        )}
      </div>

      <Link
        href={`/gia-su/${tutor.id}`}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-brand py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
      >
        Xem hồ sơ
      </Link>
    </article>
  );
}
