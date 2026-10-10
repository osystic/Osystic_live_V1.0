import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";

export const metadata = createSeoMetadata({
  title: 'About',
  description: 'Learn about OSYSTIC governance and company operating model.',
  path: '/about',
  noIndex: true,
});

export default function LeadershipPage() {
  permanentRedirect("/about#leadership");
}
