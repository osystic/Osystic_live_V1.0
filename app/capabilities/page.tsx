import type { Metadata } from "next";
import { CapabilityVisual } from "../components/marketing/TechnicalVisual";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, CloudCog, Code2, Database, LockKeyhole, ShieldCheck } from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { capabilityGroups } from "../config/site";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "Explore OSYSTIC capabilities across AI systems, product engineering, data engineering, cloud, MLOps, and platform delivery.",
  alternates: { canonical: "/capabilities" },
};

const process = [
  ["01", "Discover", "Clarify the problem, users, data, constraints, risks, and measurable success criteria."],
  ["02", "Design", "Define architecture, interfaces, evaluation strategy, security boundaries, and delivery plan."],
  ["03", "Build", "Engineer in visible increments with code review, testing, documentation, and technical checkpoints."],
  ["04", "Deploy", "Release into the agreed cloud, on-premise, or edge environment with observability and handoff."],
  ["05", "Improve", "Measure system behavior, resolve operational issues, and optimize based on real-world evidence."],
] as const;

export default function CapabilitiesPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container-shell page-hero-grid">
          <div>
            <span className="eyebrow">CAPABILITIES</span>
            <h1>End-to-end engineering for <span className="accent">intelligent systems.</span></h1>
            <p>From data and models to APIs, interfaces, infrastructure, and production operations, OSYSTIC can lead the engineering path without forcing your project into a predefined platform.</p>
            <div className="page-hero-actions">
              <BookingButton>Book a Technical Call <ArrowRight size={16} /></BookingButton>
              <Link href="/case-studies" className="button button-secondary-dark">Explore Our Work <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="page-hero-visual">
            <CapabilityVisual />
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="CORE CAPABILITIES" title="Three engineering pillars. One delivery system." body="Capabilities are combined around the system you need to ship, not sold as disconnected technology services." />
          <div className="capability-grid">
            {capabilityGroups.map((group, index) => {
              const Icon = [BrainCircuit, Code2, Database][index];
              const anchor = index === 0 ? "ai-systems" : index === 1 ? "product-engineering" : "data-cloud";
              return (
                <article className="capability-card" id={anchor} key={group.title}>
                  <div className="capability-icon"><Icon size={23} /></div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <div className="capability-links">
                    {group.items.map(([label, href]) => <Link href={href} key={`${group.title}-${label}`}>{label}<ArrowRight size={14} /></Link>)}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-soft" id="process">
        <div className="container-shell">
          <SectionHeading eyebrow="HOW WE WORK" title="A delivery process designed to reduce uncertainty." body="Each phase should produce something your team can inspect, test, approve, or use to make the next decision." />
          <div className="workflow-shell light-workflow-shell">
            <div className="workflow-grid capabilities-process-grid">
              {process.map(([number, title, body]) => (
                <div className="workflow-step" key={number} style={{ borderColor: "var(--border)" }}>
                  <div className="workflow-step-number">{number}</div>
                  <h3 style={{ color: "var(--text)" }}>{title}</h3>
                  <p style={{ color: "var(--muted)" }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-shell">
          <SectionHeading eyebrow="BUILT ON TRUST" title="The engineering relationship should stay clear." body="Ownership, deployment, security expectations, and acceptance criteria are part of the technical scope, not hidden in a platform dependency." />
          <div className="trust-points">
            <div className="trust-point"><div className="trust-point-icon"><LockKeyhole size={20}/></div><div><h3>Clear ownership & handover</h3><p>Ownership, licensing, source delivery, and handover expectations are defined in the engagement terms rather than hidden in a platform dependency.</p></div></div>
            <div className="trust-point"><div className="trust-point-icon"><CloudCog size={20}/></div><div><h3>Deployment flexibility</h3><p>Cloud, on-premise, hybrid, or edge deployment is chosen according to system requirements and constraints.</p></div></div>
            <div className="trust-point"><div className="trust-point-icon"><ShieldCheck size={20}/></div><div><h3>Security-conscious delivery</h3><p>Access, secrets, data flow, logging, dependency risk, and operational controls are addressed as engineering concerns.</p></div></div>
            <div className="trust-point"><div className="trust-point-icon"><CheckCircle2 size={20}/></div><div><h3>Measurable milestones</h3><p>Each phase should have explicit deliverables and acceptance criteria so progress can be evaluated before moving forward.</p></div></div>
          </div>
        </div>
      </section>

      <FinalCTA title="Need a capability mix that does not fit a template?" body="Most production systems span multiple disciplines. Share the actual problem and constraints, and we will help define the architecture and delivery path." />
    </main>
  );
}
