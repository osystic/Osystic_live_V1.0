import type { Metadata } from "next";
import Image from "next/image";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";

export const metadata: Metadata = { title: "Leadership", description: "OSYSTIC leadership and engineering accountability.", alternates: { canonical: "/leadership" } };

export default function LeadershipPage() {
  return <main id="main-content" className="leadership-page">
    <section className="page-hero"><div className="container-shell"><span className="eyebrow">LEADERSHIP</span><h1 style={{ maxWidth:850 }}>Founder-led. <span className="accent">Engineering-led.</span></h1><p>Public profiles are intentionally limited to approved company information rather than inflated biographies or placeholder executive identities.</p></div></section>
    <section className="section section-light"><div className="container-shell"><SectionHeading eyebrow="LEADERSHIP" title="Clear ownership of delivery."/>
      <div className="work-grid">
        <article className="work-card"><div className="work-media" style={{ aspectRatio:"4/3" }}><Image src="/team/shawaiz-arif.png" alt="Shawaiz Arif" fill sizes="(max-width:800px) 94vw, (min-width:1440px) 624px, 48vw" style={{ objectFit:"cover",objectPosition:"center top" }}/></div><div className="work-card-body"><span className="work-kicker">FOUNDER & CEO</span><h3>Shawaiz Arif</h3><p>Company direction, technical delivery, client engagements, and AI/software engineering programs.</p></div></article>
        <article className="work-card"><div className="work-media" style={{ aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg,#10151d,#0a0d12)" }}><div style={{ width:110,height:110,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid #303945",color:"#83a1ff",fontSize:34,fontWeight:650 }}>MA</div></div><div className="work-card-body"><span className="work-kicker">CTO</span><h3>Muhammad Arslan</h3><p>Technical architecture and engineering execution across software and AI delivery.</p></div></article>
      </div>
    </div></section>
    <FinalCTA />
  </main>;
}
