import Link from "next/link";
import { ArrowRight, BrainCircuit, Cable, Cpu, Gauge, Network, ServerCog, ShieldCheck, Wrench, Zap } from "lucide-react";
import { BookingButton } from "@/app/components/CalBooking";
import { StructuredData } from "@/app/components/seo/StructuredData";
import { createSeoMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationId } from "@/lib/structured-data";
import { EnergyGridExperience } from "./EnergyGridExperience";
import { GridControlSequence } from "./GridControlSequence";
import styles from "./energy-utilities.module.css";

export const metadata = createSeoMetadata({
  title: "Energy & Utilities AI & Software Engineering",
  description: "OSYSTIC engineers grid intelligence, edge AI, predictive asset systems, OT integrations, and cloud data platforms for energy and utility operators.",
  path: "/industries/energy-utilities",
  keywords: ["energy utilities AI","smart grid software engineering","grid intelligence","edge AI utilities","predictive maintenance utilities","OT IT integration","energy data platform"],
});

const workloads = [
  { icon: Gauge, title: "Grid forecasting", copy: "Forecast load, generation, renewable variability, and operating constraints from continuously updated system state." },
  { icon: Wrench, title: "Predictive asset intelligence", copy: "Combine telemetry, inspection history, and maintenance records to surface emerging failure signatures." },
  { icon: Cpu, title: "Edge inspection", copy: "Run vision and anomaly detection close to field assets when latency, connectivity, or data movement matters." },
  { icon: Network, title: "OT / IT integration", copy: "Connect operational telemetry and enterprise data without flattening critical security boundaries." },
] as const;

const schema = [
  { "@context":"https://schema.org", "@type":"Service", name:"Energy & Utilities AI & Software Engineering", description:"Grid intelligence, edge AI, predictive maintenance, OT integration, and data-platform engineering for energy and utility operators.", url:"https://www.osystic.com/industries/energy-utilities", provider:{ "@id":organizationId }, areaServed:{ "@type":"Place", name:"Worldwide" } },
  breadcrumbSchema([{name:"Home",path:"/"},{name:"Industries",path:"/industries"},{name:"Energy & Utilities",path:"/industries/energy-utilities"}]),
];

export default function EnergyUtilitiesPage() {
  return <>
    <StructuredData id="energy-utilities-schema" data={schema} />
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <div className="container-shell">
          <div className={styles.heroGrid}>
            <div>
              <span className={styles.kicker}>ENERGY & UTILITIES / CRITICAL INFRASTRUCTURE</span>
              <h1>Intelligence for grids that cannot afford <span>blind spots.</span></h1>
              <p>OSYSTIC engineers production AI and software for utilities, energy operators, and critical infrastructure teams, connecting field telemetry, asset data, edge compute, and cloud platforms into observable decision systems.</p>
              <div className={styles.actions}>
                <BookingButton className="button button-primary">Discuss your grid <ArrowRight size={16}/></BookingButton>
                <Link href="/capabilities" className="button button-secondary-dark">Explore capabilities <ArrowRight size={16}/></Link>
              </div>
            </div>
            <EnergyGridExperience />
          </div>
        </div>
      </section>

      <section className={styles.control}>
        <div className="container-shell">
          <div className={styles.sectionHead}>
            <span>GRID INTELLIGENCE CONTROL PLANE</span>
            <h2>From field signal to governed decision.</h2>
            <p>The architecture starts with how a signal moves through operational infrastructure, what it is allowed to influence, and what evidence operators need to trust it.</p>
          </div>
          <GridControlSequence />
        </div>
      </section>

      <section className={styles.workloads}>
        <div className="container-shell">
          <div className={styles.sectionHeadDark}>
            <span>OPERATING WORKLOADS</span>
            <h2>Attach intelligence to the physical system.</h2>
          </div>
          <div className={styles.cardGrid}>
            {workloads.map(({icon:Icon,title,copy}) => <article key={title}>
              <Icon size={22}/><h3>{title}</h3><p>{copy}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className={styles.boundary}>
        <div className="container-shell">
          <div className={styles.boundaryGrid}>
            <div>
              <span className={styles.kicker}>OT / IT CONVERGENCE</span>
              <h2>AI should not quietly become a control loop.</h2>
              <p>Prediction, recommendation, and control are separate trust zones. We keep operator review, policy gates, and automation authority explicit.</p>
            </div>
            <div className={styles.boundaryDiagram}>
              <div><Cable size={18}/><strong>FIELD</strong><small>meters / sensors / assets</small></div>
              <i/>
              <div><ServerCog size={18}/><strong>OT / CONTROL</strong><small>SCADA / historian / protection</small></div>
              <span><ShieldCheck size={15}/> CONTROL BOUNDARY</span>
              <div><BrainCircuit size={18}/><strong>INTELLIGENCE</strong><small>forecast / anomaly / assist</small></div>
              <i/>
              <div><Zap size={18}/><strong>OPERATIONS</strong><small>plan / review / act</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.closing}>
        <div className="container-shell">
          <h2>Build the intelligence layer around the grid you actually operate.</h2>
          <BookingButton className="button button-primary">Start an energy systems discussion <ArrowRight size={16}/></BookingButton>
        </div>
      </section>
    </main>
  </>;
}
