# GD4 — Thử nghiệm, nghiệm thu & sửa lỗi

- Tiếp nhận ý kiến phản hồi của khách hàng, người dùng (form feedback trong app, hoặc kênh hỗ trợ)
- Tiếp thu và sửa lỗi, khắc phục khuyết điểm (theo dõi qua GitHub Issues)
- Hoàn thiện hệ thống trước khi phát hành rộng
- CI kiểm tra tự động ở `.github/workflows/ci.yml` (lint, build, test) chạy trên mỗi PR

# GD5 — Triển khai trang web tới mọi người

- `docker-compose.yml` để chạy local/staging (Postgres + API + Web)
- `.github/workflows/deploy.yml` (mẫu) để build & deploy khi merge vào `main`
- Gợi ý hosting theo ngân sách: VPS (droplet) + Docker, hoặc PaaS (Render/Railway/Vercel cho frontend) khi mới ra mắt để tiết kiệm chi phí vận hành
