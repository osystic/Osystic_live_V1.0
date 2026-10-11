"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  GitBranch,
  Globe2,
  LockKeyhole,
  Network,
  Radar,
  ScanLine,
  ShieldCheck,
  Waypoints,
  Workflow,
} from "lucide-react";
import { Component, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BookingButton } from "../components/CalBooking";
import { siteConfig } from "../config/site";
import styles from "./about.module.css";

const AboutNetwork3D = dynamic(() => import("./AboutNetwork3D"), {
  ssr: false,
  loading: () => <div className={styles.networkFallback} aria-hidden="true" />,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

class About3DBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <div className={styles.networkFallback} aria-hidden="true" /> : this.props.children;
  }
}

const thesis = [
  {
    number: "01",
    label: "VISION",
    title: "AI systems organizations can understand, operate, and own.",
    body: "We want advanced software to increase institutional capability, not create a permanent dependency on the team that built it.",
  },
  {
    number: "02",
    label: "MISSION",
    title: "Turn ambiguous problems into dependable production systems.",
    body: "We connect strategy, architecture, engineering, deployment, and handover so technical work remains tied to a concrete operating outcome.",
  },
  {
    number: "03",
    label: "STANDARD",
    title: "Make the important engineering decisions visible.",
    body: "Architecture boundaries, risk, ownership, validation, and deployment assumptions should be reviewable before they become expensive surprises.",
  },
] as const;

const excellence = [
  {
    icon: ScanLine,
    index: "01",
    label: "FRAME",
    title: "Define the real system boundary.",
    body: "Clarify users, data, operational constraints, failure modes, and what success can actually be measured against.",
    signal: "PROBLEM / EVIDENCE",
  },
  {
    icon: GitBranch,
    index: "02",
    label: "ARCHITECT",
    title: "Choose interfaces before implementation momentum takes over.",
    body: "Model components, dependencies, data flow, security boundaries, and deployment conditions before complexity becomes accidental architecture.",
    signal: "SYSTEM / BOUNDARIES",
  },
  {
    icon: Cpu,
    index: "03",
    label: "ENGINEER",
    title: "Build for observability, failure, and change.",
    body: "Production quality means the system can be tested, monitored, debugged, operated, and evolved without relying on hidden context.",
    signal: "RUNTIME / CONTROL",
  },
  {
    icon: ShieldCheck,
    index: "04",
    label: "PROVE",
    title: "Delivery ends with evidence, not presentation.",
    body: "A phase should finish with working software, validation evidence, documentation, and a clear ownership state for what comes next.",
    signal: "OUTCOME / HANDOVER",
  },
] as const;

const leadershipSlots = [
  { icon: Globe2, role: "EXECUTIVE LEADERSHIP", scope: "Company direction, market position, governance." },
  { icon: Network, role: "ENGINEERING LEADERSHIP", scope: "Architecture, technical standards, delivery quality." },
  { icon: Workflow, role: "DELIVERY LEADERSHIP", scope: "Programs, client coordination, operational outcomes." },
] as const;

