"use client";

export interface FilterChip {
  key: string;
  label: string;
}

// Hiển thị các tiêu chí đang lọc dạng chip, bấm x để bỏ từng cái
export function FilterChips({ chips, onRemove }: { chips: FilterChip[]; onRemove: (key: string) => void }) {
  if (chips.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1.5 text-sm text-brand-deep"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            aria-label={`Xóa bộ lọc ${chip.label}`}
            className="rounded-full hover:opacity-70"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}
