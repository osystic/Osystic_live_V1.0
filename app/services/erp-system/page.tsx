import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'ERP & Enterprise Systems Engineering',
  description: 'Explore OSYSTIC ERP and enterprise systems engineering.',
  path: '/services/data-cloud/erp',
  noIndex: true,
});

export default function ERPLegacyPage(){ permanentRedirect("/services/data-cloud/erp"); }
