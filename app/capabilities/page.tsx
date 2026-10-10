import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Braces, CloudCog, Cpu, Database, Network, ShieldCheck, Workflow } from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { capabilityGroups } from "../config/site";
import { FutureReveal } from "../components/future/FutureReveal";

export const metadata = createSeoMetadata({
  title: 'Enterprise AI & Software Engineering Capabilities',
  description: 'Explore OSYSTIC capabilities across enterprise AI systems, agentic AI, product engineering, data engineering, cloud, MLOps, LLMOps, and platform delivery.',
  path: '/capabilities',
  keywords: ['enterprise AI capabilities','agentic AI engineering','product engineering','data engineering','cloud engineering'],
});

const pillars = [
  { key:"ai", Icon:BrainCircuit, eyebrow:"01 / AI SYSTEMS", signal:"REASON · RETRIEVE · ACT", accent:"violet" },
  { key:"product", Icon:Braces, eyebrow:"02 / PRODUCT ENGINEERING", signal:"INTERFACE · API · DOMAIN", accent:"blue" },
  { key:"data", Icon:Database, eyebrow:"03 / DATA & CLOUD", signal:"INGEST · MODEL · OPERATE", accent:"cyan" },
] as const;

export default function CapabilitiesPage(){
  return <main id="main-content" className="fp-capabilities">
    <section className="fp-cap-hero">
      <div className="container-shell fp-cap-hero-grid">
        <div><span className="future-kicker">CAPABILITY ATLAS / 001</span><span className="eyebrow">CAPABILITIES</span><h1>One engineering system. <span>Three operating layers.</span></h1><p>OSYSTIC combines AI, product, data, and cloud engineering around the system that must ship. The architecture is composed across layers instead of sold as disconnected services.</p><div className="page-hero-actions"><BookingButton>Book a Technical Call <ArrowRight size={16}/></BookingButton><Link href="/case-studies" className="button button-secondary-dark">See delivery evidence <ArrowRight size={16}/></Link></div></div>
        <div className="fp-cap-atlas" aria-label="OSYSTIC capability architecture"><div className="fp-cap-atlas-core"><Cpu size={30}/><strong>OSYSTIC</strong><small>ENGINEERING SYSTEM</small></div><span className="fp-cap-orbit o1"/><span className="fp-cap-orbit o2"/><span className="fp-cap-orbit o3"/>{pillars.map(({Icon,eyebrow},i)=><div key={eyebrow} className={`fp-cap-node n${i+1}`}><Icon size={18}/><span>{eyebrow.split(" / ")[1]}</span></div>)}</div>
      </div>
    </section>

    <section className="fp-cap-atlas-section"><div className="container-shell"><div className="fp-cap-section-head"><span className="eyebrow">SYSTEM LAYERS</span><h2>Choose the layer. Follow the dependencies.</h2><p>Every layer has its own delivery surface, but production systems cross boundaries. The atlas below shows the interfaces between them.</p></div>
      <div className="fp-cap-pillars">{capabilityGroups.map((group,index)=>{ const meta=pillars[index]; const Icon=meta.Icon; return <FutureReveal key={group.title} delay={index*.08} className={`fp-cap-pillar ${meta.accent}`}><div className="fp-cap-pillar-top"><span>{meta.eyebrow}</span><Icon size={24}/></div><h2>{group.title}</h2><p>{group.description}</p><div className="fp-cap-signal">{meta.signal}</div><div className="fp-cap-service-list">{group.items.map(([label,href],j)=><Link href={href} key={`${label}-${j}`}><span>{String(j+1).padStart(2,"0")}</span><b>{label}</b><ArrowRight size={14}/></Link>)}</div><Link className="future-inline-link" href={group.href}>Open {group.title} architecture <ArrowRight size={15}/></Link></FutureReveal>; })}</div>
    </div></section>

    <section className="fp-cap-dependency"><div className="container-shell fp-cap-dependency-grid"><div><span className="eyebrow">CROSS-LAYER DELIVERY</span><h2>Architecture is the contract between capabilities.</h2><p>Models need reliable data. Products need observable APIs. Cloud platforms need security boundaries. Delivery works when those dependencies are explicit from the start.</p></div><div className="fp-dependency-map"><div><BrainCircuit size={18}/><span>AI SYSTEMS</span></div><i/><div><Workflow size={18}/><span>PRODUCT</span></div><i/><div><CloudCog size={18}/><span>PLATFORM</span></div><i/><div><ShieldCheck size={18}/><span>CONTROL</span></div><i/><div><Network size={18}/><span>OPERATE</span></div></div></div></section>
    <FinalCTA title="Need more than one capability?" body="Most production systems do. Bring the problem and constraints; we will map the engineering layers around the outcome." />
  </main>;
}
