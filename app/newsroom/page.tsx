import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Insights',
  description: 'OSYSTIC engineering insights and company updates.',
  path: '/insights',
  noIndex: true,
});

export default function NewsroomIndexPage() { permanentRedirect("/insights"); }
