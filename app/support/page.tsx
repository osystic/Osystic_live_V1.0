import { createSeoMetadata } from "@/lib/seo";
import { ArrowRight, Mail, MessageSquareText, ShieldCheck, Siren } from "lucide-react";
import { siteConfig } from "../config/site";
export const metadata = createSeoMetadata({
  title: 'Support',
  description: 'Contact OSYSTIC for active project support, delivery routing, security escalation guidance, and general engineering support requests.',
  path: '/support',
  keywords: ['OSYSTIC support','enterprise engineering support'],
});
export default function SupportPage(){return <main id="main-content" className="fp-support"><section className="fp-support-hero"><div className="container-shell fp-support-grid"><div><span className="future-kicker">SUPPORT ROUTER / ACTIVE</span><span className="eyebrow">SUPPORT</span><h1>Route the issue to the <span>right ownership path.</span></h1><p>Active engagements should use their agreed delivery and escalation channels. General requests can be routed through OSYSTIC directly.</p><a className="button button-primary" href={`mailto:${siteConfig.email}`}>Email OSYSTIC <ArrowRight size={15}/></a></div><div className="fp-support-router"><div><MessageSquareText size={20}/><span>ACTIVE ENGAGEMENT</span><b>PROJECT CHANNEL</b></div><i/><div><Siren size={20}/><span>SECURITY / OPS</span><b>ESCALATION PATH</b></div><i/><div><Mail size={20}/><span>GENERAL</span><b>{siteConfig.email}</b></div></div></div></section><section className="fp-support-note"><div className="container-shell"><ShieldCheck size={22}/><p>Do not send credentials, production keys, or customer-sensitive information by general email. Use the secure channel agreed for your engagement when sensitive context is involved.</p></div></section></main>}
