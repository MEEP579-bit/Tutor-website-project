"use client";

import { useState, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, type, ...props }: Props) {
  const inputId = id ?? props.name;
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword ? (show ? "text" : "password") : type}
          {...props}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm text-ink focus:border-brand ${
            isPassword ? "pr-10" : ""
          } ${error ? "border-danger" : "border-line"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M2 10s3-6 8-6c1.7 0 3.1.5 4.3 1.2M18 10s-1 2-3 3.6M2 10s1 2 3 3.6M8 8.3A2.5 2.5 0 0 0 10 12.5c.6 0 1.1-.2 1.6-.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
