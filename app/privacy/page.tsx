import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "OSYSTIC website privacy information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container-shell"><span className="eyebrow">LEGAL</span><h1>Privacy <span className="accent">Policy.</span></h1><p>This page describes the information the OSYSTIC website may collect through its public forms and site operation.</p></div></section>
      <section className="section"><div className="content-shell prose-shell">
        <h2>Information submitted to us</h2>
        <p>When you contact OSYSTIC through a website form, we may receive information such as your name, work email, company, project context, and the message you choose to provide.</p>
        <h2>How that information is used</h2>
        <p>Submitted information may be used to respond to your request, evaluate a potential engagement, provide requested services, improve site operation, and meet applicable legal or security obligations.</p>
        <h2>Site operation</h2>
        <p>The website may use technical information and essential storage required for security, performance, form delivery, and normal website functionality. Any analytics or optional tracking should be configured in accordance with the site’s active consent settings.</p>
        <h2>Your requests</h2>
        <p>For access, correction, deletion, or other privacy-related questions about information you submitted to OSYSTIC, contact <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
        <p><Link href="/contact">Contact OSYSTIC</Link></p>
      </div></section>
    </main>
  );
}
