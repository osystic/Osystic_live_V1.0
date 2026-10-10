import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Enterprise AI Systems Engineering',
  description: 'Explore OSYSTIC enterprise AI systems engineering.',
  path: '/capabilities/ai-systems',
  noIndex: true,
});

export default function AISolutionsLegacyPage(){ permanentRedirect("/capabilities#ai-systems"); }
