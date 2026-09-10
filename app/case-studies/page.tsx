import { DeliveryVisual } from "../components/marketing/TechnicalVisual";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, LockKeyhole, ShieldCheck } from "lucide-react";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { fetchCaseStudies } from "./actions";

export const metadata: Metadata = {
  title: "Work & Case Studies",
  description: "Selected OSYSTIC work across production AI, product engineering, data systems, cloud, and enterprise software.",
  alternates: { canonical: "/case-studies" },
};

const fallbacks = [
  "/media/visuals/diagram-work.svg",
  "/media/visuals/diagram-work.svg",
  "/media/visuals/diagram-cloud.svg",
  "/media/visuals/diagram-work.svg",
  "/media/visuals/diagram-edge.svg",
];

export default async function WorkPage() {
  const studies = await fetchCaseStudies();
  const featured = studies[0];
  const rest = studies.slice(1);

  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container-shell page-hero-grid">
          <div>
            <span className="eyebrow">WORK / CASE STUDIES</span>
            <h1>Real systems. <span className="accent">Measurable impact.</span></h1>
            <p>We publish work only when the underlying project information is cleared for public use. Where client confidentiality applies, relevant experience can be discussed privately during discovery.</p>
          </div>
          <div className="page-hero-visual">
            <DeliveryVisual />
          </div>
        </div>
      </section>

      {featured ? (
        <section className="section section-light">
          <div className="container-shell">
            <div className="featured-work-heading"><SectionHeading eyebrow="FEATURED CASE STUDY" title={featured.title} body={featured.excerpt || featured.challenge} /></div>
            <Link href={`/case-studies/${featured.slug}`} className="work-card featured-work">
              <div className="work-media">
                <Image src={featured.featuredImage || fallbacks[0]} alt="" fill sizes="(max-width:1024px) 94vw, 650px" />
              </div>
              <div className="work-card-body">
                <span className="work-kicker">{featured.client}</span>
                <h3>{featured.title}</h3>
                <p><strong style={{ color:"var(--text)" }}>Challenge:</strong> {featured.challenge}</p>
                <p><strong style={{ color:"var(--text)" }}>Solution:</strong> {featured.solution}</p>
                {featured.results.length ? <div className="work-results">{featured.results.slice(0,3).map(item => <span key={item}>{item}</span>)}</div> : null}
                <span className="text-link" style={{ marginTop:24 }}>Read case study <ArrowRight size={15}/></span>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="section section-light">
          <div className="container-shell">
            <div className="work-empty confidentiality-panel">
              <span className="eyebrow">PUBLIC CASE STUDIES</span>
              <h3>Public case studies are being prepared.</h3>
              <p>We publish project details and outcomes only when they are approved for public use. Relevant experience can be discussed during discovery while respecting client confidentiality.</p>
              <Link className="text-link" href="/contact" style={{ marginTop:22 }}>Ask about relevant experience <ArrowRight size={15}/></Link>
            </div>
          </div>
        </section>
      )}

      {rest.length ? (
        <section className="section section-soft">
          <div className="container-shell">
            <SectionHeading eyebrow="MORE WORK" title="Selected production engagements." />
            <div className="work-grid">
              {rest.map((study,index) => (
                <Link className="work-card" href={`/case-studies/${study.slug}`} key={study.id}>
                  <div className="work-media"><Image src={study.featuredImage || fallbacks[(index+1)%fallbacks.length]} alt="" fill sizes="(max-width:800px) 94vw, (min-width:1440px) 624px, 48vw" /></div>
                  <div className="work-card-body">
                    <span className="work-kicker">CASE STUDY</span>
                    <h3>{study.title}</h3>
                    <p>{study.excerpt || study.challenge}</p>
                    {study.results.length ? <div className="work-results">{study.results.slice(0,2).map(item => <span key={item}>{item}</span>)}</div> : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-light">
        <div className="container-shell">
          <SectionHeading eyebrow="EVERY ENGAGEMENT" title="A delivery model built around client control." />
          <div className="industry-grid">
            {([
              [LockKeyhole,"Clear Ownership & Handover","Ownership, licensing, source delivery, and handover expectations are defined for the engagement."],
              [Layers3,"Phased Delivery","Each phase has visible deliverables and acceptance points before the next phase begins."],
              [ShieldCheck,"Security-Conscious Engineering","Data flow, access, secrets, observability, and deployment boundaries are addressed against the system requirements."],
              [CheckCircle2,"Documentation & Handoff","Architecture decisions and operating knowledge can be documented so the system remains understandable after delivery."],
            ] as [LucideIcon, string, string][]).map(([Icon,title,body],index) => (
              <article className="industry-card" key={title}>
                <div className="capability-icon" style={{ marginBottom:20 }}><Icon size={22}/></div>
                <span className="industry-number">0{index+1}</span>
                <h3 style={{ marginTop:14 }}>{title}</h3><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA title="Have a challenge worth solving?" body="Tell us the constraints, current system, data, and desired outcome. We can discuss relevant experience without exposing confidential client work." />
    </main>
  );
}
