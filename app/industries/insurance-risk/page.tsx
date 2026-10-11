import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, BarChart3, BrainCircuit, Calculator, CheckCircle2, ClipboardCheck, FileText, Fingerprint, History, LockKeyhole, Scale, ScanText, Search, ShieldCheck, UserCheck } from "lucide-react";
import { BookingButton } from "@/app/components/CalBooking";
import { StructuredData } from "@/app/components/seo/StructuredData";
import { createSeoMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationId } from "@/lib/structured-data";
import { UnderwritingDecisionDesk } from "./UnderwritingDecisionDesk";
import { ClaimsEvidenceFlow } from "./ClaimsEvidenceFlow";
import styles from "./insurance-risk.module.css";

export const metadata = createSeoMetadata({
  title:"Insurance & Risk AI & Software Engineering",
  description:"OSYSTIC engineers underwriting intelligence, claims automation, actuarial analytics, fraud detection, document intelligence, and governed AI workflows for insurers and risk organizations.",
  path:"/industries/insurance-risk",
  keywords:["insurance AI engineering","underwriting AI","claims automation","insurance fraud detection","actuarial AI","insurance risk analytics","agentic insurance workflows","claims intelligence platform"],
});

const dossier=[
  [FileText,"Submission intelligence","APPLICATION / SCHEDULES / FORMS","Extract entities, exposures, clauses, locations, limits, and supporting evidence from submissions."],
  [History,"Loss & account context","HISTORY / EXPERIENCE / EVENTS","Bring prior losses, account history, external signals, and portfolio context into one review surface."],
  [Calculator,"Risk decision support","SCORE / PRICE / REFER","Combine model outputs, business rules, appetite, authority limits, and human judgment into explicit decision support."],
  [ClipboardCheck,"Decision evidence","RATIONALE / APPROVAL / AUDIT","Record inputs, model version, policy rules, human actions, exceptions, and final rationale."],
] as const;

const actuarial=[
  [BarChart3,"Book-level risk visibility","Aggregate exposure, concentration, claims experience, pricing, and model outputs into portfolio views."],
  [Calculator,"Decision-support models","Support pricing, segmentation, renewal, and risk selection while keeping validation assumptions visible."],
  [Activity,"Emerging risk signals","Surface changes in claims frequency, severity, exposure patterns, and external conditions for review."],
] as const;

const schema=[
  {"@context":"https://schema.org","@type":"Service",name:"Insurance & Risk AI & Software Engineering",description:"Underwriting intelligence, claims automation, actuarial analytics, fraud detection, document intelligence, and governed AI workflow engineering.",url:"https://www.osystic.com/industries/insurance-risk",provider:{"@id":organizationId},areaServed:{"@type":"Place",name:"Worldwide"}},
  breadcrumbSchema([{name:"Home",path:"/"},{name:"Industries",path:"/industries"},{name:"Insurance & Risk",path:"/industries/insurance-risk"}]),
];

