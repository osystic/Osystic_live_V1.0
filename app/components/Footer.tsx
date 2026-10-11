import Link from "next/link";
import { ArrowUpRight, Linkedin, LogIn, Mail, MapPin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { siteConfig } from "../config/site";

const footerGroups = [
  {
    title: "Capabilities",
    items: [
      { label: "AI & Machine Learning", href: "/capabilities/ai-systems" },
      { label: "Data Engineering", href: "/services/data-cloud/data" },
      { label: "Cloud & DevOps", href: "/services/devops-cloud" },
      { label: "Custom Software", href: "/capabilities/product-engineering" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Admin Login", href: "https://www.osystic.com/admin/", admin: true },
    ],
  },
  {
    title: "Industries",
    items: [
      { label: "Financial Services", href: "/industries/finance" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Technology", href: "/industries/technology" },
    ],
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
        {footerGroups.map(group => (
          <div className="future-footer-link-group" key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map(item => ("admin" in item && item.admin) ? (
              <a className="future-footer-admin-link" href={item.href} key={item.href}>
                {item.label}<LogIn size={11} aria-hidden="true"/>
              </a>
            ) : (
              <Link href={item.href} key={item.href}>
                {item.label}<ArrowUpRight size={10} aria-hidden="true"/>
              </Link>
            ))}
          </div>
        ))}
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
      </div>
    </div>
  </footer>;
}
