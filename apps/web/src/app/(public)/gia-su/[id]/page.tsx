// Hồ sơ chi tiết gia sư — GD3 mục 5
// TODO: gọi GET /api/tutors/:id, hiển thị: ảnh, tên, sđt, môn dạy, học phí,
// kinh nghiệm, trình độ, trường học, thành tích, hình thức dạy, lịch dạy,
// số học sinh đã tiếp nhận, đánh giá, nút nhắn tin & gọi.
export default function TutorProfilePage({ params }: { params: { id: string } }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Hồ sơ gia sư #{params.id}</h1>
    </main>
  );
}
