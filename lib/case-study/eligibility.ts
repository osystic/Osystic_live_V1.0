import type { JsonMap, NormalizedShowcaseManifest } from "./manifest";
import { booleanAt } from "./manifest";

export type EligibilityResult = {
  eligible: boolean;
  legacy: boolean;
  reasons: string[];
  warnings: string[];
};

export type RepositoryEligibilityInput = {
  owner: string;
  expectedOwner: string;
  visibility: string;
  archived: boolean;
  repoName: string;
  readme: string;
  caseStudy: string;
  assetPaths: string[];
  manifest: NormalizedShowcaseManifest;
};

const READY_WEBSITE_STATES = new Set(["ready-for-review", "approved", "published"]);
const LEGACY_REPOSITORY_CLASSES = new Set(["public-showcase", "public-case-study"]);
const LEGACY_PORTFOLIO_STATUSES = new Set(["approved-public-showcase", "approved-showcase", "published"]);

function statusLooksCompleted(value: string) {
  const normalized = value.toLowerCase();
  return ["completed", "complete", "closed", "delivered", "retained"].some((term) => normalized.includes(term));
}

function contentLooksCompleted(input: RepositoryEligibilityInput) {
  const text = `${input.readme}\n${input.caseStudy}`.toLowerCase();
  return /\b(completed|complete and accepted|engagement was completed|delivery was completed|completed delivery|completed and delivered|final delivery)\b/.test(text);
}

function unsafeManifestFlags(raw: JsonMap) {
  const paths = [
    "publication.credentials_included",
    "publication.private_infrastructure_included",
    "publication.contract_or_payment_details_included",
    "publication.private_conversations_included",
    "publication.private_customer_data_included",
  ];
  return paths.filter((path) => booleanAt(raw, path, false));
}

export function evaluateRepositoryEligibility(input: RepositoryEligibilityInput): EligibilityResult {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const manifest = input.manifest;

  if (input.owner.toLowerCase() !== input.expectedOwner.toLowerCase()) {
    reasons.push(`Repository owner must be ${input.expectedOwner}.`);
  }
  if (input.visibility.toLowerCase() !== "public") reasons.push("Repository must be public.");
  if (input.archived) reasons.push("Archived repositories are not eligible for website publishing.");

  const acceptedRepositoryClasses = manifest.legacy
    ? LEGACY_REPOSITORY_CLASSES
    : new Set(["public-showcase"]);
  if (!acceptedRepositoryClasses.has(manifest.repositoryClass)) {
    reasons.push("repository_class must identify an approved public case-study showcase.");
  }

  if (manifest.visibility && manifest.visibility !== "public") reasons.push("Manifest visibility must be public.");
  if (!manifest.portfolioEligible) reasons.push("portfolio.eligible must be true.");

  const acceptedPortfolioStatuses = manifest.legacy
    ? LEGACY_PORTFOLIO_STATUSES
    : new Set(["approved-public-showcase"]);
  if (!acceptedPortfolioStatuses.has(manifest.portfolioStatus)) {
    reasons.push("portfolio.status must indicate an approved public showcase.");
  }

  if (manifest.sourceType && manifest.sourceType !== "sanitized-client-delivery") {
    warnings.push("source.type is not sanitized-client-delivery.");
  }
  if (manifest.sourceCodeIncluded) reasons.push("Public showcase manifest says confidential source code is included.");

  const unsafeFlags = unsafeManifestFlags(manifest.raw);
  if (unsafeFlags.length) {
    reasons.push(`Manifest blocks publishing because these flags are true: ${unsafeFlags.join(", ")}.`);
  }

  if (!input.readme.trim()) reasons.push("README.md is required.");
  if (!input.caseStudy.trim()) reasons.push("case-study.md is required.");
  if (!input.assetPaths.length) reasons.push("At least one public asset is required under assets/.");

  if (manifest.legacy) {
    const namingSignal = /-case-study$/i.test(input.repoName);
    const completedSignal = statusLooksCompleted(manifest.projectStatus) || contentLooksCompleted(input);
    if (!namingSignal) reasons.push("Legacy manifests are only accepted for repositories ending in -Case-Study.");
    if (!completedSignal && namingSignal) {
      warnings.push("Legacy manifest has no explicit completed status; completion is inferred from the established -Case-Study publication convention.");
    }
    warnings.push("Upgrade .osystic/repository.yml to schema_version: 2 with project.status and website publication fields.");
  } else {
    if (!statusLooksCompleted(manifest.projectStatus)) reasons.push("project.status must explicitly indicate completed delivery.");
    if (manifest.websiteEligible !== true) reasons.push("website.eligible must be true.");
    if (!READY_WEBSITE_STATES.has(manifest.websiteStatus)) {
      reasons.push("website.status must be ready-for-review, approved, or published.");
    }
  }

  return { eligible: reasons.length === 0, legacy: manifest.legacy, reasons, warnings };
}
