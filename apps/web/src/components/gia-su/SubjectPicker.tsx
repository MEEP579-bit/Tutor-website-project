"use client";

import { useState } from "react";
import { SUBJECT_GROUPS } from "@/lib/constants";

// Bộ chọn môn học dạng popover: có ô tìm kiếm + chip theo nhóm — thay cho <select> mặc định
export function SubjectPicker({
  value,
  onChange,
  placeholder = "Chọn môn học",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = SUBJECT_GROUPS.map((group) => ({
    ...group,
    subjects: normalizedQuery
      ? group.subjects.filter((s) => s.toLowerCase().includes(normalizedQuery))
      : group.subjects,
  })).filter((group) => group.subjects.length > 0);

  function select(subject: string) {
    onChange(subject);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative flex-1 min-w-[160px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-left text-sm text-ink focus:border-brand"
      >
        <span className={value ? "text-ink" : "text-muted"}>{value || placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0 text-muted">
          <path d="m5 7 5 6 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* Lớp phủ trong suốt để bấm ra ngoài là đóng popover */}
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-80 max-w-[90vw] rounded-xl border border-line bg-paper-raised p-3 shadow-lg">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm môn học..."
              className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand"
            />
            <div className="mt-3 max-h-72 overflow-y-auto">
              {visibleGroups.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted">Không tìm thấy môn phù hợp</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {visibleGroups.map((group) => (
                    <div key={group.category}>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">
                        {group.category}
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {group.subjects.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => select(s)}
                            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                              value === s
                                ? "border-brand bg-brand-tint text-brand-deep"
                                : "border-line text-ink hover:border-brand"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {value && (
              <button
                type="button"
                onClick={() => select("")}
                className="mt-3 text-sm text-muted hover:text-danger"
              >
                Xóa lựa chọn
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
