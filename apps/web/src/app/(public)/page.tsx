import Link from "next/link";
import { fetchTutors } from "@/lib/tutors-api";
import { QuickSearch } from "@/components/gia-su/QuickSearch";
import { TutorCard } from "@/components/gia-su/TutorCard";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

export default async function HomePage() {
  // Lấy gia sư nổi bật (đánh giá cao nhất) — nếu API/DB chưa sẵn sàng thì hiện danh sách rỗng thay vì crash
  const featured = await fetchTutors({}).then((all) => all.slice(0, 3)).catch(() => []);

  return (
    <main>
      {/* Hero — thanh tìm kiếm là trọng tâm, gọn gàng, không nhồi thêm nút tắt */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h1 className="font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
              Tìm gia sư phù hợp cho con bạn
            </h1>
            <p className="mt-4 max-w-prose text-lg text-muted">
              Gia sư F2F & online, đã xác minh danh tính và bằng cấp, đánh giá thật từ phụ huynh
              đã học trước đó.
            </p>
            <div className="mt-6 max-w-lg">
              <QuickSearch />
            </div>
          </div>

          <div className="rounded-xl border border-line bg-paper-raised p-6">
            <h2 className="font-display text-lg font-medium text-ink">Vì sao phụ huynh yên tâm</h2>
            <p className="mt-1 text-sm text-muted">
              Mỗi gia sư có thể được cấp một hoặc nhiều huy hiệu sau khi admin kiểm tra hồ sơ:
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <VerificationBadge type="IDENTITY" />
              <VerificationBadge type="STUDENT" />
              <VerificationBadge type="DEGREE" />
              <VerificationBadge type="EXPERIENCE" />
            </div>
          </div>
        </div>
      </section>

      {/* Gia sư nổi bật */}
      <section className="border-t border-line bg-paper-raised/50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-medium text-ink">Gia sư nổi bật</h2>
            <Link href="/tim-gia-su" className="text-sm font-medium text-brand-deep hover:underline">
              Xem tất cả
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="mt-6 text-muted">
              Chưa có gia sư nào công khai hồ sơ — hãy là người đầu tiên!{" "}
              <Link href="/dang-ky" className="font-medium text-brand-deep hover:underline">
                Đăng ký làm gia sư
              </Link>
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA cho gia sư */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start gap-4 rounded-xl bg-brand-deep p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium">Bạn là gia sư?</h2>
            <p className="mt-1 text-white/80">Tạo hồ sơ, nhận yêu cầu từ phụ huynh phù hợp với bạn.</p>
          </div>
          <Link
            href="/dang-ky"
            className="rounded-lg bg-accent px-5 py-2.5 font-medium text-brand-deep transition-opacity hover:opacity-90"
          >
            Đăng ký làm gia sư
          </Link>
        </div>
      </section>
    </main>
  );
}
