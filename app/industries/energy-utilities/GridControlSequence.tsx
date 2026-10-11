"use client";
import { BrainCircuit, Database, Gauge, RadioTower, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./energy-utilities.module.css";

const stages = [
  [RadioTower,"01","FIELD SIGNAL","meters / sensors / relays"],
  [Database,"02","CONTEXT","historian / topology / state"],
  [BrainCircuit,"03","INTELLIGENCE","forecast / anomaly / recommendation"],
  [ShieldCheck,"04","POLICY GATE","confidence / validation / operator"],
  [Gauge,"05","DECISION","plan / dispatch / maintenance"],
] as const;

export function GridControlSequence(){
  const ref=useRef<HTMLDivElement>(null); const reduce=useReducedMotion();
  useEffect(()=>{ if(reduce||!ref.current)return; let clean=()=>{}; (async()=>{ const g=await import("gsap"); const s=await import("gsap/ScrollTrigger"); const gsap=g.default; gsap.registerPlugin(s.ScrollTrigger); if(!ref.current)return; const ctx=gsap.context(()=>{ gsap.fromTo("[data-flow]",{scaleX:0},{scaleX:1,ease:"none",scrollTrigger:{trigger:ref.current,start:"top 75%",end:"bottom 45%",scrub:.7}}); gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((el,i)=>gsap.fromTo(el,{opacity:.25,y:20},{opacity:1,y:0,duration:.5,delay:i*.03,scrollTrigger:{trigger:el,start:"top 84%"}})); },ref); clean=()=>ctx.revert(); })(); return()=>clean(); },[reduce]);
  return <div ref={ref} className={styles.sequence}>
    <div className={styles.flow}><i data-flow/></div>
    <div className={styles.stageGrid}>{stages.map(([Icon,code,title,copy])=><article key={code} data-stage><span>{code}</span><Icon size={18}/><strong>{title}</strong><small>{copy}</small></article>)}</div>
  </div>;
}
