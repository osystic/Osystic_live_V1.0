import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Fingerprint, KeyRound, LockKeyhole, Network, ShieldCheck, ScanSearch, FileCheck2, CloudCog } from "lucide-react";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { FutureReveal } from "../components/future/FutureReveal";

export const metadata = createSeoMetadata({
  title: 'Trust, Security & AI Governance',
  description: 'Learn how OSYSTIC approaches secure engineering, identity and access, data boundaries, AI governance, observability, deployment controls, and technical handover.',
  path: '/trust',
  keywords: ['enterprise AI security','AI governance','secure software engineering','data security engineering'],
});

const controls=[
  [Fingerprint,"Identity & access","Least-privilege access, explicit roles, secret handling, and environment separation are designed against the real system."],
  [Network,"Data boundaries","Data movement, storage, residency, and external-service exposure are mapped before implementation decisions are locked."],
  [ScanSearch,"Observability","Logs, traces, evaluations, and audit evidence are selected around the failure modes that actually matter."],
  [FileCheck2,"Delivery evidence","Acceptance points, technical decisions, runbooks, and handover expectations remain visible throughout delivery."],
] as const;

export default function TrustPage(){return <main id="main-content" className="fp-trust-page">
  <section className="fp-trust-hero"><div className="container-shell fp-trust-hero-grid"><div><span className="future-kicker">TRUST CONTROL PLANE / ACTIVE</span><span className="eyebrow">TRUST & SECURITY</span><h1>Control should be designed into the system, <span>not added as a badge.</span></h1><p>OSYSTIC scopes security and governance against the actual architecture, data, deployment model, and engagement boundaries. We do not present framework alignment as certification.</p><div className="page-hero-actions"><BookingButton>Discuss your requirements <ArrowRight size={16}/></BookingButton><Link href="/contact" className="button button-secondary-dark">Security inquiry <ArrowRight size={16}/></Link></div></div><div className="fp-control-room"><div className="fp-control-bar"><span/><span/><span/><b>SECURITY / CONTROL_MATRIX</b></div><div className="fp-control-shield"><span className="pulse p1"/><span className="pulse p2"/><div><LockKeyhole size={40}/><strong>CONTROLLED</strong><small>OWNERSHIP · ACCESS · EVIDENCE</small></div></div><div className="fp-control-status"><span><i/>IDENTITY <b>DEFINED</b></span><span><i/>DATA <b>BOUNDED</b></span><span><i/>AUDIT <b>VISIBLE</b></span><span><i/>HANDOFF <b>EXPLICIT</b></span></div></div></div></section>
  <section className="fp-trust-controls"><div className="container-shell"><div className="fp-trust-title"><span className="eyebrow">CONTROL DOMAINS</span><h2>Four questions before technology selection.</h2></div><div className="fp-control-ledger">{controls.map(([Icon,title,body],i)=><FutureReveal key={title} delay={i*.07} className="fp-control-row"><span>0{i+1}</span><Icon size={21}/><h3>{title}</h3><p>{body}</p><b>REVIEW</b></FutureReveal>)}</div></div></section>
  <section className="fp-trust-deploy"><div className="container-shell fp-trust-deploy-grid"><div><span className="eyebrow">DEPLOYMENT BOUNDARY</span><h2>Cloud, private infrastructure, hybrid, or edge.</h2><p>The deployment model is an engineering decision shaped by data locality, latency, integration, hardware, compliance, and operating ownership.</p></div><div className="fp-deploy-options">{[[CloudCog,"CLOUD"],[ShieldCheck,"PRIVATE"],[Network,"HYBRID"],[KeyRound,"EDGE"]].map(([Icon,label],i)=>{const I=Icon as typeof CloudCog;return <div key={label as string}><I size={21}/><span>0{i+1}</span><b>{label as string}</b></div>})}</div></div></section>
  <section className="fp-trust-claims"><div className="container-shell"><div><span className="eyebrow">CLAIMS POLICY</span><h2>Evidence before labels.</h2></div><div className="fp-claim-terminal"><code>&gt; certification_status</code><strong>NOT CLAIMED WITHOUT VERIFIED EVIDENCE</strong><code>&gt; framework_alignment</code><span>Scoped when required by the engagement</span><code>&gt; security_controls</code><span>Designed and documented against the actual system</span></div></div></section>
  <FinalCTA title="Need a security-conscious delivery model?" body="Share the data boundary, environment, access model, regulatory context, and operational constraints. We will map controls to the system rather than to marketing language."/>
</main>}
