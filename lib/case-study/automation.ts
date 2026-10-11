import { AiError, callGeminiJson } from "./gemini";
import {
  fetchPublicShowcaseBundle,
  getRawAssetUrl,
  listPublicRepositories,
  parseAndValidateUrl,
  type PublicShowcaseBundle,
} from "./github";
import { evaluateRepositoryEligibility } from "./eligibility";
import { evaluatePublicShowcaseQuality, scanPublicShowcaseSafety } from "./quality";
import { buildWebsiteSummaryPrompt } from "./prompts";
import {
  buildFallbackStructuredSummary,
  normalizeStructuredSummary,
  summaryToMarkdown,
  validateStructuredSummary,
  type StructuredCaseStudySummary,
} from "./summary";
import {
  parseStoredAnalysis,
  pushHistory,
  serializeStoredAnalysis,
  sourceForStorage,
  type CaseStudyAutomationMetadata,
  type CaseStudyWorkflowStatus,
  type StoredCaseStudyAnalysis,
} from "./metadata";
import {
  findAiCaseStudyByProjectKey,
  findAiCaseStudyByRepositoryId,
  findPublishedCaseStudyBySlug,
  getAiCaseStudyByGithubUrl,
  listAiCaseStudies,
  updateAiCaseStudy,
  upsertAiCaseStudy,
} from "./store";

export type SyncAction =
  | "created"
  | "refreshed"
  | "unchanged"
  | "update_available"
  | "blocked"
  | "possible_duplicate";

export type SyncResult = {
  action: SyncAction;
  study: Awaited<ReturnType<typeof getAiCaseStudyByGithubUrl>>;
  workflowStatus: CaseStudyWorkflowStatus;
  warnings: string[];
};

function placeholderContent(title: string, messages: string[]) {
  return [
    "### Executive Summary",
    `${title} was detected by the OSYSTIC public case-study automation, but it is not ready for website publication yet.`,
    "",
    "### Challenge",
    messages.join(" ") || "Repository review is required.",
    "",
    "### What OSYSTIC Delivered",
    "Publication is blocked until the repository satisfies the public-showcase contract.",
    "",
    "### Engineering Highlights",
    "- Automated publication gate detected an issue that requires review.",
    "- No public website content has been changed.",
    "",
    "### Technology Stack",
    "- Pending verified public evidence",
    "",
    "### Outcomes",
    "- Pending review",
  ].join("\n");
}

function makeMetadata(input: {
  bundle: PublicShowcaseBundle;
  eligibility: ReturnType<typeof evaluateRepositoryEligibility>;
  quality: ReturnType<typeof evaluatePublicShowcaseQuality>;
  safety: ReturnType<typeof scanPublicShowcaseSafety>;
  status: CaseStudyWorkflowStatus;
  existing?: CaseStudyAutomationMetadata | null;
  summary?: StructuredCaseStudySummary | null;
  generationMode?: "ai" | "fallback" | "none";
  generationWarning?: string | null;
}): CaseStudyAutomationMetadata {
  const now = new Date().toISOString();
  const existing = input.existing;
  return {
    schemaVersion: 2,
    projectKey: input.bundle.manifest.projectKey,
    canonicalSlug: input.bundle.manifest.canonicalSlug,
    repositoryId: input.bundle.repository.id,
    repositoryFullName: input.bundle.repository.fullName,
    repositoryUrl: input.bundle.repository.htmlUrl,
    repositoryVisibility: input.bundle.repository.visibility,
    repositoryPushedAt: input.bundle.repository.pushedAt,
    headSha: input.bundle.repository.headSha,
    fingerprint: input.bundle.fingerprint,
    lastAnalyzedSha: existing?.lastAnalyzedSha ?? null,
    lastPublishedSha: existing?.lastPublishedSha ?? null,
    workflowStatus: input.status,
    detectedAt: existing?.detectedAt ?? now,
    lastSyncedAt: now,
    legacyManifest: input.bundle.manifest.legacy,
    eligibility: input.eligibility,
    quality: input.quality,
    safety: input.safety,
    summary: input.summary ?? existing?.summary ?? null,
    pendingSummary: existing?.pendingSummary ?? null,
    heroVisualUrl: existing?.heroVisualUrl ?? null,
    manualEdited: existing?.manualEdited ?? false,
    manualEditedAt: existing?.manualEditedAt ?? null,
    duplicateCandidate: existing?.duplicateCandidate ?? null,
    generationMode: input.generationMode ?? existing?.generationMode ?? "none",
    generationWarning: input.generationWarning ?? existing?.generationWarning ?? null,
  } as CaseStudyAutomationMetadata;
}

