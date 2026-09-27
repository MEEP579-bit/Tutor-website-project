"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSessionUser, dashboardPathForRole, type SessionUser } from "@/lib/auth";

// Phần bên phải của header — đổi giữa Đăng nhập/Đăng ký và trạng thái đã đăng nhập
export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(getSessionUser());
    sync();
    window.addEventListener("gia-su-session-change", sync);
    return () => window.removeEventListener("gia-su-session-change", sync);
  }, []);

  if (!user) {
    return (
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
    );
  }

  return (
    <>
      <Link href="/tin-nhan" className="text-ink hover:text-brand-deep">
        Tin nhắn
      </Link>
      <Link href={dashboardPathForRole(user.role)} className="text-ink hover:text-brand-deep">
        Xin chào, {user.fullName.split(" ").slice(-1)[0]}
      </Link>
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
  );
}
