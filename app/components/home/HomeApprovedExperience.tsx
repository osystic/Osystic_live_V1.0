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
      <section className={styles.heroCinematic} aria-labelledby="approved-home-title">
        <div className={styles.heroCinematicGrid} aria-hidden="true" />
        <div className={styles.heroCinematicGlow} aria-hidden="true" />

        <div className={styles.robotScene} aria-hidden="true">
          <div className={styles.robotHalo} />
          <div className={styles.robotScan} />
          <svg className={styles.robotSvg} viewBox="0 0 760 760" role="presentation">
            <defs>
              <linearGradient id="robotMetal" x1="0" x2="1">
                <stop offset="0" stopColor="#0f1d31" />
                <stop offset=".48" stopColor="#243a5f" />
                <stop offset="1" stopColor="#0a1424" />
              </linearGradient>
              <linearGradient id="robotEdge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#9ab3ff" stopOpacity=".78" />
                <stop offset=".5" stopColor="#567cf1" stopOpacity=".44" />
                <stop offset="1" stopColor="#2f56c9" stopOpacity=".08" />
              </linearGradient>
              <radialGradient id="robotFaceGlow">
                <stop offset="0" stopColor="#89a8ff" stopOpacity=".3" />
                <stop offset=".55" stopColor="#3c68db" stopOpacity=".08" />
                <stop offset="1" stopColor="#1b3e8f" stopOpacity="0" />
              </radialGradient>
              <filter id="eyeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g className={styles.robotOrbitBack}>
              <ellipse cx="402" cy="345" rx="246" ry="98" transform="rotate(-16 402 345)" />
              <ellipse cx="402" cy="345" rx="232" ry="76" transform="rotate(52 402 345)" />
              <ellipse cx="402" cy="345" rx="205" ry="60" transform="rotate(108 402 345)" />
            </g>

            <circle className={styles.robotAmbient} cx="408" cy="326" r="245" fill="url(#robotFaceGlow)" />

            <g className={styles.robotBust}>
              <path className={styles.robotShoulderBack} d="M130 718C160 620 247 575 319 558L493 558C568 577 653 624 681 718Z" />
              <path className={styles.robotShoulderPanel} d="M174 718C210 637 275 610 331 594L472 594C529 610 593 638 636 718Z" />
              <path className={styles.robotNeckBack} d="M330 492L475 492L500 602L302 602Z" />
              <path className={styles.robotNeckCore} d="M355 493L448 493L462 578L341 578Z" />

              <path
                className={styles.robotHeadOuter}
                fill="url(#robotMetal)"
                d="M274 191L332 132L443 121L512 171L545 264L525 400L470 492L395 527L321 491L270 405L250 281Z"
              />
              <path className={styles.robotHeadEdge} d="M274 191L332 132L443 121L512 171L545 264L525 400L470 492L395 527L321 491L270 405L250 281Z" />
              <path className={styles.robotFacePlate} d="M302 213L349 174L434 166L486 203L508 274L493 375L454 446L398 476L340 447L300 381L282 284Z" />
              <path className={styles.robotForeheadPlate} d="M324 205L357 180L430 174L470 203L445 238L351 240Z" />
              <path className={styles.robotCheekLeft} d="M299 307L349 282L366 350L333 412L302 378Z" />
              <path className={styles.robotCheekRight} d="M492 306L443 282L426 350L460 412L492 377Z" />
              <path className={styles.robotJaw} d="M334 416L397 447L459 415L447 462L398 491L347 462Z" />

              <path className={styles.robotTempleLeft} d="M252 268L286 247L298 331L278 389L255 361Z" />
              <path className={styles.robotTempleRight} d="M542 268L510 246L499 331L519 390L541 360Z" />

              <path className={styles.robotEyeSocketLeft} d="M317 264L374 252L382 284L327 291Z" />
              <path className={styles.robotEyeSocketRight} d="M416 253L474 264L465 291L410 284Z" />
              <path className={styles.robotEyeGlow} filter="url(#eyeGlow)" d="M329 273L370 265L374 276L334 282Z" />
              <path className={styles.robotEyeGlow} filter="url(#eyeGlow)" d="M421 265L462 273L457 282L417 276Z" />

              <path className={styles.robotNoseBridge} d="M385 251L409 251L422 356L398 375L374 356Z" />
              <path className={styles.robotMouthSlot} d="M355 397L397 408L439 397L428 416L397 423L366 416Z" />

              <g className={styles.robotCircuitLines}>
                <path d="M332 210L301 182L272 184" />
                <path d="M462 213L500 187L530 192" />
                <path d="M298 347L255 371L228 371" />
                <path d="M493 347L535 372L567 372" />
                <path d="M337 452L309 500L273 511" />
                <path d="M457 451L486 500L523 511" />
                <path d="M353 174L341 143L314 126" />
                <path d="M440 173L452 142L480 126" />
              </g>

              <g className={styles.robotNodes}>
                <circle cx="272" cy="184" r="3" />
                <circle cx="530" cy="192" r="3" />
                <circle cx="228" cy="371" r="3" />
                <circle cx="567" cy="372" r="3" />
                <circle cx="273" cy="511" r="3" />
                <circle cx="523" cy="511" r="3" />
                <circle cx="314" cy="126" r="3" />
                <circle cx="480" cy="126" r="3" />
              </g>
            </g>

            <g className={styles.robotHud}>
              <path d="M150 280H230" />
              <path d="M565 238H651" />
              <path d="M575 466H665" />
              <circle cx="150" cy="280" r="3" />
              <circle cx="651" cy="238" r="3" />
              <circle cx="665" cy="466" r="3" />
            </g>
          </svg>

          <div className={[styles.robotTag, styles.robotTagA].join(" ")}>
            <span>01</span><strong>MODELS / AGENTS</strong>
          </div>
          <div className={[styles.robotTag, styles.robotTagB].join(" ")}>
            <span>02</span><strong>DATA / SYSTEMS</strong>
          </div>
          <div className={[styles.robotTag, styles.robotTagC].join(" ")}>
            <span>03</span><strong>DEPLOYMENT / CONTROL</strong>
          </div>
        </div>

        <div className={styles.heroCinematicShell}>
          <div className={styles.heroCinematicCopy}>
            <div className={styles.heroCinematicKicker}>
              <span /> ENTERPRISE AI & SOFTWARE ENGINEERING
            </div>

            <h1 id="approved-home-title">
              Production AI.<br />
              Software systems.<br />
              <span>Built to be owned.</span>
            </h1>

            <p>
              OSYSTIC engineers production AI, digital products, and data platforms for organizations
              that need reliability, deployment flexibility, and long-term technical control.
            </p>

            <div className={styles.heroCinematicActions}>
              <BookingButton className={styles.heroCinematicPrimary}>
                Book a Technical Call <ArrowRight size={15} />
              </BookingButton>
              <Link href="/case-studies" className={styles.heroCinematicSecondary}>
                Explore Our Work <ArrowRight size={15} />
              </Link>
            </div>

            <div className={styles.heroCinematicProof}>
              <span><ShieldCheck size={13} /> Engineering-led delivery</span>
              <i />
              <span>Cloud / On-Prem / Edge</span>
              <i />
              <span>Clear ownership & handover</span>
            </div>
          </div>
        </div>

        <div className={styles.heroCinematicRail}>
          <div><span>01</span><strong>PRODUCTION AI</strong><small>Models, agents, retrieval, automation</small></div>
          <div><span>02</span><strong>PRODUCT ENGINEERING</strong><small>Applications, APIs, platforms, workflows</small></div>
          <div><span>03</span><strong>DATA & CLOUD</strong><small>Pipelines, infrastructure, deployment</small></div>
          <div><span>04</span><strong>OWNERSHIP</strong><small>Source, access, documentation, handover</small></div>
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
