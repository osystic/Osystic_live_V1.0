import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "OSYSTIC access control boundary.",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function UnauthorizedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
