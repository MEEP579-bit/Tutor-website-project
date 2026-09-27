// Client gọi API backend — dùng chung cho toàn bộ apps/web
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError("Không kết nối được đến máy chủ. Kiểm tra API đã chạy chưa (npm run dev:api).", 0);
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(data?.message ?? `Lỗi ${res.status}`, res.status);
  }
  return data as T;
}

// Giống apiFetch nhưng tự đính kèm token đăng nhập — dùng cho các API cần đăng nhập
export async function apiFetchAuth<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken } = await import("./auth");
  const token = getToken();
  return apiFetch<T>(path, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
}
