import type { CSSProperties } from "react";
import Link from "next/link";
import { Activity, ArrowRight, Check, CloudCog, Code2, Cpu, Database, MonitorSmartphone, Network, RadioTower, ShieldCheck, Workflow } from "lucide-react";
import { BookingButton } from "../CalBooking";
import { FinalCTA } from "./FinalCTA";
import { FutureReveal } from "../future/FutureReveal";

export type ServiceDetailItem={title:string;desc:string;points?:readonly string[];learnMoreHref?:string;learnMoreLabel?:string};
export type ServiceDetailStep={title:string;tag?:string;desc:string;checks?:readonly string[];from?:string;fromSub?:string;to?:string};
export type ServiceDetailTech={category:string;items:readonly string[]};
export type ServiceDetailIndustry={name:string;detail:string};
export type ServiceDetailFaq={q:string;a:string};
type NodeLike={id:string;label:string;sub:string;x:number;y:number;dark?:boolean};
type EdgeLike={from:number;to:number};
type CodeLine={type:string;content:string};
export type ServiceDetailData={
  slug?:string;name:string;category:string;heroH1:string;heroSub:string;tagline?:string;
  services:readonly ServiceDetailItem[];steps?:readonly ServiceDetailStep[];techStack?:readonly ServiceDetailTech[];industries?:readonly ServiceDetailIndustry[];faqs?:readonly ServiceDetailFaq[];ctaH2?:string;ctaDesc?:string;
  wfNodes?:readonly NodeLike[];wfEdges?:readonly EdgeLike[];pipeNodes?:readonly NodeLike[];pipeEdges?:readonly EdgeLike[];diagramTitle?:string;codeLines?:readonly CodeLine[];codeLabel?:string;
};

type ServiceVisualFamily="orchestration"|"mlops"|"frontend"|"backend"|"data"|"cloud"|"security"|"edge";
function hash(value:string){return [...value].reduce((a,c)=>a+c.charCodeAt(0),0)}
function getVisualFamily(data:ServiceDetailData):ServiceVisualFamily{
  const slug=data.slug||"";
  if(slug==="edge-ai") return "edge";
  if(["frontend-development","mobile-development"].includes(slug)) return "frontend";
  if(["backend","saas-development","blockchain","erp"].includes(slug)) return "backend";
  if(["data","data-analysis"].includes(slug)) return "data";
  if(["cloud","devops-cloud"].includes(slug)) return "cloud";
  if(slug==="security") return "security";
  if(["ai-reliability","predictive-analytics","ai-deep-learning","computer-vision-nlp"].includes(slug)) return "mlops";
  return "orchestration";
}
const familyMeta:Record<ServiceVisualFamily,{label:string;sub:string;icon:typeof Cpu;signals:readonly string[]}> = {
  orchestration:{label:"RUNTIME ORCHESTRATION",sub:"DECIDE ‒ ACT → VERIFY",icon:Workflow,signals:["TOOLS","STATE","GUARDS"]},
  mlops:{label:"MODEL LIFECYCLE",sub:"EVAL ‒ RELEASE → OBSERVE",icon:Activity,signals:["EVAL","DRIFT","TRACE"]},
  frontend:{label:"INTERACTION SURFACE",sub:"COMPONENT → STATE → VIEW",icon:MonitorSmartphone,signals:["UI","STATE","A1LY"]},
  backend:{label:"REQUEST TOPOLOGY",sub:"EDGE → DOMAIN → DATA",icon:Network,signals:["API","QUEUE","CACHE"]},
  data:{label:"DATA PIPELINE",sub:"INGEST → MODEL → SERVE",icon:Database,signals:["RAW","MODEL","SERVE"]},
  cloud:{label:"CONTROL PLANE",sub:"BUILD → DEPLOY → OBSERVE",icon:CloudCog,signals:["REGION","RUNTIME","SLO"]},
  security:{label:"TRUST BOUNDARY",sub:"IDENTITY → POLICY → AUDIT",icon:ShieldCheck,signals:["IDENTITY","POLICY","AUDIT"]},
  edge:{label:"EDGE FLEET",sub:"DEVICE → INFER → SYNC",icon:RadioTower,signals:["FLEET","LOCAL","SYNC"]},
};
function FamilyHud({family}:{family:ServiceVisualFamily}){
  const meta=familyMeta[family],Icon=meta.icon;
  return <div className="fp-service-family-hud" aria-hidden="true"><div><Icon size={17}/><span><b>{meta.label}</b><small>{meta.sub}</small></span></div><div>{meta.signals.map((x,i)=><span key={x}><i/>{String(i+1).padStart(2,"0")} {x}</span>)}</div></div>
}
function Visual({data,family}:{data:ServiceDetailData;family:ServiceVisualFamily}){
  const nodes=data.wfNodes||data.pipeNodes; const edges=data.wfEdges||data.pipeEdges;
  if(data.codeLines?.length){return <div className={`fp-service-code fp-service-visual-${family}`}><FamilyHud family={family}/><div className="fp-code-head"><span/><span/><span/><b>{data.codeLabel||"system.ts"}</b></div><pre>{data.codeLines.slice(0,18).map((line,i)=><code key={i} className={`code-${line.type}`}>{line.content||" "}{"\n"}</code>)}</pre><div className="fp-code-status"><i/>BUILD / READY</div></div>}
  if(nodes?.length){return <div className={`fp-service-graph fp-service-visual-${family}`} aria-label={data.diagramTitle||`${data.name} architecture`}><FamilyHud family={family}/><svg viewBox="0 0 900 440" role="img">{edges?.map((e,i)=>{const a=nodes[e.from],b=nodes[e.to];return a&&b?<line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}/>:null})}{nodes.slice(0,10).map((n)=><g key={n.id} transform={`translate(${n.x},${n.y})`}><circle r={n.dark?26:19}/><text y={n.dark?48:39} textAnchor="middle">{n.label}</text><text y={n.dark?64:54} textAnchor="middle" className="sub">{n.sub}</text></g>)}</svg><div className="fp-graph-pulse"><Cpu size={20}/><span>{familyMeta[family].label}</span></div></div>}
  const meta=familyMeta[family],Icon=meta.icon;
  return <div className={`fp-service-constellation fp-service-visual-${family}`}><FamilyHud family={family}/><span className="ring r1"/><span className="ring r2"/><div className="core"><Icon size={32}/><b>{data.name}</b><small>{meta.label}</small></div>{[...meta.signals,"OUTPUT"].map((x,i)=><span className={`n n${i+1}`} key={x}>{x}</span>)}</div>
}

