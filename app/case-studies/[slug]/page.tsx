import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCaseStudy } from "../actions";
import { CaseStudyPublicView } from "../CaseStudyPublicView";
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
      <CaseStudyPublicView study={study} />
    </>
  );
}
