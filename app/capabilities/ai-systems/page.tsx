import type { Metadata } from "next";
import { CAPABILITY_PILLARS } from "../../_data/capability-pillars";
import { CapabilityPillarPage } from "../../components/marketing/CapabilityPillarPage";

export const metadata: Metadata = { title: "AI Systems", description: "Production AI systems, agents, enterprise RAG, AI reliability, machine learning, computer vision, and edge AI engineering by OSYSTIC.", alternates: { canonical: "/capabilities/ai-systems" } };
export default function AISystemsPage(){ return <CapabilityPillarPage pillar={CAPABILITY_PILLARS["ai-systems"]} />; }