async function generateSummary(bundle: PublicShowcaseBundle) {
  const fallback = buildFallbackStructuredSummary({
    repoName: bundle.repository.name,
    readme: bundle.readme,
    caseStudy: bundle.caseStudy,
    assetPaths: bundle.assetPaths,
  });

  let summary = fallback;
  let mode: "ai" | "fallback" = "fallback";
  let warning: string | null = null;

  try {
    const raw = await callGeminiJson<unknown>(buildWebsiteSummaryPrompt(bundle, fallback));
    const candidate = normalizeStructuredSummary(raw);
    const validated = validateStructuredSummary(candidate);
    if (validated.valid) {
      summary = candidate;
      mode = "ai";
    } else {
      warning = `AI summary failed validation: ${validated.issues.join(" ")}`;
    }
  } catch (error) {
    warning = error instanceof AiError || error instanceof Error ? error.message : "AI generation failed; deterministic fallback was used.";
  }

  if (!summary.heroVisualPath && fallback.heroVisualPath) summary.heroVisualPath = fallback.heroVisualPath;
  return { summary, mode, warning };
}

function gateStatus(
  eligibility: ReturnType<typeof evaluateRepositoryEligibility>,
  quality: ReturnType<typeof evaluatePublicShowcaseQuality>,
  safety: ReturnType<typeof scanPublicShowcaseSafety>,
): CaseStudyWorkflowStatus {
  if (!eligibility.eligible) return "not_eligible";
  if (!safety.passed) return "blocked";
  if (!quality.passed) return "fact_check_required";
  return "needs_review";
}

function baseAnalysis(existingAnalysis: StoredCaseStudyAnalysis, bundle: PublicShowcaseBundle) {
  return {
    ...existingAnalysis,
    source: sourceForStorage(bundle),
  } satisfies StoredCaseStudyAnalysis;
}

