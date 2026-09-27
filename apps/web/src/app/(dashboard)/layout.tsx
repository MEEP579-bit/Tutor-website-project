"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSessionUser, clearSession, dashboardPathForRole, type SessionUser } from "@/lib/auth";

const ROLE_FOR_PREFIX: Record<string, SessionUser["role"]> = {
  "/admin": "ADMIN",
  "/gia-su": "TUTOR",
  "/phu-huynh": "PARENT",
};

// Bảo vệ toàn bộ khu vực dashboard: chưa đăng nhập -> về /dang-nhap,
// sai vai trò (vd. phụ huynh vào /gia-su) -> đưa về đúng dashboard của họ
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  useEffect(() => {
    const current = getSessionUser();
    if (!current) {
      router.replace("/dang-nhap");
      return;
    }

    const requiredRole = Object.entries(ROLE_FOR_PREFIX).find(([prefix]) =>
      pathname?.startsWith(prefix)
    )?.[1];

    if (requiredRole && current.role !== requiredRole) {
      router.replace(dashboardPathForRole(current.role));
      return;
    }

    setUser(current);
  }, [pathname, router]);

  if (user === undefined) {
    return <div className="flex min-h-screen items-center justify-center text-muted">Đang tải...</div>;
  }
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-paper-raised">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="font-display text-lg font-medium text-brand-deep">
            Gia Sư Platform
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/tin-nhan" className="text-ink hover:text-brand-deep">
              Tin nhắn
            </Link>
            <span className="text-muted">Xin chào, {user.fullName}</span>
            <button
              type="button"
              onClick={() => {
                clearSession();
                router.push("/");
              }}
              className="rounded-lg border border-line px-3 py-1.5 text-ink transition-colors hover:border-brand hover:text-brand-deep"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
