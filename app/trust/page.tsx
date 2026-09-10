import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CloudCog, FileCheck2, Fingerprint, KeyRound, LockKeyhole, Network, ShieldCheck, Waypoints } from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: "Trust & Security",
  description: "How OSYSTIC approaches security-conscious engineering, ownership, deployment, privacy, observability, documentation, and system handoff.",
  alternates: { canonical: "/trust" },
};

const controls = [
  { icon: KeyRound, title: "Access & secrets", body: "Least-privilege access, environment separation, secret handling, and credentials are treated as explicit implementation concerns." },
  { icon: Network, title: "Data boundaries", body: "Data flow, residency constraints, third-party processors, model providers, and storage locations are documented against the agreed architecture." },
  { icon: Fingerprint, title: "Privacy by design", body: "We aim to minimize unnecessary data exposure and design integrations around the data that a system actually needs." },
  { icon: FileCheck2, title: "Documentation & auditability", body: "Important technical decisions, interfaces, deployment assumptions, runbooks, and operational controls are documented for handoff and review." },
  { icon: Waypoints, title: "Observability", body: "Production systems can include structured logging, tracing, model evaluation, monitoring, and alerting where they support reliable operations." },
  { icon: ShieldCheck, title: "Secure delivery practices", body: "Code review, dependency hygiene, validation, authorization, and security testing are selected according to the system risk profile." },
] as const;

export default function TrustPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container-shell page-hero-grid">
          <div>
            <span className="eyebrow">TRUST & SECURITY</span>
            <h1>Security claims should be <span className="accent">precise and verifiable.</span></h1>
            <p>OSYSTIC approaches security as an engineering discipline. We scope controls against the system, environment, data, users, and risk profile rather than relying on generic badges or unsupported compliance language.</p>
            <div className="page-hero-actions">
              <BookingButton>Discuss Security Requirements <ArrowRight size={16}/></BookingButton>
              <Link className="button button-secondary-dark" href="/contact">Send Project Details <ArrowRight size={16}/></Link>
            </div>
          </div>
          <div className="page-hero-visual" style={{ padding: 36 }}>
            <div style={{ width:"100%", display:"grid", gap:14 }}>
              {["OWNERSHIP", "DATA BOUNDARIES", "ACCESS CONTROL", "OBSERVABILITY", "DOCUMENTATION"].map((item, index) => (
                <div key={item} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px",border:"1px solid #29313b",borderRadius:12,background:index===0?"rgba(59,108,255,.11)":"rgba(255,255,255,.02)" }}>
                  <span style={{ color:index===0?"#8ba8ff":"#c3cbd5",fontSize:12,letterSpacing:".08em" }}>{item}</span>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:index===0?"#3b6cff":"#39424e" }}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="ENGINEERING CONTROLS" title="Trust is built into the implementation path." body="The exact control set depends on the project. These are the areas we expect to make explicit during architecture and delivery." />
          <div className="industry-grid industry-grid-three">
            {controls.map(({icon:Icon,title,body}, index) => (
              <article className="industry-card" key={title} style={{ minHeight:250 }}>
                <div className="capability-icon" style={{ marginBottom:20 }}><Icon size={22}/></div>
                <span className="industry-number">0{index+1}</span>
                <h3 style={{ marginTop:14 }}>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-shell trust-layout">
          <div>
            <span className="eyebrow">OWNERSHIP</span>
            <h2>Your system should remain operable without us.</h2>
            <p>Our default delivery principle is to avoid artificial dependency. The agreed source code, model artifacts, infrastructure definitions, documentation, and deployment knowledge should be transferable to your team.</p>
          </div>
          <div className="trust-points">
            <div className="trust-point"><div className="trust-point-icon"><LockKeyhole size={20}/></div><div><h3>Client-controlled environments</h3><p>Where appropriate, systems are deployed into infrastructure and accounts controlled by the client.</p></div></div>
            <div className="trust-point"><div className="trust-point-icon"><CloudCog size={20}/></div><div><h3>No forced deployment model</h3><p>Cloud, on-premise, hybrid, and edge options are evaluated based on the actual constraints.</p></div></div>
            <div className="trust-point"><div className="trust-point-icon"><FileCheck2 size={20}/></div><div><h3>Handoff is part of delivery</h3><p>Documentation, runbooks, architecture notes, and knowledge transfer are treated as project deliverables where scoped.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container-shell content-shell">
          <SectionHeading eyebrow="COMPLIANCE LANGUAGE" title="Certification and alignment are not the same thing." body="The public website will not represent OSYSTIC as certified against a framework unless that certification is current and verifiable. Project-specific compliance requirements can still be designed into systems based on the applicable obligations and client environment." />
          <p className="prose-shell">If a prospective engagement requires a particular certification, data-processing agreement, residency requirement, security review, or vendor assessment, include that requirement during discovery so it can be addressed before architecture is locked.</p>
        </div>
      </section>

      <FinalCTA title="Have specific security or deployment constraints?" body="Share them early. Architecture is easier to get right when data boundaries, deployment requirements, and operational expectations are known before implementation begins." />
    </main>
  );
}
