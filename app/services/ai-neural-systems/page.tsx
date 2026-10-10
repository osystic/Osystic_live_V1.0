import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'AI & Machine Learning Engineering',
  description: 'Explore OSYSTIC AI and machine learning engineering.',
  path: '/services/ai-deep-learning',
  noIndex: true,
});

export default function AINeuralLegacyPage(){ permanentRedirect("/services/ai-deep-learning"); }
