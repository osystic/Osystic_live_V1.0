import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Cpu, Layers3 } from "lucide-react";
import { FinalCTA } from "@/app/components/marketing/FinalCTA";
import type { PublicCaseStudy } from "./actions";

export function CaseStudyPublicView({
  study,
  preview = false,
}: {
  study: PublicCaseStudy;
  preview?: boolean;
}) {
  return (
    <main id="main-content" className="fp-case-detail">
      {preview ? (
        <div className="fp-case-preview-notice" role="status">
          <div className="container-shell">
            <b>ADMIN PREVIEW</b>
            <span>This draft is not public yet. Publish only after the content and visual layout are approved.</span>
          </div>
        </div>
      ) : null}

      <section className="fp-case-hero" aria-labelledby="case-study-title">
        <div className="container-shell">
          <Link href={preview ? "/admin/case-studies" : "/case-studies"} className="future-inline-link">
            <ArrowLeft size={14} /> {preview ? "Back to review queue" : "Evidence ledger"}
          </Link>
          <div className="fp-case-hero-grid">
            <header>
              <span className="future-kicker">CASE STUDY / {study.client.toUpperCase()}</span>
              <span className="eyebrow">DELIVERY EVIDENCE</span>
              <h1 id="case-study-title">{study.title}</h1>
              <p>{study.excerpt || study.challenge}</p>
              <div className="fp-case-tags">
                {study.technologies.slice(0, 5).map((technology) => <span key={technology}>{technology}</span>)}
              </div>
              {study.githubUrl ? (
                <a href={study.githubUrl} target="_blank" rel="noopener noreferrer" className="future-inline-link">
                  View full technical case study on GitHub <ArrowUpRight size={14} />
                </a>
              ) : null}
            </header>
            <div className="fp-case-media">
              {study.featuredImage ? (
                <Image
                  src={study.featuredImage}
                  alt={`${study.title} project visual`}
                  fill
                  sizes="(max-width:900px) 94vw, 46vw"
                  unoptimized={study.featuredImage.toLowerCase().endsWith(".svg")}
                />
              ) : (
                <div className="fp-case-placeholder" aria-label="OSYSTIC delivery system">
                  <Cpu size={40} /><b>OSYSTIC</b><small>DELIVERY SYSTEM</small>
                </div>
              )}
              <span className="scan" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="fp-case-stack" aria-label="Technology surface">
        <div className="container-shell">
          <Layers3 size={20} />
          <span>TECHNOLOGY SURFACE</span>
          <div>{study.technologies.map((technology) => <b key={technology}>{technology}</b>)}</div>
        </div>
      </section>
      <FinalCTA
        title="Need a system with similar constraints?"
        body="We can discuss relevant architecture and delivery experience while respecting client confidentiality."
      />
    </main>
  );
}
