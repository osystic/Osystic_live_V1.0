import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationId } from "@/lib/structured-data";
import { StructuredData } from "@/app/components/seo/StructuredData";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Boxes,
  CreditCard,
  Database,
  Factory,
  Gauge,
  GraduationCap,
  HeartPulse,
  MapPinned,
  Network,
  RadioTower,
  Route,
  ServerCog,
  ShieldAlert,
  ShoppingBag,
  Users,
  Workflow,
} from "lucide-react";
import { ALL_SLUGS, getIndustry } from "../../_data/industries-data";
import { BookingButton } from "../../components/CalBooking";
import { FinalCTA } from "../../components/marketing/FinalCTA";
import { FutureReveal } from "../../components/future/FutureReveal";

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) {
    return createSeoMetadata({
      title: "Industry not found",
      description: "The requested OSYSTIC industry page could not be found.",
      path: "/industries",
      noIndex: true,
    });
  }

  return createSeoMetadata({
    title: `${industry.name} AI & Software Engineering`,
    description: industry.description,
    path: `/industries/${industry.slug}`,
    keywords: [
      `${industry.name} AI`,
      `${industry.name} software engineering`,
      `${industry.name} machine learning`,
      "enterprise AI engineering",
    ],
  });
}

function SectorSignals({
  items,
}: {
  items: Array<{ label: string; icon: typeof Database }>;
}) {
  return (
    <div className="fp-sector-signals">
      {items.map(({ label, icon: Icon }) => (
        <span key={label}>
          <Icon size={15} />
          {label}
        </span>
      ))}
    </div>
  );
}

