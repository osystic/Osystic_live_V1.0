"use client";

import Link from "next/link";
import { ArrowRight, Building2, Factory, HeartPulse, Cpu, Radar } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { primaryIndustries } from "../../config/site";

const icons = [Building2, Factory, HeartPulse, Cpu] as const;
const coords = [[23,28],[72,22],[76,72],[28,76]] as const;

export function HomeIndustriesExperience() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.01 });
  return (
    <section ref={sectionRef} className="fh-industries" aria-labelledby="fh-industries-title">
      <div className="container-shell fh-industries-grid">
        <div className="fh-industries-copy">
          <span className="future-step">06 / INDUSTRY CONTEXT</span>
          <span className="eyebrow">OPERATIONAL RADAR</span>
          <h2 id="fh-industries-title">The same technology behaves differently inside every operating environment.</h2>
          <p>Risk, latency, data sensitivity, workflow ownership, and regulation change the architecture. Hover or focus a sector to see the context OSYSTIC designs around.</p>
          <Link href="/industries" className="future-inline-link">Explore all industries <ArrowRight size={15}/></Link>
        </div>
        <div className="fh-radar-shell">
          <div className="fh-radar" aria-hidden="true">
            <span className="fh-radar-ring r1"/><span className="fh-radar-ring r2"/><span className="fh-radar-ring r3"/>
            <motion.span
              className="fh-radar-sweep"
              animate={!reduced && inView ? { rotate: 360 } : { rotate: 0 }}
              transition={!reduced && inView ? { repeat: Infinity, duration: 9, ease: "linear" } : { duration: 0 }}
            />
            <div className="fh-radar-core"><Radar size={25}/><strong>OSYSTIC</strong><small>CONTEXT ENGINE</small></div>
            {primaryIndustries.map((item,index)=><span key={item.name} className="fh-radar-ping" style={{ left:`${coords[index][0]}%`, top:`${coords[index][1]}%` }}/>) }
          </div>
          <div className="fh-industry-orbit-list">
            {primaryIndustries.map((industry,index)=>{
              const Icon=icons[index];
              return <Link href={industry.href} className="fh-industry-orbit-card" key={industry.name}>
                <span>0{index+1}</span><Icon size={20}/><div><strong>{industry.name}</strong><p>{industry.description}</p></div><ArrowRight size={15}/>
              </Link>;
            })}
          </div>
        </div>
      </div>
      <div className="future-handoff"><span>06</span><i/><span>07</span><b>TRUST CONTROL</b></div>
    </section>
  );
}