export function AboutExperience() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const heroIntroRef = useRef<HTMLDivElement>(null);
  const heroSceneRef = useRef<HTMLDivElement>(null);
  const heroChaptersRef = useRef<HTMLDivElement>(null);
  const excellenceRef = useRef<HTMLElement>(null);
  const excellenceProgressRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneActive, setSceneActive] = useState(true);

  useLayoutEffect(() => {
    if (window.location.hash) return;

    ScrollTrigger.clearScrollMemory("manual");

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const section = heroRef.current;
    if (!section || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { rootMargin: "260px 0px 260px 0px", threshold: 0.01 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !sceneActive || sceneReady) return;
    const timer = window.setTimeout(() => setSceneReady(true), 120);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, sceneActive, sceneReady]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const media = gsap.matchMedia();

      media.add("(min-width: 1025px)", () => {
        const chapterNodes = gsap.utils.toArray<HTMLElement>(`.${styles.heroChapter}`, heroChaptersRef.current ?? undefined);
        gsap.set(chapterNodes, { autoAlpha: 0, y: 34 });

        const heroTimeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top+=76",
            end: "bottom bottom",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        heroTimeline
          .to(heroIntroRef.current, { y: -68, opacity: 0.12, scale: 0.96, duration: 0.26 }, 0.14)
          .to(heroSceneRef.current, { scale: 0.86, xPercent: -7, yPercent: -2, duration: 0.34 }, 0.18)
          .to(chapterNodes[0], { autoAlpha: 1, y: 0, duration: 0.18 }, 0.34)
          .to(chapterNodes[0], { opacity: 0.34, duration: 0.14 }, 0.49)
          .to(chapterNodes[1], { autoAlpha: 1, y: 0, duration: 0.18 }, 0.5)
          .to(chapterNodes[1], { opacity: 0.34, duration: 0.14 }, 0.66)
          .to(chapterNodes[2], { autoAlpha: 1, y: 0, duration: 0.18 }, 0.67)
          .to(heroSceneRef.current, { scale: 0.77, opacity: 0.68, duration: 0.18 }, 0.78);

        const stageNodes = gsap.utils.toArray<HTMLElement>(`.${styles.excellenceStage}`, excellenceRef.current ?? undefined);
        gsap.set(excellenceProgressRef.current, { scaleY: 0, transformOrigin: "top center" });
        gsap.to(excellenceProgressRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: excellenceRef.current,
            start: "top 62%",
            end: "bottom 72%",
            scrub: 0.7,
          },
        });

        stageNodes.forEach((stage) => {
          gsap.fromTo(
            stage,
            { opacity: 0.34, x: 24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.45,
              ease: "power2.out",
              scrollTrigger: {
                trigger: stage,
                start: "top 72%",
                end: "top 44%",
                scrub: 0.45,
              },
            },
          );
        });

        return () => {
          heroTimeline.scrollTrigger?.kill();
          heroTimeline.kill();
        };
      });

      return () => media.revert();
    },
    { scope: heroRef, dependencies: [reducedMotion] },
  );

  return (
    <main id="main-content" className={styles.page}>
      <section ref={heroRef} className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroSticky}>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroGlowA} aria-hidden="true" />
          <div className={styles.heroGlowB} aria-hidden="true" />

          <div className={`container-shell ${styles.heroShell}`}>
            <div ref={heroIntroRef} className={styles.heroIntro}>
              <motion.div
                className={styles.systemLabel}
                initial={false}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <span /> COMPANY / OSYSTIC
              </motion.div>
              <motion.h1
                id="about-title"
                initial={false}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                Trust is not a brand promise. <em>It is an engineering property.</em>
              </motion.h1>
              <motion.p
                initial={false}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12 }}
              >
                OSYSTIC builds production AI and software systems around visible decisions, explicit ownership, and engineering evidence that survives beyond the launch.
              </motion.p>
              <motion.div
                className={styles.heroActions}
                initial={false}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.58, delay: 0.2 }}
              >
                <BookingButton className="button button-primary">
                  Start a technical conversation <ArrowRight size={16} />
                </BookingButton>
                <Link href="/case-studies" className="button button-secondary-dark">
                  Inspect delivery evidence <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div ref={heroSceneRef} className={styles.networkStage} aria-label="Interactive global trust and scale network">
              <div className={styles.networkCanvas}>
                {sceneReady ? (
                  <About3DBoundary>
                    <AboutNetwork3D active={sceneActive} />
                  </About3DBoundary>
                ) : (
                  <div className={styles.networkFallback} aria-hidden="true" />
                )}
              </div>
              <div className={`${styles.nodeTag} ${styles.nodeTagA}`}>TRUST / CONTROL</div>
              <div className={`${styles.nodeTag} ${styles.nodeTagB}`}>SCALE / SYSTEMS</div>
              <div className={`${styles.nodeTag} ${styles.nodeTagC}`}>OWNERSHIP / HANDOVER</div>
              <div className={`${styles.nodeTag} ${styles.nodeTagD}`}>GLOBAL / DELIVERY</div>
            </div>

            <div ref={heroChaptersRef} className={styles.heroChapters} aria-label="OSYSTIC company narrative">
              <article className={styles.heroChapter}>
                <span>01 / VISION</span>
                <strong>Capability should remain with the client.</strong>
              </article>
              <article className={styles.heroChapter}>
                <span>02 / SCALE</span>
                <strong>Scale through repeatable engineering systems.</strong>
              </article>
              <article className={styles.heroChapter}>
                <span>03 / TRUST</span>
                <strong>Make claims inspectable through evidence.</strong>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.thesisSection}>
        <div className="container-shell">
          <div className={styles.sectionIntro}>
            <span className={styles.sectionIndex}>01 / COMPANY THESIS</span>
            <h2>What we are building as a company.</h2>
          </div>

          <div className={styles.thesisList}>
            {thesis.map((item, index) => (
              <motion.article
                key={item.label}
                className={styles.thesisRow}
                initial={reducedMotion ? false : { opacity: 0, y: 42 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.32 }}
                transition={{ duration: 0.72, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={styles.thesisNumber}>{item.number}</span>
                <span className={styles.thesisLabel}>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section ref={excellenceRef} className={styles.excellenceSection}>
        <div className={`container-shell ${styles.excellenceGrid}`}>
          <div className={styles.excellenceIntro}>
            <span className={styles.sectionIndex}>02 / ENGINEERING EXCELLENCE</span>
            <h2>Quality is a chain of decisions, not a final QA step.</h2>
            <p>
              Our standard is designed around traceability. Each important decision should have context, an owner, a validation path, and an operational consequence that can be inspected later.
            </p>
            <div className={styles.excellenceLegend}>
              <span><CheckCircle2 size={15} /> REVIEWABLE</span>
              <span><LockKeyhole size={15} /> OWNABLE</span>
              <span><Radar size={15} /> OBSERVABLE</span>
            </div>
          </div>

          <div className={styles.excellenceTrack}>
            <div className={styles.excellenceRail} aria-hidden="true">
              <div ref={excellenceProgressRef} />
            </div>
            {excellence.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.index} className={styles.excellenceStage}>
                  <div className={styles.stageMarker}>{item.index}</div>
                  <div className={styles.stageIcon}><Icon size={20} /></div>
                  <div className={styles.stageCopy}>
                    <span>{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                  <div className={styles.stageSignal}>{item.signal}</div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.scaleSection}>
        <div className="container-shell">
          <div className={styles.scaleHeader}>
            <span className={styles.sectionIndex}>03 / HOW WE SCALE</span>
            <h2>Systems over heroics.</h2>
            <p>Enterprise delivery becomes more dependable when the operating model does not depend on one person remembering everything.</p>
          </div>

          <div className={styles.scaleArchitecture}>
            <div className={styles.architectureCore}>
              <Waypoints size={28} />
              <strong>OSYSTIC</strong>
              <small>ENGINEERING SYSTEM</small>
            </div>
            <div className={`${styles.architectureNode} ${styles.architectureNodeA}`}>
              <Boxes size={18} /><span>MODULAR ARCHITECTURE</span><b>CHANGE WITHOUT REBUILDING EVERYTHING</b>
            </div>
            <div className={`${styles.architectureNode} ${styles.architectureNodeB}`}>
              <ShieldCheck size={18} /><span>CONTROL BOUNDARIES</span><b>SECURITY, ACCESS, GOVERNANCE</b>
            </div>
            <div className={`${styles.architectureNode} ${styles.architectureNodeC}`}>
              <Workflow size={18} /><span>DELIVERY PROTOCOL</span><b>PHASES, REVIEWS, EVIDENCE</b>
            </div>
            <div className={`${styles.architectureNode} ${styles.architectureNodeD}`}>
              <Network size={18} /><span>HANDOVER MODEL</span><b>SOURCE, DOCUMENTATION, OPERATIONS</b>
            </div>
            <span className={styles.architectureRingA} aria-hidden="true" />
            <span className={styles.architectureRingB} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="leadership" className={styles.leadershipSection}>
        <div className="container-shell">
          <div className={styles.leadershipHead}>
            <div>
              <span className={styles.sectionIndex}>04 / LEADERSHIP & GOVERNANCE</span>
              <h2>Roles should explain accountability before they advertise personalities.</h2>
            </div>
            <p>Public leadership profiles are intentionally reserved until approved company biographies and imagery are ready for publication.</p>
          </div>

          <div className={styles.leadershipGrid}>
            {leadershipSlots.map((slot, index) => {
              const Icon = slot.icon;
              return (
                <motion.article
                  key={slot.role}
                  className={styles.leadershipSlot}
                  initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, delay: index * 0.07 }}
                >
                  <div className={styles.slotTop}><span>0{index + 1}</span><Icon size={20} /></div>
                  <div className={styles.slotPortrait} aria-hidden="true"><span /><span /><span /></div>
                  <h3>{slot.role}</h3>
                  <p>{slot.scope}</p>
                  <small>PROFILE RESERVED / PUBLISH WHEN APPROVED</small>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="global-operations" className={styles.presenceSection}>
        <div className={`container-shell ${styles.presenceGrid}`}>
          <div className={styles.presenceCopy}>
            <span className={styles.sectionIndex}>05 / DELIVERY FABRIC</span>
            <h2>US presence. Global project delivery.</h2>
            <p>OSYSTIC presents a single verified United States business address and structures project delivery around systems, documentation, shared technical context, and accountable ownership.</p>
            <Link href="/contact" className={styles.inlineLink}>Start a project conversation <ArrowRight size={15} /></Link>
          </div>

          <div className={styles.presenceMap} aria-label="OSYSTIC verified operating presence">
            <span className={styles.mapGrid} aria-hidden="true" />
            <span className={styles.mapArc} aria-hidden="true" />
            <div className={`${styles.location} ${styles.locationUs}`}>
              <Globe2 size={18} />
              <span>BUSINESS PRESENCE</span>
              <b>UNITED STATES</b>
              <small>{siteConfig.address.line1}<br/>{siteConfig.address.line2}<br/>{siteConfig.address.country}</small>
            </div>
            <div className={`${styles.location} ${styles.locationGlobal}`}>
              <Cpu size={18} />
              <span>PROJECT DELIVERY</span>
              <b>GLOBAL CLIENT SYSTEMS</b>
              <small>REMOTE COLLABORATION</small>
            </div>
            <div className={styles.presenceCore}><Network size={24} /><b>OSYSTIC</b><small>CONNECTED DELIVERY</small></div>
          </div>
        </div>
      </section>
    </main>
  );
}
