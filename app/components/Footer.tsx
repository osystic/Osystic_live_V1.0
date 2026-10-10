import Link from "next/link";
import { ArrowUpRight, Linkedin, LogIn, Mail, MapPin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { capabilityGroups, siteConfig } from "../config/site";

const footerGroups = [
  {
    title: "Capabilities",
    items: capabilityGroups.map(group => [group.title, group.href]),
  },
  {
    title: "Company",
    items: [["About","/about"],["Industries","/industries"],["Trust & Security","/trust"],["Careers","/careers"]],
  },
  {
    title: "Explore",
    items: [["Case Studies","/case-studies"],["Insights","/insights"],["Contact","/contact"],["Support","/support"]],
  },
] as const;

export default function Footer(){
  return <footer className="future-footer">
    <div className="container-shell future-footer-main">
      <div className="future-footer-brand">
        <div className="future-footer-brandline">
          <BrandLogo compact/>
          <span><i/>ENGINEERING SYSTEMS / ONLINE</span>
        </div>
        <p>Production AI, software, data, and cloud systems engineered for reliability, ownership, and long-term operation.</p>
        <a className="future-footer-email" href={`mailto:${siteConfig.email}`}>
          <Mail size={14}/>{siteConfig.email}
        </a>
      </div>

      <nav className="future-footer-links" aria-label="Footer navigation">
        {footerGroups.map(group=><div key={group.title}>
          <h3>{group.title}</h3>
          {group.items.map(([label,href])=><Link href={href} key={href}>{label}<ArrowUpRight size={10}/></Link>)}
        </div>)}
      </nav>
    </div>

    <div className="container-shell future-footer-meta">
      <div className="future-footer-address">
        <MapPin size={14}/>
        <span><small>US BUSINESS ADDRESS</small>{siteConfig.address.line1}, {siteConfig.address.line2}, {siteConfig.address.country}</span>
      </div>
      <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14}/>LinkedIn</a>
      <span>GLOBAL PROJECT DELIVERY</span>
    </div>

    <div className="container-shell future-footer-bottom">
      <span>© {new Date().getFullYear()} OSYSTIC. ALL RIGHTS RESERVED.</span>
      <div>
        <Link href="/privacy">PRIVACY</Link>
        <Link href="/terms">TERMS</Link>
        <a className="future-admin-login" href="https://www.osystic.com/admin/"><LogIn size={11}/>ADMIN LOGIN</a>
      </div>
    </div>
  </footer>;
}
