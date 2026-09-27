import Link from "next/link";

export function TutorDashboardNav({ current }: { current: "ho-so" | "yeu-cau" }) {
  const tabClass = (tab: "ho-so" | "yeu-cau") =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      current === tab ? "bg-brand text-white" : "text-muted hover:text-ink"
    }`;

  return (
    <div className="mb-6 flex gap-2 rounded-lg border border-line p-1">
      <Link href="/gia-su" className={tabClass("ho-so")}>
        Hồ sơ
      </Link>
      <Link href="/gia-su/yeu-cau" className={tabClass("yeu-cau")}>
        Yêu cầu học sinh
      </Link>
    </div>
  );
}
