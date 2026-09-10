import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { CapabilityPillar } from "../../_data/capability-pillars";
import { BookingButton } from "../CalBooking";
import { FinalCTA } from "./FinalCTA";
import { SectionHeading } from "./SectionHeading";
import { TechnicalVisual } from "./TechnicalVisual";

export function CapabilityPillarPage({ pillar }: { pillar: CapabilityPillar }) {
  const visualVariant = pillar.slug === "ai-systems" ? "ai" : pillar.slug === "product-engineering" ? "product" : "data";
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container-shell page-hero-grid pillar-hero-grid">
          <div>
            <span className="eyebrow">{pillar.eyebrow}</span>
            <h1>{pillar.title}</h1>
            <p>{pillar.intro}</p>
            <div className="page-hero-actions">
              <BookingButton>Book a Technical Call <ArrowRight size={16} aria-hidden="true" /></BookingButton>
              <Link className="button button-secondary-dark" href="/case-studies">Explore Our Work</Link>
            </div>
          </div>
          <div className="page-hero-visual" aria-hidden="true"><TechnicalVisual name={pillar.eyebrow} variant={visualVariant} /></div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="CAPABILITY SCOPE" title="Engineering depth without a catalogue of thin services." body="Each capability is substantial enough to stand on its own, while the architecture is designed to combine disciplines when the system requires it." />
          <div className="pillar-outcomes" aria-label={`${pillar.eyebrow} scope`}>
            {pillar.outcomes.map(item => <div key={item}><CheckCircle2 size={18} aria-hidden="true" /><span>{item}</span></div>)}
          </div>
          <div className="service-list-grid pillar-service-grid">
            {pillar.capabilities.map((item, index) => (
              <article className="service-list-card" key={item.title}>
                <div className="service-list-number">{String(index + 1).padStart(2, "0")}</div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
                <Link className="text-link" href={item.href}>Explore capability <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-shell">
          <SectionHeading eyebrow="ENGINEERING APPROACH" title="Designed to be operated after launch." body="Architecture, validation, deployment, observability, and ownership are treated as part of the delivery rather than follow-up work." />
          <div className="pillar-approach-grid">
            {pillar.approach.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="RELATED" title="Continue through the architecture." body="Use the related pages to review adjacent engineering disciplines, delivery evidence, and security positioning." />
          <div className="pillar-related-links">{pillar.related.map(item => <Link className="button button-secondary" href={item.href} key={item.href}>{item.label}<ArrowRight size={15} aria-hidden="true" /></Link>)}</div>
        </div>
      </section>
      <FinalCTA />
    </main>
  );
}
