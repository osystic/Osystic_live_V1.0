import { createSeoMetadata } from "@/lib/seo";
import { CAPABILITY_PILLARS } from "../../_data/capability-pillars";
import { CapabilityPillarPage } from "../../components/marketing/CapabilityPillarPage";

export const metadata = createSeoMetadata({
  title: 'Data, Cloud & Platform Engineering',
  description: 'Data engineering, analytics, cloud infrastructure, platform engineering, DevOps, MLOps, and operational infrastructure designed for enterprise scale.',
  path: '/capabilities/data-cloud',
  keywords: ['data engineering','cloud engineering','platform engineering','DevOps services','MLOps'],
});
export default function DataCloudPage(){ return <CapabilityPillarPage pillar={CAPABILITY_PILLARS["data-cloud"]} />; }
