import "../styles/globals.css";
import type { ReactNode } from "react";
import { Fraunces, Be_Vietnam_Pro } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

export const metadata = {
  title: "Gia Sư Platform — Tìm gia sư phù hợp",
  description: "Kết nối phụ huynh & gia sư F2F/Online — đã xác minh, đánh giá thật.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${beVietnam.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
