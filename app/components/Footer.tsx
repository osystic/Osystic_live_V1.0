import Link from "next/link";
import { ArrowUpRight, LogIn, Mail, MapPin } from "lucide-react";

// lucide-react has no `Linkedin` glyph in the pinned version, so ship the
// official mark inline rather than pulling in an icon dependency for it.
function LinkedInGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
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
      { label: "How We Work", href: "/how-we-work" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Admin Login", href: "https://www.osystic.com/admin/", admin: true },
    ],
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
            <LinkedInGlyph size={14} />
            LinkedIn
          </a>
        </div>

        <nav className="future-footer-links" aria-label="Footer navigation">
          {footerGroups.map(group => (
            <div className="future-footer-link-group" key={group.title}>
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
