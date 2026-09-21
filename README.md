# Gia Sư Platform

Website kết nối phụ huynh/học sinh với gia sư (F2F & online) — hồ sơ gia sư, tìm kiếm & đặt lịch, xác minh, đánh giá, thông báo, và (giai đoạn nâng cao) matching bằng AI.

## Cấu trúc monorepo

```
gia-su-platform/
├── apps/
│   ├── web/     # Frontend (Next.js) — trang chủ, danh sách/hồ sơ gia sư, đăng ký/đăng nhập, dashboard
│   └── api/     # Backend (Node/Express + Prisma) — auth, users, tutors, booking, matching, notifications...
├── packages/
│   └── shared/  # Types & constants dùng chung giữa web và api
├── docs/        # Tài liệu đặc tả, được chuyển thể từ kế hoạch triển khai gốc
├── .github/workflows/  # CI (lint, build, test)
├── scripts/     # Script tiện ích (seed db, deploy...)
└── docker-compose.yml
```

## Bản đồ Giai đoạn (GD) → Thư mục

| Giai đoạn | Nội dung | Nơi triển khai |
|---|---|---|
| GD1 | Tìm thông tin gia sư, nghiên cứu dữ liệu, xác định yêu cầu | `docs/01-nghien-cuu-yeu-cau.md` |
| GD2 | Thiết kế giao diện (trang chủ, ds gia sư, hồ sơ, đăng ký/đăng nhập, admin) | `apps/web/src/app`, `apps/web/src/components` |
| GD3 | Lập trình & xây dựng web (tài khoản, hồ sơ, tìm kiếm, tính năng) | `apps/web`, `apps/api/src/modules` |
| GD4 | Thử nghiệm, nghiệm thu, sửa lỗi | `.github/workflows`, `apps/*/tests` (tự thêm) |
| GD5 | Triển khai (deploy) | `docker-compose.yml`, `scripts/`, `.github/workflows/deploy.yml` |
| GD6 | Nâng cao (AI đề xuất, AI matching, chatbot, video, uy tín) | `apps/api/src/modules/ai`, `docs/06-nang-cao-ai.md` |

Xem chi tiết từng phần trong thư mục `docs/`.

## Bắt đầu nhanh (đề xuất, có thể đổi công nghệ)

1. `cp .env.example .env` rồi điền biến môi trường (DB, JWT secret, SMTP...)
2. `docker-compose up -d` (Postgres + các service phụ trợ)
3. Cài dependency:
   - `cd apps/api && npm install`
   - `cd apps/web && npm install`
4. Chạy migration: `cd apps/api && npx prisma migrate dev`
5. Chạy dev: `npm run dev` ở mỗi app (hoặc dùng `npm run dev` ở root nếu cấu hình workspaces)

## Ngăn xếp công nghệ đề xuất

- **Frontend**: Next.js (React) + TypeScript + Tailwind CSS — responsive tốt cho cả máy tính & điện thoại (yêu cầu GD2)
- **Backend**: Node.js + Express (hoặc NestJS nếu team quen kiến trúc module) + TypeScript
- **Database**: PostgreSQL qua Prisma ORM
- **Auth**: JWT + refresh token, xác thực email/sđt qua OTP
- **File upload** (CCCD, thẻ SV, bằng cấp...): S3-compatible storage (hoặc Cloudinary cho MVP)
- **Realtime/Chat & thông báo**: WebSocket (Socket.IO) + push notification (Web Push / Firebase)
- **AI (GD6)**: gọi API mô hình ngôn ngữ cho chatbot thu thập nhu cầu + matching engine dựa trên điểm số (xem `docs/06-nang-cao-ai.md`)

Đây là khung sườn — điều chỉnh công nghệ theo ngân sách & năng lực team như kế hoạch gốc đã ghi (GD3: "Lựa chọn công nghệ: sử dụng các nền tảng phù hợp vs ngân sách").
