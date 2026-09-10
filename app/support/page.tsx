import type { Metadata } from "next";
import { ArrowRight, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import { siteConfig } from "../config/site";
import { FinalCTA } from "../components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "Support",
  description: "Contact OSYSTIC for project and delivery support.",
  alternates: { canonical: "/support" },
};

const options = [
  [MessageSquareText, "Existing engagements", "Use the delivery channel agreed for your project so context, priorities, and ownership stay clear."],
  [ShieldCheck, "Security or operational concern", "For an active engagement, use the agreed escalation path. If you are unsure where to report it, email OSYSTIC directly."],
  [Mail, "General support", `Email ${siteConfig.email} with the project or system name and enough context for the request to be routed correctly.`],
] as const;

export default function SupportPage() {
  return <main id="main-content">
    <section className="page-hero"><div className="container-shell"><span className="eyebrow">SUPPORT</span><h1>Support with <span className="accent">clear ownership.</span></h1><p>For active work, the fastest route is the communication and escalation channel agreed for your engagement. General requests can be sent to our main contact address.</p><div className="page-hero-actions"><a className="button button-primary" href={`mailto:${siteConfig.email}`}>Email OSYSTIC <ArrowRight size={15}/></a></div></div></section>
    <section className="section section-light"><div className="container-shell"><div className="service-list-grid">{options.map(([Icon,title,body],index)=><article className="service-list-card" key={title}><div className="capability-icon"><Icon size={20}/></div><div className="service-list-number">0{index+1}</div><h2>{title}</h2><p>{body}</p></article>)}</div><p style={{marginTop:32,color:"var(--muted)",fontSize:13}}>OSYSTIC does not currently publish a public documentation portal. Any legacy <code>/docs</code> reference has been removed rather than linking to a non-existent page.</p></div></section>
    <FinalCTA />
  </main>;
}
