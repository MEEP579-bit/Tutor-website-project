"use client";

import { useState } from "react";
import { CLASS_CATEGORIES, CLASS_GROUPS } from "@/lib/constants";

// Bộ chọn lớp dạng popover — chọn từng lớp cụ thể, nhóm theo cấp học cho dễ nhìn
export function ClassPicker({
  value,
  onChange,
  placeholder = "Chọn lớp",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = CLASS_GROUPS.find((c) => c.value === value)?.label;

  function select(v: string) {
    onChange(v);
    setOpen(false);
  }

  return (
    <div className="relative flex-1 min-w-[150px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-left text-sm text-ink focus:border-brand"
      >
        <span className={selectedLabel ? "text-ink" : "text-muted"}>{selectedLabel ?? placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0 text-muted">
          <path d="m5 7 5 6 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-72 max-w-[90vw] rounded-xl border border-line bg-paper-raised p-3 shadow-lg">
            <div className="max-h-80 overflow-y-auto">
              <div className="flex flex-col gap-3">
                {CLASS_CATEGORIES.map((cat) => (
                  <div key={cat.category}>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted">{cat.category}</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {cat.classes.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => select(c.value)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                            value === c.value
                              ? "border-brand bg-brand-tint text-brand-deep"
                              : "border-line text-ink hover:border-brand"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
