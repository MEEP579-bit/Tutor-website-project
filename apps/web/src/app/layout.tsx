import "../styles/globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Gia Sư Platform",
  description: "Kết nối phụ huynh & gia sư F2F/Online",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
