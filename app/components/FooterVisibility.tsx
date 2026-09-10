"use client";

import { usePathname } from "next/navigation";

export function FooterVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : children;
}
