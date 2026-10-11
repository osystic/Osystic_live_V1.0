export type StructuredCaseStudySummary = {
  title: string;
  executiveSummary: string;
  industry: string;
  capabilities: string[];
  challenge: string;
  solution: string;
  engineeringHighlights: string[];
  technologies: string[];
  outcomes: string[];
  confidentialityNote: string;
  heroVisualPath: string | null;
};

function clean(value: unknown, max = 1200) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanList(value: unknown, limit: number, itemMax = 240) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => clean(item, itemMax)).filter(Boolean))].slice(0, limit);
}

export function normalizeStructuredSummary(value: unknown): StructuredCaseStudySummary {
  const data = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

  return {
    title: clean(data.title, 140),
    executiveSummary: clean(data.executiveSummary, 700),
    industry: clean(data.industry, 100) || "Technology",
    capabilities: cleanList(data.capabilities, 6, 80),
    challenge: clean(data.challenge, 1200),
    solution: clean(data.solution, 1200),
    engineeringHighlights: cleanList(data.engineeringHighlights, 6, 260),
    technologies: cleanList(data.technologies, 16, 80),
    outcomes: cleanList(data.outcomes, 5, 240),
    confidentialityNote: clean(data.confidentialityNote, 400),
    heroVisualPath: clean(data.heroVisualPath, 300) || null,
  };
}

export function validateStructuredSummary(summary: StructuredCaseStudySummary) {
  const issues: string[] = [];
  if (summary.title.length < 5) issues.push("Title is missing or too short.");
  if (summary.executiveSummary.length < 60) issues.push("Executive summary is too short.");
  if (summary.challenge.length < 60) issues.push("Challenge is too short.");
  if (summary.solution.length < 60) issues.push("Solution is too short.");
  if (summary.engineeringHighlights.length < 2) issues.push("At least two engineering highlights are required.");
  if (summary.technologies.length < 2) issues.push("At least two technologies are required.");
  if (summary.outcomes.length < 1) issues.push("At least one evidence-backed outcome is required.");
  return { valid: issues.length === 0, issues };
}

function bullets(values: string[]) {
  return values.length ? values.map((item) => `- ${item}`).join("\n") : "- Not explicitly stated in the public evidence.";
}

export function summaryToMarkdown(summary: StructuredCaseStudySummary) {
  return [
    "### Executive Summary",
    summary.executiveSummary,
    "",
    "### Challenge",
    summary.challenge,
    "",
    "### What OSYSTIC Delivered",
    summary.solution,
    "",
    "### Engineering Highlights",
    bullets(summary.engineeringHighlights),
    "",
    "### Technology Stack",
    bullets(summary.technologies),
    "",
    "### Outcomes",
    bullets(summary.outcomes),
  ].join("\n").trim();
}

function section(markdown: string, names: string[]) {
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(?:^|\\n)#{1,4}\\s+(?:${escaped})\\s*\\n([\\s\\S]*?)(?=\\n#{1,4}\\s+|$)`, "i");
  return markdown.match(regex)?.[1]?.trim() || "";
}

function firstParagraph(value: string, fallback: string, max = 900) {
  const blocks = value
    .split(/\n{2,}/)
    .map((item) => item.replace(/^[-*+]\s+/gm, "").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const result = blocks.find((item) => item.length >= 45) || blocks[0] || fallback;
  return result.slice(0, max);
}

function listFromSection(value: string, limit: number) {
  const bullets = value.split(/\r?\n/)
    .map((line) => line.match(/^\s*[-*+]\s+(.+)$/)?.[1]?.replace(/[*_`]/g, "").trim())
    .filter((item): item is string => Boolean(item));
  return [...new Set(bullets)].slice(0, limit);
}


function inlineTechnologyList(value: string) {
  const backticks = [...value.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim()).filter(Boolean);
  if (backticks.length) return [...new Set(backticks)].slice(0, 16);
  return value
    .split(/[·|,]/)
    .map((item) => item.replace(/[*_`]/g, "").trim())
    .filter((item) => item.length > 1 && item.length < 80)
    .slice(0, 16);
}

function titleFromRepo(repoName: string) {
  return repoName
    .replace(/-case-study$/i, "")
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildFallbackStructuredSummary(input: {
  repoName: string;
  readme: string;
  caseStudy: string;
  technologies?: string[];
  assetPaths?: string[];
}): StructuredCaseStudySummary {
  const source = input.caseStudy || input.readme;
  const overview = section(source, ["Project Overview", "What this repository is", "Overview"]);
  const challenge = section(source, ["The engineering challenge", "Engineering challenge", "Challenge", "Problem Statement", "Problem"]);
  const solution = section(source, ["Solution", "Solution architecture", "Architecture", "Product architecture", "Research and validation architecture", "Approach"]);
  const engineering = section(source, ["Engineering highlights", "Implementation Highlights", "Technical overview"]);
  const outcomes = section(source, ["Engagement outcome", "Results", "Results / Impact", "Validation evidence", "Outcome"]);
  const technology = section(source, ["Technology", "Technology Stack", "Tech Stack"]);
  const boundary = section(source, ["Public vs. private repository boundary", "Company showcase classification"]);

  const detectedTech = input.technologies?.length
    ? input.technologies
    : (listFromSection(technology, 16).length ? listFromSection(technology, 16) : inlineTechnologyList(technology));

  const heroVisualPath = (input.assetPaths || []).find((path) => /(?:architecture|hero|system|overview|validation).*\.(?:svg|png|jpe?g|webp)$/i.test(path))
    || (input.assetPaths || []).find((path) => /\.(?:svg|png|jpe?g|webp)$/i.test(path))
    || null;

  return {
    title: titleFromRepo(input.repoName),
    executiveSummary: firstParagraph(overview || input.readme, `A completed OSYSTIC engineering engagement documented in a sanitized public showcase repository.`, 650),
    industry: "Technology",
    capabilities: [],
    challenge: firstParagraph(challenge, "The public case study documents a completed engineering challenge and the constraints addressed by the delivered system."),
    solution: firstParagraph(solution, "OSYSTIC delivered a controlled engineering solution documented in the public technical case study."),
    engineeringHighlights: listFromSection(engineering, 6),
    technologies: detectedTech,
    outcomes: listFromSection(outcomes, 5).length ? listFromSection(outcomes, 5) : [firstParagraph(outcomes, "Completed delivery with public evidence retained in the engineering case study.", 220)],
    confidentialityNote: firstParagraph(boundary, "The public repository is sanitized and excludes confidential implementation details.", 320),
    heroVisualPath,
  };
}

export function parseSummaryMarkdown(markdown: string, fallback: StructuredCaseStudySummary): StructuredCaseStudySummary {
  const executiveSummary = firstParagraph(section(markdown, ["Executive Summary"]), fallback.executiveSummary, 700);
  const challenge = firstParagraph(section(markdown, ["Challenge"]), fallback.challenge, 1200);
  const solution = firstParagraph(section(markdown, ["What OSYSTIC Delivered", "Solution"]), fallback.solution, 1200);
  const engineeringHighlights = listFromSection(section(markdown, ["Engineering Highlights"]), 6);
  const technologies = listFromSection(section(markdown, ["Technology Stack"]), 16);
  const outcomes = listFromSection(section(markdown, ["Outcomes"]), 5);

  return {
    ...fallback,
    executiveSummary,
    challenge,
    solution,
    engineeringHighlights: engineeringHighlights.length ? engineeringHighlights : fallback.engineeringHighlights,
    technologies: technologies.length ? technologies : fallback.technologies,
    outcomes: outcomes.length ? outcomes : fallback.outcomes,
  };
}
