import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Web Application Engineering',
  description: 'Explore OSYSTIC frontend and web application engineering.',
  path: '/services/engineering/frontend-development',
  noIndex: true,
});

export default function WebDevelopmentLegacyPage(){ permanentRedirect("/services/engineering/frontend-development"); }
