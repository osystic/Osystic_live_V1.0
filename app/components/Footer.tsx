import Link from "next/link";
import { Linkedin, Mail, MapPin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { capabilityGroups, primaryIndustries, siteConfig } from "../config/site";

const footerGroups = [
  {
    title: "Work",
    items: [
      ["Case Studies", "/case-studies"],
      ["Our Process", "/capabilities#process"],
    ],
  },
  {
    title: "Capabilities",
    items: capabilityGroups.map(group => [group.title, group.href]),
  },
  {
    title: "Industries",
    items: primaryIndustries.map(industry => [industry.name, industry.href]),
  },
  {
    title: "Company",
    items: [
      ["About", "/about"],
      ["Leadership", "/leadership"],
      ["Careers", "/careers"],
      ["Trust & Security", "/trust"],
    ],
  },
  {
    title: "Resources",
    items: [
      ["Insights", "/insights"],
      ["Support", "/support"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-shell footer-grid">
        <div className="footer-brand">
          <BrandLogo compact />
          <p>Production AI and software systems, engineered for ownership, reliability, and long-term scale.</p>
          <a className="footer-social" href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="OSYSTIC on LinkedIn">
            <Linkedin size={18} />
          </a>
        </div>

        <div className="footer-links-grid">
          {footerGroups.map(group => (
            <div key={group.title} className="footer-group">
              <h3>{group.title}</h3>
              {group.items.map(([label, href]) => (
                <Link href={href} key={`${group.title}-${href}`}>{label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-contact">
          <h3>Get in touch</h3>
          <a href={`mailto:${siteConfig.email}`}><Mail size={16} /> {siteConfig.email}</a>
          <div><MapPin size={16} /><span>{siteConfig.address.line1}<br />{siteConfig.address.line2}<br />{siteConfig.address.country}</span></div>
          <div><MapPin size={16} /><span>Local Operations<br />{siteConfig.localOperations}</span></div>
        </div>
      </div>

      <div className="container-shell footer-bottom">
        <span>© {new Date().getFullYear()} OSYSTIC. All rights reserved.</span>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div>
    </footer>
  );
}
