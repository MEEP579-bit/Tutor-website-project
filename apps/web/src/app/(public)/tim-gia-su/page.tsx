"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTutors, type ApiTutorSummary } from "@/lib/tutors-api";
import { ApiError } from "@/lib/api";
import { CLASS_GROUPS } from "@/lib/constants";
import { TutorCard } from "@/components/gia-su/TutorCard";
import {
  SearchFilters,
  DEFAULT_FILTERS,
  MAX_BUDGET_CEILING,
  type TutorFilters,
} from "@/components/gia-su/SearchFilters";
import { FilterChips, type FilterChip } from "@/components/gia-su/FilterChips";

function chipsFromFilters(f: TutorFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (f.subject) chips.push({ key: "subject", label: `Môn: ${f.subject}` });
  if (f.classGroup) {
    const label = CLASS_GROUPS.find((c) => c.value === f.classGroup)?.label ?? f.classGroup;
    chips.push({ key: "classGroup", label: `Lớp: ${label}` });
  }
  if (f.mode !== "ALL") chips.push({ key: "mode", label: `Hình thức: ${f.mode === "ONLINE" ? "Online" : "Tại nhà"}` });
  if (f.region) chips.push({ key: "region", label: `Khu vực: ${f.region}` });
  if (f.maxBudget < MAX_BUDGET_CEILING) {
    chips.push({ key: "maxBudget", label: `Học phí ≤ ${f.maxBudget.toLocaleString("vi-VN")}đ` });
  }
  if (f.minExperience > 0) chips.push({ key: "minExperience", label: `Kinh nghiệm ≥ ${f.minExperience} năm` });
  if (f.minRating > 0) chips.push({ key: "minRating", label: `Đánh giá ≥ ${f.minRating}★` });
  return chips;
}

function TimGiaSuContent() {
  const searchParams = useSearchParams();
  const initial: TutorFilters = { ...DEFAULT_FILTERS, subject: searchParams.get("subject") ?? "" };

  const [draft, setDraft] = useState<TutorFilters>(initial);
  const [applied, setApplied] = useState<TutorFilters>(initial);
  const [results, setResults] = useState<ApiTutorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function patchDraft(patch: Partial<TutorFilters>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function removeChip(key: string) {
    const patch: Partial<TutorFilters> = { [key]: (DEFAULT_FILTERS as any)[key] } as Partial<TutorFilters>;
    setDraft((d) => ({ ...d, ...patch }));
    setApplied((a) => ({ ...a, ...patch }));
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchTutors({
      subject: applied.subject || undefined,
      classGroup: applied.classGroup || undefined,
      region: applied.region || undefined,
      mode: applied.mode === "ALL" ? undefined : applied.mode,
      maxBudget: applied.maxBudget,
      minRating: applied.minRating || undefined,
      minExperience: applied.minExperience || undefined,
    })
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Không tải được danh sách gia sư.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applied]);

  const chips = chipsFromFilters(applied);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-medium text-ink">Tìm gia sư phù hợp với bạn</h1>
        <p className="mt-1 text-muted">Chọn môn học, lớp và hình thức học — chúng tôi lọc ra gia sư phù hợp nhất.</p>
      </header>

      <SearchFilters draft={draft} onDraftChange={patchDraft} onSubmit={() => setApplied(draft)} />
      <FilterChips chips={chips} onRemove={removeChip} />

      <p className="mt-4 text-sm text-muted">{loading ? "Đang tải..." : `${results.length} gia sư phù hợp`}</p>

      {error && (
        <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && results.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center text-muted">
          Chưa có gia sư nào khớp với bộ lọc này. Thử nới ngân sách hoặc đổi khu vực xem sao.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function TimGiaSuPage() {
  return (
    <Suspense fallback={null}>
      <TimGiaSuContent />
    </Suspense>
  );
}
