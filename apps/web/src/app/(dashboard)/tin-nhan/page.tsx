"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchConversations, type ApiConversation } from "@/lib/chat-api";
import { getInitials } from "@/lib/tutors-api";
import { ApiError } from "@/lib/api";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchConversations()
      .then(setConversations)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được danh sách trò chuyện."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-ink">Tin nhắn</h1>
      <p className="mt-1 text-muted">Các cuộc trò chuyện với gia sư/phụ huynh sau khi yêu cầu học được nhận.</p>

      {loading && <p className="mt-6 text-muted">Đang tải...</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && conversations.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center text-muted">
          Chưa có cuộc trò chuyện nào. Trò chuyện sẽ xuất hiện ở đây sau khi 1 yêu cầu học được chấp nhận.
        </div>
      )}

      {conversations.length > 0 && (
        <div className="mt-6 flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper-raised">
          {conversations.map((c) => (
            <Link
              key={c.bookingId}
              href={`/chat/${c.bookingId}?with=${encodeURIComponent(c.otherPartyName)}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-line/20"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
                aria-hidden="true"
              >
                {getInitials(c.otherPartyName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`truncate font-medium ${c.unreadCount > 0 ? "text-ink" : "text-ink/90"}`}>
                    {c.otherPartyName}
                  </span>
                  {c.lastMessageAt && (
                    <span className="shrink-0 text-xs text-muted">{timeAgo(c.lastMessageAt)}</span>
                  )}
                </div>
                <p className={`truncate text-sm ${c.unreadCount > 0 ? "font-medium text-ink" : "text-muted"}`}>
                  {c.lastMessage ?? "Chưa có tin nhắn nào — bấm để bắt đầu"}
                </p>
              </div>
              {c.unreadCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-brand-deep">
                  {c.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
