import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Clock3, Mail, MapPin, SearchCheck, ShieldCheck, Waypoints } from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { siteConfig } from "../config/site";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell OSYSTIC about your AI, software, data, cloud, or product engineering project and book a technical discovery call.",
  alternates: { canonical: "/contact" },
};

const steps = [
  ["01", "Discovery Call", "We clarify the problem, users, current system, constraints, and desired outcome."],
  ["02", "Technical Review", "We assess architecture, data, integrations, delivery risk, and feasibility."],
  ["03", "Roadmap", "We define an implementation path, phases, acceptance criteria, and responsibilities."],
  ["04", "Proposal", "You receive a scoped commercial proposal when the work is sufficiently defined."],
] as const;

export default function ContactPage() {
  return (
    <main id="main-content" className="contact-page">
      <section className="page-hero">
        <div className="container-shell page-hero-grid">
          <div>
            <span className="eyebrow">CONTACT</span>
            <h1>Let’s scope what <span className="accent">you’re building.</span></h1>
            <p>Share the technical context, current environment, constraints, and desired outcome. We will use that information to determine the most useful next conversation.</p>
            <div className="page-hero-actions"><BookingButton>Book a Technical Call <ArrowRight size={16}/></BookingButton></div>
          </div>
          <div className="page-hero-visual">
            <Image src="/media/visuals/contact-connectivity.webp" alt="Global engineering connectivity" fill sizes="(max-width:1024px) min(94vw,640px), 600px" style={{ objectFit:"cover",opacity:.88 }} />
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell contact-inquiry-grid">
          <div><SectionHeading eyebrow="PROJECT INQUIRY" title="Tell us about the system." body="The more useful technical context you provide, the less time the first conversation needs to spend on generic discovery." /><ContactForm /></div>
          <aside className="contact-expectations">
            <h2>What to expect</h2>
            <div style={{ borderTop:"1px solid var(--border)" }}>
              {([
                [SearchCheck,"Technical review","A senior team member reviews the problem and constraints before recommending a delivery path."],
                [ShieldCheck,"Confidential context","Do not send passwords, production keys, or customer-sensitive data through this form. High-level architecture and requirements are enough to start."],
                [Waypoints,"Outcome-first scope","We focus on what the system must do, how success is evaluated, and where it needs to operate."],
              ] as [LucideIcon, string, string][]).map(([Icon,title,body]) => <div className="trust-point" key={title} style={{ borderColor:"var(--border)" }}><div className="trust-point-icon" style={{ borderColor:"var(--border)" }}><Icon size={20}/></div><div><h3 style={{ color:"var(--text)" }}>{title}</h3><p style={{ color:"var(--muted)" }}>{body}</p></div></div>)}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-tight section-soft">
        <div className="container-shell">
          <div className="industry-grid contact-options-grid">
            <a className="industry-card" href={`mailto:${siteConfig.email}`}><div className="capability-icon"><Mail size={21}/></div><h3>Email</h3><p>{siteConfig.email}</p><span className="text-link">Write to us <ArrowRight size={14}/></span></a>
            <div className="industry-card"><div className="capability-icon"><Clock3 size={21}/></div><h3>Technical call</h3><div className="contact-inline-booking"><BookingButton className="text-link">Book a Technical Call <ArrowRight size={14}/></BookingButton></div></div>
            <div className="industry-card"><div className="capability-icon"><MapPin size={21}/></div><h3>Operations</h3><p>{siteConfig.address.line1}<br />{siteConfig.address.line2}<br />{siteConfig.address.country}<br />Local Operations: {siteConfig.localOperations}</p></div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="WHAT HAPPENS NEXT" title="A clear discovery process." body="Not every inquiry needs a long sales process. The goal is to reach technical clarity quickly enough to make a useful decision." />
          <div className="workflow-shell contact-process-shell"><div className="workflow-grid contact-process-grid">{steps.map(([number,title,body]) => <div className="workflow-step" key={number} style={{ borderColor:"var(--border)" }}><div className="workflow-step-number">{number}</div><h3 style={{ color:"var(--text)" }}>{title}</h3><p style={{ color:"var(--muted)" }}>{body}</p></div>)}</div></div>
        </div>
      </section>

      <FinalCTA title="Prefer to start with a technical call?" body="Choose an available time to discuss your project." />
    </main>
  );
}
