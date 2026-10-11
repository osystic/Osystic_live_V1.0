export type JsonMap = Record<string, unknown>;

export type NormalizedShowcaseManifest = {
  raw: JsonMap;
  schemaVersion: number;
  repositoryClass: string;
  visibility: string;
  dataClassification: string;
  projectKey: string;
  projectName: string;
  projectStatus: string;
  portfolioEligible: boolean;
  portfolioStatus: string;
  websiteEligible: boolean | null;
  websiteStatus: string;
  canonicalSlug: string;
  autoSync: boolean;
  sourceType: string;
  sourceCodeIncluded: boolean;
  clientIdentityPublic: boolean;
  legacy: boolean;
};

function stripComment(value: string) {
  let quote: "'" | '"' | null = null;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if ((char === "'" || char === '"') && value[index - 1] !== "\\") {
      if (quote === char) quote = null;
      else if (!quote) quote = char;
      continue;
    }
    if (char === "#" && !quote) return value.slice(0, index).trimEnd();
  }
  return value;
}

function parseScalar(raw: string): unknown {
  const value = stripComment(raw).trim();
  if (!value) return "";

  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  const lower = value.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;
  if (lower === "null" || lower === "~") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => parseScalar(item.trim()));
  }

  return value;
}

/**
 * Parses the deliberately small YAML subset used by .osystic/repository.yml.
 * It supports nested mappings, scalar values and inline arrays. Block arrays,
 * anchors and custom tags are intentionally rejected by omission.
 */
export function parseOsysticYaml(input: string): JsonMap {
  const root: JsonMap = {};
  const stack: Array<{ indent: number; target: JsonMap }> = [{ indent: -1, target: root }];

  for (const rawLine of input.replace(/\t/g, "  ").split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
    const trimmed = stripComment(rawLine.trim());
    if (!trimmed) continue;

    const colon = trimmed.indexOf(":");
    if (colon <= 0) continue;

    const key = trimmed.slice(0, colon).trim();
    const rawValue = trimmed.slice(colon + 1).trim();
    if (!/^[A-Za-z0-9_.-]+$/.test(key)) continue;

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].target;

    if (!rawValue) {
      const child: JsonMap = {};
      parent[key] = child;
      stack.push({ indent, target: child });
    } else {
      parent[key] = parseScalar(rawValue);
    }
  }

  return root;
}

export function parseManifestText(path: string, content: string): JsonMap {
  if (path.endsWith(".json")) {
    const parsed = JSON.parse(content) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Public showcase manifest must be a JSON object.");
    }
    return parsed as JsonMap;
  }
  return parseOsysticYaml(content);
}

export function getPath(value: JsonMap, path: string): unknown {
  let current: unknown = value;
  for (const segment of path.split(".")) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;
    current = (current as JsonMap)[segment];
  }
  return current;
}

export function stringAt(value: JsonMap, path: string, fallback = ""): string {
  const result = getPath(value, path);
  if (typeof result === "string") return result.trim();
  if (typeof result === "number") return String(result);
  return fallback;
}

export function booleanAt(value: JsonMap, path: string, fallback = false): boolean {
  const result = getPath(value, path);
  return typeof result === "boolean" ? result : fallback;
}

export function slugifyProjectKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/-case-study$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96) || "case-study";
}

function projectNameFromRepo(repoName: string) {
  return repoName
    .replace(/-case-study$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();
}

export function normalizeShowcaseManifest(raw: JsonMap, repoName: string): NormalizedShowcaseManifest {
  const schemaVersionRaw = getPath(raw, "schema_version") ?? getPath(raw, "schemaVersion") ?? 1;
  const schemaVersion = typeof schemaVersionRaw === "number" ? schemaVersionRaw : Number(schemaVersionRaw) || 1;

  const projectKey = slugifyProjectKey(
    stringAt(raw, "project.key") ||
      stringAt(raw, "project") ||
      repoName,
  );

  const projectName =
    stringAt(raw, "project.name") ||
    (typeof getPath(raw, "project") === "string" ? stringAt(raw, "project") : "") ||
    projectNameFromRepo(repoName);

  const projectStatus =
    stringAt(raw, "project.status") ||
    stringAt(raw, "project_status") ||
    stringAt(raw, "delivery.status") ||
    stringAt(raw, "status");

  const websiteEligibleRaw = getPath(raw, "website.eligible");

  return {
    raw,
    schemaVersion,
    repositoryClass: stringAt(raw, "repository_class") || stringAt(raw, "repositoryClass"),
    visibility: stringAt(raw, "visibility"),
    dataClassification: stringAt(raw, "data_classification") || stringAt(raw, "dataClassification"),
    projectKey,
    projectName,
    projectStatus,
    portfolioEligible: booleanAt(raw, "portfolio.eligible", false),
    portfolioStatus: stringAt(raw, "portfolio.status"),
    websiteEligible: typeof websiteEligibleRaw === "boolean" ? websiteEligibleRaw : null,
    websiteStatus: stringAt(raw, "website.status"),
    canonicalSlug: slugifyProjectKey(stringAt(raw, "website.canonical_slug") || projectKey),
    autoSync: booleanAt(raw, "website.auto_sync", true),
    sourceType: stringAt(raw, "source.type"),
    sourceCodeIncluded: booleanAt(raw, "source.source_code_included", false),
    clientIdentityPublic: booleanAt(raw, "publication.client_identity_public", booleanAt(raw, "client_identity_public", false)),
    legacy: schemaVersion < 2 || websiteEligibleRaw === undefined,
  };
}
