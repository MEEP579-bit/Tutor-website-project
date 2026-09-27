import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <div className="flex-1">{children}</div>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Gia Sư Platform.
      </footer>
    </div>
  );
}
