import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Intelligent Automation Engineering',
  description: 'Explore OSYSTIC intelligent automation engineering.',
  path: '/services/intelligent-automation',
  noIndex: true,
});

export default function AutomationLegacyPage(){ permanentRedirect("/services/intelligent-automation"); }
