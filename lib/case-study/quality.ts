export type SafetyResult = { passed: boolean; issues: string[]; warnings: string[] };
export type QualityResult = {
  passed: boolean;
  score: number;
  checks: Record<string, boolean>;
  issues: string[];
};

const SECRET_PATTERNS: Array<[string, RegExp]> = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{25,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["Stripe secret", /\bsk_(?:live|test)_[A-Za-z0-9]{20,}\b/],
];

const SUSPICIOUS_FILE_PATTERNS = [
  /(^|\/)\.env(?:\.|$)/i,
  /(^|\/)(?:id_rsa|id_ed25519)(?:\.|$)/i,
  /(^|\/).*\.pem$/i,
  /(^|\/)credentials(?:\.|\/|$)/i,
  /(^|\/)secrets?(?:\.|\/|$)/i,
];

export function scanPublicShowcaseSafety(input: {
  manifestText: string;
  readme: string;
  caseStudy: string;
  docs: Array<{ path: string; content: string }>;
  filePaths: string[];
}): SafetyResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  const text = [input.manifestText, input.readme, input.caseStudy, ...input.docs.map((doc) => doc.content)].join("\n");

  for (const [label, pattern] of SECRET_PATTERNS) {
    if (pattern.test(text)) issues.push(`Potential ${label} detected in public documentation.`);
  }

  for (const path of input.filePaths) {
    if (/(^|\/)\.env\.example$/i.test(path)) continue;
    if (SUSPICIOUS_FILE_PATTERNS.some((pattern) => pattern.test(path))) {
      issues.push(`Suspicious public file path detected: ${path}`);
    }
  }

  const emailMatches = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi) ?? [];
  const externalEmails = [...new Set(emailMatches.filter((email) => !/@osystic\.com$/i.test(email)))];
  if (externalEmails.length) warnings.push("Public documentation contains non-OSYSTIC email addresses; review client/privacy exposure.");

  return { passed: issues.length === 0, issues, warnings };
}

export function evaluatePublicShowcaseQuality(input: {
  readme: string;
  caseStudy: string;
  assetPaths: string[];
}): QualityResult {
  const text = `${input.readme}\n${input.caseStudy}`.toLowerCase();
  const checks: Record<string, boolean> = {
    substantialReadme: input.readme.trim().length >= 500,
    substantialCaseStudy: input.caseStudy.trim().length >= 800,
    challenge: /(?:^|\n)#{1,4}\s+.*(?:challenge|problem)/i.test(input.caseStudy) || /\bthe (?:engineering )?challenge\b/i.test(text),
    solutionOrArchitecture: /(?:^|\n)#{1,4}\s+.*(?:solution|approach|architecture|system)/i.test(input.caseStudy) || /\barchitecture\b/i.test(text),
    engineeringEvidence: /engineering highlights|implementation highlights|technical overview|validation evidence/i.test(text),
    technology: /technology|tech stack|stack\b/i.test(text),
    outcome: /outcome|results|validation|delivery evidence|engagement outcome/i.test(text),
    confidentialityBoundary: /public vs\.? private|sanitized|portfolio-safe|confidential/i.test(text),
    visualEvidence: input.assetPaths.length > 0,
  };

  const entries = Object.entries(checks);
  const passedCount = entries.filter(([, passed]) => passed).length;
  const score = Math.round((passedCount / entries.length) * 100);
  const issues = entries.filter(([, passed]) => !passed).map(([key]) => `Missing or weak quality signal: ${key}.`);
  return { passed: score >= 78 && checks.substantialCaseStudy && checks.confidentialityBoundary && checks.visualEvidence, score, checks, issues };
}
