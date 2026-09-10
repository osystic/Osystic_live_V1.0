import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CloudCog,
  Code2,
  Database,
  Fingerprint,
  Layers3,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { BookingButton } from "./components/CalBooking";
import { FinalCTA } from "./components/marketing/FinalCTA";
import { SectionHeading } from "./components/marketing/SectionHeading";
import { capabilityGroups, primaryIndustries } from "./config/site";
import { fetchCaseStudies } from "./case-studies/actions";

export const metadata: Metadata = {
  title: "AI & Software Engineering",
  description:
    "OSYSTIC designs, builds, and deploys production AI systems, digital products, and data infrastructure with clear ownership terms, deployment flexibility, and defined handover.",
  alternates: { canonical: "/" },
};

const proof = [
  { icon: LockKeyhole, title: "Clear Ownership & Handover", body: "Ownership, licensing, source delivery, and handover are defined explicitly for each engagement." },
  { icon: CloudCog, title: "Cloud / On-Prem / Edge", body: "Deploy where your data and operational constraints require." },
  { icon: Layers3, title: "Phased Delivery", body: "Defined milestones and evaluable deliverables reduce execution risk." },
  { icon: ShieldCheck, title: "Security-Conscious Engineering", body: "Security, access, observability, and governance are considered from design onward." },
] as const;

const workflow = [
  ["01", "Input", "Documents, APIs, events, structured and unstructured data."],
  ["02", "Retrieval", "Relevant knowledge is selected from approved data sources."],
  ["03", "Reasoning", "Models and tools work within an explicit orchestration layer."],
  ["04", "Guardrails", "Validation, policies, permissions, and safety checks constrain actions."],
  ["05", "Output", "The system returns an answer, decision, or downstream action."],
  ["06", "Audit Trail", "Observability makes important system activity reviewable."],
] as const;

const insightThemes = [
  {
    image: "/media/visuals/diagram-ai.svg",
    meta: "AI SYSTEMS",
    title: "Building reliable agentic systems beyond the demo",
    body: "Evaluation, guardrails, tool permissions, observability, and the operational decisions that determine whether an AI agent belongs in production.",
  },
  {
    image: "/media/visuals/diagram-cloud.svg",
    meta: "CLOUD & SECURITY",
    title: "Choosing between cloud, on-premise, and hybrid AI deployment",
    body: "A practical architecture lens for organizations balancing privacy, latency, governance, infrastructure, and cost.",
  },
  {
    image: "/media/visuals/diagram-edge.svg",
    meta: "EDGE AI",
    title: "What changes when machine learning moves to the edge",
    body: "Hardware constraints, model optimization, telemetry, update strategy, and reliability considerations for real-time inference.",
  },
] as const;

function caseImage(index: number, provided: string | null) {
  if (provided) return provided;
  return index % 2 === 0 ? "/media/visuals/diagram-work.svg" : "/media/visuals/diagram-work.svg";
}

