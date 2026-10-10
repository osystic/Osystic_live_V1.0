import Link from "next/link";
import { ArrowUpRight, Linkedin, LogIn, Mail, MapPin, Radio } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { capabilityGroups, primaryIndustries, siteConfig } from "../config/site";

const footerGroups=[
  {title:"Explore",items:[["Case Studies","/case-studies"],["Capabilities","/capabilities"],["Industries","/industries"],["Insights","/insights"]]},
  {title:"Engineering",items:capabilityGroups.map(group=>[group.title,group.href])},
  {title:"Company",items:[["About","/about"],["Leadership","/leadership"],["Careers","/careers"],["Trust & Security","/trust"],["Support","/support"]]},
  {title:"Focus",items:primaryIndustries.map(industry=>[industry.name,industry.href])},
] as const;

export default function Footer(){
  return <footer className="future-footer">
    <div className="container-shell future-footer-top">
      <div className="future-footer-brand">
        <div className="future-footer-brandline"><BrandLogo compact/><span><i/>SYSTEMS ONLINE</span></div>
        <h2>Production systems,<br/><span>built to be owned.</span></h2>
        <p>AI, product, data, and cloud engineering with visible delivery, explicit ownership, and production accountability.</p>
        <div className="future-footer-actions">
          <a href={`mailto:${siteConfig.email}`}><Mail size={15}/>{siteConfig.email}</a>
        </div>
      </div>
      <div className="future-footer-links">{footerGroups.map(group=><div key={group.title}><h3>{group.title}</h3>{group.items.map(([label,href])=><Link href={href} key={`${group.title}-${href}`}>{label}<ArrowUpRight size={11}/></Link>)}</div>)}</div>
    </div>
    <div className="container-shell future-footer-network">
      <div><MapPin size={15}/><span>US BUSINESS ADDRESS</span><b>{siteConfig.address.line1}<br/>{siteConfig.address.line2}<br/>{siteConfig.address.country}</b></div><i/><div><Radio size={15}/><span>DELIVERY MODEL</span><b>GLOBAL PROJECT DELIVERY</b></div><i/><a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15}/><span>LINKEDIN</span><b>OSYSTIC</b></a>
    </div>
    <div className="container-shell future-footer-bottom"><span>© {new Date().getFullYear()} OSYSTIC. ALL RIGHTS RESERVED.</span><div><Link href="/privacy">PRIVACY</Link><Link href="/terms">TERMS</Link><a className="future-admin-login" href="https://www.osystic.com/admin/"><LogIn size={12}/>ADMIN LOGIN</a></div></div>
  </footer>
}
