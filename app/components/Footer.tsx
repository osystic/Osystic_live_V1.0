import Link from "next/link";
import { ArrowUpRight, Linkedin, LogIn, Mail, MapPin } from "lucide-react";
import { siteConfig } from "../config/site";
import { INDUSTRIES } from "../_data/industries-data";

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
    items: INDUSTRIES.map(industry => ({
      label: industry.name,
      href: industry.href,
    })),
  },
];

export default function Footer() {
  return (
    <footer className="future-footer">
      <div className="container-shell future-footer-main">
        <div className="future-footer-brand">
          <div className="future-footer-wordmark">OSYSTIC</div>

          <a className="future-footer-email" href={`mailto:${siteConfig.email}`}>
            <Mail size={14} aria-hidden="true" />
            {siteConfig.email}
          </a>

          <div className="future-footer-address future-footer-address-inline">
            <MapPin size={14} aria-hidden="true" />
            <span>
              <small>US BUSINESS ADDRESS</small>
              {siteConfig.address.line1}, {siteConfig.address.line2},{" "}
              {siteConfig.address.country}
            </span>
          </div>

          <a
            className="future-footer-linkedin"
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={14} aria-hidden="true" />
            LinkedIn
          </a>
        </div>

        <nav className="future-footer-links" aria-label="Footer navigation">
          {footerGroups.map(group => (
            <div
              className={`future-footer-link-group${group.title === "Industries" ? " future-footer-link-group-industries" : ""}`}
              key={group.title}
            >
              <h3>{group.title}</h3>

              {group.items.map(item =>
                "admin" in item && item.admin ? (
                  <a
                    className="future-footer-admin-link"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                    <LogIn size={11} aria-hidden="true" />
                  </a>
                ) : (
                  <Link href={item.href} key={item.href}>
                    {item.label}
                    <ArrowUpRight size={10} aria-hidden="true" />
                  </Link>
                ),
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="container-shell future-footer-bottom">
        <span>© {new Date().getFullYear()} OSYSTIC. ALL RIGHTS RESERVED.</span>

        <div>
          <Link href="/privacy">PRIVACY</Link>
          <Link href="/terms">TERMS</Link>
        </div>
      </div>
    </footer>
  );
}
