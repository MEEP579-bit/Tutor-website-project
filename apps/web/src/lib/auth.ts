// Lưu/đọc phiên đăng nhập ở phía trình duyệt (localStorage)
export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: "PARENT" | "TUTOR" | "ADMIN";
  avatarUrl?: string | null;
}

const TOKEN_KEY = "gia_su_token";
const USER_KEY = "gia_su_user";

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("gia-su-session-change"));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("gia-su-session-change"));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

// Trang dashboard mặc định theo vai trò sau khi đăng nhập/đăng ký
export function dashboardPathForRole(role: SessionUser["role"]): string {
  if (role === "ADMIN") return "/admin";
  if (role === "TUTOR") return "/gia-su";
  return "/phu-huynh";
}
