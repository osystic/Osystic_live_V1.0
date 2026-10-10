import Link from "next/link";
import { ArrowRight, BrainCircuit, Braces, CheckCircle2, CloudCog, Database, GitBranch, Layers3, Network, ShieldCheck, TerminalSquare, Waypoints } from "lucide-react";
import type { CapabilityPillar } from "../../_data/capability-pillars";
import { BookingButton } from "../CalBooking";
import { FinalCTA } from "./FinalCTA";
import { FutureReveal } from "../future/FutureReveal";

function Actions(){return <div className="page-hero-actions"><BookingButton>Book a Technical Call <ArrowRight size={16}/></BookingButton><Link className="button button-secondary-dark" href="/case-studies">Explore Our Work <ArrowRight size={15}/></Link></div>}

function AISystems({pillar}:{pillar:CapabilityPillar}){return <>
  <section className="fp-pillar-hero fp-ai-pillar"><div className="container-shell fp-pillar-hero-grid"><div><span className="future-kicker">CAPABILITY / AI SYSTEMS</span><span className="eyebrow">{pillar.eyebrow}</span><h1>{pillar.title}</h1><p>{pillar.intro}</p><Actions/></div><div className="fp-ai-mesh"><span className="mesh-ring r1"/><span className="mesh-ring r2"/><div className="mesh-core"><BrainCircuit size={36}/><b>REASONING CORE</b><small>GROUND · ACT · EVALUATE</small></div>{["RETRIEVAL","TOOLS","GUARDRAILS","EVALS","MEMORY","OBSERVE"].map((x,i)=><span className={`mesh-node n${i+1}`} key={x}>{x}</span>)}</div></div></section>
  <section className="fp-ai-capabilities"><div className="container-shell"><div className="fp-pillar-title"><span className="eyebrow">AI SYSTEM SURFACE</span><h2>Model behavior is only one layer.</h2><p>Production AI connects retrieval, tools, permissions, validation, deployment, and human review around a real workflow.</p></div><div className="fp-ai-service-grid">{pillar.capabilities.map((item,i)=><FutureReveal key={item.title} delay={(i%3)*.06}><Link href={item.href}><span>0{i+1}</span><BrainCircuit size={18}/><h3>{item.title}</h3><p>{item.body}</p><b>OPEN NODE <ArrowRight size={13}/></b></Link></FutureReveal>)}</div></div></section>
  <section className="fp-ai-validation"><div className="container-shell fp-ai-validation-grid"><div><span className="eyebrow">VALIDATION LOOP</span><h2>Define → evaluate → observe → improve.</h2></div><div className="fp-validation-loop">{pillar.approach.map((item,i)=><div key={item.title}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></div></section>
</>}

function ProductEngineering({pillar}:{pillar:CapabilityPillar}){return <>
  <section className="fp-pillar-hero fp-product-pillar"><div className="container-shell fp-pillar-hero-grid"><div><span className="future-kicker">CAPABILITY / PRODUCT ENGINEERING</span><span className="eyebrow">{pillar.eyebrow}</span><h1>{pillar.title}</h1><p>{pillar.intro}</p><Actions/></div><div className="fp-product-stack"><div className="stack-layer l1"><span>INTERFACE</span><Braces size={20}/></div><div className="stack-layer l2"><span>APPLICATION</span><Layers3 size={20}/></div><div className="stack-layer l3"><span>APIs / DOMAIN</span><GitBranch size={20}/></div><div className="stack-layer l4"><span>DATA / INTEGRATIONS</span><Database size={20}/></div><div className="stack-layer l5"><span>DEPLOYMENT</span><CloudCog size={20}/></div></div></div></section>
  <section className="fp-product-blueprint"><div className="container-shell"><div className="fp-pillar-title"><span className="eyebrow">PRODUCT BLUEPRINT</span><h2>From interface to production boundary.</h2></div><div className="fp-blueprint-grid">{pillar.capabilities.map((item,i)=><FutureReveal key={item.title} delay={(i%2)*.07} className={`fp-blueprint-card c${i+1}`}><span>MODULE / 0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p><Link href={item.href}>Inspect module <ArrowRight size={14}/></Link></FutureReveal>)}</div></div></section>
  <section className="fp-product-release"><div className="container-shell"><div><span className="eyebrow">RELEASE PATH</span><h2>Architecture → build → release → ownership.</h2></div><div className="fp-release-terminal">{pillar.approach.map((item,i)=><div key={item.title}><TerminalSquare size={17}/><span>0{i+1}</span><b>{item.title}</b><p>{item.body}</p></div>)}</div></div></section>
</>}

function DataCloud({pillar}:{pillar:CapabilityPillar}){return <>
  <section className="fp-pillar-hero fp-data-pillar"><div className="container-shell fp-pillar-hero-grid"><div><span className="future-kicker">CAPABILITY / DATA & CLOUD</span><span className="eyebrow">{pillar.eyebrow}</span><h1>{pillar.title}</h1><p>{pillar.intro}</p><Actions/></div><div className="fp-data-pipeline"><div className="pipe p1"><Database size={19}/><span>SOURCES</span></div><i/><div className="pipe p2"><Waypoints size={19}/><span>PIPELINES</span></div><i/><div className="pipe p3"><Layers3 size={19}/><span>PLATFORM</span></div><i/><div className="pipe p4"><Network size={19}/><span>CONSUMERS</span></div><span className="fp-data-stream"/></div></div></section>
  <section className="fp-data-topology"><div className="container-shell"><div className="fp-pillar-title"><span className="eyebrow">PLATFORM TOPOLOGY</span><h2>Observable foundations for every workload above them.</h2></div><div className="fp-data-service-list">{pillar.capabilities.map((item,i)=><FutureReveal key={item.title} delay={i*.04}><Link href={item.href}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><ArrowRight size={16}/></Link></FutureReveal>)}</div></div></section>
  <section className="fp-data-operations"><div className="container-shell fp-data-operations-grid"><div><span className="eyebrow">OPERATING LOOP</span><h2>Evidence instead of infrastructure guesswork.</h2></div><div>{pillar.approach.map((item,i)=><article key={item.title}><span>0{i+1}</span><CloudCog size={19}/><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></div></section>
</>}

export function CapabilityPillarPage({pillar}:{pillar:CapabilityPillar}){
  return <main id="main-content" className={`fp-pillar fp-pillar-${pillar.slug}`}>
    {pillar.slug==="ai-systems"?<AISystems pillar={pillar}/>:pillar.slug==="product-engineering"?<ProductEngineering pillar={pillar}/>:<DataCloud pillar={pillar}/>} 
    <section className="fp-pillar-outcomes"><div className="container-shell"><span className="eyebrow">OUTCOME SURFACE</span><div>{pillar.outcomes.map(x=><span key={x}><CheckCircle2 size={16}/>{x}</span>)}</div><div className="fp-pillar-related">{pillar.related.map(x=><Link href={x.href} key={x.href}>{x.label}<ArrowRight size={14}/></Link>)}</div></div></section>
    <FinalCTA />
  </main>
}
