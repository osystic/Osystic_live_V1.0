import { createSeoMetadata } from "@/lib/seo";
import { CAPABILITY_PILLARS } from "../../_data/capability-pillars";
import { CapabilityPillarPage } from "../../components/marketing/CapabilityPillarPage";

export const metadata = createSeoMetadata({
  title: 'Product & Software Engineering',
  description: 'Enterprise SaaS, web applications, mobile products, backend systems, APIs, modernization, and platform integration engineering by OSYSTIC.',
  path: '/capabilities/product-engineering',
  keywords: ['product engineering','custom software development','SaaS development','backend API engineering','enterprise software'],
});
export default function ProductEngineeringPage(){ return <CapabilityPillarPage pillar={CAPABILITY_PILLARS["product-engineering"]} />; }
