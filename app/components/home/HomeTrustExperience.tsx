"use client";

import Link from "next/link";
import { ArrowRight, Fingerprint, ScanSearch, CheckCircle2, LockKeyhole, Activity } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const controls = [
  [Fingerprint,"Data boundary","Deployment and access patterns stay inside approved ownership boundaries."],
  [ScanSearch,"Observability","Critical model, workflow, and platform behavior can be traced and reviewed."],
  [CheckCircle2,"Acceptance","Delivery phases, evidence, decisions, and handoff criteria stay explicit."],
] as const;

export function HomeTrustExperience(){
  const reduced=useReducedMotion();
  const sectionRef=useRef<HTMLElement>(null);
  const inView=useInView(sectionRef,{amount:0.01});
  return <section ref={sectionRef} className="fh-trust" aria-labelledby="fh-trust-title">
    <div className="container-shell fh-trust-grid">
      <div className="fh-trust-console">
        <div className="fh-console-bar"><span/><span/><span/><b>CONTROL_PLANE / LIVE</b></div>
        <div className="fh-shield-map">
          <motion.div
            className="fh-shield-pulse"
            animate={!reduced&&inView?{scale:[1,1.08,1],opacity:[.45,.8,.45]}:{scale:1,opacity:.45}}
            transition={!reduced&&inView?{duration:3.2,repeat:Infinity}:{duration:0}}
          />
          <div className="fh-shield-core"><LockKeyhole size={34}/><strong>OWNED</strong><small>ACCESS CONTROLLED</small></div>
          <div className="fh-trust-metric m1"><Activity size={14}/><span>AUDIT</span><b>ACTIVE</b></div>
          <div className="fh-trust-metric m2"><span>DEPLOY</span><b>FLEXIBLE</b></div>
          <div className="fh-trust-metric m3"><span>HANDOFF</span><b>DEFINED</b></div>
        </div>
      </div>
      <div className="fh-trust-copy">
        <span className="future-step">07 / TRUST & SECURITY</span>
        <span className="eyebrow">CONTROL PLANE</span>
        <h2 id="fh-trust-title">Ownership, auditability, and operational control are part of the architecture.</h2>
        <p>We do not turn framework names into unsupported certification claims. Controls are mapped to the actual data, system, infrastructure, and engagement boundaries.</p>
        <div className="fh-trust-controls">{controls.map(([Icon,title,body])=><div key={title}><Icon size={18}/><span><strong>{title}</strong><small>{body}</small></span></div>)}</div>
        <Link href="/trust" className="future-inline-link">Open trust architecture <ArrowRight size={15}/></Link>
      </div>
    </div>
    <div className="future-handoff"><span>07</span><i/><span>08</span><b>KNOWLEDGE SIGNAL</b></div>
  </section>;
}
