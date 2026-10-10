import { createSeoMetadata } from "@/lib/seo";
import { Database, Eye, Mail, ShieldCheck } from "lucide-react";
import { siteConfig } from "../config/site";
export const metadata = createSeoMetadata({
  title: 'Privacy Policy',
  description: 'Read the OSYSTIC website privacy policy covering submitted information, site operation, security, and privacy-related requests.',
  path: '/privacy',
  keywords: ['OSYSTIC privacy policy'],
});
const sections=[[Database,"Information submitted to us","When you contact OSYSTIC through a website form, we may receive information such as your name, work email, company, project context, and the message you choose to provide."],[Eye,"How information is used","Submitted information may be used to respond to your request, evaluate a potential engagement, provide requested services, improve site operation, and meet applicable legal or security obligations."],[ShieldCheck,"Site operation","The website may use technical information and essential storage required for security, performance, form delivery, and normal website functionality. Optional analytics should follow active consent settings."],[Mail,"Your requests",`For access, correction, deletion, or other privacy-related questions about information submitted to OSYSTIC, contact ${siteConfig.email}.`]] as const;
export default function PrivacyPage(){return <main id="main-content" className="fp-legal fp-privacy"><section className="fp-legal-hero"><div className="container-shell"><span className="future-kicker">LEGAL / DATA NOTICE</span><span className="eyebrow">PRIVACY</span><h1>Privacy policy.</h1><p>How information submitted through the OSYSTIC public website may be handled.</p></div></section><section className="fp-legal-ledger"><div className="container-shell">{sections.map(([Icon,title,body],i)=><article key={title}><span>0{i+1}</span><Icon size={20}/><div><h2>{title}</h2><p>{body}</p></div></article>)}</div></section></main>}
