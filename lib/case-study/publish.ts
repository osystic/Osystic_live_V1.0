import { marked } from "marked";
import { sanitizePublishedHtml } from "@/lib/content-security";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "case-study";
}

export function parseMarkdownSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const regex = /^###[ \t]+(.+)$/gm;
  const matches = [...markdown.matchAll(regex)];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const heading = (match[1] || "").trim().toLowerCase();
    const start = (match.index ?? 0) + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? markdown.length : markdown.length;
    sections[heading] = markdown.slice(start, end).trim();
  }
  return sections;
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

export function extractParagraph(text: string, maxLength = 200) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((block) => stripMarkdownInline(block.replace(/^[-*+]\s+/gm, "")))
    .filter((block) => block && !block.startsWith("|"));
  const first = paragraphs[0] || "";
  if (first.length <= maxLength) return first;
  return first.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function extractBullets(text: string, limit = 12): string[] {
  const bullets: string[] = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*[-*+]\s+(.+)$/);
    if (!match?.[1]) continue;
    const cleaned = stripMarkdownInline(match[1]);
    if (cleaned) bullets.push(cleaned);
    if (bullets.length >= limit) break;
  }
  return bullets;
}

export function markdownToHtml(markdown: string) {
  const html = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
  return sanitizePublishedHtml(html);
}

export function prettifyTitle(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
};

export function buildPublicDraft(input: {
  githubUrl: string;
  projectTitle: string | null;
  generatedContent: string;
}): PublicCaseStudyDraft {
  const sections = parseMarkdownSections(input.generatedContent);
  const title = prettifyTitle(input.projectTitle || input.githubUrl.split("/").pop() || "Case Study");
  const owner = input.githubUrl.split("/")[3] || "Open Source";

  const overview = sections["project overview"] || "";
  const problem = sections["problem statement"] || "";
  const solution = sections["solution"] || "";
  const resultsSection = sections["results / impact"] || sections["results/impact"] || "";
  const stackSection = sections["technology stack"] || "";

  return {
    title,
    slug: slugify(title),
    excerpt: extractParagraph(overview, 180),
    content: markdownToHtml(input.generatedContent),
    client: owner,
    challenge: extractParagraph(problem, 700) || "Information not explicitly provided",
    solution: extractParagraph(solution, 700) || "Information not explicitly provided",
    results: extractBullets(resultsSection, 6),
    technologies: extractBullets(stackSection, 12),
  };
}