export async function syncPublicCaseStudyRepository(
  githubUrl: string,
  options: { forceGeneration?: boolean; expectedOwner?: string } = {},
): Promise<SyncResult> {
  const expectedOwner = options.expectedOwner || process.env.CASE_STUDY_GITHUB_OWNER || "osystic";
  const parsedUrl = parseAndValidateUrl(githubUrl);
  const normalizedUrl = parsedUrl.normalizedUrl;
  // fetchPublicShowcaseBundle proves public visibility without credentials before reading files.
  // Private project repositories therefore never enter or get analyzed by this pipeline.
  const bundle = await fetchPublicShowcaseBundle(normalizedUrl);

  const eligibility = evaluateRepositoryEligibility({
    owner: bundle.repository.owner,
    expectedOwner,
    visibility: bundle.repository.visibility,
    archived: bundle.repository.archived,
    repoName: bundle.repository.name,
    readme: bundle.readme,
    caseStudy: bundle.caseStudy,
    assetPaths: bundle.assetPaths,
    manifest: bundle.manifest,
  });
  const quality = evaluatePublicShowcaseQuality({
    readme: bundle.readme,
    caseStudy: bundle.caseStudy,
    assetPaths: bundle.assetPaths,
  });
  const safety = scanPublicShowcaseSafety({
    manifestText: bundle.manifestText,
    readme: bundle.readme,
    caseStudy: bundle.caseStudy,
    docs: bundle.docs,
    filePaths: bundle.filePaths,
  });

  let existing = await getAiCaseStudyByGithubUrl(normalizedUrl);
  if (!existing) {
    const byRepositoryId = await findAiCaseStudyByRepositoryId(bundle.repository.id);
    if (byRepositoryId) {
      existing = await updateAiCaseStudy(byRepositoryId.id, { githubUrl: normalizedUrl });
    }
  }
  const existingAnalysis = parseStoredAnalysis(existing?.analysis);
  const existingAutomation = existingAnalysis.automation ?? null;
  const status = gateStatus(eligibility, quality, safety);
  const allWarnings = [...eligibility.warnings, ...safety.warnings, ...quality.issues];

  if (!eligibility.eligible || !safety.passed) {
    const metadata = makeMetadata({ bundle, eligibility, quality, safety, status, existing: existingAutomation });
    const analysis = { ...baseAnalysis(existingAnalysis, bundle), automation: metadata };
    const study = await upsertAiCaseStudy({
      githubUrl: normalizedUrl,
      projectTitle: bundle.manifest.projectName,
      generatedContent: existing?.generatedContent || placeholderContent(bundle.manifest.projectName, [...eligibility.reasons, ...safety.issues]),
      analysis,
      publishedId: existing?.publishedId ?? null,
    });
    return { action: "blocked", study, workflowStatus: status, warnings: allWarnings };
  }

  if (!existing) {
    const duplicate = await findAiCaseStudyByProjectKey(bundle.manifest.projectKey);
    if (duplicate) {
      const duplicateAnalysis = parseStoredAnalysis(duplicate.analysis);
      if (duplicateAnalysis.automation) {
        duplicateAnalysis.automation = {
          ...duplicateAnalysis.automation,
          workflowStatus: "possible_duplicate",
          duplicateCandidate: {
            repositoryId: bundle.repository.id,
            repositoryUrl: bundle.repository.htmlUrl,
            repositoryFullName: bundle.repository.fullName,
            detectedAt: new Date().toISOString(),
          },
          lastSyncedAt: new Date().toISOString(),
        };
        const updated = await updateAiCaseStudy(duplicate.id, { analysis: duplicateAnalysis });
        return {
          action: "possible_duplicate",
          study: updated,
          workflowStatus: "possible_duplicate",
          warnings: [`A case study already exists for project key ${bundle.manifest.projectKey}.`],
        };
      }
    }
  }

  if (existing && !options.forceGeneration && existingAutomation?.fingerprint === bundle.fingerprint) {
    const metadata = makeMetadata({
      bundle,
      eligibility,
      quality,
      safety,
      status: existingAutomation.workflowStatus,
      existing: existingAutomation,
    });
    const analysis = { ...baseAnalysis(existingAnalysis, bundle), automation: metadata };
    const study = await updateAiCaseStudy(existing.id, { analysis });
    return { action: "unchanged", study, workflowStatus: metadata.workflowStatus, warnings: allWarnings };
  }

  if (existing && !options.forceGeneration && existingAutomation?.fingerprint && existingAutomation.fingerprint !== bundle.fingerprint) {
    const metadata = makeMetadata({
      bundle,
      eligibility,
      quality,
      safety,
      status: "update_available",
      existing: existingAutomation,
    });
    const analysis = { ...baseAnalysis(existingAnalysis, bundle), automation: metadata };
    const study = await updateAiCaseStudy(existing.id, { analysis });
    return { action: "update_available", study, workflowStatus: "update_available", warnings: allWarnings };
  }

  const generated = await generateSummary(bundle);
  const summaryValidation = validateStructuredSummary(generated.summary);
  const workflowStatus: CaseStudyWorkflowStatus = quality.passed && summaryValidation.valid
    ? "needs_review"
    : "fact_check_required";
  const metadata = makeMetadata({
    bundle,
    eligibility,
    quality,
    safety,
    status: workflowStatus,
    existing: existingAutomation,
    summary: generated.summary,
    generationMode: generated.mode,
    generationWarning: generated.warning,
  });
  metadata.lastAnalyzedSha = bundle.repository.headSha;
  metadata.heroVisualUrl = getRawAssetUrl(bundle, generated.summary.heroVisualPath);
  metadata.duplicateCandidate = null;

  if (existing && existingAutomation?.manualEdited) {
    metadata.pendingSummary = generated.summary;
    metadata.workflowStatus = "update_available";
    metadata.summary = existingAutomation.summary;
    metadata.manualEdited = true;
    metadata.manualEditedAt = existingAutomation.manualEditedAt;

    const analysis = { ...baseAnalysis(existingAnalysis, bundle), automation: metadata };
    const study = await updateAiCaseStudy(existing.id, { analysis });
    return {
      action: "update_available",
      study,
      workflowStatus: "update_available",
      warnings: [
        ...allWarnings,
        "Manual website edits were preserved. A refreshed GitHub summary is waiting for explicit review/application.",
        ...(generated.warning ? [generated.warning] : []),
        ...summaryValidation.issues,
      ],
    };
  }

  metadata.pendingSummary = null;
  metadata.manualEdited = false;
  metadata.manualEditedAt = null;

  let analysis = baseAnalysis(existingAnalysis, bundle);
  if (existing?.generatedContent) {
    analysis.history = pushHistory(existingAnalysis, {
      savedAt: new Date().toISOString(),
      reason: existingAutomation ? "repository-refresh" : "legacy-import",
      sourceSha: existingAutomation?.lastAnalyzedSha ?? null,
      generatedContent: existing.generatedContent,
      summary: existingAutomation?.summary ?? null,
    });
  }
  analysis = { ...analysis, automation: metadata };

  const publishedMatch = existing?.publishedId
    ? null
    : await findPublishedCaseStudyBySlug(bundle.manifest.canonicalSlug);
  const publishedId = existing?.publishedId ?? publishedMatch?.id ?? null;
  const generatedContent = summaryToMarkdown(generated.summary);
  const study = await upsertAiCaseStudy({
    githubUrl: normalizedUrl,
    projectTitle: generated.summary.title || bundle.manifest.projectName,
    generatedContent,
    analysis,
    publishedId,
  });

  return {
    action: existing ? "refreshed" : "created",
    study,
    workflowStatus,
    warnings: [...allWarnings, ...(generated.warning ? [generated.warning] : []), ...summaryValidation.issues],
  };
}

