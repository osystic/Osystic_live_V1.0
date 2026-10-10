import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";

export const metadata = createSeoMetadata({
  title: 'Enterprise AI & Software Engineering Capabilities',
  description: 'Explore OSYSTIC enterprise AI, software, data, and cloud engineering capabilities.',
  path: '/capabilities',
  noIndex: true,
});

export default function ServicesIndexPage() {
  permanentRedirect("/capabilities");
}
