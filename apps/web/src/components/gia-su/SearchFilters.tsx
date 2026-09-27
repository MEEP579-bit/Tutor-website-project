"use client";

import { useState } from "react";
import { SubjectPicker } from "./SubjectPicker";
import { ClassPicker } from "./ClassPicker";

export interface TutorFilters {
  subject: string;
  classGroup: string;
  mode: "ALL" | "ONLINE" | "OFFLINE";
  region: string;
  maxBudget: number;
  minRating: number;
  minExperience: number;
}

export const MAX_BUDGET_CEILING = 300000;

export const DEFAULT_FILTERS: TutorFilters = {
  subject: "",
  classGroup: "",
  mode: "ALL",
  region: "",
  maxBudget: MAX_BUDGET_CEILING,
  minRating: 0,
  minExperience: 0,
};

const MODE_TABS: Array<{ value: TutorFilters["mode"]; label: string }> = [
  { value: "ALL", label: "Tất cả" },
  { value: "ONLINE", label: "Online" },
  { value: "OFFLINE", label: "Tại nhà" },
];

// Thanh tìm kiếm gia sư — môn học/lớp dạng popover, hình thức dạng segmented,
// các bộ lọc ít dùng gộp vào "Bộ lọc nâng cao". Chỉ áp dụng khi bấm "Tìm gia sư".
export function SearchFilters({
  draft,
  onDraftChange,
  onSubmit,
}: {
  draft: TutorFilters;
  onDraftChange: (patch: Partial<TutorFilters>) => void;
  onSubmit: () => void;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="rounded-xl border border-line bg-paper-raised p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SubjectPicker value={draft.subject} onChange={(v) => onDraftChange({ subject: v })} />
        <ClassPicker value={draft.classGroup} onChange={(v) => onDraftChange({ classGroup: v })} />

        <div className="flex rounded-lg border border-line p-1">
          {MODE_TABS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onDraftChange({ mode: opt.value })}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                draft.mode === opt.value ? "bg-brand text-white" : "text-muted hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep sm:ml-auto"
        >
          Tìm gia sư
        </button>
      </div>

      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        className="mt-3 text-sm font-medium text-brand-deep hover:underline"
      >
        {advancedOpen ? "Ẩn bộ lọc nâng cao" : "Bộ lọc nâng cao"}
      </button>

      {advancedOpen && (
        <div className="mt-3 grid grid-cols-1 gap-4 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Khu vực</span>
            <input
              type="text"
              value={draft.region}
              onChange={(e) => onDraftChange({ region: e.target.value })}
              placeholder="VD: Quận 1, Ninh Bình..."
              className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">
              Học phí tối đa: <span className="text-brand-deep">{draft.maxBudget.toLocaleString("vi-VN")}đ</span>
            </span>
            <input
              type="range"
              min={50000}
              max={MAX_BUDGET_CEILING}
              step={10000}
              value={draft.maxBudget}
              onChange={(e) => onDraftChange({ maxBudget: Number(e.target.value) })}
              className="accent-brand"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Kinh nghiệm tối thiểu</span>
            <select
              className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand"
              value={draft.minExperience}
              onChange={(e) => onDraftChange({ minExperience: Number(e.target.value) })}
            >
              <option value={0}>Tất cả</option>
              <option value={1}>Từ 1 năm</option>
              <option value={3}>Từ 3 năm</option>
              <option value={5}>Từ 5 năm</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-ink">Đánh giá tối thiểu</span>
            <select
              className="rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand"
              value={draft.minRating}
              onChange={(e) => onDraftChange({ minRating: Number(e.target.value) })}
            >
              <option value={0}>Tất cả</option>
              <option value={4}>Từ 4 sao</option>
              <option value={4.5}>Từ 4.5 sao</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