export default function InsuranceRiskPage(){
  return <><StructuredData id="insurance-risk-schema" data={schema}/><main id="main-content" className={styles.page}>
    <section className={styles.hero}><div className="container-shell"><div className={styles.heroGrid}><div>
      <span className={styles.kicker}>INSURANCE & RISK / DECISION INTELLIGENCE</span>
      <h1>Turn fragmented evidence into <span>defensible decisions.</span></h1>
      <p>OSYSTIC engineers AI and software for underwriting, claims, actuarial, fraud, and policy operations, transforming document-heavy workflows into governed decision systems.</p>
      <div className={styles.actions}><BookingButton className="button button-primary">Discuss your insurance workflow <ArrowRight size={16}/></BookingButton><Link href="/capabilities" className="button button-secondary-dark">Explore capabilities <ArrowRight size={16}/></Link></div>
    </div><UnderwritingDecisionDesk/></div></div></section>

    <section className={styles.underwriting}><div className="container-shell"><div className={styles.headDark}><span>UNDERWRITING / DECISION DOSSIER</span><h2>Reduce preparation time without hiding the basis of the decision.</h2></div><div className={styles.dossier}>{dossier.map(([Icon,title,label,copy],i)=><article key={title}><span>0{i+1}</span><Icon size={20}/><div><small>{label}</small><h3>{title}</h3></div><p>{copy}</p><CheckCircle2 size={15}/></article>)}</div></div></section>

    <section className={styles.claims}><div className="container-shell"><div className={styles.head}><span>CLAIMS / EVIDENCE INTELLIGENCE</span><h2>A claim is an evidence problem before it becomes a workflow problem.</h2><p>Claims teams work across forms, statements, invoices, images, policy language, notes, and third-party reports. AI becomes useful when it organizes that evidence without severing it from its source.</p></div><ClaimsEvidenceFlow/></div></section>

    <section className={styles.actuarial}><div className="container-shell"><div className={styles.headDark}><span>ACTUARIAL / PORTFOLIO INTELLIGENCE</span><h2>See individual decisions in the context of the whole book.</h2></div><div className={styles.book}><div className={styles.bookHead}><span>PORTFOLIO VIEW</span><b>COMMERCIAL RISK</b></div><div className={styles.bands}>{["PROPERTY","LIABILITY","MOTOR","SPECIALTY"].map((x,i)=><div key={x}><span>{x}</span>{Array.from({length:7}).map((_,j)=><i key={j} className={(i+j)%5===0?styles.hot:""}/>)}</div>)}</div></div><div className={styles.actCards}>{actuarial.map(([Icon,title,copy])=><article key={title}><Icon size={21}/><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className={styles.fraud}><div className="container-shell"><div className={styles.fraudGrid}><div><span className={styles.kicker}>FRAUD / SPECIAL INVESTIGATION</span><h2>Detect patterns. Do not manufacture certainty.</h2><p>Fraud systems should prioritize evidence for investigation, not replace investigators with a black-box accusation engine.</p><div className={styles.notice}><AlertTriangle size={18}/><span>High-risk signals route into specialist review workflows.</span></div></div><div className={styles.triage}>{["Identity inconsistency","Behavioral anomaly","Evidence conflict","Network signal"].map((t,i)=><article key={t}><span>{String.fromCharCode(65+i)}</span><div><h3>{t}</h3><p>Context, provenance, and confidence remain visible for investigation.</p></div><div><i/><i/><i/><i/></div></article>)}</div></div></div></section>

    <section className={styles.agentic}><div className="container-shell"><div className={styles.headDark}><span>AGENTIC DOCUMENT OPERATIONS</span><h2>Automate the work around the decision, not the accountability for it.</h2></div><div className={styles.agentGrid}>{[[ScanText,"Read"],[Search,"Extract"],[BrainCircuit,"Reason"],[UserCheck,"Review"],[BadgeCheck,"Record"]].map(([Icon,title],i)=><article key={title as string}><span>0{i+1}</span><Icon size={19}/><h3>{title as string}</h3><p>Controlled document intelligence with explicit tools, escalation, and approval boundaries.</p></article>)}</div></div></section>

    <section className={styles.govern}><div className="container-shell"><div className={styles.governGrid}><div className={styles.ledger}><div><span>DECISION RECORD</span><b>IMMUTABLE CONTEXT</b></div>{[["WORKFLOW","COMMERCIAL UNDERWRITING"],["MODEL","RISK-SUPPORT / V4.7"],["POLICY STATE","APPETITE RULESET 12"],["EVIDENCE","18 SOURCES ATTACHED"],["RECOMMENDATION","REFER FOR REVIEW"],["AUTHORITY","SENIOR UNDERWRITER"]].map(([k,v])=><p key={k}><span>{k}</span><b>{v}</b></p>)}</div><div><span className={styles.kicker}>GOVERNED AI / DECISION CONTROL</span><h2>Every material recommendation should leave a record.</h2><p>Insurance AI operates inside regulated, financially material, and customer-sensitive workflows. Governance belongs inside the system architecture.</p><div className={styles.controls}><article><Fingerprint size={18}/><span>Identity & authority</span></article><article><Scale size={18}/><span>Decision provenance</span></article><article><LockKeyhole size={18}/><span>Sensitive-data boundaries</span></article><article><ShieldCheck size={18}/><span>Human accountability</span></article></div></div></div></div></section>

    <section className={styles.closing}><div className="container-shell"><h2>Modernize the workflow without losing the evidence behind it.</h2><BookingButton className="button button-primary">Discuss your insurance system <ArrowRight size={16}/></BookingButton></div></section>
  </main></>;
}