export function ServiceDetailPage({data}:{data:ServiceDetailData}){
  const services=data.services.slice(0,6),steps=data.steps?.slice(0,6)||[],tech=data.techStack?.slice(0,6)||[],industries=data.industries?.slice(0,4)||[],faqs=data.faqs?.slice(0,6)||[];
  const category=data.category.toLowerCase(); const mode=category.includes("data")||category.includes("cloud")?"data":category.includes("engineering")||category.includes("product")?"product":"ai";
  const family=getVisualFamily(data);
  const layout=(hash(data.slug||data.name)%3)+1;
  const style={"--service-accent":mode==="data"?"#16d9d4":mode==="product"?"#4b7cff":"#8b6cff"} as CSSProperties;
  const ModeIcon=mode==="data"?Database:mode==="product"?Code2:Workflow;
  return <main id="main-content" className={`fp-service fp-service-${mode} fp-service-layout-${layout}`} style={style}>
    <section className="fp-service-hero"><div className="container-shell fp-service-hero-grid"><div><span className="future-kicker">{data.category.toUpperCase()} / SYSTEM NODE</span><span className="eyebrow">{data.name}</span><h1>{data.heroH1}</h1><p>{data.heroSub}</p><div className="page-hero-actions"><BookingButton>Book a Technical Call <ArrowRight size={16}/></BookingButton><Link href="/case-studies" className="button button-secondary-dark">Delivery evidence <ArrowRight size={15}/></Link></div><div className="fp-service-note"><ShieldCheck size={17}/><span>Ownership, deployment boundary, acceptance criteria, and handover are defined per engagement.</span></div></div><Visual data={data} family={family}/></div></section>
    <section className="fp-service-scope"><div className="container-shell"><div className="fp-service-section-head"><span className="eyebrow">WHAT WE BUILD</span><h2>{data.name}, engineered as an operating system.</h2><p>Scope follows the real workflow, environment, failure modes, and ownership model rather than a fixed vendor package.</p></div><div className="fp-service-module-grid">{services.map((item,i)=><FutureReveal key={item.title} delay={(i%3)*.05}><article><span>0{i+1}</span><ModeIcon size={19}/><h3>{item.title}</h3><p>{item.desc}</p>{item.points?.length?<ul>{item.points.slice(0,3).map(x=><li key={x}><Check size={13}/>{x}</li>)}</ul>:null}{item.learnMoreHref?<Link href={item.learnMoreHref}>{item.learnMoreLabel||"Learn more"}<ArrowRight size={13}/></Link>:null}</article></FutureReveal>)}</div></div></section>
    {steps.length?<section className="fp-service-delivery"><div className="container-shell"><div className="fp-service-section-head"><span className="eyebrow">DELIVERY SEQUENCE</span><h2>From unknowns to production evidence.</h2></div><div className="fp-service-timeline">{steps.map((step,i)=><div key={`${step.tag}-${step.title}`}><span>{step.tag||String(i+1).padStart(2,"0")}</span><div><h3>{step.title}</h3><p>{step.desc}</p>{step.from&&step.to?<small>{step.from} <ArrowRight size={12}/> {step.to}</small>:null}</div><i/></div>)}</div></div></section>:null}
    {tech.length?<section className="fp-service-stack"><div className="container-shell fp-service-stack-grid"><div><span className="eyebrow">TECHNOLOGY SURFACE</span><h2>Tools selected for the system, not the trend.</h2><p>Technology follows environment, operating constraints, team ownership, and long-term maintainability.</p></div><div className="fp-stack-console">{tech.map((g,i)=><div key={g.category}><span>0{i+1}</span><b>{g.category}</b><p>{g.items.slice(0,8).join(" · ")}</p></div>)}</div></div></section>:null}
    {industries.length?<section className="fp-service-context"><div className="container-shell"><div className="fp-service-section-head"><span className="eyebrow">WHERE IT FITS</span><h2>The same capability changes by domain.</h2></div><div className="fp-service-context-grid">{industries.map((x,i)=><article key={x.name}><span>{String(i+1).padStart(2,"0")}</span><h3>{x.name}</h3><p>{x.detail}</p></article>)}</div></div></section>:null}
    {faqs.length?<section className="fp-service-faq"><div className="container-shell fp-service-faq-grid"><div><span className="eyebrow">TECHNICAL FAQ</span><h2>Questions worth resolving before delivery.</h2></div><div>{faqs.map((x,i)=><details key={x.q} open={i===0}><summary><span>0{i+1}</span>{x.q}<b>+</b></summary><p>{x.a}</p></details>)}</div></div></section>:null}
    <FinalCTA title={data.ctaH2||`Need ${data.name}?`} body={data.ctaDesc||"Share the problem, current environment, constraints, and desired outcome. We will map the technical path around the system you need to own."}/>
  </main>
}
