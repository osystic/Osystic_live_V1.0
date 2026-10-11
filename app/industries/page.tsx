import { createSeoMetadata } from "@/lib/seo";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Radar, ShieldAlert, Timer, Database, Workflow } from "lucide-react";
import { INDUSTRIES } from "../_data/industries-data";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { FutureReveal } from "../components/future/FutureReveal";

export const metadata = createSeoMetadata({
  title: 'Enterprise AI Engineering by Industry',
  description: 'Explore OSYSTIC engineering across 12 enterprise operating environments, including finance, healthcare, energy, aerospace, automotive, insurance, manufacturing, logistics, telecom, retail, education, and technology.',
  path: '/industries',
  keywords: ['AI engineering by industry','enterprise AI solutions','industry software engineering'],
});

const factors=[[ShieldAlert,"RISK"],[Timer,"LATENCY"],[Database,"DATA"],[Workflow,"WORKFLOW"]] as const;
export default function IndustriesPage(){return <main id="main-content" className="fp-industries">
  <section className="fp-industries-hero"><div className="container-shell fp-industries-hero-grid"><div><span className="future-kicker">INDUSTRY INTELLIGENCE / RADAR</span><span className="eyebrow">INDUSTRIES</span><h1>Context is not a vertical label. <span>It changes the system.</span></h1><p>Data sensitivity, failure cost, response time, auditability, and workflow ownership alter engineering decisions. We start with the operating environment before selecting the architecture.</p></div><div className="fp-industry-radar"><span className="ring r1"/><span className="ring r2"/><span className="ring r3"/><span className="sweep"/><div className="core"><Radar size={28}/><b>CONTEXT</b></div>{factors.map(([Icon,label],i)=><div className={`factor f${i+1}`} key={label}><Icon size={16}/><span>{label}</span></div>)}</div></div></section>
  <section className="fp-industry-grid-section"><div className="container-shell"><div className="fp-industry-grid-head"><span className="eyebrow">OPERATING ENVIRONMENTS</span><h2>{INDUSTRIES.length} contexts. Different constraints.</h2></div><div className="fp-industry-matrix">{INDUSTRIES.map((industry,i)=><FutureReveal key={industry.slug} delay={(i%4)*.04}><Link href={industry.href} className="fp-industry-cell" style={{"--industry-accent":industry.accent} as CSSProperties}><div><span>{String(i+1).padStart(2,"0")}</span><b>{industry.name}</b></div><h3>{industry.tagline}</h3><p>{industry.description}</p><div className="fp-industry-signals"><span>DATA</span><i/><span>RISK</span><i/><span>OPS</span></div><span className="future-inline-link">Open environment <ArrowRight size={14}/></span></Link></FutureReveal>)}</div></div></section>
  <FinalCTA title="Have industry-specific constraints?" body="Share the workflow, data boundaries, regulatory context, infrastructure, and operating conditions. The system should be designed around them from the start."/>
</main>}
