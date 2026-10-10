import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Code2, Compass, ShieldCheck, Workflow } from "lucide-react";
import { createSeoMetadata } from "@/lib/seo";
import { BookingButton } from "../components/CalBooking";
import { FinalCTA } from "../components/marketing/FinalCTA";

export const metadata = createSeoMetadata({
  title: "Leadership & Accountability",
  description: "Meet OSYSTIC founder leadership and see how company direction, engineering standards, delivery accountability, and client ownership are governed.",
  path: "/leadership",
  keywords: ["OSYSTIC leadership", "AI engineering leadership", "software engineering governance"],
});

const responsibilities = [
  { Icon: Compass, label: "Company Direction", detail: "Strategy, positioning, operating priorities, and long-term company direction." },
  { Icon: Code2, label: "Engineering Standard", detail: "Architecture quality, technical review, production readiness, and delivery evidence." },
  { Icon: Workflow, label: "Client Delivery", detail: "Engagement accountability, milestone clarity, escalation, and handover discipline." },
  { Icon: ShieldCheck, label: "Governance", detail: "Ownership boundaries, responsible claims, security posture, and decision visibility." },
] as const;

export default function LeadershipPage() {
  return (
    <main id="main-content" className="fp-leadership">
      <section className="fp-leadership-hero">
        <div className="container-shell fp-leadership-hero-grid">
          <div>
            <span className="future-kicker">COMPANY / ACCOUNTABILITY</span>
            <span className="eyebrow">LEADERSHIP</span>
            <h1>Leadership should make <span>accountability visible.</span></h1>
            <p>OSYSTIC is founder-led. Company direction, engineering standards, client delivery, and the quality bar stay connected to explicit ownership rather than anonymous process.</p>
            <div className="page-hero-actions">
              <BookingButton>Start a technical conversation <ArrowRight size={16}/></BookingButton>
              <Link href="/about" className="button button-secondary-dark">How OSYSTIC operates <ArrowRight size={15}/></Link>
            </div>
          </div>

          <div className="fp-leadership-ledger" aria-label="Leadership accountability model">
            <div className="fp-leadership-ledger-head"><span>ACCOUNTABILITY REGISTER</span><b>FOUNDER-LED</b></div>
            {responsibilities.map(({ Icon, label }, index) => (
              <div className="fp-leadership-ledger-row" key={label}>
                <span>0{index + 1}</span><Icon size={18}/><strong>{label}</strong><i/><b>OWNED</b>
              </div>
            ))}
            <div className="fp-leadership-ledger-foot"><BriefcaseBusiness size={14}/><span>DECISIONS / DELIVERY / HANDOVER</span></div>
          </div>
        </div>
      </section>

      <section className="fp-founder-profile">
        <div className="container-shell fp-founder-profile-grid">
          <div className="fp-founder-identity" aria-label="Shawaiz Arif, Founder and CEO">
            <div className="fp-founder-monogram">SA</div>
            <span>OSYSTIC / EXECUTIVE LEADERSHIP</span>
            <strong>Shawaiz Arif</strong>
            <b>FOUNDER & CEO</b>
            <small>COMPANY DIRECTION · TECHNICAL DELIVERY · CLIENT ENGAGEMENT</small>
          </div>

          <div className="fp-founder-console">
            <span className="eyebrow">FOUNDER ACCOUNTABILITY</span>
            <h2>One accountable line from direction to delivery.</h2>
            <p>The founder role is responsible for connecting commercial commitments with technical reality, maintaining the engineering standard, and ensuring that delivery closes with a clear ownership state.</p>
            <div className="fp-accountability-list">
              {responsibilities.map(({ Icon, label, detail }) => (
                <div key={label}><Icon size={18}/><span><strong>{label}</strong><small>{detail}</small></span></div>
              ))}
            </div>
            <Link href="/trust" className="future-inline-link">Inspect the trust model <ArrowRight size={14}/></Link>
          </div>
        </div>
      </section>

      <FinalCTA title="Want to discuss a system directly?" body="Bring the actual problem, constraints, and operating environment. The conversation starts with technical context and clear ownership."/>
    </main>
  );
}
