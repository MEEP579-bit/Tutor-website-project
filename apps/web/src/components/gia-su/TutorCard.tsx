import type { TutorSummary } from "@gia-su/shared";

// Card hiển thị trong danh sách gia sư — GD3 mục 3
// (tên, avatar, môn, khu vực, học phí, rating, số lượt đánh giá, nút xem hồ sơ)
export function TutorCard({ tutor }: { tutor: TutorSummary }) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* TODO: <img src={tutor.avatarUrl} .../> */}
        <div>
          <h3 className="font-semibold">{tutor.fullName}</h3>
          <p className="text-sm text-gray-500">{tutor.subjects.join(", ")}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span>{tutor.region}</span>
        <span>{tutor.hourlyRate ? `${tutor.hourlyRate.toLocaleString()}đ/buổi` : ""}</span>
      </div>
      <div className="mt-2 text-sm text-yellow-600">
        ★ {tutor.ratingAvg.toFixed(1)} ({tutor.ratingCount} đánh giá)
      </div>
      {/* TODO: nút "Xem hồ sơ" -> /gia-su/[id] */}
    </div>
  );
}
