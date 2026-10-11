import Link from "next/link";
import { ArrowRight, Binary, BrainCircuit, Cpu, Database, Fingerprint, GitBranch, Layers3, LockKeyhole, Radar, ServerCog, ShieldCheck } from "lucide-react";
import { BookingButton } from "@/app/components/CalBooking";
import { StructuredData } from "@/app/components/seo/StructuredData";
import { createSeoMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationId } from "@/lib/structured-data";
import { SensorFusionRadar } from "./SensorFusionRadar";
import { MissionThreadSequence } from "./MissionThreadSequence";
import styles from "./aerospace-defense.module.css";

export const metadata = createSeoMetadata({
  title:"Aerospace & Defense AI & Mission Software Engineering",
  description:"OSYSTIC engineers secure AI, sensor fusion, simulation platforms, mission software, sovereign data systems, and edge deployment architectures for aerospace and defense environments.",
  path:"/industries/aerospace-defense",
  keywords:["aerospace AI engineering","defense software engineering","mission software","sensor fusion AI","secure edge AI","sovereign AI infrastructure","aerospace simulation software"],
});

const domains=[
  [Radar,"Sensor & data fusion","MULTI-MODAL / REAL-TIME","Unify telemetry, imagery, geospatial feeds, platform state, and operational context while preserving provenance and confidence."],
  [Layers3,"Simulation & digital engineering","MODEL / TEST / VERIFY","Build simulation environments, synthetic-data pipelines, digital twins, and scenario tooling before systems reach constrained environments."],
  [BrainCircuit,"Decision-support AI","ASSIST / EXPLAIN / REVIEW","Surface patterns, forecasts, classifications, and recommendations while keeping evidence and operator review visible."],
  [Cpu,"Edge-deployed intelligence","DISCONNECTED / CONSTRAINED","Run selected intelligence workloads near the platform when bandwidth, latency, sovereignty, or resilience rule out cloud-only execution."],
] as const;

const schema=[
  {"@context":"https://schema.org","@type":"Service",name:"Aerospace & Defense AI & Mission Software Engineering",description:"Secure AI, simulation, sensor fusion, mission software, sovereign infrastructure, and edge engineering.",url:"https://www.osystic.com/industries/aerospace-defense",provider:{"@id":organizationId},areaServed:{"@type":"Place",name:"Worldwide"}},
  breadcrumbSchema([{name:"Home",path:"/"},{name:"Industries",path:"/industries"},{name:"Aerospace & Defense",path:"/industries/aerospace-defense"}]),
];

export default function AerospaceDefensePage(){
  return <><StructuredData id="aerospace-defense-schema" data={schema}/><main id="main-content" className={styles.page}>
    <section className={styles.hero}><div className="container-shell"><div className={styles.heroGrid}><div>
      <span className={styles.kicker}>AEROSPACE & DEFENSE / MISSION SYSTEMS</span>
      <h1>Software for environments where uncertainty is <span>part of the system.</span></h1>
      <p>OSYSTIC engineers secure AI, simulation platforms, sensor fusion systems, mission software, and edge-deployed intelligence for controlled and operationally demanding environments.</p>
      <div className={styles.actions}><BookingButton className="button button-primary">Discuss a mission system <ArrowRight size={16}/></BookingButton><Link href="/capabilities" className="button button-secondary-dark">Explore capabilities <ArrowRight size={16}/></Link></div>
    </div><SensorFusionRadar/></div></div></section>

    <section className={styles.thread}><div className="container-shell"><div className={styles.head}><span>MISSION THREAD / SYSTEM STATE</span><h2>Intelligence is useful only when the thread stays intact.</h2><p>Sensing, context, software state, model outputs, policy, and operator workflow must agree across the mission lifecycle.</p></div><MissionThreadSequence/></div></section>

    <section className={styles.domains}><div className="container-shell"><div className={styles.headDark}><span>MISSION ENGINEERING DOMAINS</span><h2>Build around the information environment, not a single model.</h2></div><div className={styles.domainList}>{domains.map(([Icon,title,label,copy],i)=><article key={title}><span>0{i+1}</span><Icon size={21}/><div><small>{label}</small><h3>{title}</h3></div><p>{copy}</p></article>)}</div></div></section>

    <section className={styles.enclave}><div className="container-shell"><div className={styles.enclaveGrid}><div className={styles.enclaveVisual}><div className={styles.rings}><i/><i/><i/></div><div className={styles.core}><LockKeyhole size={27}/><strong>SOVEREIGN CORE</strong><small>DATA / MODEL / POLICY</small></div><div className={styles.e1}><Database size={16}/> DATA</div><div className={styles.e2}><BrainCircuit size={16}/> MODEL</div><div className={styles.e3}><Fingerprint size={16}/> AUDIT</div><div className={styles.e4}><ServerCog size={16}/> RUNTIME</div></div><div>
      <span className={styles.kicker}>SOVEREIGN AI / CONTROLLED COMPUTE</span><h2>Keep sensitive intelligence inside an architecture you can account for.</h2><p>Data, models, identities, runtime dependencies, policy, observability, and update paths all need explicit boundaries.</p><div className={styles.principles}><article><Fingerprint size={18}/><div><h3>Identity before access</h3><p>Explicit workload provenance and authorization.</p></div></article><article><ShieldCheck size={18}/><div><h3>Evidence remains attached</h3><p>Outputs preserve context, confidence, versioning, and review history.</p></div></article></div>
    </div></div></div></section>

    <section className={styles.sim}><div className="container-shell"><div className={styles.headDark}><span>SIMULATION / DIGITAL ENGINEERING</span><h2>Test more of the system before the system becomes expensive to test.</h2></div><div className={styles.simGrid}><article><GitBranch size={20}/><h3>Scenario orchestration</h3><p>Composable controlled scenarios for software and model behavior.</p></article><article><Layers3 size={20}/><h3>Digital twins</h3><p>Operational representations linked to telemetry and simulation state.</p></article><article><Binary size={20}/><h3>Synthetic data</h3><p>Purpose-built data for sparse, sensitive, or difficult conditions.</p></article></div></div></section>

    <section className={styles.closing}><div className="container-shell"><h2>Engineer for the environment, not for the demo.</h2><BookingButton className="button button-primary">Discuss the system <ArrowRight size={16}/></BookingButton></div></section>
  </main></>;
}
