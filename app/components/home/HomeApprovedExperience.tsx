import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight, BrainCircuit, CloudCog, Code2, Database, LockKeyhole,
  Layers3, ShieldCheck, Search, PenTool, Boxes, Rocket, Bot,
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
  { number: "01", title: "Discover", copy: "Understand your needs and define objectives.", icon: Search },
  { number: "02", title: "Design", copy: "Architect the solution and plan implementation.", icon: PenTool },
  { number: "03", title: "Build", copy: "Develop and iterate with continuous feedback.", icon: Boxes },
  { number: "04", title: "Deploy", copy: "Launch, validate, and support adoption.", icon: Rocket },
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
      <section className={styles.hero} aria-labelledby="approved-home-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>AI & SOFTWARE ENGINEERING</div>
            <h1 id="approved-home-title">
              Production AI and<br />
              software systems, <span>built to be owned.</span>
            </h1>
            <p>OSYSTIC designs, builds, and deploys AI systems, digital products, and data infrastructure for organizations where reliability, security, and long-term ownership matter.</p>
            <div className={styles.heroActions}>
              <BookingButton className={styles.primaryButton}>Book a Technical Call <ArrowRight size={15} /></BookingButton>
              <Link href="/case-studies" className={styles.secondaryButton}>Explore Our Work <ArrowRight size={15} /></Link>
            </div>
            <div className={styles.heroProof}><ShieldCheck size={14} /> Engineering-led delivery <span>•</span> No platform lock-in.</div>
          </div>

          <HeroReveal className={styles.heroVisual}>
            <div className={styles.heroScene} aria-hidden="true">
              <div className={styles.networkGlow} />
              <svg className={styles.networkSvg} viewBox="0 0 620 620">
                <defs>
                  <radialGradient id="coreGlow">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset=".16" stopColor="#9db7ff" />
                    <stop offset=".48" stopColor="#557cff" stopOpacity=".65" />
                    <stop offset="1" stopColor="#2955dd" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="meshStroke" x1="0" x2="1">
                    <stop offset="0" stopColor="#5576ff" stopOpacity=".28" />
                    <stop offset=".5" stopColor="#dbe4ff" stopOpacity=".9" />
                    <stop offset="1" stopColor="#5576ff" stopOpacity=".28" />
                  </linearGradient>
                </defs>
                <g className={styles.orbitGroup}>
                  <ellipse cx="310" cy="310" rx="210" ry="78" transform="rotate(-18 310 310)" />
                  <ellipse cx="310" cy="310" rx="212" ry="83" transform="rotate(55 310 310)" />
                  <ellipse cx="310" cy="310" rx="196" ry="68" transform="rotate(112 310 310)" />
                </g>
                <g className={styles.meshGroup}>
                  <polygon points="310,116 441,165 500,291 447,431 310,505 174,444 119,310 175,170" />
                  <polygon points="310,148 405,188 470,281 433,392 317,470 205,418 151,311 203,207" />
                  <polygon points="310,182 390,223 433,310 388,398 307,432 225,391 188,307 232,224" />
                  <path d="M310 116L310 505M119 310L500 291M175 170L447 431M441 165L174 444M203 207L433 392M151 311L470 281M225 391L390 223" />
                  <path d="M310 148L433 392L205 418L405 188L151 311L317 470L203 207L470 281L225 391L310 148" />
                </g>
                <g className={styles.nodeGroup}>
                  {[
                    [310,116,7],[441,165,6],[500,291,8],[447,431,6],[310,505,7],[174,444,6],[119,310,8],[175,170,6],
                    [310,148,4],[405,188,5],[470,281,4],[433,392,5],[317,470,4],[205,418,5],[151,311,4],[203,207,5],
                    [310,182,4],[390,223,4],[433,310,5],[388,398,4],[307,432,4],[225,391,5],[188,307,4],[232,224,4]
                  ].map(([cx,cy,r],i)=><circle key={i} cx={cx} cy={cy} r={r} />)}
                </g>
                <circle className={styles.coreHalo} cx="310" cy="310" r="98" />
                <circle className={styles.coreHaloSoft} cx="310" cy="310" r="144" />
                <circle className={styles.corePoint} cx="310" cy="310" r="42" fill="url(#coreGlow)" />
                <circle className={styles.coreWhite} cx="310" cy="310" r="5" />
              </svg>
              <div className={styles.particleField}>
                {Array.from({ length: 34 }).map((_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}
              </div>
            </div>
            <span className={[styles.heroLabel, styles.labelA].join(" ")}>DATA & APIs</span>
            <span className={[styles.heroLabel, styles.labelB].join(" ")}>MODELS & AGENTS</span>
            <span className={[styles.heroLabel, styles.labelC].join(" ")}>BUSINESS LOGIC</span>
            <span className={[styles.heroLabel, styles.labelD].join(" ")}>DEPLOY ANYWHERE</span>
          </HeroReveal>
        </div>

        <div className={styles.heroTrace} aria-hidden="true"><span /><i /></div>

        <div className={styles.deliveryBand}>
          <div className={styles.deliveryIntro}>
            <div className={styles.eyebrow}>FROM INTELLIGENCE TO DELIVERY</div>
            <h2>The system moves. The engineering discipline <span>stays connected.</span></h2>
          </div>
          <div className={styles.deliveryCards}>
            {delivery.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className={styles.deliveryCard}
                  key={item.title}
                >
                  <div className={styles.deliveryTop}><span>{item.number}</span><Icon size={24} strokeWidth={1.5} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              );
            })}
          </div>
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
            <div className={styles.blueEyebrow}>OUR PROCESS</div>
            <h2>Our AI Development Workflow</h2>
            <p>A proven methodology from concept to deployment, ensuring successful AI implementation.</p>
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
        </div>
      </section>

      <section className={[styles.section, styles.dark].join(" ")}>
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
