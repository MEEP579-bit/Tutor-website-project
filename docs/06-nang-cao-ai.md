# GD6 — Nâng cao (khi đã có người dùng)

Module tương ứng: `apps/api/src/modules/ai`

## A. AI đề xuất gia sư
Thay vì bắt phụ huynh tự lọc hàng chục gia sư, phụ huynh mô tả nhu cầu bằng ngôn ngữ tự nhiên:

> "Con tôi lớp 9, học Toán khá yếu, chuẩn bị thi vào 10. Muốn học 3 buổi/tuần vào buổi tối, ngân sách khoảng 200k/buổi."

AI phân tích → đề xuất 5–10 gia sư phù hợp, tính điểm matching theo trọng số:

| Tiêu chí | Trọng số |
|---|---|
| Môn học | 30% |
| Lớp | 15% |
| Mục tiêu | 15% |
| Lịch | 15% |
| Địa điểm | 10% |
| Ngân sách | 10% |
| Kinh nghiệm | 5% |

→ Công thức điểm: `score = 0.30*mon_hoc + 0.15*lop + 0.15*muc_tieu + 0.15*lich + 0.10*dia_diem + 0.10*ngan_sach + 0.05*kinh_nghiem`
(mỗi tiêu chí normalize về thang 0–1 trước khi nhân trọng số — xem `modules/matching`)

## B. AI Matching tự động
Luồng: **Request → Matching Engine → Gia sư phù hợp**
- Khi phụ huynh đăng nhu cầu, gia sư phù hợp cũng nhận được thông báo "Có một học sinh phù hợp với hồ sơ của bạn" → **Nhận học sinh**
- Đây là tính năng tạo khác biệt lớn cho sản phẩm — ưu tiên đầu tư sau khi có đủ dữ liệu người dùng để matching engine hoạt động tốt.

## C. AI trợ lý cho phụ huynh (chatbot)
Chatbot hỏi tuần tự:
1. "Con bạn đang học lớp mấy?"
2. "Môn nào cần cải thiện?"
3. "Mục tiêu là gì?"
4. "Muốn học online hay tại nhà?"

Sau 1–2 phút → hệ thống tự tạo yêu cầu tìm gia sư hoàn chỉnh (đưa vào `modules/booking`).

## D. Video giới thiệu gia sư
- Gia sư quay video ngắn 30–60 giây tự giới thiệu (VD: "Xin chào, mình là Minh, sinh viên Đại học Bách Khoa...")
- Phụ huynh xem trước khi liên hệ → tăng độ tin cậy, giảm tỉ lệ liên hệ "hụt"

## E. Hệ thống uy tín gia sư
Không chỉ dựa vào rating trung bình. Tính thêm:
- Số học sinh đã dạy
- Số buổi đã hoàn thành
- Tỷ lệ nhận yêu cầu
- Tỷ lệ đúng giờ
- Tỷ lệ học sinh quay lại
- Thời gian hoạt động (tuổi tài khoản)
- Số đánh giá xác thực (chỉ tính đánh giá từ học sinh/phụ huynh đã học thật)

→ Kết hợp các chỉ số này thành một "điểm uy tín" hiển thị song song với rating sao, giảm gian lận đánh giá ảo.
