import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Code2,
  FileCheck2,
  GitBranch,
  KeyRound,
  Layers3,
  PackageCheck,
  ScanSearch,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { FutureReveal } from "../components/future/FutureReveal";
import styles from "./HowWeWork.module.css";

export const metadata = createSeoMetadata({
  title: "How We Work",
  description:
    "See how OSYSTIC structures enterprise AI and software engagements around explicit scope, reviewable engineering decisions, validation gates, release control, and clear ownership.",
  path: "/how-we-work",
  keywords: [
    "software engineering delivery process",
    "enterprise AI delivery",
    "software project governance",
    "production engineering workflow",
    "technical handover",
  ],
});

const principles = [
  {
    icon: ScanSearch,
    title: "Scope before build",
    copy: "Requirements, constraints, dependencies, and acceptance criteria are made explicit before implementation expands.",
  },
  {
    icon: GitBranch,
    title: "Work stays reviewable",
    copy: "Important architecture decisions, milestones, releases, and feedback remain visible throughout delivery.",
  },
  {
    icon: ShieldCheck,
    title: "Production has gates",
    copy: "Testing, security, deployment, and client approval move through defined checkpoints rather than assumptions.",
  },
  {
    icon: KeyRound,
    title: "Ownership is deliberate",
    copy: "Source, infrastructure, documentation, access, and ongoing responsibility finish in a defined ownership state.",
  },
] as const;

const lifecycle = [
  {
    number: "01",
    icon: ScanSearch,
    title: "Discover & Define",
    copy: "Understand the operating objective, users, existing systems, data, constraints, risks, and measurable success criteria.",
    output: "Scope boundary · assumptions · acceptance criteria",
  },
  {
    number: "02",
    icon: Waypoints,
    title: "Architect & Plan",
    copy: "Define system boundaries, integrations, data flow, security model, deployment approach, and implementation sequence.",
    output: "Architecture · delivery plan · milestones",
  },
  {
    number: "03",
    icon: Code2,
    title: "Build in Reviewable Milestones",
    copy: "Engineering proceeds in controlled increments with working outputs, visible decisions, and feedback before the next stage expands.",
    output: "Working software · source changes · milestone review",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Validate & Harden",
    copy: "Functional QA, edge cases, observability, security considerations, performance, and relevant AI evaluations are checked against the real system.",
    output: "Validation evidence · resolved issues · release candidate",
  },
  {
    number: "05",
    icon: ClipboardCheck,
    title: "UAT & Release",
    copy: "The agreed behavior is validated before production-impacting changes are released, with release state and approval kept explicit.",
    output: "UAT approval · deployment record · production verification",
  },
  {
    number: "06",
    icon: PackageCheck,
    title: "Handover & Operate",
    copy: "Documentation, source, configuration, access, and operational responsibilities move into the ownership model agreed for the engagement.",
    output: "Owned system · documentation · support state",
  },
] as const;

const visibility = [
  ["Current milestone", "What is being built now and what constitutes completion."],
  ["Decisions", "What changed, why it changed, and what the decision affects."],
  ["Review points", "What needs client feedback, validation, or formal approval."],
  ["Release state", "What is in development, staging, UAT, or production."],
  ["Ownership", "Who owns the next action and what is waiting on either side."],
] as const;

const gates = [
  ["SCOPE", "DEFINED"],
  ["ARCHITECTURE", "REVIEWED"],
  ["BUILD", "EVALUATED"],
  ["QA", "PASSED"],
  ["UAT", "APPROVED"],
  ["PRODUCTION", "VERIFIED"],
  ["HANDOVER", "COMPLETE"],
] as const;

const changeControl = [
  {
    number: "01",
    title: "Requested",
    copy: "A new requirement or change is captured with enough context to evaluate it.",
  },
  {
    number: "02",
    title: "Assessed",
    copy: "Impact on architecture, effort, dependencies, risk, and delivery is made visible.",
  },
  {
    number: "03",
    title: "Agreed",
    copy: "Accepted changes enter the delivery plan with a clear effect on scope and acceptance.",
  },
] as const;

const ownership = [
  {
    icon: GitBranch,
    title: "Source",
    copy: "Repository access, source delivery, licensing, and ownership terms are defined for the engagement.",
  },
  {
    icon: Layers3,
    title: "Infrastructure",
    copy: "Hosting, environments, deployment responsibility, and operational boundaries are made explicit.",
  },
  {
    icon: FileCheck2,
    title: "Knowledge",
    copy: "Architecture context, setup information, decisions, and operating documentation travel with the system.",
  },
  {
    icon: KeyRound,
    title: "Access",
    copy: "Credentials, integrations, roles, and permissions are transferred or revoked according to the agreed model.",
  },
] as const;

