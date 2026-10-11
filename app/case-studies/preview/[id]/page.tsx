import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPublicView } from "../../CaseStudyPublicView";
import type { PublicCaseStudy } from "../../actions";
import { buildPublicDraft } from "@/lib/case-study/publish";
import { getAiCaseStudy } from "@/lib/case-study/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Study Preview",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function CaseStudyPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getAiCaseStudy(id);
  if (!record) notFound();

  const draft = buildPublicDraft({
    githubUrl: record.githubUrl,
    projectTitle: record.projectTitle,
    generatedContent: record.generatedContent,
    analysis: record.analysis,
  });

  const study: PublicCaseStudy = {
    id: record.id,
    title: draft.title,
    slug: draft.slug,
    excerpt: draft.excerpt,
    content: draft.content,
    client: draft.client,
    challenge: draft.challenge,
    solution: draft.solution,
    results: draft.results,
    technologies: draft.technologies,
    featuredImage: draft.featuredImage,
    githubUrl: draft.githubUrl,
    viewCount: 0,
    publishedAt: null,
  };

  return <CaseStudyPublicView study={study} preview />;
}
