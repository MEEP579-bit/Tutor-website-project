# GD2 — Thiết kế giao diện

Các trang cần có (map sang `apps/web/src/app`):

| Trang | Route đề xuất | Ghi chú |
|---|---|---|
| Trang chủ | `/` | `(public)/page.tsx` |
| Danh sách gia sư | `/tim-gia-su` | `(public)/tim-gia-su` — tìm kiếm theo môn, ngân sách, khu vực, kinh nghiệm, giới tính, trình độ, đánh giá |
| Hồ sơ/CV gia sư | `/gia-su/[id]` | `(public)/gia-su/[id]` |
| Đăng ký | `/dang-ky` | có 2 luồng: đăng ký phụ huynh & đăng ký gia sư |
| Đăng nhập | `/dang-nhap` | dùng chung cho phụ huynh/gia sư/admin, redirect theo role |
| Dashboard Admin | `/admin/*` | `(dashboard)/admin` |
| Dashboard Gia sư | `/gia-su/dashboard/*` | `(dashboard)/gia-su` |
| Dashboard Phụ huynh | `/phu-huynh/*` | `(dashboard)/phu-huynh` |

## Yêu cầu thiết kế
- Giao diện dễ nhìn, mượt mà trên cả máy tính và điện thoại → dùng Tailwind CSS responsive (mobile-first), test trên các breakpoint sm/md/lg.
- Component tái sử dụng đặt tại `apps/web/src/components/ui` (Button, Input, Card, Modal, Rating, Avatar, Badge...).
- Component theo domain: `components/gia-su` (TutorCard, TutorProfile, SearchFilters), `components/phu-huynh` (BookingForm, FavoriteList), `components/admin` (ApprovalTable, Dashboard charts).
