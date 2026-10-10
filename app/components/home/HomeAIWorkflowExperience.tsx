"use client";

import {
  ArrowRight,
  Braces,
  DatabaseZap,
  FileInput,
  Fingerprint,
  Gauge,
  Network,
  Radar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const workflowStages = [
  {
    number: "01",
    key: "INPUT",
    title: "Input",
    icon: FileInput,
    body: "Documents, APIs, events, and structured or unstructured data enter through explicit system boundaries.",
    signal: "INGEST / NORMALIZE",
    status: "PAYLOAD ACCEPTED",
    latency: "24 ms",
    policy: "SOURCE ALLOWLIST",
    payload: ["source: approved_api", "type: customer_event", "schema: validated"],
  },
  {
    number: "02",
    key: "RETRIEVAL",
    title: "Retrieval",
    icon: DatabaseZap,
    body: "Relevant knowledge is selected from approved sources with permissions and context carried into retrieval.",
    signal: "SEARCH / RERANK",
    status: "CONTEXT RESOLVED",
    latency: "83 ms",
    policy: "TENANT FILTERED",
    payload: ["scope: workspace_07", "matches: 12", "top_k: 5"],
  },
  {
    number: "03",
    key: "REASONING",
    title: "Reasoning",
    icon: Sparkles,
    body: "Models and tools operate inside an orchestration layer that makes prompts, tools, state, and decisions inspectable.",
    signal: "MODEL / TOOLS / STATE",
    status: "PLAN EXECUTING",
    latency: "641 ms",
    policy: "TOOL SCOPED",
    payload: ["model: routed", "tools: 2 permitted", "confidence: 0.94"],
  },
  {
    number: "04",
    key: "GUARDRAILS",
    title: "Guardrails",
    icon: ShieldCheck,
    body: "Policies, validation, permissions, and deterministic checks constrain what the system can return or execute.",
    signal: "VERIFY / CONSTRAIN",
    status: "POLICY PASSED",
    latency: "17 ms",
    policy: "4 CHECKS PASSED",
    payload: ["pii: blocked", "action: authorized", "schema: enforced"],
  },
  {
    number: "05",
    key: "OUTPUT",
    title: "Output",
    icon: Braces,
    body: "The system produces an answer, decision, structured response, or downstream action with a defined contract.",
    signal: "RESPOND / ACT",
    status: "DELIVERY READY",
    latency: "31 ms",
    policy: "OUTPUT CONTRACT",
    payload: ["format: typed_json", "destination: api", "state: committed"],
  },
  {
    number: "06",
    key: "AUDIT",
    title: "Audit Trail",
    icon: ScanSearch,
    body: "Important activity is logged so teams can review behavior, evaluate quality, diagnose failures, and improve safely.",
    signal: "LOG / EVALUATE / TRACE",
    status: "TRACE COMPLETE",
    latency: "100%",
    policy: "OBSERVABLE",
    payload: ["trace_id: osy_8f21", "events: 18", "evaluation: recorded"],
  },
] as const;

const controlSignals = [
  { icon: Fingerprint, label: "Identity", value: "Scoped" },
  { icon: ShieldCheck, label: "Policy", value: "Enforced" },
  { icon: Radar, label: "Telemetry", value: "Live" },
];

export function HomeAIWorkflowExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const active = workflowStages[activeIndex];
  const ActiveIcon = active.icon;

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current || !stageRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const setStage = (index: number) => {
          setActiveIndex((current) => (current === index ? current : index));
        };

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => {
            const next = Math.min(
              workflowStages.length - 1,
              Math.floor(self.progress * workflowStages.length),
            );
            setStage(next);
          },
        });

        gsap.fromTo(
          ".future-ai-workflow-intro",
          { opacity: 0.35, y: 36 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              end: "top 28%",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          ".future-ai-runtime",
          { opacity: 0.5, y: 42, scale: 0.975 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 58%",
              end: "top 12%",
              scrub: true,
            },
          },
        );

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="home-ai-workflow"
      className="future-ai-workflow"
      data-scroll-step="05"
      aria-labelledby="home-ai-workflow-title"
    >
      <div className="future-ai-workflow-grid" aria-hidden="true" />
      <div className="future-ai-workflow-glow future-ai-workflow-glow-a" aria-hidden="true" />
      <div className="future-ai-workflow-glow future-ai-workflow-glow-b" aria-hidden="true" />

      <div ref={stageRef} className="future-ai-workflow-sticky">
        <div className="container-shell future-ai-workflow-shell">
          <header className="future-ai-workflow-intro">
            <div>
              <div className="future-section-code future-section-code-cyan">
                <span>05</span>
                <i />
                AI RUNTIME
              </div>
              <h2 id="home-ai-workflow-title">
                Production AI you can <span>inspect while it works.</span>
              </h2>
            </div>
            <div className="future-ai-workflow-copy">
              <p>
                A production system is more than a model call. Data boundaries, retrieval, tool access, validation, output contracts, and observability have to operate as one controlled runtime.
              </p>
              <div className="future-ai-control-signals" aria-label="Runtime control signals">
                {controlSignals.map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <Icon size={13} aria-hidden="true" />
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="future-ai-runtime">
            <div className="future-ai-runtime-top" aria-hidden="true">
              <span><i /> OSYSTIC / AGENT RUNTIME</span>
              <span>TRACE: OSY-05-1842</span>
              <span>05 / 10</span>
            </div>

            <nav className="future-ai-stage-rail" aria-label="Agentic workflow stages">
              {workflowStages.map((stage, index) => {
                const StageIcon = stage.icon;
                const isActive = index === activeIndex;
                const isComplete = index < activeIndex;
                return (
                  <button
                    type="button"
                    className={`${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
                    aria-pressed={isActive}
                    onClick={() => setActiveIndex(index)}
                    key={stage.key}
                  >
                    <span className="future-ai-stage-number">{stage.number}</span>
                    <span className="future-ai-stage-icon"><StageIcon size={15} /></span>
                    <span className="future-ai-stage-name">
                      <strong>{stage.title}</strong>
                      <small>{stage.signal}</small>
                    </span>
                    <span className="future-ai-stage-state" aria-hidden="true" />
                  </button>
                );
              })}
            </nav>

            <div className="future-ai-flow-map">
              <div className="future-ai-map-grid" aria-hidden="true" />
              <div className="future-ai-map-scan" aria-hidden="true" />

              <div className="future-ai-flow-heading">
                <span><Workflow size={14} /> LIVE EXECUTION PATH</span>
                <strong>RUN / 00184</strong>
              </div>

              <div className="future-ai-pipeline" aria-label={`Current workflow stage: ${active.title}`}>
                <div className="future-ai-pipeline-line" aria-hidden="true">
                  <motion.span
                    className="future-ai-packet"
                    animate={{ left: `${(activeIndex / (workflowStages.length - 1)) * 100}%` }}
                    transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>

                {workflowStages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const state = index === activeIndex ? "active" : index < activeIndex ? "complete" : "pending";
                  return (
                    <button
                      type="button"
                      className={`future-ai-pipeline-node is-${state}`}
                      style={{ left: `${(index / (workflowStages.length - 1)) * 100}%` }}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Inspect ${stage.title} stage`}
                      key={stage.key}
                    >
                      <span><StageIcon size={18} /></span>
                      <small>{stage.key}</small>
                    </button>
                  );
                })}
              </div>

              <div className="future-ai-runtime-visual">
                <AnimatePresence mode="wait">
                  <motion.div
                    className="future-ai-active-module"
                    key={active.key}
                    initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -10, scale: 1.02 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="future-ai-module-orbit" aria-hidden="true" />
                    <div className="future-ai-module-orbit future-ai-module-orbit-b" aria-hidden="true" />
                    <div className="future-ai-module-icon"><ActiveIcon size={31} /></div>
                    <span>{active.number} / ACTIVE MODULE</span>
                    <h3>{active.title}</h3>
                    <p>{active.signal}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="future-ai-runtime-links" aria-hidden="true">
                  <i className="future-ai-runtime-link-a" />
                  <i className="future-ai-runtime-link-b" />
                  <i className="future-ai-runtime-link-c" />
                </div>

                <div className="future-ai-control-plane future-ai-control-plane-top">
                  <ShieldCheck size={14} /> POLICY CONTROL PLANE
                </div>
                <div className="future-ai-control-plane future-ai-control-plane-bottom">
                  <Radar size={14} /> OBSERVABILITY PLANE
                </div>
              </div>

              <div className="future-ai-flow-footer" aria-hidden="true">
                <span><i /> REQUEST ACTIVE</span>
                <span>BOUNDARY CHECKS / ON</span>
                <span>TRACE CAPTURE / ON</span>
              </div>
            </div>

            <aside className="future-ai-inspector" aria-live="polite">
              <div className="future-ai-inspector-label">
                <span>STAGE INSPECTOR</span>
                <Gauge size={14} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${active.key}-inspector`}
                  className="future-ai-inspector-content"
                  initial={reducedMotion ? false : { opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="future-ai-inspector-stage">
                    <span>{active.number}</span>
                    <div>
                      <small>{active.key}</small>
                      <h3>{active.title}</h3>
                    </div>
                  </div>

                  <p>{active.body}</p>

                  <div className="future-ai-metrics">
                    <div><span>STATE</span><strong>{active.status}</strong></div>
                    <div><span>LATENCY</span><strong>{active.latency}</strong></div>
                    <div><span>CONTROL</span><strong>{active.policy}</strong></div>
                  </div>

                  <div className="future-ai-payload">
                    <div><Network size={13} /> RUNTIME PAYLOAD</div>
                    <code>{"{"}</code>
                    {active.payload.map((line) => (
                      <code key={line}><i /> {line}</code>
                    ))}
                    <code>{"}"}</code>
                  </div>
                </motion.div>
              </AnimatePresence>
            </aside>
          </div>

          <div className="future-ai-handoff" aria-hidden="true">
            <span>05 / AI RUNTIME</span>
            <i><b /></i>
            <span>06 / INDUSTRY CONTEXT</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </section>
  );
}
