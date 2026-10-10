"use client";

import Link from "next/link";
import {
  ArrowRight,
  Binary,
  BrainCircuit,
  Braces,
  CloudCog,
  Code2,
  Database,
  Gauge,
  Network,
  ServerCog,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { capabilityGroups } from "../../config/site";

const layerMeta = [
  {
    code: "INTELLIGENCE LAYER",
    short: "AI",
    icon: BrainCircuit,
    signal: "REASON / RETRIEVE / PERCEIVE / ACT",
    detail: "Models, retrieval, agents, evaluation, and automation operate as a controlled intelligence layer around approved data and tools.",
    status: ["LLM + ML", "AGENTIC", "OBSERVABLE"],
  },
  {
    code: "EXPERIENCE LAYER",
    short: "PRODUCT",
    icon: Code2,
    signal: "INTERFACE / SERVICES / APIs / SAAS",
    detail: "Interfaces, business logic, APIs, and product workflows turn system capability into software people can reliably use.",
    status: ["WEB + MOBILE", "API-FIRST", "MODULAR"],
  },
  {
    code: "FOUNDATION LAYER",
    short: "DATA",
    icon: Database,
    signal: "PIPELINES / CLOUD / DEVOPS / ANALYTICS",
    detail: "Data pipelines, infrastructure, deployment systems, and telemetry provide the operational foundation beneath the product.",
    status: ["CLOUD / EDGE", "DATA OPS", "RESILIENT"],
  },
] as const;

const orbitIcons = [Sparkles, Binary, Braces, CloudCog, ServerCog, ShieldCheck] as const;

export function HomeCapabilitiesExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();



  const activeGroup = capabilityGroups[activeIndex];
  const activeMeta = layerMeta[activeIndex];
  const ActiveIcon = activeMeta.icon;
  const visibleItems = activeGroup.items.slice(0, 6);

  return (
    <section
      id="home-capabilities"
      className="future-capabilities"
      data-scroll-step="04"
      aria-labelledby="home-capabilities-title"
    >
      <div className="future-capabilities-grid" aria-hidden="true" />
      <div className="future-capabilities-aurora future-capabilities-aurora-a" aria-hidden="true" />
      <div className="future-capabilities-aurora future-capabilities-aurora-b" aria-hidden="true" />
      <div className="future-capability-energy" aria-hidden="true" />

      <div className="future-capabilities-sticky">
        <div className="container-shell future-capabilities-shell">
          <div className="future-capabilities-intro">
            <div>
              <div className="future-section-code">
                <span>04</span>
                <i />
                CAPABILITY SYSTEMS
              </div>
              <h2 id="home-capabilities-title">
                One engineering system. <span>Three connected layers.</span>
              </h2>
            </div>
            <div className="future-capabilities-intro-copy">
              <p>
                AI, product engineering, and infrastructure are designed together so intelligence can move from data to production without fragmented ownership.
              </p>
              <Link href="/capabilities" className="future-inline-link">
                Explore the full capability stack <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="future-capability-console">
            <div className="future-capability-console-top" aria-hidden="true">
              <span><i /> OSYSTIC ENGINEERING SYSTEM</span>
              <span>ARCHITECTURE / LIVE</span>
              <span>04 / 10</span>
            </div>

            <nav className="future-capability-rail" aria-label="Homepage capability layers">
              {capabilityGroups.map((group, index) => {
                const MetaIcon = layerMeta[index].icon;
                const isActive = index === activeIndex;
                return (
                  <button
                    type="button"
                    className={isActive ? "is-active" : undefined}
                    aria-pressed={isActive}
                    onClick={() => setActiveIndex(index)}
                    key={group.title}
                  >
                    <span className="future-capability-rail-number">0{index + 1}</span>
                    <span className="future-capability-rail-icon"><MetaIcon size={17} /></span>
                    <span>
                      <strong>{group.title}</strong>
                      <small>{layerMeta[index].code}</small>
                    </span>
                    <i aria-hidden="true" />
                  </button>
                );
              })}
            </nav>

            <div className="future-capability-map" aria-live="polite">
              <div className="future-capability-map-grid" aria-hidden="true" />
              <div className="future-capability-map-ring future-capability-map-ring-a" aria-hidden="true" />
              <div className="future-capability-map-ring future-capability-map-ring-b" aria-hidden="true" />
              <svg className="future-capability-connectors" viewBox="0 0 600 520" preserveAspectRatio="none" aria-hidden="true">
                <path d="M300 260 L300 72" />
                <path d="M300 260 L486 155" />
                <path d="M300 260 L486 365" />
                <path d="M300 260 L300 452" />
                <path d="M300 260 L114 365" />
                <path d="M300 260 L114 155" />
              </svg>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup.title}
                  className="future-capability-core"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.86, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, scale: 1.08, rotate: 4 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="future-capability-core-pulse" aria-hidden="true" />
                  <ActiveIcon size={32} strokeWidth={1.45} aria-hidden="true" />
                  <strong>{activeMeta.short}</strong>
                  <span>{activeMeta.code}</span>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeGroup.title}-nodes`}
                  className="future-capability-nodes"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  {visibleItems.map(([label, href], index) => {
                    const NodeIcon = orbitIcons[index];
                    return (
                      <Link
                        className={`future-cap-node future-cap-node-${index + 1}`}
                        href={href}
                        key={label}
                      >
                        <span><NodeIcon size={14} aria-hidden="true" /></span>
                        <strong>{label}</strong>
                      </Link>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              <div className="future-capability-map-caption" aria-hidden="true">
                <Network size={14} /> DEPENDENCY GRAPH / {activeMeta.signal}
              </div>
            </div>

            <div className="future-capability-detail">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeGroup.title}-detail`}
                  initial={reducedMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: -14 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="future-capability-detail-code">{activeMeta.code}</span>
                  <h3>{activeGroup.title}</h3>
                  <p>{activeMeta.detail}</p>

                  <div className="future-capability-status-row">
                    {activeMeta.status.map(status => <span key={status}>{status}</span>)}
                  </div>

                  <div className="future-capability-signal">
                    <Gauge size={15} aria-hidden="true" />
                    <div>
                      <span>SYSTEM ROLE</span>
                      <strong>{activeMeta.signal}</strong>
                    </div>
                  </div>

                  <Link href={activeGroup.href} className="future-capability-explore">
                    Explore {activeGroup.title} <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="future-capabilities-handoff" aria-hidden="true">
            <span>04</span>
            <strong>CAPABILITY SYSTEMS</strong>
            <i />
            <span>05</span>
            <strong>AI WORKFLOW</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
