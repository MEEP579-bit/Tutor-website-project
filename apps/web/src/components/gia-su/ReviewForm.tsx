"use client";

import { useState } from "react";
import { createReview } from "@/lib/reviews-api";
import { ApiError } from "@/lib/api";
import { StarRatingInput } from "@/components/ui/StarRatingInput";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

export function ReviewForm({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createReview({ bookingId, rating, comment: comment || undefined });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gửi đánh giá thất bại, thử lại sau.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 rounded-lg border border-line bg-paper p-3">
      <div>
        <span className="text-sm font-medium text-ink">Chất lượng dạy học thế nào?</span>
        <div className="mt-1">
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
      </div>
      <Textarea
        label="Nhận xét (không bắt buộc)"
        rows={2}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cảm nhận của bạn về gia sư..."
      />
      {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
      <div>
        <Button type="submit" loading={saving}>
          Gửi đánh giá
        </Button>
      </div>
    </form>
  );
}
