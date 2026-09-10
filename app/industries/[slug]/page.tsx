import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ALL_SLUGS, getIndustry } from "../../_data/industries-data";
import { BookingButton } from "../../components/CalBooking";
import { FinalCTA } from "../../components/marketing/FinalCTA";
import { SectionHeading } from "../../components/marketing/SectionHeading";

export function generateStaticParams() { return ALL_SLUGS.map(slug => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return { title: "Industry not found" };
  return {
    title: `${industry.name} Engineering`,
    description: industry.description.replaceAll("OSYSTIC", "OSYSTIC"),
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const description = industry.description.replaceAll("OSYSTIC", "OSYSTIC");
  const heroDesc = industry.heroDesc.replaceAll("OSYSTIC", "OSYSTIC");

  return <main id="main-content">
    <section className="page-hero"><div className="container-shell page-hero-grid"><div><span className="eyebrow">INDUSTRY / {industry.name.toUpperCase()}</span><h1>{industry.tagline}</h1><p>{description}</p><div className="page-hero-actions"><BookingButton>Discuss Your Use Case <ArrowRight size={16}/></BookingButton><Link className="button button-secondary-dark" href="/capabilities">Explore Capabilities <ArrowRight size={16}/></Link></div></div><div className="page-hero-visual" style={{ padding:36 }}><div style={{ width:"100%" }}><span className="eyebrow">OPERATING CONTEXT</span><p style={{ marginTop:18 }}>{heroDesc}</p></div></div></div></section>

    <section className="section section-light"><div className="container-shell"><SectionHeading eyebrow="CHALLENGES" title={`What changes in ${industry.name.toLowerCase()}.`} body="The useful engineering questions start with the constraints of the operating environment."/><div className="industry-grid industry-grid-three">{industry.challenges.map((item,index) => <article className="industry-card" key={item.title}><span className="industry-number">0{index+1}</span><h3>{item.title}</h3><p>{item.desc}</p></article>)}</div></div></section>

    <section className="section section-soft"><div className="container-shell"><SectionHeading eyebrow="WHAT WE BUILD" title="Systems designed around the workflow." body="These are capability patterns, not guaranteed project outcomes. The exact architecture depends on the client’s data, infrastructure, risk profile, and validation requirements."/><div className="work-grid sector-grid">{industry.solutions.map(item => <article className="work-empty" key={item.title}><CheckCircle2 size={22} color="#3b6cff"/><h3 style={{ marginTop:18 }}>{item.title}</h3><p>{item.desc}</p></article>)}</div></div></section>

    <section className="section section-dark"><div className="container-shell"><SectionHeading eyebrow="RELATED INDUSTRIES" title="Adjacent operating contexts."/><div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>{industry.relatedSlugs.map(related => { const item=getIndustry(related); return item ? <Link key={related} href={`/industries/${related}`} className="button button-secondary-dark">{item.name} <ArrowRight size={14}/></Link> : null; })}</div></div></section>
    <FinalCTA />
  </main>;
}
