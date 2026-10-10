import { createSeoMetadata } from "@/lib/seo";
import { FileCheck2, Scale, Shield, Wrench } from "lucide-react";
export const metadata = createSeoMetadata({
  title: 'Terms of Use',
  description: 'Review the terms governing use of the OSYSTIC public website, including lawful use, website content, service descriptions, and availability.',
  path: '/terms',
  keywords: ['OSYSTIC terms of use'],
});
const sections=[[Scale,"Lawful use","Use this website for lawful informational and business purposes. Do not misuse the site, attempt unauthorized access, interfere with operation, or misrepresent information submitted through forms."],[FileCheck2,"Website content","Unless otherwise stated, website copy, visual material, brand assets, and original content are owned by OSYSTIC or used with permission."],[Wrench,"Services and project terms","Website descriptions are general capability information. Scope, deliverables, ownership, timelines, fees, warranties, and responsibilities are defined in the relevant written agreement."],[Shield,"Availability and accuracy","We aim to keep public information accurate and the website available, but website content may change and uninterrupted availability is not guaranteed."]] as const;
export default function TermsPage(){return <main id="main-content" className="fp-legal fp-terms"><section className="fp-legal-hero"><div className="container-shell"><span className="future-kicker">LEGAL / USE PROTOCOL</span><span className="eyebrow">TERMS</span><h1>Terms of use.</h1><p>These terms govern the OSYSTIC public website. Project-specific commercial terms remain governed by the applicable client agreement.</p></div></section><section className="fp-legal-ledger"><div className="container-shell">{sections.map(([Icon,title,body],i)=><article key={title}><span>0{i+1}</span><Icon size={20}/><div><h2>{title}</h2><p>{body}</p></div></article>)}</div></section></main>}
