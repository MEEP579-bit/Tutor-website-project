"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";
import { saveSession, dashboardPathForRole, type SessionUser } from "@/lib/auth";

interface LoginResponse {
  token: string;
  user: SessionUser;
}

export default function DangNhapPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveSession(result.token, result.user);
      router.push(dashboardPathForRole(result.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng nhập thất bại, thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink">Đăng nhập</h1>
      <p className="mt-1 text-muted">Dùng chung cho phụ huynh, gia sư và quản trị viên.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ban@email.com"
        />
        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading}>
          Đăng nhập
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="font-medium text-brand-deep hover:underline">
          Đăng ký
        </Link>
      </p>
    </main>
  );
}
