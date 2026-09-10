import type { Metadata } from "next";
import { CAPABILITY_PILLARS } from "../../_data/capability-pillars";
import { CapabilityPillarPage } from "../../components/marketing/CapabilityPillarPage";

export const metadata: Metadata = { title: "Product Engineering", description: "SaaS, web, mobile, backend, API, enterprise software, and platform integration engineering by OSYSTIC.", alternates: { canonical: "/capabilities/product-engineering" } };
export default function ProductEngineeringPage(){ return <CapabilityPillarPage pillar={CAPABILITY_PILLARS["product-engineering"]} />; }
