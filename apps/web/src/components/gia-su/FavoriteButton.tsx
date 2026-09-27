"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSessionUser } from "@/lib/auth";
import { fetchFavorites, addFavorite, removeFavorite } from "@/lib/favorites-api";

// Nút lưu/bỏ lưu gia sư yêu thích — chỉ hiện cho phụ huynh đã đăng nhập
export function FavoriteButton({ tutorId }: { tutorId: string }) {
  const [checking, setChecking] = useState(true);
  const [visible, setVisible] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const user = getSessionUser();
    if (!user || user.role !== "PARENT") {
      setChecking(false);
      return;
    }
    setVisible(true);
    fetchFavorites()
      .then((list) => setFavorited(list.some((t) => t.id === tutorId)))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [tutorId]);

  async function toggle() {
    setBusy(true);
    try {
      if (favorited) {
        await removeFavorite(tutorId);
        setFavorited(false);
      } else {
        await addFavorite(tutorId);
        setFavorited(true);
      }
    } catch {
      // giữ nguyên trạng thái cũ nếu lỗi, không chặn trải nghiệm
    } finally {
      setBusy(false);
    }
  }

  if (checking) return null;

  if (!visible) {
    return (
      <Link href="/dang-nhap" className="text-sm text-muted hover:text-brand-deep">
        Đăng nhập để lưu gia sư
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        favorited ? "border-accent bg-accent-tint text-brand-deep" : "border-line text-ink hover:border-brand"
      }`}
    >
      {favorited ? "★ Đã lưu" : "☆ Lưu gia sư"}
    </button>
  );
}
