import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Braces, CloudCog, Database, ShieldCheck, Workflow } from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { capabilityGroups } from "../config/site";
import { FutureReveal } from "../components/future/FutureReveal";

export const metadata = createSeoMetadata({
  title: "Enterprise AI & Software Engineering Capabilities",
  description: "Explore OSYSTIC capabilities across enterprise AI systems, agentic AI, product engineering, data engineering, cloud, MLOps, LLMOps, and platform delivery.",
  path: "/capabilities",
  keywords: ["enterprise AI capabilities","agentic AI engineering","product engineering","data engineering","cloud engineering"],
});

const pillars = [
  { Icon: BrainCircuit, eyebrow:"01 / AI SYSTEMS", signal:"REASON · RETRIEVE · ACT", accent:"violet", code:"INTELLIGENCE" },
  { Icon: Braces, eyebrow:"02 / PRODUCT ENGINEERING", signal:"INTERFACE · API · DOMAIN", accent:"blue", code:"EXPERIENCE" },
  { Icon: Database, eyebrow:"03 / DATA & CLOUD", signal:"INGEST · MODEL · OPERATE", accent:"cyan", code:"FOUNDATION" },
] as const;

export default function CapabilitiesPage(){
  return <main id="main-content" className="fp-capabilities">
    <section className="fp-cap-hero">
      <div className="container-shell fp-cap-hero-grid">
        <div>
          <span className="future-kicker">CAPABILITY SYSTEM / 001</span>
          <span className="eyebrow">CAPABILITIES</span>
          <h1>Three engineering layers. <span>One production system.</span></h1>
          <p>OSYSTIC connects AI, product, data, and cloud engineering around a single production outcome. Each layer has a distinct role, interface, and operating contract.</p>
          <div className="page-hero-actions">
            <BookingButton>Book a Technical Call <ArrowRight size={16}/></BookingButton>
            <Link href="/case-studies" className="button button-secondary-dark">See delivery evidence <ArrowRight size={16}/></Link>
          </div>
        </div>

        <div className="fp-cap-matrix" aria-label="OSYSTIC engineering system layers">
          <div className="fp-cap-matrix-head"><span>OSYSTIC / SYSTEM MAP</span><b>3 ACTIVE LAYERS</b></div>
          {capabilityGroups.map((group,index)=>{
            const meta=pillars[index];
            const Icon=meta.Icon;
            return <Link href={group.href} className={`fp-cap-matrix-row ${meta.accent}`} key={group.title}>
              <span className="fp-cap-matrix-index">0{index+1}</span>
              <span className="fp-cap-matrix-icon"><Icon size={18}/></span>
              <span className="fp-cap-matrix-copy"><small>{meta.code}</small><strong>{group.title}</strong><em>{meta.signal}</em></span>
              <span className="fp-cap-matrix-state"><i/><i/><i/><b>CONNECTED</b></span>
              <ArrowRight size={15}/>
            </Link>;
          })}
          <div className="fp-cap-matrix-foot"><ShieldCheck size={14}/><span>CONTROL BOUNDARIES SHARED ACROSS ALL LAYERS</span></div>
        </div>
      </div>
    </section>

    <section className="fp-cap-atlas-section">
      <div className="container-shell">
        <div className="fp-cap-section-head">
          <span className="eyebrow">SYSTEM LAYERS</span>
          <h2>Each layer has a different job.</h2>
          <p>The capability model below separates responsibilities clearly, while preserving the interfaces that matter across the whole system.</p>
        </div>

        <div className="fp-cap-pillars">
          {capabilityGroups.map((group,index)=>{
            const meta=pillars[index]; const Icon=meta.Icon;
            return <FutureReveal key={group.title} delay={index*.08} className={`fp-cap-pillar ${meta.accent}`}>
              <div className="fp-cap-pillar-top"><span>{meta.eyebrow}</span><Icon size={23}/></div>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
              <div className="fp-cap-signal">{meta.signal}</div>
              <div className="fp-cap-service-list">
                {group.items.map(([label,href],j)=><Link href={href} key={`${label}-${j}`}><span>{String(j+1).padStart(2,"0")}</span><b>{label}</b><ArrowRight size={14}/></Link>)}
              </div>
              <Link className="future-inline-link" href={group.href}>Open {group.title} <ArrowRight size={15}/></Link>
            </FutureReveal>;
          })}
        </div>
      </div>
    </section>

    <section className="fp-cap-dependency">
      <div className="container-shell fp-cap-dependency-grid">
        <div>
          <span className="eyebrow">CROSS-LAYER DELIVERY</span>
          <h2>Interfaces are where delivery succeeds or fails.</h2>
          <p>Models need reliable data. Products need observable APIs. Platforms need security boundaries. We make those dependencies explicit before implementation locks them in.</p>
        </div>
        <div className="fp-dependency-map">
          <div><BrainCircuit size={18}/><span>AI SYSTEMS</span></div><i/>
          <div><Workflow size={18}/><span>PRODUCT</span></div><i/>
          <div><CloudCog size={18}/><span>PLATFORM</span></div><i/>
          <div><ShieldCheck size={18}/><span>CONTROL</span></div>
        </div>
      </div>
    </section>

    <FinalCTA title="Need more than one capability?" body="Most production systems do. Bring the problem and constraints; we will map the engineering layers around the outcome."/>
  </main>;
}
