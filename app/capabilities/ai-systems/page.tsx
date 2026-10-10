import { createSeoMetadata } from "@/lib/seo";
import { CAPABILITY_PILLARS } from "../../_data/capability-pillars";
import { CapabilityPillarPage } from "../../components/marketing/CapabilityPillarPage";

export const metadata = createSeoMetadata({
  title: 'Enterprise AI Systems Engineering',
  description: 'Production AI agents, enterprise RAG, LLM reliability, machine learning, computer vision, predictive AI, and edge AI engineering by OSYSTIC.',
  path: '/capabilities/ai-systems',
  keywords: ['enterprise AI systems','AI agents','enterprise RAG','LLMOps','computer vision engineering'],
});
export default function AISystemsPage(){ return <CapabilityPillarPage pillar={CAPABILITY_PILLARS["ai-systems"]} />; }
