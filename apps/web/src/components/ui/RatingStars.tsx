export function RatingStars({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <svg width="14" height="14" viewBox="0 0 20 20" fill="var(--accent)" aria-hidden="true">
        <path d="M10 1.5 12.6 7l6 .9-4.3 4.2 1 6-5.3-2.8L4.7 18l1-6L1.4 7.9l6-.9L10 1.5Z" />
      </svg>
      <span className="font-medium text-ink">{value.toFixed(1)}</span>
      {typeof count === "number" && <span className="text-muted">({count})</span>}
    </span>
  );
}
