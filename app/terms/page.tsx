import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the OSYSTIC public website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container-shell"><span className="eyebrow">LEGAL</span><h1>Terms of <span className="accent">Use.</span></h1><p>These terms apply to use of the OSYSTIC public website. Project-specific commercial terms are governed by the applicable agreement with the client.</p></div></section>
      <section className="section"><div className="content-shell prose-shell">
        <h2>Lawful use</h2>
        <p>You may use this website for lawful informational and business purposes. You must not misuse the site, attempt unauthorized access, interfere with its operation, or misrepresent information submitted through its forms.</p>
        <h2>Website content</h2>
        <p>Unless otherwise stated, website copy, visual material, brand assets, and original content are owned by OSYSTIC or used with permission. Website content may not be republished as your own without authorization.</p>
        <h2>Services and project terms</h2>
        <p>Descriptions on this website are general capability information. Scope, deliverables, ownership terms, timelines, fees, warranties, and responsibilities for a specific engagement are defined in the relevant written agreement.</p>
        <h2>Availability and accuracy</h2>
        <p>We aim to keep public information accurate and the website available, but website content may be updated and uninterrupted availability is not guaranteed.</p>
        <p><Link href="/contact">Questions about these terms</Link></p>
      </div></section>
    </main>
  );
}
