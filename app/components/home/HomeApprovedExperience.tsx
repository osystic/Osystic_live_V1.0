import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight, BrainCircuit, CloudCog, Code2, Database, LockKeyhole,
  Layers3, ShieldCheck, Search, Boxes, Rocket, Bot,
} from "lucide-react";
import { BookingButton } from "../CalBooking";
import { INDUSTRIES } from "../../_data/industries-data";
import { HeroReveal } from "./Reveal";
import styles from "./HomeApprovedExperience.module.css";

const delivery = [
  { number: "01", title: "Clear Ownership & Handover", copy: "Ownership, licensing, source delivery, and handover are defined explicitly for each engagement.", icon: LockKeyhole },
  { number: "02", title: "Cloud / On-Prem / Edge", copy: "Deploy where your data, operational, and regulatory constraints require.", icon: CloudCog },
  { number: "03", title: "Phased Delivery", copy: "Defined milestones and evaluable deliverables reduce execution risk.", icon: Layers3 },
  { number: "04", title: "Security-Conscious Engineering", copy: "Security, access, observability, and governance are considered from design onward.", icon: ShieldCheck },
] as const;

const selectedWork = [
  { tag: "AI PLATFORM", title: "Enterprise AI Knowledge Platform", copy: "Secure, domain-specific AI platform for knowledge-intensive workflows.", image: "/media/work/financial-research.webp", href: "/case-studies" },
  { tag: "COMPUTER VISION", title: "Manufacturing Quality Inspection", copy: "Real-time visual inspection system designed for production environments.", image: "/media/work/predictive-maintenance.webp", href: "/case-studies" },
  { tag: "DATA INFRASTRUCTURE", title: "Data Platform Modernization", copy: "Scalable data foundations for analytics, automation, and AI workloads.", image: "/media/work/cloud-modernization.webp", href: "/case-studies" },
] as const;

const capabilities = [
  { title: "AI & Machine Learning", copy: "Custom AI solutions for real-world business problems.", href: "/capabilities/ai-systems", icon: BrainCircuit },
  { title: "Custom Software Development", copy: "Scalable, secure, and maintainable software systems.", href: "/capabilities/product-engineering", icon: Code2 },
  { title: "Data Engineering", copy: "Modern data platforms, pipelines, and analytics foundations.", href: "/services/data-cloud/data", icon: Database },
  { title: "Cloud & DevOps", copy: "Reliable deployment, infrastructure, and platform operations.", href: "/services/devops-cloud", icon: CloudCog },
  { title: "Security & Compliance", copy: "Security-first engineering patterns for production systems.", href: "/trust", icon: ShieldCheck },
  { title: "AI Agents & Automation", copy: "Intelligent automation for repeatable business workflows.", href: "/services/intelligent-automation", icon: Bot },
] as const;

const workflow = [
  { number: "01", title: "Discover & Define", copy: "Clarify objectives, constraints, risks, and acceptance criteria.", icon: Search },
  { number: "02", title: "Architect & Plan", copy: "Define system boundaries, delivery stages, and review points.", icon: Layers3 },
  { number: "03", title: "Build", copy: "Ship working increments with visible decisions and feedback.", icon: Boxes },
  { number: "04", title: "Validate", copy: "Test behavior, edge cases, security, and operational readiness.", icon: ShieldCheck },
  { number: "05", title: "Release", copy: "Move through UAT and production approval with explicit state.", icon: Rocket },
  { number: "06", title: "Handover", copy: "Transfer source, context, access, and operational ownership.", icon: LockKeyhole },
] as const;


const insights = [
  { tag: "AI SYSTEMS", title: "Building reliable agentic systems beyond the demo", copy: "Guardrails, evaluation, tool permissions, observability, and production ownership.", href: "/insights" },
  { tag: "CLOUD & SECURITY", title: "Choosing between cloud, on-premise, and hybrid AI deployment", copy: "A practical architecture lens for privacy, latency, governance, and infrastructure.", href: "/insights" },
  { tag: "EDGE AI", title: "What changes when machine learning moves to the edge", copy: "Hardware constraints, telemetry, update strategy, and reliability for real-time inference.", href: "/insights" },
] as const;