function SectorVisual({ slug, name }: { slug: string; name: string }) {
  const head = (
    <div className="fp-sector-head">
      <span>{name}</span>
      <b>CONTEXT MODEL</b>
    </div>
  );

  if (slug === "finance") {
    return (
      <div className="fp-sector-console fp-sector-visual fp-sector-finance-visual" aria-label="Financial risk and transaction operating model">
        {head}
        <div className="fp-finance-ledger">
          <div className="fp-finance-risk-core">
            <ShieldAlert size={25} />
            <strong>RISK ENGINE</strong>
            <small>SCORE / EXPLAIN / ROUTE</small>
          </div>
          <div className="fp-finance-rail rail-a"><span>TXN STREAM</span><i /><b>LOW LATENCY</b></div>
          <div className="fp-finance-rail rail-b"><span>IDENTITY</span><i /><b>VERIFIED</b></div>
          <div className="fp-finance-rail rail-c"><span>REVIEW</span><i /><b>HUMAN GATE</b></div>
          <div className="fp-finance-rail rail-d"><span>AUDIT</span><i /><b>TRACEABLE</b></div>
          <div className="fp-finance-pulse" aria-hidden="true" />
        </div>
        <SectorSignals items={[
          { label: "TRANSACTIONS", icon: CreditCard },
          { label: "RISK", icon: ShieldAlert },
          { label: "DECISIONS", icon: Gauge },
          { label: "AUDIT", icon: Activity },
        ]} />
      </div>
    );
  }

  if (slug === "manufacturing") {
    return (
      <div className="fp-sector-console fp-sector-visual fp-sector-manufacturing-visual" aria-label="Manufacturing production intelligence operating model">
        {head}
        <div className="fp-manufacturing-line">
          <div className="fp-mfg-conveyor" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <div className="fp-mfg-node n1"><Factory size={19}/><b>LINE</b><small>SENSOR / PLC</small></div>
          <div className="fp-mfg-node n2"><Activity size={19}/><b>VISION</b><small>INSPECT</small></div>
          <div className="fp-mfg-node n3"><Gauge size={19}/><b>QA GATE</b><small>PASS / REVIEW</small></div>
          <div className="fp-mfg-node n4"><ServerCog size={19}/><b>MES</b><small>OPERATE</small></div>
          <div className="fp-mfg-quality"><span>QUALITY LOOP</span><strong>EDGE → DECISION → TRACE</strong></div>
        </div>
        <SectorSignals items={[
          { label: "SENSORS", icon: Activity },
          { label: "QUALITY", icon: Gauge },
          { label: "EDGE", icon: ServerCog },
          { label: "OUTPUT", icon: Boxes },
        ]} />
      </div>
    );
  }

  if (slug === "healthcare") {
    return (
      <div className="fp-sector-console fp-sector-visual fp-sector-healthcare-visual" aria-label="Healthcare interoperability and clinical review operating model">
        {head}
        <div className="fp-healthcare-mesh">
          <div className="fp-healthcare-core"><HeartPulse size={27}/><b>CLINICAL CONTEXT</b><small>HUMAN REVIEW</small></div>
          <div className="fp-healthcare-node ehr"><Database size={17}/><b>EHR</b><small>RECORDS</small></div>
          <div className="fp-healthcare-node pacs"><Activity size={17}/><b>PACS</b><small>IMAGING</small></div>
          <div className="fp-healthcare-node nlp"><Workflow size={17}/><b>NLP</b><small>EXTRACT</small></div>
          <div className="fp-healthcare-node review"><Users size={17}/><b>REVIEW</b><small>CLINICIAN</small></div>
          <span className="fp-healthcare-orbit o1" aria-hidden="true"/><span className="fp-healthcare-orbit o2" aria-hidden="true"/>
        </div>
        <SectorSignals items={[
          { label: "EHR", icon: Database },
          { label: "PRIVACY", icon: ShieldAlert },
          { label: "REVIEW", icon: Users },
          { label: "INTEROP", icon: Network },
        ]} />
      </div>
    );
  }

  if (slug === "retail") {
    return (
      <div className="fp-sector-console fp-sector-visual fp-sector-retail-visual" aria-label="Retail demand and personalization operating model">
        {head}
        <div className="fp-retail-funnel">
          <div className="fp-retail-column c1"><Users size={18}/><span>CUSTOMER</span><b>EVENTS</b><i/><i/><i/></div>
          <div className="fp-retail-arrow" aria-hidden="true">→</div>
          <div className="fp-retail-column c2"><Gauge size={18}/><span>RANK</span><b>DECISION</b><i/><i/><i/></div>
          <div className="fp-retail-arrow" aria-hidden="true">→</div>
          <div className="fp-retail-column c3"><ShoppingBag size={18}/><span>STOREFRONT</span><b>EXPERIENCE</b><i/><i/><i/></div>
          <div className="fp-retail-stock"><Boxes size={15}/><span>INVENTORY SIGNAL</span><strong>DEMAND / STOCK / RETURNS</strong></div>
        </div>
        <SectorSignals items={[
          { label: "CUSTOMER", icon: Users },
          { label: "DEMAND", icon: Activity },
          { label: "INVENTORY", icon: Boxes },
          { label: "COMMERCE", icon: ShoppingBag },
        ]} />
      </div>
    );
  }

  if (slug === "logistics") {
    return (
      <div className="fp-sector-console fp-sector-visual fp-sector-logistics-visual" aria-label="Logistics route and ETA operating model">
        {head}
        <div className="fp-logistics-route">
          <div className="fp-logistics-map-grid" aria-hidden="true"/>
          <svg viewBox="0 0 560 290" preserveAspectRatio="none" aria-hidden="true">
            <path d="M55 210 C135 205 145 85 238 104 S335 242 418 176 S486 82 522 86"/>
          </svg>
          <div className="fp-log-node l1"><MapPinned size={17}/><b>ORIGIN</b><small>LOAD</small></div>
          <div className="fp-log-node l2"><Route size={17}/><b>HUB</b><small>CAPACITY</small></div>
          <div className="fp-log-node l3"><Gauge size={17}/><b>ETA</b><small>PREDICT</small></div>
          <div className="fp-log-node l4"><Boxes size={17}/><b>DELIVERY</b><small>TRACE</small></div>
          <div className="fp-logistics-constraints"><span>TRAFFIC</span><span>WINDOWS</span><span>CAPACITY</span><span>DRIVER HOURS</span></div>
        </div>
        <SectorSignals items={[
          { label: "ROUTES", icon: Route },
          { label: "ETA", icon: Gauge },
          { label: "CAPACITY", icon: Boxes },
          { label: "EVENTS", icon: Activity },
        ]} />
      </div>
    );
  }

  if (slug === "telecom") {
    return (
      <div className="fp-sector-console fp-sector-visual fp-sector-telecom-visual" aria-label="Telecommunications network intelligence operating model">
        {head}
        <div className="fp-telecom-network">
          <span className="fp-telecom-ring r1" aria-hidden="true"/><span className="fp-telecom-ring r2" aria-hidden="true"/><span className="fp-telecom-ring r3" aria-hidden="true"/>
          <div className="fp-telecom-core"><RadioTower size={29}/><b>NETWORK</b><small>TELEMETRY</small></div>
          <div className="fp-tel-node ran"><Activity size={16}/><b>RAN</b><small>SIGNAL</small></div>
          <div className="fp-tel-node core"><Network size={16}/><b>CORE</b><small>TRAFFIC</small></div>
          <div className="fp-tel-node noc"><Gauge size={16}/><b>NOC</b><small>ANOMALY</small></div>
          <div className="fp-tel-node cx"><Users size={16}/><b>CX</b><small>CHURN</small></div>
        </div>
        <SectorSignals items={[
          { label: "TELEMETRY", icon: Activity },
          { label: "NETWORK", icon: Network },
          { label: "ANOMALY", icon: Gauge },
          { label: "SUBSCRIBER", icon: Users },
        ]} />
      </div>
    );
  }

  if (slug === "education") {
    return (
      <div className="fp-sector-console fp-sector-visual fp-sector-education-visual" aria-label="Education adaptive learning operating model">
        {head}
        <div className="fp-education-path">
          <div className="fp-edu-learner"><GraduationCap size={26}/><b>LEARNER</b><small>STATE</small></div>
          <div className="fp-edu-track">
            <div><span>01</span><BookOpen size={16}/><b>CONTENT</b><small>SELECT</small></div>
            <i/>
            <div><span>02</span><Activity size={16}/><b>ASSESS</b><small>EVALUATE</small></div>
            <i/>
            <div><span>03</span><Workflow size={16}/><b>ADAPT</b><small>NEXT PATH</small></div>
          </div>
          <div className="fp-edu-signal"><strong>FEEDBACK LOOP</strong><span>KNOWLEDGE → ENGAGEMENT → INTERVENTION</span></div>
        </div>
        <SectorSignals items={[
          { label: "LEARNER", icon: GraduationCap },
          { label: "CONTENT", icon: BookOpen },
          { label: "ASSESS", icon: Activity },
          { label: "ADAPT", icon: Workflow },
        ]} />
      </div>
    );
  }

  return (
    <div className="fp-sector-console fp-sector-visual fp-sector-technology-visual" aria-label="Technology platform engineering operating model">
      {head}
      <div className="fp-technology-stack">
        <div className="fp-tech-layer l1"><span>04</span><ServerCog size={17}/><b>CLOUD / RUNTIME</b><small>DEPLOY · OBSERVE</small></div>
        <div className="fp-tech-layer l2"><span>03</span><Database size={17}/><b>DATA PLATFORM</b><small>EVENTS · MODELS</small></div>
        <div className="fp-tech-layer l3"><span>02</span><Network size={17}/><b>APIs / SERVICES</b><small>CONTRACTS · LOGIC</small></div>
        <div className="fp-tech-layer l4"><span>01</span><Workflow size={17}/><b>PRODUCT + AI</b><small>EXPERIENCE · AGENTS</small></div>
        <div className="fp-tech-status"><i/><span>PLATFORM STATE</span><strong>OPERABLE / OWNED</strong></div>
      </div>
      <SectorSignals items={[
        { label: "PRODUCT", icon: Workflow },
        { label: "APIS", icon: Network },
        { label: "DATA", icon: Database },
        { label: "RUNTIME", icon: ServerCog },
      ]} />
    </div>
  );
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const style = { "--industry-accent": industry.accent } as CSSProperties;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${industry.name} AI & Software Engineering`,
      description: industry.description,
      url: `https://www.osystic.com/industries/${industry.slug}`,
      provider: { "@id": organizationId },
      areaServed: { "@type": "Place", name: "Worldwide" },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: industry.name, path: `/industries/${industry.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main id="main-content" className={`fp-industry-detail fp-industry-${industry.slug}`} style={style}>
        <section className="fp-industry-detail-hero">
          <div className="container-shell fp-industry-detail-grid">
            <div>
              <span className="future-kicker">INDUSTRY / {industry.name.toUpperCase()}</span>
              <span className="eyebrow">OPERATING CONTEXT</span>
              <h1>{industry.tagline}</h1>
              <p>{industry.description}</p>
              <div className="page-hero-actions">
                <BookingButton>Discuss your use case <ArrowRight size={16}/></BookingButton>
                <Link href="/capabilities" className="button button-secondary-dark">
                  Explore capabilities <ArrowRight size={16}/>
                </Link>
              </div>
            </div>
            <SectorVisual slug={industry.slug} name={industry.name} />
          </div>
        </section>

        <section className="fp-sector-challenges">
          <div className="container-shell">
            <div className="fp-sector-section-head">
              <span className="eyebrow">CONSTRAINT MAP</span>
              <h2>What changes in {industry.name.toLowerCase()}.</h2>
              <p>{industry.heroDesc}</p>
            </div>
            <div className="fp-sector-challenge-grid">
              {industry.challenges.map((item, i) => (
                <FutureReveal key={item.title} delay={i * 0.07}>
                  <article>
                    <span>0{i + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="constraint-line"><i/><b>ARCHITECTURE INPUT</b></div>
                  </article>
                </FutureReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="fp-sector-solutions">
          <div className="container-shell">
            <div className="fp-sector-section-head">
              <span className="eyebrow">SYSTEM PATTERNS</span>
              <h2>Engineering around the workflow.</h2>
              <p>These are capability patterns, not guaranteed outcomes. Exact design depends on the client’s data, infrastructure, risk profile, and validation requirements.</p>
            </div>
            <div className="fp-sector-solution-rail">
              {industry.solutions.map((item, i) => (
                <div key={item.title}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fp-sector-related">
          <div className="container-shell">
            <span className="eyebrow">ADJACENT CONTEXTS</span>
            <div>
              {industry.relatedSlugs.map((relatedSlug) => {
                const related = getIndustry(relatedSlug);
                return related ? (
                  <Link href={`/industries/${relatedSlug}`} key={relatedSlug}>
                    {related.name}<ArrowRight size={14}/>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </section>

        <FinalCTA
          title={`Building for ${industry.name.toLowerCase()}?`}
          body="Bring the real workflow, data boundary, infrastructure, and risk constraints. We will map the engineering path around them."
        />
      </main>
    </>
  );
}