export default function HowWeWorkPage() {
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero} aria-labelledby="how-we-work-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className="container-shell">
          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>DELIVERY SYSTEM / CONTROLLED</span>
              <span className="eyebrow">HOW WE WORK</span>
              <h1 id="how-we-work-title">
                Structured delivery.<br />
                Visible decisions.<br />
                <span>Clear ownership.</span>
              </h1>
              <p>
                OSYSTIC runs engagements around explicit scope, reviewable engineering decisions,
                defined acceptance points, and a clear ownership state from discovery through production.
              </p>
              <div className={styles.heroActions}>
                <BookingButton className="button button-primary">
                  Discuss a Project <ArrowRight size={16} />
                </BookingButton>
                <Link href="/case-studies" className="button button-secondary-dark">
                  View Case Studies <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className={styles.controlPanel} aria-label="OSYSTIC delivery control flow">
              <div className={styles.controlHeader}>
                <span>OSYSTIC / DELIVERY_CONTROL</span>
                <b>ACTIVE</b>
              </div>
              <div className={styles.controlRail}>
                {[
                  ["01", "SCOPE", "DEFINED"],
                  ["02", "ARCHITECTURE", "REVIEWED"],
                  ["03", "BUILD", "ITERATIVE"],
                  ["04", "VALIDATION", "EVIDENCED"],
                  ["05", "RELEASE", "APPROVED"],
                  ["06", "OWNERSHIP", "EXPLICIT"],
                ].map(([number, label, state]) => (
                  <div className={styles.controlRow} key={number}>
                    <span>{number}</span>
                    <i aria-hidden="true" />
                    <strong>{label}</strong>
                    <b>{state}</b>
                  </div>
                ))}
              </div>
              <div className={styles.controlFoot}>
                <span>STATUS</span>
                <strong>NO HIDDEN HANDOFF</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.principles}>
        <div className="container-shell">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">OPERATING MODEL</span>
            <h2>Built around visibility and control.</h2>
            <p>
              The process is designed to reduce ambiguity without turning delivery into bureaucracy.
              Important decisions stay inspectable, and responsibility stays clear.
            </p>
          </div>
          <div className={styles.principleGrid}>
            {principles.map((item, index) => {
              const Icon = item.icon;
              return (
                <FutureReveal key={item.title} delay={index * 0.06} className={styles.principleCard}>
                  <div className={styles.cardTop}>
                    <span>0{index + 1}</span>
                    <Icon size={21} strokeWidth={1.5} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </FutureReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.lifecycleSection}>
        <div className="container-shell">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">DELIVERY LIFECYCLE</span>
            <h2>From problem definition to an owned production system.</h2>
            <p>
              The exact cadence changes by engagement. The control points do not: scope, architecture,
              validation, release, and ownership remain explicit.
            </p>
          </div>

          <div className={styles.lifecycleGrid}>
            {lifecycle.map((item, index) => {
              const Icon = item.icon;
              return (
                <FutureReveal key={item.number} delay={(index % 3) * 0.05} className={styles.lifecycleCard}>
                  <div className={styles.lifecycleTop}>
                    <span>{item.number}</span>
                    <Icon size={22} strokeWidth={1.45} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <div className={styles.output}>
                    <span>OUTPUT</span>
                    <strong>{item.output}</strong>
                  </div>
                </FutureReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.visibilitySection}>
        <div className="container-shell">
          <div className={styles.visibilityGrid}>
            <div>
              <span className="eyebrow">PROJECT VISIBILITY</span>
              <h2>You should not have to ask where the project stands.</h2>
              <p>
                Status should come from the delivery record, not from memory. OSYSTIC structures the
                engagement so progress, decisions, approvals, and ownership can be understood without
                reconstructing weeks of conversation.
              </p>
            </div>
            <div className={styles.visibilityLedger}>
              {visibility.map(([title, copy], index) => (
                <div key={title}>
                  <span>0{index + 1}</span>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                  <b>VISIBLE</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.gatesSection}>
        <div className="container-shell">
          <div className={styles.sectionHeading}>
            <span className="eyebrow">ENGINEERING GATES</span>
            <h2>Nothing reaches production by assumption.</h2>
            <p>
              Each gate represents a question that must be answered before the next state becomes real.
              The depth of evidence scales with the system and its risk.
            </p>
          </div>
          <div className={styles.gateTrack}>
            {gates.map(([label, state], index) => (
              <div className={styles.gate} key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i aria-hidden="true" />
                <strong>{label}</strong>
                <b>{state}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.changeSection}>
        <div className="container-shell">
          <div className={styles.changeLayout}>
            <div className={styles.sectionHeading}>
              <span className="eyebrow">CHANGE CONTROL</span>
              <h2>Scope can evolve without becoming ambiguous.</h2>
              <p>
                Change is normal. Hidden impact is not. New requirements are evaluated against the
                system and delivery plan before they become commitments.
              </p>
            </div>
            <div className={styles.changeFlow}>
              {changeControl.map((item, index) => (
                <div key={item.title}>
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                  {index < changeControl.length - 1 ? <ArrowRight size={16} aria-hidden="true" /> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ownershipSection}>
        <div className="container-shell">
          <div className={styles.ownershipHead}>
            <div>
              <span className="eyebrow">OWNERSHIP & HANDOVER</span>
              <h2>Built to remain operable after delivery.</h2>
            </div>
            <p>
              The end of a phase should not create dependency on hidden context. The system, access,
              documentation, and operational responsibilities move into an agreed ownership state.
            </p>
          </div>
          <div className={styles.ownershipGrid}>
            {ownership.map((item, index) => {
              const Icon = item.icon;
              return (
                <FutureReveal key={item.title} delay={index * 0.06} className={styles.ownershipCard}>
                  <Icon size={23} strokeWidth={1.45} />
                  <span>0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </FutureReveal>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA
        eyebrow="START A PROJECT"
        title="Bring the system, constraint, or outcome."
        body="We will define the technical path, review points, validation approach, and ownership model before implementation becomes expensive."
        step="DELIVERY / PROJECT CHANNEL"
      />
    </main>
  );
}