const trustLogos = ["Microsoft", "aws", "Google Cloud", "NVIDIA", "Vercel", "docker"];

const featuredIndustryConfig = [
  { slug: "healthcare", copy: "Clinical AI, diagnostics, and secure health systems." },
  { slug: "finance", copy: "Fraud, risk, compliance, and financial intelligence." },
  { slug: "manufacturing", copy: "Quality, predictive maintenance, and production intelligence." },
  { slug: "retail", copy: "Personalisation, inventory, and customer intelligence." },
  { slug: "energy-utilities", copy: "Grid intelligence, edge AI, and critical infrastructure." },
  { slug: "automotive-mobility", copy: "Connected mobility, ADAS, and software-defined platforms." },
] as const;

const featuredIndustries = featuredIndustryConfig.flatMap(({ slug, copy }) => {
  const industry = INDUSTRIES.find((item) => item.slug === slug);
  return industry ? [{ ...industry, homeCopy: copy }] : [];
});
export function HomeApprovedExperience() {
  return (
    <div className={styles.page}>
      <section className={styles.heroNext} aria-labelledby="approved-home-title">
        <div className={styles.heroBackdrop} aria-hidden="true" />
        <div className={styles.heroGridFine} aria-hidden="true" />

        <div className={styles.heroShellNext}>
          <div className={styles.heroCopyNext}>
            <div className={styles.heroKickerNext}>
              <span />
              ENTERPRISE AI & SOFTWARE ENGINEERING
            </div>

            <h1 id="approved-home-title">
              Production AI and software systems, <span>built to be owned.</span>
            </h1>

            <p className={styles.heroLeadNext}>
              OSYSTIC engineers AI systems, digital products, and data platforms for organizations
              that need production reliability, deployment flexibility, and long-term technical ownership.
            </p>

            <div className={styles.heroActionsNext}>
              <BookingButton className={styles.heroPrimaryNext}>
                Book a Technical Call <ArrowRight size={15} />
              </BookingButton>
              <Link href="/case-studies" className={styles.heroSecondaryNext}>
                Explore Our Work <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.heroAssuranceNext}>
              <span><ShieldCheck size={13} /> Engineering-led delivery</span>
              <i />
              <span>Explicit handover</span>
              <i />
              <span>No platform lock-in</span>
            </div>
          </div>

          <HeroReveal className={styles.blueprintWrap}>
            <div className={styles.blueprintTopbar}>
              <div>
                <span className={styles.blueprintDot} />
                OSYSTIC / SYSTEM_BLUEPRINT
              </div>
              <strong>PRODUCTION / READY</strong>
            </div>

            <div className={styles.blueprintBody}>
              <div className={styles.blueprintFlow}>
                <div className={styles.blueprintLayer}>
                  <span className={styles.blueprintNumber}>01</span>
                  <div className={styles.blueprintIcon}><Database size={17} strokeWidth={1.45} /></div>
                  <div>
                    <small>DATA & CONTEXT</small>
                    <strong>Operational inputs</strong>
                    <p>APIs, applications, documents, events, and business data.</p>
                  </div>
                  <b>CONNECTED</b>
                </div>
                <div className={styles.blueprintConnector} aria-hidden="true"><i /></div>

                <div className={styles.blueprintLayer}>
                  <span className={styles.blueprintNumber}>02</span>
                  <div className={styles.blueprintIcon}><BrainCircuit size={17} strokeWidth={1.45} /></div>
                  <div>
                    <small>INTELLIGENCE</small>
                    <strong>Models & agents</strong>
                    <p>Reasoning, retrieval, prediction, orchestration, and automation.</p>
                  </div>
                  <b>CONTROLLED</b>
                </div>
                <div className={styles.blueprintConnector} aria-hidden="true"><i /></div>

                <div className={styles.blueprintLayer}>
                  <span className={styles.blueprintNumber}>03</span>
                  <div className={styles.blueprintIcon}><Code2 size={17} strokeWidth={1.45} /></div>
                  <div>
                    <small>PRODUCT LAYER</small>
                    <strong>Logic & experience</strong>
                    <p>Business rules, workflows, interfaces, services, and integrations.</p>
                  </div>
                  <b>REVIEWABLE</b>
                </div>
                <div className={styles.blueprintConnector} aria-hidden="true"><i /></div>

                <div className={styles.blueprintLayer}>
                  <span className={styles.blueprintNumber}>04</span>
                  <div className={styles.blueprintIcon}><CloudCog size={17} strokeWidth={1.45} /></div>
                  <div>
                    <small>RUNTIME</small>
                    <strong>Deploy where required</strong>
                    <p>Cloud, on-premise, hybrid, and edge environments.</p>
                  </div>
                  <b>OPERABLE</b>
                </div>
              </div>

              <aside className={styles.blueprintControls}>
                <div className={styles.controlsHead}>
                  <span>DELIVERY CONTROLS</span>
                  <i />
                </div>
                <div>
                  <span>Security by design</span>
                  <strong>ACTIVE</strong>
                </div>
                <div>
                  <span>Observability</span>
                  <strong>DEFINED</strong>
                </div>
                <div>
                  <span>Source handover</span>
                  <strong>INCLUDED</strong>
                </div>
                <div>
                  <span>Deployment model</span>
                  <strong>FLEXIBLE</strong>
                </div>
                <div className={styles.controlsFooter}>
                  <small>OWNERSHIP STATE</small>
                  <b>CLIENT-CONTROLLED</b>
                </div>
              </aside>
            </div>
          </HeroReveal>
        </div>

        <div className={styles.heroPrinciples}>
          {delivery.map((item) => {
            const Icon = item.icon;
            return (
              <div className={styles.heroPrinciple} key={item.title}>
                <span>{item.number}</span>
                <Icon size={18} strokeWidth={1.4} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={[styles.section, styles.light].join(" ")} id="selected-work">
        <div className={styles.sectionShell}>
          <div className={styles.sectionHead}>
            <div><div className={styles.blueEyebrow}>SELECTED WORK</div><h2>Real systems. Real outcomes.</h2></div>
            <Link href="/case-studies" className={styles.inlineLink}>View all case studies <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.workGrid}>
            {selectedWork.map((item) => (
              <article
                className={styles.workCard}
                key={item.title}
              >
                <Link href={item.href} className={styles.workMedia}>
                  <Image src={item.image} alt="" fill sizes="(max-width:760px) 92vw, 31vw" /><span>{item.tag}</span>
                </Link>
                <div className={styles.workBody}>
                  <h3>{item.title}</h3><p>{item.copy}</p>
                  <Link href={item.href} className={styles.cardLink}>View Case Study <ArrowRight size={13} /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={[styles.section, styles.dark].join(" ")}>
        <div className={styles.sectionShell}>
          <div className={styles.sectionHead}>
            <div>
              <div className={styles.darkEyebrow}>WHAT WE DO</div>
              <h2>Our Capabilities</h2>
              <p>End-to-end engineering capabilities to design, build, and deploy production-ready AI and software systems.</p>
            </div>
            <Link href="/capabilities" className={styles.darkInlineLink}>View all services <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                >
                  <Link href={item.href} className={styles.capabilityCard}>
                    <div className={styles.capabilityIcon}><Icon size={22} strokeWidth={1.45} /></div>
                    <ArrowRight size={14} className={styles.capabilityArrow} />
                    <h3>{item.title}</h3><p>{item.copy}</p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={[styles.section, styles.workflowSection].join(" ")}>
        <div className={styles.sectionShell}>
          <div className={styles.centerHead}>
            <div className={styles.blueEyebrow}>HOW WE WORK</div>
            <h2>Engineering delivery with explicit checkpoints.</h2>
            <p>Scope, technical decisions, acceptance criteria, and ownership remain visible throughout the engagement.</p>
          </div>
          <div className={styles.workflowTrack}>
            {workflow.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className={styles.workflowStep}
                  key={item.title}
                >
                  <div className={styles.workflowLine} aria-hidden="true" />
                  <div className={styles.workflowNumber}>{item.number}</div>
                  <Icon size={20} /><h3>{item.title}</h3><p>{item.copy}</p>
                </article>
              );
            })}
          </div>
          <Link href="/how-we-work" className={styles.workflowLink}>
            Explore how we work <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className={[styles.section, styles.dark, styles.industriesSection].join(" ")}>
        <div className={styles.sectionShell}>
          <div className={styles.sectionHead}>
            <div>
              <div className={styles.darkEyebrow}>INDUSTRY EXPERTISE</div>
              <h2>Industries We Serve</h2>
              <p>Selected sectors where AI, software, and operational complexity create meaningful engineering opportunities.</p>
            </div>
            <Link href="/industries" className={styles.industryExploreLink}>
              <span>Explore all industries <ArrowRight size={14} /></span>
              <small>{INDUSTRIES.length} sectors</small>
            </Link>
          </div>
          <div className={styles.industryGrid}>
            {featuredIndustries.map((item, index) => (
              <Link
                key={item.slug}
                href={item.href}
                className={styles.industryCard}
                style={{ "--industry-accent": item.accent } as CSSProperties}
              >
                <span className={styles.industryNumber}>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <small>{item.homeCopy}</small>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <div className={styles.sectionShell}>
          <div className={styles.centerHead}>
            <div className={styles.blueEyebrow}>TECHNOLOGY ECOSYSTEM</div>
            <h2>Built with leading platforms and tools.</h2>
          </div>
          <div className={styles.logoStrip} aria-label="Technology ecosystem">{trustLogos.map((logo) => <span key={logo}>{logo}</span>)}</div>
        </div>
      </section>

      <section className={[styles.section, styles.insightsSection].join(" ")}>
        <div className={styles.sectionShell}>
          <div className={styles.sectionHead}>
            <div><div className={styles.blueEyebrow}>INSIGHTS / BLOGS</div><h2>Technical perspective without the noise.</h2></div>
            <Link href="/insights" className={styles.inlineLink}>View all insights <ArrowRight size={14} /></Link>
          </div>
          <div className={styles.insightGrid}>
            {insights.map((item) => (
              <article
                className={styles.insightCard}
                key={item.title}
              >
                <span>{item.tag}</span><h3>{item.title}</h3><p>{item.copy}</p>
                <Link href={item.href} className={styles.cardLink}>Read insight <ArrowRight size={13} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalGrid} aria-hidden="true" />
        <div className={styles.finalWave} aria-hidden="true">
          <svg viewBox="0 0 900 300" preserveAspectRatio="none">
            <defs><linearGradient id="waveStroke" x1="0" x2="1"><stop offset="0" stopColor="#1d4fff" stopOpacity="0" /><stop offset=".42" stopColor="#4a75ff" /><stop offset=".68" stopColor="#6cbaff" /><stop offset="1" stopColor="#1d4fff" stopOpacity="0" /></linearGradient></defs>
            {Array.from({ length: 18 }).map((_, index) => (
              <path
                key={index}
                d={"M0 " + (150 + index * 2) + " C180 " + (60 + index * 3) + ", 300 " + (250 - index * 4) + ", 470 " + (150 + index) + " S760 " + (60 + index * 3) + ", 900 " + (150 + index * 2)}
                fill="none"
                stroke="url(#waveStroke)"
                strokeWidth={index % 5 === 0 ? 1.5 : 0.8}
                opacity={0.22 + (index % 4) * 0.08}
              />
            ))}
          </svg>
        </div>
        <div className={styles.sectionShell}>
          <div className={styles.finalInner}>
            <div><h2>Ready to build what’s next?</h2><p>Let’s discuss your project and explore how we can help you achieve your goals with AI and modern software engineering.</p></div>
            <div className={styles.finalActions}>
              <BookingButton className={styles.primaryButton}>Book a Technical Call <ArrowRight size={15} /></BookingButton>
              <Link href="/capabilities" className={styles.secondaryButton}>Explore Our Services <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
