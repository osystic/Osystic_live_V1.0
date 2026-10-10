import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationId } from "@/lib/structured-data";
import { StructuredData } from "@/app/components/seo/StructuredData";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Database, Gauge, Network, ShieldAlert, Workflow } from "lucide-react";
import { ALL_SLUGS, getIndustry } from "../../_data/industries-data";
import { BookingButton } from "../../components/CalBooking";
import { FinalCTA } from "../../components/marketing/FinalCTA";
import { FutureReveal } from "../../components/future/FutureReveal";

export function generateStaticParams(){return ALL_SLUGS.map(slug=>({slug}))}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return createSeoMetadata({ title: "Industry not found", description: "The requested OSYSTIC industry page could not be found.", path: "/industries", noIndex: true });
  return createSeoMetadata({
    title: `${industry.name} AI & Software Engineering`,
    description: industry.description,
    path: `/industries/${industry.slug}`,
    keywords: [`${industry.name} AI`, `${industry.name} software engineering`, `${industry.name} machine learning`, "enterprise AI engineering"],
  });
}
export default async function IndustryPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const industry=getIndustry(slug);if(!industry)notFound();const style={"--industry-accent":industry.accent} as CSSProperties;
const structuredData=[
  {"@context":"https://schema.org","@type":"Service",name:`${industry.name} AI & Software Engineering`,description:industry.description,url:`https://www.osystic.com/industries/${industry.slug}`,provider:{"@id":organizationId},areaServed:{"@type":"Place",name:"Worldwide"}},
  breadcrumbSchema([{name:"Home",path:"/"},{name:"Industries",path:"/industries"},{name:industry.name,path:`/industries/${industry.slug}`}]),
];
return <><StructuredData data={structuredData}/><main id="main-content" className={`fp-industry-detail fp-industry-${industry.slug}`} style={style}>
  <section className="fp-industry-detail-hero"><div className="container-shell fp-industry-detail-grid"><div><span className="future-kicker">INDUSTRY / {industry.name.toUpperCase()}</span><span className="eyebrow">OPERATING CONTEXT</span><h1>{industry.tagline}</h1><p>{industry.description}</p><div className="page-hero-actions"><BookingButton>Discuss your use case <ArrowRight size={16}/></BookingButton><Link href="/capabilities" className="button button-secondary-dark">Explore capabilities <ArrowRight size={16}/></Link></div></div><div className="fp-sector-console"><div className="fp-sector-head"><span>{industry.name}</span><b>CONTEXT MODEL</b></div><div className="fp-sector-core"><span className="ring r1"/><span className="ring r2"/><div><Gauge size={28}/><strong>OPERATING</strong><small>CONSTRAINTS</small></div></div><div className="fp-sector-signals"><span><Database size={15}/>DATA</span><span><ShieldAlert size={15}/>RISK</span><span><Workflow size={15}/>WORKFLOW</span><span><Network size={15}/>INTEGRATION</span></div></div></div></section>
  <section className="fp-sector-challenges"><div className="container-shell"><div className="fp-sector-section-head"><span className="eyebrow">CONSTRAINT MAP</span><h2>What changes in {industry.name.toLowerCase()}.</h2><p>{industry.heroDesc}</p></div><div className="fp-sector-challenge-grid">{industry.challenges.map((item,i)=><FutureReveal key={item.title} delay={i*.07}><article><span>0{i+1}</span><h3>{item.title}</h3><p>{item.desc}</p><div className="constraint-line"><i/><b>ARCHITECTURE INPUT</b></div></article></FutureReveal>)}</div></div></section>
  <section className="fp-sector-solutions"><div className="container-shell"><div className="fp-sector-section-head"><span className="eyebrow">SYSTEM PATTERNS</span><h2>Engineering around the workflow.</h2><p>These are capability patterns, not guaranteed outcomes. Exact design depends on the client’s data, infrastructure, risk profile, and validation requirements.</p></div><div className="fp-sector-solution-rail">{industry.solutions.map((item,i)=><div key={item.title}><span>{String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.desc}</p></div>)}</div></div></section>
  <section className="fp-sector-related"><div className="container-shell"><span className="eyebrow">ADJACENT CONTEXTS</span><div>{industry.relatedSlugs.map(s=>{const i=getIndustry(s);return i?<Link href={`/industries/${s}`} key={s}>{i.name}<ArrowRight size={14}/></Link>:null})}</div></div></section>
  <FinalCTA title={`Building for ${industry.name.toLowerCase()}?`} body="Bring the real workflow, data boundary, infrastructure, and risk constraints. We will map the engineering path around them."/>
</main></>}
