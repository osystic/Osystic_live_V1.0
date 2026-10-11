import assert from "node:assert/strict";
import { parseOsysticYaml, normalizeShowcaseManifest } from "../lib/case-study/manifest";
import { evaluateRepositoryEligibility, semanticTitleSimilarity } from "../lib/case-study/eligibility";
import { evaluatePublicShowcaseQuality, scanPublicShowcaseSafety } from "../lib/case-study/quality";

const v2 = `
schema_version: 2
repository_class: public-showcase
visibility: public
data_classification: public
project:
  key: event-orchestration-saas
  name: Event Orchestration SaaS
  status: completed
portfolio:
  eligible: true
  status: approved-public-showcase
website:
  eligible: true
  status: ready-for-review
  canonical_slug: event-orchestration-saas
  auto_sync: true
publication:
  client_identity_public: false
  credentials_included: false
source:
  type: sanitized-client-delivery
  source_code_included: false
`;

const manifest = normalizeShowcaseManifest(parseOsysticYaml(v2), "Event-Orchestration-SaaS-Case-Study");
assert.equal(manifest.schemaVersion, 2);
assert.equal(manifest.projectKey, "event-orchestration-saas");
assert.equal(manifest.websiteEligible, true);
assert.equal(manifest.legacy, false);

const caseStudy = `
# Event Orchestration SaaS

## The engineering challenge
Coordinate multiple users and workflows without exposing privileged operations.

## Solution architecture
A typed web application coordinates authenticated workflows through a controlled backend.

## Engineering highlights
- Server-side authorization boundaries.
- Event-driven notification workflows.

## Technology
React, TypeScript, PostgreSQL, serverless functions.

## Engagement outcome
The completed delivery passed production build and validation checks.

## Public vs. private repository boundary
This repository is sanitized and excludes confidential implementation source.
`.repeat(5);
const readme = `# Event Orchestration SaaS\n\nPUBLIC SHOWCASE · SANITIZED · PORTFOLIO-SAFE\n\nCompleted engineering engagement.\n${caseStudy}`;

const eligibility = evaluateRepositoryEligibility({
  owner: "osystic",
  expectedOwner: "osystic",
  visibility: "public",
  archived: false,
  repoName: "Event-Orchestration-SaaS-Case-Study",
  readme,
  caseStudy,
  assetPaths: ["assets/architecture.svg"],
  manifest,
});
assert.equal(eligibility.eligible, true, eligibility.reasons.join(" | "));

const quality = evaluatePublicShowcaseQuality({ readme, caseStudy, assetPaths: ["assets/architecture.svg"] });
assert.equal(quality.passed, true, quality.issues.join(" | "));
assert.ok(quality.score >= 78);

const safety = scanPublicShowcaseSafety({
  manifestText: v2,
  readme,
  caseStudy,
  docs: [],
  filePaths: ["README.md", "case-study.md", "assets/architecture.svg"],
});
assert.equal(safety.passed, true, safety.issues.join(" | "));

const envExampleSafe = scanPublicShowcaseSafety({
  manifestText: v2,
  readme,
  caseStudy,
  docs: [],
  filePaths: [".env.example", "README.md", "case-study.md", "assets/architecture.svg"],
});
assert.equal(envExampleSafe.passed, true, envExampleSafe.issues.join(" | "));

const unsafe = scanPublicShowcaseSafety({
  manifestText: v2,
  readme: `${readme}\nghp_abcdefghijklmnopqrstuvwxyz123456`,
  caseStudy,
  docs: [],
  filePaths: [".env.production"],
});
assert.equal(unsafe.passed, false);
assert.ok(unsafe.issues.length >= 2);

const legacyYaml = `
schema_version: 1
repository_class: public-showcase
visibility: public
portfolio:
  eligible: true
  status: approved-public-showcase
source:
  type: sanitized-client-delivery
  source_code_included: false
`;
const legacy = normalizeShowcaseManifest(parseOsysticYaml(legacyYaml), "Legacy-Project-Case-Study");
const legacyEligibility = evaluateRepositoryEligibility({
  owner: "osystic",
  expectedOwner: "osystic",
  visibility: "public",
  archived: false,
  repoName: "Legacy-Project-Case-Study",
  readme,
  caseStudy,
  assetPaths: ["assets/architecture.svg"],
  manifest: legacy,
});
assert.equal(legacyEligibility.eligible, true);
assert.equal(legacyEligibility.legacy, true);
assert.ok(legacyEligibility.warnings.length > 0);

const legacyApprovedShowcase = normalizeShowcaseManifest(parseOsysticYaml(legacyYaml.replace("approved-public-showcase", "approved-showcase")), "Legacy-Approved-Case-Study");
const legacyApprovedEligibility = evaluateRepositoryEligibility({
  owner: "osystic", expectedOwner: "osystic", visibility: "public", archived: false,
  repoName: "Legacy-Approved-Case-Study", readme, caseStudy, assetPaths: ["assets/architecture.svg"],
  manifest: legacyApprovedShowcase,
});
assert.equal(legacyApprovedEligibility.eligible, true);

