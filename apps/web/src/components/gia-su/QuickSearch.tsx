"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubjectPicker } from "./SubjectPicker";

// Thanh tìm kiếm nhanh ở trang chủ — điều hướng sang /tim-gia-su với môn đã chọn
export function QuickSearch() {
  const router = useRouter();
  const [subject, setSubject] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(subject ? `/tim-gia-su?subject=${encodeURIComponent(subject)}` : "/tim-gia-su");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-line bg-paper-raised p-3 shadow-sm sm:flex-row sm:items-center"
    >
      <SubjectPicker value={subject} onChange={setSubject} placeholder="Con bạn cần học môn gì?" />
      <button
        type="submit"
        className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
      >
        Tìm gia sư
      </button>
    </form>
  );
}
