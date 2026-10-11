import { marked } from "marked";
import { sanitizePublishedHtml } from "@/lib/content-security";
import { stringAt } from "./manifest";
import { parseStoredAnalysis } from "./metadata";
import {
  buildFallbackStructuredSummary,
  parseSummaryMarkdown,
  type StructuredCaseStudySummary,
} from "./summary";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96) || "case-study";
}

export function stripMarkdownInline(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/~([^~]+)~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function markdownToHtml(markdown: string) {
  const html = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
  return sanitizePublishedHtml(html);
}

function publicNotesMarkdown(summary: StructuredCaseStudySummary) {
  const sections: string[] = [];
  if (summary.engineeringHighlights.length) {
    sections.push("### Engineering Highlights", ...summary.engineeringHighlights.map((item) => `- ${item}`));
  }
  if (summary.capabilities.length) {
    sections.push("", "### Capabilities", ...summary.capabilities.map((item) => `- ${item}`));
  }
  if (summary.confidentialityNote) {
    sections.push("", "### Public Evidence Boundary", summary.confidentialityNote);
  }
  return sections.join("\n").trim();
}

function deriveSummary(input: {
  projectTitle: string | null;
  generatedContent: string;
  analysis: string | null;
}) {
  const analysis = parseStoredAnalysis(input.analysis);
  if (analysis.automation?.summary) return { summary: analysis.automation.summary, analysis };

  const source = analysis.source;
  const fallback = buildFallbackStructuredSummary({
    repoName: source?.repository.name || input.projectTitle || "Case-Study",
    readme: source?.readme || "",
    caseStudy: source?.caseStudy || "",
    assetPaths: source?.assetPaths || [],
  });
  return { summary: parseSummaryMarkdown(input.generatedContent, fallback), analysis };
}

export type PublicCaseStudyDraft = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  featuredImage: string | null;
  githubUrl: string;
};

export function buildPublicDraft(input: {
  githubUrl: string;
  projectTitle: string | null;
  generatedContent: string;
  analysis: string | null;
}): PublicCaseStudyDraft {
  const { summary, analysis } = deriveSummary(input);
  const automation = analysis.automation;
  const source = analysis.source;
  const clientIdentityPublic = Boolean(source?.manifest.clientIdentityPublic);
  const rawManifest = source?.manifest.raw || {};
  const publicClient = clientIdentityPublic
    ? stringAt(rawManifest, "project.client") || stringAt(rawManifest, "client") || "Public Client"
    : "Confidential Client";

  return {
    title: summary.title || input.projectTitle || "OSYSTIC Engineering Case Study",
    slug: automation?.canonicalSlug || slugify(summary.title || input.projectTitle || "case-study"),
    excerpt: summary.executiveSummary,
    content: markdownToHtml(publicNotesMarkdown(summary)),
    client: publicClient,
    challenge: summary.challenge,
    solution: summary.solution,
    results: summary.outcomes,
    technologies: summary.technologies,
    featuredImage: automation?.heroVisualUrl || null,
    githubUrl: input.githubUrl,
  };
}
