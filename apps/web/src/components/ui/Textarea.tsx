import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <textarea
        id={inputId}
        {...props}
        className={`rounded-lg border px-3 py-2.5 text-sm text-ink focus:border-brand ${
          error ? "border-danger" : "border-line"
        }`}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
