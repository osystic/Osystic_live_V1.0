"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CircuitBoard,
  CloudCog,
  Database,
  Layers3,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BookingButton } from "../CalBooking";

const HeroScene3D = dynamic(() => import("./HeroScene3D"), {
  ssr: false,
  loading: () => <div className="future-hero-orb future-hero-orb-static" aria-hidden="true" />,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

class Hero3DBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div className="future-hero-orb future-hero-orb-static" aria-hidden="true" />
      : this.props.children;
  }
}

const telemetry = [
  { icon: Database, label: "DATA LAYER", value: "CONNECTED" },
  { icon: CircuitBoard, label: "AI CORE", value: "ORCHESTRATED" },
  { icon: ShieldCheck, label: "CONTROL", value: "GOVERNED" },
] as const;

const proof = [
  {
    icon: LockKeyhole,
    title: "Clear Ownership & Handover",
    body: "Ownership, licensing, source delivery, and handover are defined explicitly for each engagement.",
  },
  {
    icon: CloudCog,
    title: "Cloud / On-Prem / Edge",
    body: "Deploy where your data and operational constraints require.",
  },
  {
    icon: Layers3,
    title: "Phased Delivery",
    body: "Defined milestones and evaluable deliverables reduce execution risk.",
  },
  {
    icon: ShieldCheck,
    title: "Security-Conscious Engineering",
    body: "Security, access, observability, and governance are considered from design onward.",
  },
] as const;

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);
  const handoffRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneActive, setSceneActive] = useState(true);


  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { rootMargin: "280px 0px 280px 0px", threshold: 0.01 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !sceneActive || sceneReady) return;

    const mountScene = () => setSceneReady(true);
    const windowWithIdle = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (windowWithIdle.requestIdleCallback) {
      const id = windowWithIdle.requestIdleCallback(mountScene, { timeout: 650 });
      return () => windowWithIdle.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(mountScene, 160);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, sceneActive, sceneReady]);

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const media = gsap.matchMedia();

      media.add("(min-width: 1025px)", () => {
        gsap.set(proofRef.current, { autoAlpha: 0, y: 68, pointerEvents: "none" });
        gsap.set(handoffRef.current, { autoAlpha: 0, y: 18 });

        const cards = gsap.utils.toArray<HTMLElement>(".future-proof-card", proofRef.current ?? undefined);
        gsap.set(cards, { y: 34, opacity: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top+=78",
            end: "bottom bottom",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(copyRef.current, { y: -72, opacity: 0, scale: 0.97, duration: 0.28 }, 0.18)
          .to(telemetryRef.current, { y: -34, opacity: 0, duration: 0.2 }, 0.22)
          .to(
            visualRef.current,
            {
              xPercent: -36,
              yPercent: -7,
              scale: 0.73,
              opacity: 0.56,
              duration: 0.42,
            },
            0.22,
          )
          .to(proofRef.current, { autoAlpha: 1, y: 0, pointerEvents: "auto", duration: 0.24 }, 0.42)
          .to(cards, { y: 0, opacity: 1, stagger: 0.035, duration: 0.2 }, 0.46)
          .to(handoffRef.current, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.74)
          .to(visualRef.current, { yPercent: -13, scale: 0.66, opacity: 0.34, duration: 0.2 }, 0.78)
          .to(proofRef.current, { y: -14, duration: 0.18 }, 0.82);

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      className="future-hero future-story"
      data-scroll-step="01-02"
      aria-labelledby="home-hero-title"
    >
      <div className="future-story-sticky">
        <div className="future-hero-gridlines" aria-hidden="true" />
        <div className="future-hero-aurora future-hero-aurora-a" aria-hidden="true" />
        <div className="future-hero-aurora future-hero-aurora-b" aria-hidden="true" />
        <div className="future-story-scanline" aria-hidden="true" />

        <div className="container-shell future-hero-shell future-story-shell">
          <div ref={copyRef} className="future-hero-copy">
            <motion.div
              className="future-hero-kicker"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="future-status-dot" aria-hidden="true" />
              AI & SOFTWARE ENGINEERING
            </motion.div>

            <motion.h1
              id="home-hero-title"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              Production AI and software systems, <span>built to be owned.</span>
            </motion.h1>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              OSYSTIC designs, builds, and deploys AI systems, digital products, and data infrastructure for organizations where reliability, security, and long-term ownership matter.
            </motion.p>

            <motion.div
              className="future-hero-actions"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <BookingButton className="button future-primary-cta">
                Book a Technical Call <ArrowRight size={16} />
              </BookingButton>
              <Link className="button future-secondary-cta" href="/case-studies">
                Explore Our Work <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              className="future-hero-assurance"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={reducedMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ShieldCheck size={15} aria-hidden="true" />
              <span>Engineering-led delivery</span>
              <i aria-hidden="true" />
              <span>No platform lock-in</span>
            </motion.div>
          </div>

          <div
            ref={visualRef}
            className="future-hero-visual"
            aria-label="Interactive OSYSTIC production AI orchestration model"
          >
            <motion.div
              className="future-hero-orbit"
              aria-hidden="true"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {sceneReady ? <Hero3DBoundary><HeroScene3D active={sceneActive} /></Hero3DBoundary> : <div className="future-hero-orb future-hero-orb-static" />}
            </motion.div>

            <span className="future-node-label future-node-label-a">DATA & APIs</span>
            <span className="future-node-label future-node-label-b">MODELS & AGENTS</span>
            <span className="future-node-label future-node-label-c">BUSINESS LOGIC</span>
            <span className="future-node-label future-node-label-d">DEPLOY ANYWHERE</span>

            <div className="future-hero-axis future-hero-axis-x" aria-hidden="true" />
            <div className="future-hero-axis future-hero-axis-y" aria-hidden="true" />
          </div>

          <div ref={telemetryRef} className="future-hero-telemetry">
            {telemetry.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  className="future-telemetry-item"
                  key={item.label}
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.28 + index * 0.06 }}
                >
                  <Icon size={15} aria-hidden="true" />
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div ref={proofRef} className="future-proof-stage" aria-label="OSYSTIC delivery principles">
            <div className="future-proof-heading">
              <div className="future-hero-kicker">
                <span className="future-status-dot" aria-hidden="true" />
                FROM INTELLIGENCE TO DELIVERY
              </div>
              <h2>
                The system moves. The engineering discipline <span>stays connected.</span>
              </h2>
              <p>
                The same thinking that shapes the architecture continues through deployment, governance, ownership, and handover.
              </p>
            </div>

            <div className="future-proof-grid">
              {proof.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article className="future-proof-card" key={item.title}>
                    <div className="future-proof-card-top">
                      <span>0{index + 1}</span>
                      <Icon size={19} strokeWidth={1.65} aria-hidden="true" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div ref={handoffRef} className="future-story-handoff" aria-hidden="true">
            <span>02</span>
            <strong>DELIVERY PRINCIPLES</strong>
            <i />
            <span>03</span>
            <strong>PROVEN OUTCOMES</strong>
          </div>

          <Link className="future-scroll-cue" href="#selected-work" aria-label="Scroll to selected work">
            <span>SCROLL</span>
            <span className="future-scroll-mouse" aria-hidden="true"><i /></span>
            <ArrowDown size={15} aria-hidden="true" />
          </Link>

          <div className="future-hero-step" aria-hidden="true">
            <span>01</span>
            <i />
            <span>10</span>
          </div>
        </div>
      </div>
    </section>
  );
}
