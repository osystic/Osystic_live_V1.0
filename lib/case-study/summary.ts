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

type MarkdownSection = {
  level: number;
  title: string;
  normalized: string;
  content: string;
  line: number;
};

const EXECUTIVE_HEADINGS = [
  "Executive summary",
  "Project overview",
  "What this repository is",
  "Context",
  "Engagement context",
];

const CHALLENGE_HEADINGS = [
  "Challenge",
  "The challenge",
  "Engineering challenge",
  "Engineering challenges",
  "Problem",
  "The problem",
  "Problem statement",
  "Problem space",
  "Core problem",
  "Client objective translated into engineering requirements",
  "Constraints",
];

const SOLUTION_HEADINGS = [
  "Solution",
  "Solution architecture",
  "Engineering response",
  "Engineering approach",
  "Architecture decision",
  "Research architecture",
  "Research and validation architecture",
  "Engineering architecture",
  "Product architecture",
  "Architecture",
  "Solution pattern",
  "Three-phase delivery",
  "Rule translation",
  "R5 lifecycle correction",
  "Key engineering decisions",
];

const HIGHLIGHT_HEADINGS = [
  "Engineering highlights",
  "Key implementation highlights",
  "Key engineering decisions",
  "Implementation highlights",
];

const TECHNOLOGY_HEADINGS = [
  "Technology",
  "Technology stack",
  "Tech stack",
  "Technology surface",
  "Core stack",
];

const OUTCOME_HEADINGS = [
  "Outcome",
  "Outcomes",
  "Result",
  "Results",
  "Engagement outcome",
  "Delivery outcome",
  "Validation outcome",
  "Public result summary",
  "Repository-hardening outcome",
  "Outcome and relevance",
  "Outcome / what this demonstrates",
];

const CONFIDENTIALITY_HEADINGS = [
  "Disclosure boundary",
  "Scope and disclosure boundary",
  "Disclosure and claims boundary",
  "Public vs private repository boundary",
  "Public vs. private repository boundary",
  "Public/private boundary",
  "Scope boundaries",
  "Scope and safety boundary",
];

function toStringArray(value: unknown, limit = 12): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item ?? "").trim()).filter(Boolean))].slice(0, limit);
}

