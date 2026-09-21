# Sơ đồ dữ liệu (tóm tắt)

Chi tiết đầy đủ nằm ở `apps/api/prisma/schema.prisma`. Tóm tắt các bảng chính:

- **User** — bảng gốc cho account (role: PARENT | TUTOR | ADMIN), email, sđt, mật khẩu (hash), trạng thái xác thực email/sđt, khu vực, nhu cầu.
- **TutorProfile** — 1-1 với User(role=TUTOR): ảnh đại diện, giới thiệu, môn dạy (nhiều), khu vực dạy, hình thức dạy (ONLINE/OFFLINE/BOTH), học phí, kinh nghiệm, trình độ, trường từng học, lịch dạy, chứng chỉ, thành tích, số học sinh đã tiếp nhận.
- **VerificationDocument** — hồ sơ xác minh (loại: CCCD | STUDENT_CARD | DEGREE | CERTIFICATE | CONFIRMATION_LETTER), file URL, trạng thái (PENDING/APPROVED/REJECTED), người duyệt (admin).
- **TutorBadge** — huy hiệu đã cấp (IDENTITY | STUDENT | DEGREE | EXPERIENCE).
- **TutoringRequest** (bài đăng tìm gia sư của phụ huynh) — môn, mục tiêu, hình thức, số buổi/tuần, khung giờ, ngân sách, yêu cầu thêm, ghi chú.
- **Booking** — kết nối TutoringRequest ↔ TutorProfile: trạng thái (PENDING/ACCEPTED/DECLINED/CANCELLED/COMPLETED), lịch học đã chốt.
- **Message** — chat giữa phụ huynh & gia sư (thuộc 1 Booking hoặc 1 cuộc trò chuyện trực tiếp).
- **Review** — đánh giá (rating 1–5, nhận xét, tiêu chí: chất lượng, thái độ), người đánh giá, người được đánh giá.
- **Favorite** — phụ huynh lưu gia sư yêu thích.
- **Notification** — loại sự kiện, kênh gửi (IN_APP/EMAIL/PUSH/SMS), trạng thái đã đọc.
- **MatchScore** (GD6) — điểm matching giữa TutoringRequest ↔ TutorProfile theo trọng số môn học/lớp/mục tiêu/lịch/địa điểm/ngân sách/kinh nghiệm.

Xem file Prisma để có kiểu dữ liệu chính xác — đây chỉ là bản đồ khái niệm để dễ hình dung trước khi code.
