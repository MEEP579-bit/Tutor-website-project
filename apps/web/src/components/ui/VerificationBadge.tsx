const BADGE_LABEL: Record<string, string> = {
  IDENTITY: "Đã xác minh danh tính",
  STUDENT: "Đã xác minh sinh viên",
  DEGREE: "Đã xác minh bằng cấp",
  EXPERIENCE: "Đã xác minh kinh nghiệm",
};

// Huy hiệu xác minh gia sư — xem docs/03-tinh-nang-va-du-lieu.md mục 11
export function VerificationBadge({ type }: { type: string }) {
  const label = BADGE_LABEL[type] ?? type;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-xs font-medium text-brand-deep"
      title={label}
    >
      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 1.5 12.3 4l3.3-.3.8 3.3 3 1.6-1.6 3 1.6 3-3 1.6-.8 3.3-3.3-.3L10 18.5 7.7 16l-3.3.3-.8-3.3-3-1.6 1.6-3-1.6-3 3-1.6.8-3.3L7.7 4 10 1.5Z"
          fill="currentColor"
        />
        <path d="m6.8 10.2 2.1 2.1 4.3-4.3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}
