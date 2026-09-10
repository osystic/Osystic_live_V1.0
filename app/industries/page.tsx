import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INDUSTRIES } from "../_data/industries-data";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { primaryIndustries } from "../config/site";

export const metadata: Metadata = {
  title: "Industries",
  description: "OSYSTIC engineering for finance, manufacturing, healthcare, technology, and other data-intensive sectors.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  const secondary = INDUSTRIES.filter(i => !primaryIndustries.some(p => p.href.endsWith(`/${i.slug}`)));
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container-shell">
          <span className="eyebrow">INDUSTRIES</span>
          <h1 style={{ maxWidth:950 }}>Domain context changes the <span className="accent">engineering decisions.</span></h1>
          <p style={{ maxWidth:760 }}>The same model or software architecture behaves differently when data sensitivity, latency, auditability, workflow integration, and operational risk change. Our industry pages explain the problems we are equipped to engineer around.</p>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="PRIMARY FOCUS" title="Four sectors where technical depth matters." body="These are the industries we foreground in the main navigation. Additional sector pages remain available where they provide useful context." />
          <div className="industry-grid">
            {primaryIndustries.map((industry,index) => <Link className="industry-card" href={industry.href} key={industry.name}><span className="industry-number">0{index+1}</span><h3>{industry.name}</h3><p>{industry.description}</p><span className="text-link">Explore industry <ArrowRight size={14}/></span></Link>)}
          </div>
        </div>
      </section>

      {secondary.length ? <section className="section section-soft"><div className="container-shell"><SectionHeading eyebrow="ADDITIONAL SECTORS" title="Other operating contexts we support."/><div className="work-grid sector-grid">{secondary.map(industry => <Link className="work-empty" href={`/industries/${industry.slug}`} key={industry.slug}><span className="work-kicker">INDUSTRY</span><h3>{industry.name}</h3><p>{industry.description}</p><span className="text-link" style={{ marginTop:18 }}>Learn more <ArrowRight size={14}/></span></Link>)}</div></div></section> : null}

      <FinalCTA title="Have industry-specific constraints?" body="Share the workflow, data, regulatory context, infrastructure, and operating conditions. The architecture should be designed around them from the start." />
    </main>
  );
}
