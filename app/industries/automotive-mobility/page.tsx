import Link from "next/link";
import { Activity, ArrowRight, BatteryCharging, BrainCircuit, CarFront, CloudCog, Code2, Cpu, Database, Gauge, GitBranch, Radar, Route, ScanLine, ShieldCheck, Smartphone, Wrench } from "lucide-react";
import { BookingButton } from "@/app/components/CalBooking";
import { StructuredData } from "@/app/components/seo/StructuredData";
import { createSeoMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationId } from "@/lib/structured-data";
import { SDVCockpit } from "./SDVCockpit";
import { OtaReleaseOrchestrator } from "./OtaReleaseOrchestrator";
import styles from "./automotive-mobility.module.css";

export const metadata = createSeoMetadata({
  title:"Automotive & Mobility AI & Software Engineering",
  description:"OSYSTIC engineers software-defined vehicle platforms, ADAS and AI systems, connected fleet infrastructure, telemetry pipelines, OTA delivery architecture, and digital twins for modern mobility companies.",
  path:"/industries/automotive-mobility",
  keywords:["automotive software engineering","software defined vehicle engineering","SDV software development","ADAS AI engineering","connected fleet software","vehicle telemetry platform","OTA automotive software","automotive digital twin"],
});

const layers=[
  [Smartphone,"Vehicle experience","HMI / MOBILE / SERVICES","Driver, passenger, mobile, and fleet-facing experiences built on stable service contracts."],
  [BrainCircuit,"Application & intelligence","ADAS / AI / DOMAIN APPS","Perception, diagnostics, personalization, and domain software running against governed vehicle context."],
  [Code2,"Vehicle service layer","APIs / STATE / POLICY","A consistent layer exposing vehicle capabilities, state, identity, and lifecycle controls."],
  [Cpu,"Compute & middleware","ECU / HPC / RUNTIME","Runtime, middleware, communications, observability, and deployment infrastructure across vehicle compute."],
  [CarFront,"Physical vehicle","SENSORS / ACTUATORS / BUS","Sensors, controllers, power systems, and physical subsystems defining the operating envelope."],
] as const;

const fleet=[
  [Activity,"Vehicle telemetry","Normalize diagnostics, energy data, software state, and sensor-derived context across heterogeneous fleets."],
  [Route,"Fleet intelligence","Turn fleet state into maintenance prioritization, route intelligence, utilization analysis, and anomaly detection."],
  [Database,"Mobility data platform","Build streaming pipelines, lakehouse models, APIs, and governed data products for engineering and operations."],
  [Wrench,"Predictive service","Combine vehicle history, telemetry, diagnostic codes, and maintenance data to surface emerging service needs."],
] as const;

const schema=[
  {"@context":"https://schema.org","@type":"Service",name:"Automotive & Mobility AI & Software Engineering",description:"Software-defined vehicle, ADAS, connected fleet, telemetry, OTA, digital twin, and mobility platform engineering.",url:"https://www.osystic.com/industries/automotive-mobility",provider:{"@id":organizationId},areaServed:{"@type":"Place",name:"Worldwide"}},
  breadcrumbSchema([{name:"Home",path:"/"},{name:"Industries",path:"/industries"},{name:"Automotive & Mobility",path:"/industries/automotive-mobility"}]),
];