const privateRepo = evaluateRepositoryEligibility({
  owner: "osystic",
  expectedOwner: "osystic",
  visibility: "private",
  archived: false,
  repoName: "Event-Orchestration-SaaS",
  readme,
  caseStudy,
  assetPaths: ["assets/architecture.svg"],
  manifest,
});
assert.equal(privateRepo.eligible, false);
assert.ok(privateRepo.reasons.some((reason) => reason.includes("public")));


const legacyPublishedYaml = `
schema_version: 1
repository_class: public-case-study
visibility: public
portfolio:
  eligible: true
  status: published
delivery:
  status: complete
source:
  source_code_included: false
`;
const legacyPublished = normalizeShowcaseManifest(parseOsysticYaml(legacyPublishedYaml), "ES-Futures-NinjaTrader-Strategy-Case-Study");
const legacyPublishedEligibility = evaluateRepositoryEligibility({
  owner: "osystic", expectedOwner: "osystic", visibility: "public", archived: false,
  repoName: "ES-Futures-NinjaTrader-Strategy-Case-Study", readme, caseStudy,
  assetPaths: ["assets/architecture.svg"], manifest: legacyPublished,
});
assert.equal(legacyPublished.projectStatus, "complete");
assert.equal(legacyPublishedEligibility.eligible, true, legacyPublishedEligibility.reasons.join(" | "));

const notReadyV2 = normalizeShowcaseManifest(parseOsysticYaml(v2.replace("ready-for-review", "not-ready")), "Event-Orchestration-SaaS-Case-Study");
const notReadyEligibility = evaluateRepositoryEligibility({
  owner: "osystic", expectedOwner: "osystic", visibility: "public", archived: false,
  repoName: "Event-Orchestration-SaaS-Case-Study", readme, caseStudy,
  assetPaths: ["assets/architecture.svg"], manifest: notReadyV2,
});
assert.equal(notReadyEligibility.eligible, false);
assert.ok(notReadyEligibility.reasons.some((reason) => reason.includes("website.status")));

console.log("case-study contracts: PASS");

import { buildFallbackStructuredSummary, summaryToMarkdown, parseSummaryMarkdown, validateStructuredSummary } from "../lib/case-study/summary";
const fallback = buildFallbackStructuredSummary({
  repoName: "Event-Orchestration-SaaS-Case-Study",
  readme,
  caseStudy,
  technologies: ["React", "TypeScript", "PostgreSQL"],
  assetPaths: ["assets/architecture.svg"],
});
assert.equal(fallback.title, "Event Orchestration SaaS");
assert.equal(fallback.heroVisualPath, "assets/architecture.svg");
assert.ok(fallback.challenge.length > 50);
const markdown = summaryToMarkdown(fallback);
const roundTrip = parseSummaryMarkdown(markdown, fallback);
assert.equal(roundTrip.challenge, fallback.challenge);
assert.equal(validateStructuredSummary(roundTrip).valid, true, validateStructuredSummary(roundTrip).issues.join(" | "));

const realHeadingCaseStudy = `
# Example Project

## Executive summary
OSYSTIC engineered a completed system with a controlled public evidence boundary and enough detail for technical review without exposing confidential implementation material.

## Problem space
The engagement required multiple workflows, strict access boundaries, and a maintainable delivery model across a broad operational surface.

## Solution architecture
The solution separated frontend workflows, backend responsibilities, authorization, and scheduled automation into explicit engineering boundaries.

## Key engineering decisions
### 1. Keep privileged actions server-side
### 2. Separate scheduled orchestration from interactive workflows
### 3. Preserve explicit integration boundaries

## Technology
React · TypeScript · PostgreSQL · GitHub Actions

## Outcome
- Completed delivery passed the retained validation baseline.

## Public vs. private repository boundary
The public repository is sanitized and excludes confidential implementation source and client identity.
`;
const realHeadingFallback = buildFallbackStructuredSummary({
  repoName: "Example-Project-Case-Study", readme: realHeadingCaseStudy, caseStudy: realHeadingCaseStudy,
  assetPaths: ["assets/architecture.svg"],
});
assert.equal(validateStructuredSummary(realHeadingFallback).valid, true, validateStructuredSummary(realHeadingFallback).issues.join(" | "));
assert.ok(realHeadingFallback.engineeringHighlights.length >= 2);
assert.ok(realHeadingFallback.technologies.length >= 2);

console.log("case-study summary contracts: PASS");

import { validateGitHubUrl } from "../lib/case-study/validate";
assert.equal(validateGitHubUrl("https://github.com/osystic/repo.with-dots").valid, true);
assert.equal(validateGitHubUrl("https://github.com/osystic/repo.git").valid, true);
assert.equal(validateGitHubUrl("https://gitlab.com/osystic/repo").valid, false);
console.log("case-study URL contracts: PASS");

assert.ok(semanticTitleSimilarity("Event Orchestration SaaS", "Event Orchestration SaaS v2") >= 0.86);
assert.ok(semanticTitleSimilarity("Event Orchestration SaaS", "Raspberry Pi eBPF Security") < 0.4);
console.log("case-study duplicate similarity: PASS");
