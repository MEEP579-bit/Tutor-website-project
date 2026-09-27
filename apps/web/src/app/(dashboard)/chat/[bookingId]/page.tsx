"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchMessages, sendMessage, type ApiMessage } from "@/lib/chat-api";
import { getSessionUser, dashboardPathForRole } from "@/lib/auth";
import { ApiError } from "@/lib/api";

const POLL_INTERVAL_MS = 4000;

export default function ChatPage({ params }: { params: { bookingId: string } }) {
  const searchParams = useSearchParams();
  const withName = searchParams.get("with");

  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const myUserId = getSessionUser()?.id;
  const backHref = dashboardPathForRole(getSessionUser()?.role ?? "PARENT");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(showLoading: boolean) {
      if (showLoading) setLoading(true);
      try {
        const data = await fetchMessages(params.bookingId);
        if (!cancelled) {
          setMessages(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Không tải được tin nhắn.");
      } finally {
        if (!cancelled && showLoading) setLoading(false);
      }
    }

    load(true);
    const interval = setInterval(() => load(false), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [params.bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      const sent = await sendMessage(params.bookingId, content.trim());
      setMessages((prev) => [...prev, sent]);
      setContent("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gửi tin nhắn thất bại.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <Link href={backHref} className="text-sm text-muted hover:text-brand-deep">
            ← Quay lại
          </Link>
          <h1 className="font-display text-2xl font-medium text-ink">
            {withName ? `Trò chuyện với ${withName}` : "Trò chuyện"}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-line bg-paper-raised p-4">
        {loading && <p className="text-center text-muted">Đang tải...</p>}
        {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}

        {!loading && messages.length === 0 && !error && (
          <p className="text-center text-muted">Chưa có tin nhắn nào. Gửi lời chào đầu tiên nhé!</p>
        )}

        <div className="flex flex-col gap-2">
          {messages.map((m) => {
            const isMine = m.senderId === myUserId;
            return (
              <div key={m.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                {!isMine && <span className="mb-0.5 text-xs text-muted">{m.senderName}</span>}
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    isMine ? "bg-brand text-white" : "bg-line/40 text-ink"
                  }`}
                >
                  {m.content}
                </div>
                <span className="mt-0.5 text-[11px] text-muted">
                  {new Date(m.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 rounded-lg border border-line px-3 py-2.5 text-sm text-ink focus:border-brand"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
