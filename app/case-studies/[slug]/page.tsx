import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Cpu, Layers3 } from "lucide-react";
import { fetchCaseStudy } from "../actions";
import { FinalCTA } from "@/app/components/marketing/FinalCTA";
import { StructuredData } from "@/app/components/seo/StructuredData";
import { createSeoMetadata } from "@/lib/seo";
import { breadcrumbSchema, caseStudySchema } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await fetchCaseStudy(slug);
  if (!study) {
    return createSeoMetadata({
      title: "Case study not found",
      description: "The requested OSYSTIC case study could not be found.",
      path: "/case-studies",
      noIndex: true,
    });
  }

  return createSeoMetadata({
    title: study.title,
    description: study.excerpt || study.challenge,
    path: `/case-studies/${study.slug}`,
    keywords: [...study.technologies, "enterprise AI case study", "software engineering case study"],
    image: study.featuredImage,
    type: "article",
    publishedTime: study.publishedAt,
    authors: ["OSYSTIC"],
  });
}

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await fetchCaseStudy(slug);
  if (!study) notFound();

  const structuredData = [
    caseStudySchema({
      title: study.title,
      description: study.excerpt || study.challenge,
      path: `/case-studies/${study.slug}`,
      image: study.featuredImage,
      technologies: study.technologies,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Case Studies", path: "/case-studies" },
      { name: study.title, path: `/case-studies/${study.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main id="main-content" className="fp-case-detail">
        <section className="fp-case-hero" aria-labelledby="case-study-title">
          <div className="container-shell">
            <Link href="/case-studies" className="future-inline-link"><ArrowLeft size={14} /> Evidence ledger</Link>
            <div className="fp-case-hero-grid">
              <header>
                <span className="future-kicker">CASE STUDY / {study.client.toUpperCase()}</span>
                <span className="eyebrow">DELIVERY EVIDENCE</span>
                <h1 id="case-study-title">{study.title}</h1>
                <p>{study.excerpt || study.challenge}</p>
                <div className="fp-case-tags">{study.technologies.slice(0, 5).map((technology) => <span key={technology}>{technology}</span>)}</div>
                {study.githubUrl ? (
                  <a href={study.githubUrl} target="_blank" rel="noopener noreferrer" className="future-inline-link">
                    View full technical case study on GitHub <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </header>
              <div className="fp-case-media">
                {study.featuredImage ? (
                  <Image src={study.featuredImage} alt={`${study.title} project visual`} fill sizes="(max-width:900px) 94vw, 46vw" unoptimized={study.featuredImage.toLowerCase().endsWith(".svg")} />
                ) : (
                  <div className="fp-case-placeholder" aria-label="OSYSTIC delivery system"><Cpu size={40} /><b>OSYSTIC</b><small>DELIVERY SYSTEM</small></div>
                )}
                <span className="scan" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section className="fp-case-stack" aria-label="Technology surface">
          <div className="container-shell"><Layers3 size={20} /><span>TECHNOLOGY SURFACE</span><div>{study.technologies.map((technology) => <b key={technology}>{technology}</b>)}</div></div>
        </section>
        <FinalCTA title="Need a system with similar constraints?" body="We can discuss relevant architecture and delivery experience while respecting client confidentiality." />
      </main>
    </>
  );
}
