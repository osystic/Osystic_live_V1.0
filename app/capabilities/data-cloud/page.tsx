import type { Metadata } from "next";
import { CAPABILITY_PILLARS } from "../../_data/capability-pillars";
import { CapabilityPillarPage } from "../../components/marketing/CapabilityPillarPage";

export const metadata: Metadata = { title: "Data & Cloud", description: "Data engineering, analytics, cloud, platform engineering, DevOps, and operational infrastructure by OSYSTIC.", alternates: { canonical: "/capabilities/data-cloud" } };
export default function DataCloudPage(){ return <CapabilityPillarPage pillar={CAPABILITY_PILLARS["data-cloud"]} />; }
