"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSessionUser, dashboardPathForRole, type SessionUser } from "@/lib/auth";

// Header dùng chung cho toàn bộ web — cả trang công khai lẫn khu vực dashboard,
// để việc chuyển qua lại giữa Tìm gia sư / Dashboard / Tin nhắn luôn nhất quán
export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(getSessionUser());
    sync();
    window.addEventListener("gia-su-session-change", sync);
    return () => window.removeEventListener("gia-su-session-change", sync);
  }, []);

  return (
    <header className="border-b border-line bg-paper-raised">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-medium text-brand-deep">
          Gia Sư Platform
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/tim-gia-su" className="text-ink hover:text-brand-deep">
            Tìm gia sư
          </Link>

          {user ? (
            <>
              <Link href="/tin-nhan" className="text-ink hover:text-brand-deep">
                Tin nhắn
              </Link>
              <Link href={dashboardPathForRole(user.role)} className="text-ink hover:text-brand-deep">
                Dashboard
              </Link>
              <span className="hidden text-muted sm:inline">
                Xin chào, {user.fullName.split(" ").slice(-1)[0]}
              </span>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  router.push("/");
                }}
                className="rounded-lg border border-line px-4 py-2 font-medium text-ink transition-colors hover:border-brand hover:text-brand-deep"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/dang-nhap" className="text-ink hover:text-brand-deep">
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="rounded-lg bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-deep"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
