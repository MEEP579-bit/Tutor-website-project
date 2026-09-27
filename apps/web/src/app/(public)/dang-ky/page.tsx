"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";
import { saveSession, dashboardPathForRole, type SessionUser } from "@/lib/auth";

type Role = "PARENT" | "TUTOR";

interface RegisterResponse {
  token: string;
  user: SessionUser;
}

export default function DangKyPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("PARENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      const result = await apiFetch<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, phone: phone || undefined, password, role }),
      });
      saveSession(result.token, result.user);
      router.push(dashboardPathForRole(result.user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng ký thất bại, thử lại sau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl font-medium text-ink">Đăng ký</h1>
      <p className="mt-1 text-muted">Tạo tài khoản để tìm gia sư hoặc bắt đầu nhận học sinh.</p>

      {/* Chọn vai trò — quyết định luồng đăng ký (docs/02 mục "Trang đăng ký") */}
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-line p-1">
        {(["PARENT", "TUTOR"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              role === r ? "bg-brand text-white" : "text-muted hover:text-ink"
            }`}
          >
            {r === "PARENT" ? "Tôi là phụ huynh" : "Tôi là gia sư"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Họ và tên"
          name="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nguyễn Văn A"
        />
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
          label="Số điện thoại (không bắt buộc)"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxxxxxxx"
        />
        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ít nhất 6 ký tự"
        />
        <Input
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading}>
          {role === "PARENT" ? "Tạo tài khoản phụ huynh" : "Tạo tài khoản gia sư"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-medium text-brand-deep hover:underline">
          Đăng nhập
        </Link>
      </p>
    </main>
  );
}
