import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Insights',
  description: 'OSYSTIC engineering insights on enterprise AI and software systems.',
  path: '/insights',
  noIndex: true,
});

export default function BlogsIndexPage() { permanentRedirect("/insights"); }