export default function AutomotiveMobilityPage(){
  return <><StructuredData id="automotive-mobility-schema" data={schema}/><main id="main-content" className={styles.page}>
    <section className={styles.hero}><div className="container-shell"><div className={styles.heroGrid}><div>
      <span className={styles.kicker}>AUTOMOTIVE & MOBILITY / SOFTWARE-DEFINED VEHICLES</span>
      <h1>The vehicle is becoming a <span>software platform.</span></h1>
      <p>OSYSTIC engineers the software, AI, data, cloud, and lifecycle systems behind modern mobility: SDVs, connected fleets, ADAS intelligence, telemetry platforms, OTA delivery, and digital engineering.</p>
      <div className={styles.actions}><BookingButton className="button button-primary">Discuss your mobility platform <ArrowRight size={16}/></BookingButton><Link href="/capabilities" className="button button-secondary-dark">Explore capabilities <ArrowRight size={16}/></Link></div>
    </div><SDVCockpit/></div></div></section>

    <section className={styles.anatomy}><div className="container-shell"><div className={styles.headDark}><span>SOFTWARE-DEFINED VEHICLE / ARCHITECTURE</span><h2>Decouple the product from the hardware underneath it.</h2></div><div className={styles.layerStack}>{layers.map(([Icon,title,label,copy],i)=><article key={title}><span>0{5-i}</span><Icon size={20}/><div><small>{label}</small><h3>{title}</h3></div><p>{copy}</p></article>)}</div></div></section>

    <section className={styles.fleet}><div className="container-shell"><div className={styles.head}><span>CONNECTED FLEET / TELEMETRY FABRIC</span><h2>Every vehicle becomes a node in a continuously changing system.</h2><p>Fleet software needs to understand vehicle state, software versions, anomalies, identity, and high-volume telemetry across the full lifecycle.</p></div><div className={styles.fleetBoard}><div className={styles.carA}><CarFront size={20}/> VEHICLE 047 <i/></div><div className={styles.carB}><CarFront size={20}/> VEHICLE 162 <i/></div><div className={styles.carC}><CarFront size={20}/> VEHICLE 391 <i/></div><div className={styles.cloud}><CloudCog size={28}/><strong>FLEET CLOUD</strong><small>STATE / EVENTS / POLICY</small></div></div><div className={styles.fleetCards}>{fleet.map(([Icon,title,copy])=><article key={title}><Icon size={20}/><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className={styles.ota}><div className="container-shell"><div className={styles.headDark}><span>OTA / SOFTWARE LIFECYCLE</span><h2>Ship software like a platform. Roll it out like a safety-critical fleet.</h2></div><OtaReleaseOrchestrator/></div></section>

    <section className={styles.twin}><div className="container-shell"><div className={styles.twinGrid}><div>
      <span className={styles.kicker}>DIGITAL TWIN / ENGINEERING LOOP</span><h2>Reproduce vehicle state before reproducing the problem on the road.</h2><p>Connect configuration, software versions, telemetry, scenarios, and engineering evidence into a repeatable investigation environment.</p>
      <div className={styles.twinList}><article><GitBranch size={18}/><div><h3>Scenario execution</h3><p>Replay and synthetic edge cases before fleet exposure.</p></div></article><article><Gauge size={18}/><div><h3>Engineering feedback</h3><p>Return observed behavior to product, reliability, and data teams.</p></div></article></div>
    </div><div className={styles.twinVisual}><CarFront size={64}/><div className={styles.m1}><BatteryCharging size={15}/> BATTERY</div><div className={styles.m2}><Code2 size={15}/> SOFTWARE</div><div className={styles.m3}><ScanLine size={15}/> SENSORS</div><div className={styles.m4}><ShieldCheck size={15}/> HEALTH</div></div></div></div></section>

    <section className={styles.ai}><div className="container-shell"><div className={styles.headDark}><span>ADAS / AI ENGINEERING</span><h2>Model quality is only one layer of automotive intelligence.</h2></div><div className={styles.aiGrid}><article><Radar size={22}/><h3>ADAS and sensor intelligence</h3><p>Perception tooling, model evaluation, scenario analysis, and inference infrastructure.</p></article><article><BatteryCharging size={22}/><h3>EV and battery intelligence</h3><p>Range estimation, charging behavior, battery health, and thermal signals.</p></article><article><ShieldCheck size={22}/><h3>Release confidence</h3><p>Canary cohorts, rollback, observability, provenance, and health gates.</p></article></div></div></section>

    <section className={styles.closing}><div className="container-shell"><h2>Build the vehicle software platform for what comes next.</h2><BookingButton className="button button-primary">Start the discussion <ArrowRight size={16}/></BookingButton></div></section>
  </main></>;
}
