import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Predictive Analytics Engineering',
  description: 'Explore OSYSTIC predictive analytics engineering.',
  path: '/services/predictive-analytics',
  noIndex: true,
});

export default function AnalyticsLegacyPage(){ permanentRedirect("/services/predictive-analytics"); }
