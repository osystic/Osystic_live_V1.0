import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'SaaS Product Engineering',
  description: 'Explore OSYSTIC SaaS product engineering capabilities.',
  path: '/services/engineering/saas-development',
  noIndex: true,
});

export default function SaaSPage(){ permanentRedirect("/services/engineering/saas-development"); }