function scalar(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeHeading(value: string) {
  return value
    .replace(/[`*_~]/g, "")
    .replace(/^\s*\d+(?:[.)]|(?:\s*[-–—:]))?\s*/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function parseSections(markdown: string): MarkdownSection[] {
  const lines = (markdown || "").replace(/\r/g, "").split("\n");
  const headings: Array<{ level: number; title: string; normalized: string; line: number }> = [];

  for (let line = 0; line < lines.length; line += 1) {
    const match = lines[line].match(/^(#{1,4})\s+(.+?)\s*$/);
    if (!match) continue;
    const title = match[2].trim();
    headings.push({
      level: match[1].length,
      title,
      normalized: normalizeHeading(title),
      line,
    });
  }

  return headings.map((heading, index) => {
    let end = lines.length;
    for (let next = index + 1; next < headings.length; next += 1) {
      if (headings[next].level <= heading.level) {
        end = headings[next].line;
        break;
      }
    }
    return {
      ...heading,
      content: lines.slice(heading.line + 1, end).join("\n").trim(),
    };
  });
}

function headingMatches(section: MarkdownSection, names: string[]) {
  return names.some((name) => {
    const target = normalizeHeading(name);
    return section.normalized === target || section.normalized.startsWith(`${target} `);
  });
}

function findSection(markdown: string, names: string[]): MarkdownSection | null {
  return parseSections(markdown).find((item) => headingMatches(item, names)) ?? null;
}

function findSectionFromSources(sources: string[], names: string[]): MarkdownSection | null {
  for (const source of sources) {
    const found = findSection(source, names);
    if (found?.content.trim()) return found;
  }
  return null;
}

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function isTableBlock(block: string) {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  return Boolean(lines.length) && lines.every((line) => line.startsWith("|"));
}

function isImageOnly(block: string) {
  const normalized = block.trim();
  return /^!\[[^\]]*]\([^)]*\)$/.test(normalized);
}

function bulletItems(value: string, limit = 8): string[] {
  const items: string[] = [];
  for (const line of (value || "").split("\n")) {
    const match = line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.+)$/);
    if (!match?.[1]) continue;
    const cleaned = stripMarkdown(match[1]);
    if (cleaned.length >= 12) items.push(cleaned);
    if (items.length >= limit) break;
  }
  return [...new Set(items)];
}

function tableHighlights(value: string, limit = 8): string[] {
  const results: string[] = [];
  for (const raw of (value || "").split("\n")) {
    const line = raw.trim();
    if (!line.startsWith("|") || !line.endsWith("|")) continue;
    const cells = line
      .slice(1, -1)
      .split("|")
      .map((cell) => stripMarkdown(cell.trim()))
      .filter(Boolean);
    if (!cells.length || cells.every((cell) => /^[-:]+$/.test(cell))) continue;
    if (cells.some((cell) => /^(field|value|area|engineering result)$/i.test(cell))) continue;

    if (cells.length >= 4) {
      for (let index = 0; index + 1 < cells.length; index += 2) {
        const label = cells[index];
        const detail = cells[index + 1];
        if (label && detail && detail.length >= 8) results.push(`${label}: ${detail}`);
        if (results.length >= limit) return [...new Set(results)];
      }
    } else if (cells.length >= 2) {
      const [label, detail] = cells;
      if (detail.length >= 8) results.push(`${label}: ${detail}`);
    }
  }
  return [...new Set(results)].slice(0, limit);
}

function proseBlocks(value: string): string[] {
  const withoutCode = (value || "").replace(/```[\s\S]*?```/g, " ");
  const candidates: string[] = [];

  for (const rawBlock of withoutCode.split(/\n{2,}/)) {
    const block = rawBlock.trim();
    if (!block || isImageOnly(block) || isTableBlock(block)) continue;
    if (/^#{1,6}\s+\S/.test(block) && !block.includes("\n")) continue;

    const bullets = bulletItems(block, 4);
    if (bullets.length >= 2) {
      const joined = bullets
        .slice(0, 3)
        .map((item) => item.replace(/[;:.]+$/, ""))
        .join("; ") + ".";
      if (joined.length >= 45) candidates.push(joined);
      continue;
    }

    const cleaned = stripMarkdown(block);
    if (cleaned.length >= 30 && !/^(architecture|technology|engineering highlights|validation evidence)$/i.test(cleaned)) {
      candidates.push(cleaned);
    }
  }

  return candidates;
}

function clip(value: string, max = 520) {
  const cleaned = stripMarkdown(value);
  if (cleaned.length <= max) return cleaned;
  const shortened = cleaned.slice(0, max);
  const stop = Math.max(
    shortened.lastIndexOf(". "),
    shortened.lastIndexOf("; "),
    shortened.lastIndexOf(" "),
  );
  return `${shortened.slice(0, stop > max * 0.7 ? stop + 1 : max).trim()}…`;
}

function firstNarrative(value: string, fallback = "", max = 520) {
  const blocks = proseBlocks(value);
  let best = blocks.find((item) => item.length >= 55) || blocks[0] || stripMarkdown(fallback);
  if (/:$/.test(best)) {
    const bullets = bulletItems(value, 3).map((item) => item.replace(/[;:.]+$/, ""));
    if (bullets.length >= 2) best = `${best} ${bullets.join("; ")}.`;
  }
  return clip(best || fallback, max);
}

function sourceNarrative(sources: string[], names: string[], fallback = "", max = 520) {
  const found = findSectionFromSources(sources, names);
  return firstNarrative(found?.content || "", fallback, max);
}

function childHeadingHighlights(markdown: string, parentNames: string[], limit = 6): string[] {
  const sections = parseSections(markdown);
  const parentIndex = sections.findIndex((item) => headingMatches(item, parentNames));
  if (parentIndex < 0) return [];
  const parent = sections[parentIndex];
  const results: string[] = [];

  for (let index = parentIndex + 1; index < sections.length; index += 1) {
    const item = sections[index];
    if (item.level <= parent.level) break;
    if (item.level !== parent.level + 1) continue;
    const title = item.title.replace(/^\s*\d+[.)]?\s*/, "").trim();
    const detail = firstNarrative(item.content, "", 260);
    const combined = detail && normalizeHeading(detail) !== normalizeHeading(title)
      ? `${title}: ${detail}`
      : title;
    if (combined.length >= 18) results.push(combined);
    if (results.length >= limit) break;
  }
  return [...new Set(results)];
}

function namedSectionHighlights(sources: string[], names: string[], limit = 5): string[] {
  const results: string[] = [];
  for (const name of names) {
    for (const source of sources) {
      const found = findSection(source, [name]);
      if (!found) continue;
      const detail = firstNarrative(found.content, "", 280);
      if (detail.length >= 35) results.push(`${found.title}: ${detail}`);
      break;
    }
    if (results.length >= limit) break;
  }
  return [...new Set(results)];
}

function extractHighlights(sources: string[]): string[] {
  const direct = findSectionFromSources(sources, HIGHLIGHT_HEADINGS);
  if (direct) {
    const children = sources
      .flatMap((source) => childHeadingHighlights(source, HIGHLIGHT_HEADINGS, 6));
    if (children.length >= 2) return [...new Set(children)].slice(0, 6);

    const bullets = bulletItems(direct.content, 6);
    if (bullets.length >= 2) return bullets;
    const table = tableHighlights(direct.content, 6);
    if (table.length >= 2) return table;

    const prose = proseBlocks(direct.content).map((item) => clip(item, 300));
    if (prose.length >= 2) return [...new Set(prose)].slice(0, 6);
  }

  for (const parent of [
    ["Key engineering decisions"],
    ["Engineering approach"],
    ["Solution architecture"],
    ["Three-phase delivery"],
  ]) {
    for (const source of sources) {
      const children = childHeadingHighlights(source, parent, 6);
      if (children.length >= 2) return children;
    }
  }

  const named = namedSectionHighlights(sources, [
    "Rule translation",
    "State and duplicate control",
    "Alert-only safety boundary",
    "Validation strategy",
    "R5 lifecycle correction",
    "Data discipline",
    "Temporal model validation",
    "Feature and model boundary",
  ], 6);
  if (named.length >= 2) return named;

  const challenge = findSectionFromSources(sources, CHALLENGE_HEADINGS);
  const solution = findSectionFromSources(sources, SOLUTION_HEADINGS);
  const fallback = [
    ...bulletItems(challenge?.content || "", 3),
    ...bulletItems(solution?.content || "", 3),
  ];
  return [...new Set(fallback)].slice(0, 6);
}

function inlineTechnologyList(value: string): string[] {
  const results: string[] = [];
  for (const match of value.matchAll(/`([^`\n]{1,80})`/g)) {
    const cleaned = stripMarkdown(match[1]);
    if (cleaned && !/^(true|false|main|none|no-go|yes|no)$/i.test(cleaned)) results.push(cleaned);
  }
  for (const line of value.split(/\n/)) {
    if (!/[·|]/.test(line) || line.startsWith("|")) continue;
    for (const item of line.split(/[·|]/)) {
      const cleaned = stripMarkdown(item);
      if (cleaned.length >= 2 && cleaned.length <= 60) results.push(cleaned);
    }
  }
  return [...new Set(results)].slice(0, 14);
}

const KNOWN_TECHNOLOGIES = [
  "React", "TypeScript", "JavaScript", "Next.js", "Vite", "Tailwind CSS",
  "Supabase", "PostgreSQL", "Edge Functions", "Stripe", "GitHub Actions",
  "Pine Script", "TradingView", "MetaTrader 4", "MQL4", "NinjaTrader 8",
  "NinjaScript", "C++17", "C++", "eBPF", "libbpf", "Linux", "ARM64",
  "Raspberry Pi 5", "C#", ".NET 8", "WPF", "ADB", "LDPlayer",
  "Python", "Pandas", "NumPy", "scikit-learn", "Jupyter", "JSON", "HTTP",
];

function detectKnownTechnologies(value: string) {
  const normalized = value.toLowerCase();
  return KNOWN_TECHNOLOGIES.filter((technology) => normalized.includes(technology.toLowerCase()));
}

function extractTechnologies(sources: string[]): string[] {
  const section = findSectionFromSources(sources, TECHNOLOGY_HEADINGS);
  if (section) {
    const bullets = bulletItems(section.content, 14);
    const inline = inlineTechnologyList(section.content);
    const table = tableHighlights(section.content, 14)
      .flatMap((item) => item.split(":").slice(1))
      .map(stripMarkdown)
      .filter(Boolean);
    const combined = [...new Set([...bullets, ...inline, ...table])];
    if (combined.length >= 2) return combined.slice(0, 14);
  }

  const combinedText = sources.join("\n");
  return [...new Set(detectKnownTechnologies(combinedText))].slice(0, 14);
}

function extractCapabilities(sources: string[]) {
  const section = findSectionFromSources(sources, ["Capability keywords", "Capabilities", "Relevant project types"]);
  if (!section) return [];
  const bullets = bulletItems(section.content, 8);
  const inline = inlineTechnologyList(section.content);
  return [...new Set([...bullets, ...inline])].slice(0, 8);
}

function extractOutcomes(sources: string[]) {
  const section = findSectionFromSources(sources, OUTCOME_HEADINGS);
  if (!section) return ["Completed delivery with public evidence retained in the engineering case study."];

  const prose = proseBlocks(section.content).map((item) => clip(item, 280)).filter((item) => item.length >= 45);
  if (prose.length) return prose.slice(0, 4);
  const bullets = bulletItems(section.content, 5);
  if (bullets.length) return bullets;
  const table = tableHighlights(section.content, 5);
  if (table.length) return table;
  return ["Completed delivery with public evidence retained in the engineering case study."];
}

function extractConfidentiality(sources: string[]) {
  const section = findSectionFromSources(sources, CONFIDENTIALITY_HEADINGS);
  const narrative = firstNarrative(section?.content || "", "", 360);
  return narrative || "The public repository is sanitized and excludes confidential implementation details, credentials, private infrastructure, commercial terms, and client conversations.";
}

function inferIndustry(repoName: string, sources: string[]) {
  const name = repoName.toLowerCase();
  if (/(forex|futures|trading|market-analysis|xauusd|ninjatrader|metatrader|cycles-tradingview)/.test(name)) {
    return "Financial Markets";
  }
  if (/(ebpf|security-system|cybersecurity)/.test(name)) return "Cybersecurity";
  if (/(event-orchestration|event-management)/.test(name)) return "SaaS & Event Operations";
  if (/(ldplayer|emulator|automation-control)/.test(name)) return "Software Automation";

  const opening = sources.map((source) => source.slice(0, 1600)).join("\n").toLowerCase();
  if (/(forex|futures|trading platform|market analysis|ninjatrader|metatrader)/.test(opening)) return "Financial Markets";
  if (/(cybersecurity|security monitoring|ebpf security)/.test(opening)) return "Cybersecurity";
  if (/(event orchestration|event planning)/.test(opening)) return "SaaS & Event Operations";
  if (/(ldplayer|android emulator|desktop automation)/.test(opening)) return "Software Automation";
  return "Technology";
}

function extractTitle(markdown: string) {
  return stripMarkdown(markdown.match(/^#\s+(.+)$/m)?.[1] || "");
}

function cleanTitleFromRepo(repoName: string) {
  return repoName
    .replace(/-case-study$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();
}

export function normalizeStructuredSummary(value: unknown): StructuredCaseStudySummary {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

  return {
    title: scalar(source.title),
    executiveSummary: scalar(source.executiveSummary ?? source.executive_summary ?? source.summary),
    industry: scalar(source.industry) || "Technology",
    capabilities: toStringArray(source.capabilities, 8),
    challenge: scalar(source.challenge),
    solution: scalar(source.solution),
    engineeringHighlights: toStringArray(source.engineeringHighlights ?? source.engineering_highlights, 8),
    technologies: toStringArray(source.technologies ?? source.technologyStack ?? source.technology_stack, 14),
    outcomes: toStringArray(source.outcomes ?? source.results, 8),
    confidentialityNote: scalar(source.confidentialityNote ?? source.confidentiality_note),
    heroVisualPath: scalar(source.heroVisualPath ?? source.hero_visual_path) || null,
  };
}

export function buildFallbackStructuredSummary(input: {
  repoName: string;
  readme: string;
  caseStudy: string;
  technologies?: string[];
  assetPaths: string[];
}): StructuredCaseStudySummary {
  const sources = [input.caseStudy, input.readme].filter(Boolean);
  const readmeTitle = extractTitle(input.readme);
  const caseTitle = extractTitle(input.caseStudy);
  const title = cleanTitleFromRepo(input.repoName) || caseTitle || readmeTitle || "OSYSTIC Engineering Case Study";

  const executiveSummary = sourceNarrative(
    sources,
    EXECUTIVE_HEADINGS,
    sourceNarrative(sources, ["What this repository is"], `${title} is a completed OSYSTIC engineering engagement documented through a sanitized public case study.`),
    560,
  );

  const challenge = sourceNarrative(
    sources,
    CHALLENGE_HEADINGS,
    `The engagement required a controlled engineering solution that addressed the documented technical constraints while preserving a clear public evidence boundary.`,
    520,
  );

  const solution = sourceNarrative(
    sources,
    SOLUTION_HEADINGS,
    `OSYSTIC delivered a controlled engineering solution documented in the public technical case study, with implementation details kept inside the approved confidentiality boundary.`,
    560,
  );

  const heroVisualPath =
    input.assetPaths.find((path) => /(?:hero|architecture|system|overview).*\.(?:svg|png|jpe?g|webp)$/i.test(path)) ||
    input.assetPaths.find((path) => /\.(?:svg|png|jpe?g|webp)$/i.test(path)) ||
    null;

  return {
    title,
    executiveSummary,
    industry: inferIndustry(input.repoName, sources),
    capabilities: extractCapabilities(sources),
    challenge,
    solution,
    engineeringHighlights: extractHighlights(sources),
    technologies: [...new Set([...(input.technologies || []), ...extractTechnologies(sources)])].slice(0, 14),
    outcomes: extractOutcomes(sources),
    confidentialityNote: extractConfidentiality(sources),
    heroVisualPath,
  };
}

export function validateStructuredSummary(summary: StructuredCaseStudySummary) {
  const issues: string[] = [];
  if (summary.title.length < 6) issues.push("Case-study title is missing or too short.");
  if (summary.executiveSummary.length < 70) issues.push("Executive summary is too short.");
  if (summary.challenge.length < 45) issues.push("Challenge is too short.");
  if (summary.solution.length < 45) issues.push("Solution is too short.");
  if (summary.engineeringHighlights.length < 2) issues.push("At least two engineering highlights are required.");
  if (summary.technologies.length < 2) issues.push("At least two technologies are required.");
  if (summary.outcomes.length < 1) issues.push("At least one evidence-backed outcome is required.");
  if (summary.confidentialityNote.length < 25) issues.push("Confidentiality/public-evidence boundary is missing.");
  return { valid: issues.length === 0, issues };
}

export function summaryToMarkdown(summary: StructuredCaseStudySummary) {
  const lines = [
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
    ...summary.engineeringHighlights.map((item) => `- ${item}`),
    "",
    "### Technology Stack",
    ...summary.technologies.map((item) => `- ${item}`),
    "",
    "### Outcomes",
    ...summary.outcomes.map((item) => `- ${item}`),
    "",
    "### Public Evidence Boundary",
    summary.confidentialityNote,
  ];
  return lines.join("\n").trim();
}

export function parseSummaryMarkdown(
  markdown: string,
  fallback: StructuredCaseStudySummary,
): StructuredCaseStudySummary {
  const sources = [markdown];
  const bulletsFor = (names: string[]) => bulletItems(findSectionFromSources(sources, names)?.content || "", 14);

  return {
    ...fallback,
    executiveSummary: sourceNarrative(sources, ["Executive Summary"], fallback.executiveSummary, 560),
    challenge: sourceNarrative(sources, ["Challenge"], fallback.challenge, 520),
    solution: sourceNarrative(sources, ["What OSYSTIC Delivered", "Solution"], fallback.solution, 560),
    engineeringHighlights: bulletsFor(["Engineering Highlights"]).length
      ? bulletsFor(["Engineering Highlights"])
      : fallback.engineeringHighlights,
    technologies: bulletsFor(["Technology Stack"]).length
      ? bulletsFor(["Technology Stack"])
      : fallback.technologies,
    outcomes: bulletsFor(["Outcomes"]).length
      ? bulletsFor(["Outcomes"])
      : fallback.outcomes,
    confidentialityNote: sourceNarrative(
      sources,
      ["Public Evidence Boundary"],
      fallback.confidentialityNote,
      360,
    ),
  };
}
