import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Computer Vision & NLP Engineering',
  description: 'Explore OSYSTIC computer vision and NLP engineering.',
  path: '/services/computer-vision-nlp',
  noIndex: true,
});

export default function ComputerVisionLegacyPage(){ permanentRedirect("/services/computer-vision-nlp"); }
