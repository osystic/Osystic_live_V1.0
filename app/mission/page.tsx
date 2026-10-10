import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'About',
  description: 'Learn about OSYSTIC mission, vision, and engineering standards.',
  path: '/about',
  noIndex: true,
});

export default function MissionPage(){ permanentRedirect("/about"); }
