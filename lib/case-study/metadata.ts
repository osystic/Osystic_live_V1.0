import type { EligibilityResult } from "./eligibility";
import type { QualityResult, SafetyResult } from "./quality";
import type { StructuredCaseStudySummary } from "./summary";
import type { PublicShowcaseBundle } from "./github";

export const CASE_STUDY_GENERATOR_VERSION = 3;

export type CaseStudyWorkflowStatus =
  | "detected"
  | "not_eligible"
  | "blocked"
  | "fact_check_required"
  | "possible_duplicate"
  | "needs_review"
  | "update_available"
  | "approved"
  | "published"
  | "publish_failed";

export type CaseStudyHistoryEntry = {
  savedAt: string;
  reason: string;
  sourceSha: string | null;
  generatedContent: string;
  summary: StructuredCaseStudySummary | null;
};

export type StoredCaseStudySource = Omit<PublicShowcaseBundle, "filePaths">;

export type CaseStudyAutomationMetadata = {
  schemaVersion: 2;
  generatorVersion?: number;
  projectKey: string;
  canonicalSlug: string;
  repositoryId: number;
  repositoryFullName: string;
  repositoryUrl: string;
  repositoryVisibility: string;
  repositoryPushedAt: string | null;
  headSha: string;
  fingerprint: string;
  lastAnalyzedSha: string | null;
  lastPublishedSha: string | null;
  workflowStatus: CaseStudyWorkflowStatus;
  detectedAt: string;
  lastSyncedAt: string;
  legacyManifest: boolean;
  eligibility: EligibilityResult;
  quality: QualityResult;
  safety: SafetyResult;
  summary: StructuredCaseStudySummary | null;
  pendingSummary: StructuredCaseStudySummary | null;
  heroVisualUrl: string | null;
  manualEdited: boolean;
  manualEditedAt: string | null;
  generationMode: "ai" | "fallback" | "none";
  generationWarning: string | null;
  duplicateCandidate?: {
    repositoryId: number;
    repositoryUrl: string;
    repositoryFullName: string;
    detectedAt: string;
    existingStudyId?: string;
    existingProjectKey?: string;
    similarity?: number;
  } | null;
};

export type StoredCaseStudyAnalysis = {
  source?: StoredCaseStudySource;
  automation?: CaseStudyAutomationMetadata;
  history?: CaseStudyHistoryEntry[];
  [key: string]: unknown;
};

export function parseStoredAnalysis(value: string | null | undefined): StoredCaseStudyAnalysis {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as StoredCaseStudyAnalysis;
  } catch {
    return {};
  }
}

export function serializeStoredAnalysis(value: StoredCaseStudyAnalysis) {
  return JSON.stringify(value);
}

export function sourceForStorage(bundle: PublicShowcaseBundle): StoredCaseStudySource {
  const { filePaths, ...source } = bundle;
  void filePaths;
  return source;
}

export function pushHistory(
  analysis: StoredCaseStudyAnalysis,
  input: CaseStudyHistoryEntry,
  limit = 10,
): CaseStudyHistoryEntry[] {
  const history = Array.isArray(analysis.history) ? analysis.history : [];
  return [input, ...history].slice(0, limit);
}

export function publicWorkflowStatus(analysis: StoredCaseStudyAnalysis, published: boolean): CaseStudyWorkflowStatus {
  if (analysis.automation?.workflowStatus) return analysis.automation.workflowStatus;
  return published ? "published" : "needs_review";
}
