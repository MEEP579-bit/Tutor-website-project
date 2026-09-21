# GD3 — Lập trình & xây dựng web: Tính năng & Module

Mỗi mục dưới đây tương ứng một module trong `apps/api/src/modules/`.

## 1. Hệ thống tài khoản người dùng (phụ huynh) — `modules/auth`, `modules/users`
- Đăng ký, đăng nhập, quên mật khẩu
- Xác thực email & số điện thoại (OTP)
- Chỉnh sửa thông tin cá nhân, khu vực, nhu cầu

## 2. Hệ thống tài khoản gia sư — `modules/auth`, `modules/tutors`
- Đăng ký, đăng nhập, hồ sơ (ảnh đại diện, giới thiệu bản thân)
- Môn dạy, khu vực có thể dạy, hình thức dạy (online/offline)
- Học phí, kinh nghiệm, lịch dạy, trình độ, chứng chỉ, thành tích

## 3. Trang danh sách gia sư — `modules/tutors`
- Tên, avatar, môn, khu vực, học phí, rating, số lượt đánh giá
- Nút xem hồ sơ & liên hệ

## 4. Hệ thống tìm kiếm gia sư — `modules/tutors` (search/filter)
- Lọc theo: môn học, ngân sách, khu vực, kinh nghiệm, giới tính, trình độ, đánh giá

## 5. Hệ thống hồ sơ gia sư (chi tiết) — `modules/tutors`
Trường dữ liệu: ảnh đại diện, tên, sđt, môn dạy, học phí, kinh nghiệm, trình độ,
từng học ở trường (X), thành tích, hình thức dạy, lịch dạy, số học sinh đã tiếp nhận,
đánh giá từ học sinh & phụ huynh, nút nhắn tin (ntin) và gọi.

## 6. Hệ thống đăng bài tìm gia sư (phụ huynh đăng nhu cầu) — `modules/booking`
Trường dữ liệu: môn, mục tiêu, hình thức, số buổi, thời gian, ngân sách, yêu cầu, ghi chú.

## 7. Hệ thống kết nối giữa phụ huynh và gia sư — `modules/chat`, `modules/booking`
- Nhắn tin, gửi/nhận yêu cầu dạy, xác nhận lịch

## 8. Mic & Chatbox — `modules/chat`
- Chat real-time (Socket.IO), có thể tích hợp voice/mic ở giai đoạn sau

## 9. Hệ thống đánh giá gia sư — `modules/reviews`
- Rating, nhận xét, đánh giá chất lượng, thái độ

## 10. Hệ thống admin — `modules/admin`
- Dashboard tổng quan
- Quản lý học sinh/phụ huynh và gia sư
- Duyệt hồ sơ gia sư
- Quản lý môn học, bài đăng
- Báo cáo & đánh giá
- Khóa tài khoản, xóa nội dung vi phạm

## 11. Xác minh gia sư — `modules/verification`
Gia sư có thể upload: CCCD, thẻ sinh viên, bằng tốt nghiệp, chứng chỉ, giấy xác nhận.
Admin kiểm tra → cấp huy hiệu xác minh:
- ✓ Đã xác minh (tổng quát)
- ✓ Xác minh danh tính
- ✓ Xác minh sinh viên
- ✓ Xác minh bằng cấp
- ✓ Xác minh kinh nghiệm

## 12. Lịch & đặt lịch — `modules/booking`
- Đặt lịch học, xem lịch trống của gia sư, hình thức online/offline

## 13. Thông báo — `modules/notifications`
Sự kiện cần bắn thông báo:
- Có gia sư mới phù hợp
- Gia sư nhận yêu cầu
- Gia sư từ chối
- Tin nhắn mới
- Sắp đến giờ học
- Buổi học bị hủy
- Có đánh giá mới

Kênh gửi: Website (in-app), Email, Push notification; SMS/Zalo ở giai đoạn sau.

## 14. Yêu thích — `modules/favorites`
- Phụ huynh lưu gia sư vào danh sách "Gia sư yêu thích của tôi"
