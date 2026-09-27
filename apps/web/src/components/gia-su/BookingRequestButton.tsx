"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSessionUser } from "@/lib/auth";
import { createBooking } from "@/lib/booking-api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CLASS_CATEGORIES } from "@/lib/constants";

// Nút + form gửi yêu cầu học tới 1 gia sư cụ thể — chỉ hiện cho phụ huynh đã đăng nhập
export function BookingRequestButton({
  tutorId,
  subjects,
}: {
  tutorId: string;
  subjects: string[];
}) {
  const [checking, setChecking] = useState(true);
  const [isParent, setIsParent] = useState(false);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const [subject, setSubject] = useState(subjects[0] ?? "");
  const [classGroup, setClassGroup] = useState("");
  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [sessionsPerWeek, setSessionsPerWeek] = useState("2");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const user = getSessionUser();
    setIsParent(!!user && user.role === "PARENT");
    setChecking(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await createBooking({
        tutorId,
        subject,
        classGroup: classGroup || undefined,
        goal: goal || undefined,
        mode,
        sessionsPerWeek: sessionsPerWeek ? Number(sessionsPerWeek) : undefined,
        budget: budget ? Number(budget) : undefined,
        notes: notes || undefined,
      });
      setSent(true);
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gửi yêu cầu thất bại, thử lại sau.");
    } finally {
      setSending(false);
    }
  }

  if (checking) return null;

  if (sent) {
    return (
      <p className="mt-3 rounded-lg bg-brand-tint px-3 py-2 text-sm text-brand-deep">
        ✓ Đã gửi yêu cầu! Gia sư sẽ phản hồi sớm.
      </p>
    );
  }

  if (!isParent) {
    return (
      <Link href="/dang-nhap" className="mt-3 inline-block text-sm text-muted hover:text-brand-deep">
        Đăng nhập với tư cách phụ huynh để gửi yêu cầu học
      </Link>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
      >
        Gửi yêu cầu học
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 rounded-xl border border-line bg-paper-raised p-4">
      <h3 className="font-display text-base font-medium text-ink">Gửi yêu cầu học</h3>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Môn học</span>
        <select
          className="rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:border-brand"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {(subjects.length > 0 ? subjects : ["Khác"]).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-ink">Lớp của con (không bắt buộc)</span>
        <select
          className="rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:border-brand"
          value={classGroup}
          onChange={(e) => setClassGroup(e.target.value)}
        >
          <option value="">Chưa chọn</option>
          {CLASS_CATEGORIES.map((cat) => (
            <optgroup key={cat.category} label={cat.category}>
              {cat.classes.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <Input
        label="Mục tiêu học (không bắt buộc)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="VD: Chuẩn bị thi vào 10"
      />

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink">Hình thức</span>
          <select
            className="rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:border-brand"
            value={mode}
            onChange={(e) => setMode(e.target.value as "ONLINE" | "OFFLINE")}
          >
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Tại nhà</option>
          </select>
        </label>
        <Input
          label="Số buổi/tuần"
          type="number"
          min={1}
          max={14}
          value={sessionsPerWeek}
          onChange={(e) => setSessionsPerWeek(e.target.value)}
        />
      </div>

      <Input
        label="Ngân sách (đ/buổi, không bắt buộc)"
        type="number"
        min={0}
        step={10000}
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="150000"
      />

      <Textarea
        label="Ghi chú thêm"
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Lịch rảnh, yêu cầu riêng..."
      />

      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" loading={sending}>
          Gửi yêu cầu
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Huỷ
        </Button>
      </div>
    </form>
  );
}