export default async function Home() {
  const publishedWork = await fetchCaseStudies(2);

  return (
    <main id="main-content" className="home-page">
      <section className="hero">
        <div className="container-shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AI & SOFTWARE ENGINEERING</span>
            <h1>
              Production AI and software systems, <span className="accent">built to be owned.</span>
            </h1>
            <p>
              OSYSTIC designs, builds, and deploys AI systems, digital products, and data infrastructure for organizations where reliability, security, and long-term ownership matter.
            </p>
            <div className="hero-actions">
              <BookingButton>
                Book a Technical Call <ArrowRight size={16} />
              </BookingButton>
              <Link className="button button-secondary-dark" href="/case-studies">
                Explore Our Work <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-note">Engineering-led delivery. No platform lock-in.</div>
          </div>

          <div className="hero-visual" aria-label="OSYSTIC production AI system architecture">
            <div className="hero-visual-card">
              <Image src="/media/visuals/hero-orchestration.webp" alt="Conceptual orchestration system with connected data, models, business logic, and deployment nodes" fill priority sizes="(max-width: 1024px) min(94vw,640px), 600px" />
              <span className="visual-label visual-label-a">Data & APIs</span>
              <span className="visual-label visual-label-b">Models & Agents</span>
              <span className="visual-label visual-label-c">Business Logic</span>
              <span className="visual-label visual-label-d">Deploy Anywhere</span>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="OSYSTIC delivery principles">
        <div className="container-shell proof-grid">
          {proof.map(item => {
            const Icon = item.icon;
            return (
              <div className="proof-item" key={item.title}>
                <div className="proof-icon"><Icon size={23} strokeWidth={1.7} /></div>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section section-light home-work">
        <div className="container-shell">
          <div className="section-topline">
            <SectionHeading eyebrow="SELECTED WORK" title="Real systems. Clear engineering outcomes." body="Public case studies are shown only when the underlying project information has been approved for publication." />
            <Link className="text-link" href="/case-studies">View all work <ArrowRight size={15} /></Link>
          </div>

          <div className="work-grid">
            {publishedWork.length ? publishedWork.map((item, index) => (
              <Link className="work-card" href={`/case-studies/${item.slug}`} key={item.id}>
                <div className="work-media">
                  <Image src={caseImage(index, item.featuredImage)} alt="" fill sizes="(max-width:800px) 94vw, (min-width:1440px) 624px, 48vw" />
                </div>
                <div className="work-card-body">
                  <span className="work-kicker">CASE STUDY</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt || item.challenge}</p>
                  {item.results.length ? (
                    <div className="work-results">{item.results.slice(0, 2).map(result => <span key={result}>{result}</span>)}</div>
                  ) : null}
                </div>
              </Link>
            )) : (
              <div className="work-empty confidentiality-panel">
                <span className="eyebrow">CLIENT CONFIDENTIALITY</span>
                <h3>Relevant project examples are available during discovery.</h3>
                <p>
                  Many engagements involve private systems, proprietary data, or non-public product work. We publish case studies only when the details and outcomes are cleared for public use. Tell us what you are building and we can discuss relevant experience without exposing client-confidential information.
                </p>
                <Link href="/contact" className="text-link" style={{ marginTop: 22 }}>Discuss your project <ArrowRight size={15} /></Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container-shell">
          <SectionHeading eyebrow="CAPABILITIES" title="End-to-end engineering for intelligent systems." body="One engineering partner across AI, product, data, and infrastructure, with the architecture chosen for the problem rather than the trend." />
          <div className="capability-grid">
            {capabilityGroups.map((group, index) => {
              const Icon = [BrainCircuit, Code2, Database][index];
              return (
                <article className="capability-card" id={index === 0 ? "ai-systems" : index === 1 ? "product-engineering" : "data-cloud"} key={group.title}>
                  <div className="capability-icon"><Icon size={23} strokeWidth={1.7} /></div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <div className="capability-links">
                    {group.items.slice(0, 4).map(([label, href]) => <Link href={href} key={label}>{label}<ArrowRight size={14} /></Link>)}
                  </div>
                </article>
              );
            })}
          </div>
          <div style={{ marginTop: 30 }}><Link className="text-link" href="/capabilities">Explore all capabilities <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-shell">
          <SectionHeading eyebrow="AI IN ACTION" title="An agentic workflow you can inspect." body="Production AI is more than a prompt. The architecture needs explicit data boundaries, tool access, validation, observability, and deployment controls." />
          <div className="workflow-shell home-workflow">
            <div className="workflow-grid">
              {workflow.map(([number, title, body]) => (
                <div className="workflow-step" key={number}>
                  <div className="workflow-step-number">{number}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light home-industries">
        <div className="container-shell">
          <SectionHeading eyebrow="INDUSTRIES" title="Domain context changes the engineering." body="We prioritize sectors where data quality, reliability, security, workflow integration, and measurable outcomes matter." />
          <div className="industry-grid">
            {primaryIndustries.map((industry, index) => (
              <Link href={industry.href} className="industry-card" key={industry.name}>
                <span className="industry-number">0{index + 1}</span>
                <h3>{industry.name}</h3>
                <p>{industry.description}</p>
                <span className="text-link">Learn more <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-shell trust-layout">
          <div>
            <span className="eyebrow">TRUST & SECURITY</span>
            <h2>Designed for ownership, auditability, and operational control.</h2>
            <p>
              We avoid presenting framework alignment as certification. Security and governance requirements are scoped against the actual system, data, infrastructure, and regulatory context of each engagement.
            </p>
            <Link className="text-link" href="/trust" style={{ marginTop: 24 }}>Explore our engineering approach <ArrowRight size={15} /></Link>
          </div>
          <div className="trust-points">
            <div className="trust-point"><div className="trust-point-icon"><Fingerprint size={20} /></div><div><h3>Your data remains under your control</h3><p>Deployment and access patterns are designed around the environment and data boundaries you approve.</p></div></div>
            <div className="trust-point"><div className="trust-point-icon"><ScanSearch size={20} /></div><div><h3>Critical behavior is observable</h3><p>Logging, evaluation, monitoring, and audit trails are considered where they are meaningful to the system.</p></div></div>
            <div className="trust-point"><div className="trust-point-icon"><CheckCircle2 size={20} /></div><div><h3>Delivery is explicit</h3><p>Phases, acceptance criteria, technical decisions, and handoff expectations are made visible throughout the engagement.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell">
          <div className="section-topline">
            <SectionHeading eyebrow="ENGINEERING INSIGHTS" title="Technical perspective without the noise." body="We focus on the decisions that determine whether AI and software systems remain useful after launch." />
            <Link href="/insights" className="text-link">View insights <ArrowRight size={15} /></Link>
          </div>
          <div className="insight-grid">
            {insightThemes.map(item => (
              <Link href="/insights" className="insight-card" key={item.title}>
                <div className="insight-media"><Image src={item.image} alt="" width={1600} height={1000} /></div>
                <div className="insight-meta">{item.meta}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="text-link">Explore topic <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
