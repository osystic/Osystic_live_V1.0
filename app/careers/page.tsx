import type { Metadata } from "next";
import { ArrowRight, Code2, MapPin, Users } from "lucide-react";
import { CareersClient } from "./_components/CareersClient";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { siteConfig } from "../config/site";

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers and general applications for OSYSTIC engineering and business roles.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container-shell page-hero-grid">
          <div>
            <span className="eyebrow">CAREERS</span>
            <h1>Build serious systems with <span className="accent">OSYSTIC.</span></h1>
            <p>We value technical depth, ownership, clear communication, and people who can move from a problem statement to dependable delivery. Applications are reviewed against current team needs.</p>
          </div>
          <div className="page-hero-visual careers-hero-points">
            <div><Code2 size={20}/><strong>Engineering depth</strong><span>AI, software, data, cloud, and product delivery.</span></div>
            <div><Users size={20}/><strong>Ownership</strong><span>Work is organized around clear responsibility and visible delivery.</span></div>
            <div><MapPin size={20}/><strong>Local operations</strong><span>{siteConfig.localOperations}</span></div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell careers-layout">
          <div className="careers-intro">
            <SectionHeading eyebrow="GENERAL APPLICATION" title="Tell us what you can build." body="Use the application form to share your experience, role interests, relevant skills, and CV. Submission does not imply a current vacancy or guarantee a response." />
            <a className="text-link" href={`mailto:${siteConfig.email}`}>Questions about careers <ArrowRight size={14}/></a>
          </div>
          <div className="careers-form-shell"><CareersClient /></div>
        </div>
      </section>
    </main>
  );
}