export async function scanPublicCaseStudyRepositories(options: {
  owner?: string;
  maxProcess?: number;
  generateNew?: boolean;
} = {}) {
  const owner = options.owner || process.env.CASE_STUDY_GITHUB_OWNER || "osystic";
  const maxProcess = Math.max(1, Math.min(options.maxProcess ?? 4, 10));
  const repos = (await listPublicRepositories(owner))
    .filter((repo) => !repo.archived && /-case-study$/i.test(repo.name))
    .sort((a, b) => String(b.pushed_at || b.updated_at || "").localeCompare(String(a.pushed_at || a.updated_at || "")));
  const studies = await listAiCaseStudies();
  const byUrl = new Map(studies.map((study) => [study.githubUrl.toLowerCase(), study]));

  const results: Array<{ repository: string; action: SyncAction; status: CaseStudyWorkflowStatus; warnings: string[] }> = [];
  let processed = 0;

  for (const repo of repos) {
    const existing = byUrl.get(repo.html_url.toLowerCase());
    const metadata = parseStoredAnalysis(existing?.analysis).automation;
    if (existing && metadata?.repositoryPushedAt && repo.pushed_at && metadata.repositoryPushedAt === repo.pushed_at) {
      continue;
    }
    if (processed >= maxProcess) break;

    const result = await syncPublicCaseStudyRepository(repo.html_url, {
      expectedOwner: owner,
      forceGeneration: !existing && options.generateNew !== false,
    });
    results.push({
      repository: repo.full_name,
      action: result.action,
      status: result.workflowStatus,
      warnings: result.warnings,
    });
    processed += 1;
  }

  return {
    owner,
    discovered: repos.length,
    processed,
    results,
  };
}

export function analysisJsonForClient(value: string | null | undefined) {
  return parseStoredAnalysis(value);
}

export function serializeAnalysis(value: StoredCaseStudyAnalysis) {
  return serializeStoredAnalysis(value);
}
