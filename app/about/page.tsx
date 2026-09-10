import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CloudCog, Code2, FileCheck2, Globe2, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { siteConfig } from "../config/site";

export const metadata: Metadata = {
  title: "About",
  description: "About OSYSTIC, an AI and software engineering company focused on production systems, clear ownership terms, technical clarity, and phased delivery.",
  alternates: { canonical: "/about" },
};

const principles = [
  [CheckCircle2, "Technical honesty", "We would rather define what will and will not work than hide technical uncertainty behind sales language."],
  [LockKeyhole, "Ownership & handover", "Ownership, licensing, source delivery, and technical handover are defined explicitly for each engagement."],
  [CloudCog, "Deploy where the system belongs", "Architecture can target cloud, on-premise, hybrid, or edge environments according to the data and operational constraints."],
  [FileCheck2, "Phased delivery", "Each phase should end with something concrete enough to inspect, test, approve, or use to make the next decision."],
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" className="about-page">
      <section className="page-hero">
        <div className="container-shell page-hero-grid">
          <div>
            <span className="eyebrow">COMPANY</span>
            <h1>Engineering AI and software with <span className="accent">clarity, ownership, and trust.</span></h1>
            <p>OSYSTIC is an AI and software engineering company. We work across intelligent systems, product engineering, data, and cloud infrastructure with an emphasis on production reliability and client control.</p>
            <div className="page-hero-actions">
              <BookingButton>Book a Technical Call <ArrowRight size={16}/></BookingButton>
              <Link className="button button-secondary-dark" href="/case-studies">Explore Our Work <ArrowRight size={16}/></Link>
            </div>
          </div>
          <div className="page-hero-visual" style={{ padding:36 }}>
            <div className="about-principles-grid">
              {([["AI SYSTEMS",Code2],["PRODUCT ENGINEERING",CheckCircle2],["DATA & CLOUD",Globe2],["DELIVERY",ShieldCheck]] as [string, LucideIcon][]).map(([label,Icon]: [string, LucideIcon]) => <div key={label} style={{ minHeight:118,border:"1px solid #29313a",borderRadius:16,padding:20,display:"flex",flexDirection:"column",justifyContent:"space-between",background:"rgba(255,255,255,.02)" }}><Icon size={22} color="#3b6cff"/><span style={{ color:"#bec7d1",fontSize:11,letterSpacing:".08em" }}>{label}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="HOW WE THINK" title="Engineering principles before marketing claims." body="The public website should reflect how the company actually works, not borrow credibility from unsupported numbers, badges, or office locations." />
          <div className="industry-grid">
            {principles.map(([Icon,title,body],index) => <article className="industry-card" key={title}><div className="capability-icon" style={{ marginBottom:20 }}><Icon size={22}/></div><span className="industry-number">0{index+1}</span><h3 style={{ marginTop:14 }}>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-shell">
          <SectionHeading eyebrow="OPERATING MODEL" title="One path from architecture to production." body="The exact team composition changes by project, but the engagement remains anchored around explicit technical ownership and visible delivery phases." />
          <div className="workflow-shell"><div className="workflow-grid about-process-grid">{[
            ["01","Strategy","Define the problem, outcomes, constraints, and risks."],
            ["02","Architecture","Design the system, data flow, interfaces, and deployment boundary."],
            ["03","Engineering","Build, integrate, test, and document the working system."],
            ["04","Deployment","Release into the agreed environment with operational controls."],
            ["05","Optimization","Measure behavior and improve based on production evidence."],
          ].map(([number,title,body]) => <div className="workflow-step" key={number}><div className="workflow-step-number">{number}</div><h3>{title}</h3><p>{body}</p></div>)}</div></div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <div className="section-topline"><SectionHeading eyebrow="LEADERSHIP" title="Accountability should be visible." body="OSYSTIC is founder-led and engineering-led. Public biographies stay concise and are limited to information approved for the website."/><Link className="text-link" href="/leadership">Leadership <ArrowRight size={15}/></Link></div>
          <div className="leadership-feature-grid">
            <div style={{ position:"relative",minHeight:370,borderRadius:22,overflow:"hidden",background:"#10141a" }}><Image src="/team/shawaiz-arif.png" alt="Shawaiz Arif" fill sizes="(max-width:768px) min(94vw,512px), 420px" style={{ objectFit:"cover",objectPosition:"center top" }}/></div>
            <div style={{ border:"1px solid var(--border)",borderRadius:22,padding:40,display:"flex",flexDirection:"column",justifyContent:"center" }}><span className="eyebrow">FOUNDER & CEO</span><h2 style={{ fontSize:40,letterSpacing:"-.045em",margin:"18px 0 0" }}>Shawaiz Arif</h2><p style={{ color:"var(--muted)",lineHeight:1.8,maxWidth:700 }}>Leads OSYSTIC across company direction, client delivery, AI and software engineering engagements, and the operating model that connects technical execution with project outcomes.</p></div>
          </div>
        </div>
      </section>

      <section id="global-operations" className="section section-soft">
        <div className="container-shell">
          <SectionHeading eyebrow="GLOBAL OPERATIONS" title="US business presence. Lahore engineering operations." body="The website uses only verified operating locations. We do not create fictional international offices to imply scale." />
          <div className="work-grid operations-grid">
            <div className="work-empty"><MapPin size={26} color="#3b6cff"/><h3 style={{ marginTop:18 }}>United States</h3><p>{siteConfig.address.line1}<br/>{siteConfig.address.line2}<br/>{siteConfig.address.country}</p></div>
            <div className="work-empty"><MapPin size={26} color="#3b6cff"/><h3 style={{ marginTop:18 }}>Local Operations</h3><p>{siteConfig.localOperations}</p></div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
