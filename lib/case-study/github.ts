import { createHash } from "node:crypto";
import { parseManifestText, normalizeShowcaseManifest, type JsonMap } from "./manifest";
import { validateGitHubUrl } from "./validate";

export class GitHubError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
  }
}

const BASE_URL = "https://api.github.com";
const REQUEST_TIMEOUT_MS = 30000;

export type GitHubRepositoryInfo = {
  id: number;
  node_id?: string;
  name: string;
  full_name: string;
  private: boolean;
  archived: boolean;
  html_url: string;
  description?: string | null;
  default_branch: string;
  visibility?: string;
  pushed_at?: string | null;
  updated_at?: string | null;
  topics?: string[];
};

export type PublicShowcaseBundle = {
  repository: {
    id: number;
    nodeId: string | null;
    owner: string;
    name: string;
    fullName: string;
    htmlUrl: string;
    defaultBranch: string;
    visibility: string;
    archived: boolean;
    pushedAt: string | null;
    headSha: string;
  };
  manifestPath: string;
  manifestText: string;
  manifestRaw: JsonMap;
  manifest: ReturnType<typeof normalizeShowcaseManifest>;
  readme: string;
  caseStudy: string;
  docs: Array<{ path: string; content: string }>;
  assetPaths: string[];
  filePaths: string[];
  fingerprint: string;
};

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "OSYSTIC-CaseStudyAutomation/2.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghGet<T>(pathname: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL + pathname);
  for (const [key, value] of Object.entries(params || {})) url.searchParams.set(key, value);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: buildHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new GitHubError("GitHub API request timed out. Please try again.", 504);
  }

  const text = await response.text();
  if (response.status === 403 && text.toLowerCase().includes("rate limit")) {
    throw new GitHubError(
      "GitHub API rate limit exceeded. Please try again later" +
        (process.env.GITHUB_TOKEN ? "." : " or configure a GITHUB_TOKEN."),
      429,
    );
  }
  if (response.status === 404) throw new GitHubError("Repository or file not found on GitHub.", 404);
  if (response.status === 401 || response.status === 403) throw new GitHubError("GitHub access was denied.", 403);
  if (!response.ok) throw new GitHubError(`GitHub API error (HTTP ${response.status}).`, 502);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new GitHubError("Invalid response received from GitHub API.", 502);
  }
}


async function ghGetPublic<T>(pathname: string): Promise<T> {
  const url = new URL(BASE_URL + pathname);
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "OSYSTIC-CaseStudyAutomation/2.0",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new GitHubError("GitHub public-repository check timed out. Please try again.", 504);
  }

  if (response.status === 404) {
    throw new GitHubError("Only public GitHub repositories can enter the OSYSTIC case-study pipeline.", 422);
  }
  if (!response.ok) {
    throw new GitHubError(`GitHub public-repository check failed (HTTP ${response.status}).`, 502);
  }
  const payload = await response.json() as T;
  return payload;
}

export async function assertPublicRepository(owner: string, repo: string): Promise<GitHubRepositoryInfo> {
  const info = await ghGetPublic<GitHubRepositoryInfo>(`/repos/${owner}/${repo}`);
  if (info.private || String(info.visibility || "public").toLowerCase() !== "public") {
    throw new GitHubError("Only public GitHub repositories can enter the OSYSTIC case-study pipeline.", 422);
  }
  return info;
}

export function parseAndValidateUrl(url: string): { owner: string; repo: string; normalizedUrl: string } {
  const result = validateGitHubUrl(url);
  if ("error" in result) throw new GitHubError(result.error, 400);
  return { owner: result.owner, repo: result.repo, normalizedUrl: result.normalizedUrl };
}

export async function getRepositoryInfo(owner: string, repo: string): Promise<GitHubRepositoryInfo & Record<string, unknown>> {
  return ghGet<GitHubRepositoryInfo & Record<string, unknown>>(`/repos/${owner}/${repo}`);
}

export async function listPublicRepositories(owner: string, maxPages = 3): Promise<GitHubRepositoryInfo[]> {
  const results: GitHubRepositoryInfo[] = [];
  for (let page = 1; page <= maxPages; page += 1) {
    const batch = await ghGet<GitHubRepositoryInfo[]>(`/users/${encodeURIComponent(owner)}/repos`, {
      type: "public",
      sort: "updated",
      direction: "desc",
      per_page: "100",
      page: String(page),
    });
    results.push(...batch.filter((repo) => !repo.private));
    if (batch.length < 100) break;
  }
  return results;
}

export async function getReadmeContent(owner: string, repo: string, branch?: string) {
  try {
    const data = await ghGet<{ name?: string; content?: string; size?: number; encoding?: string }>(
      `/repos/${owner}/${repo}/readme`,
      branch ? { ref: branch } : undefined,
    );
    const content = data.encoding === "base64" && data.content
      ? Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8")
      : "";
    return { found: Boolean(content), filename: data.name || "README.md", content, size: data.size ?? content.length };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) {
      return { found: false, filename: null, content: null, size: null };
    }
    throw error;
  }
}

async function getRepositoryTreeDetailed(owner: string, repo: string, branch?: string) {
  try {
    const data = await ghGet<{ tree?: Array<{ path?: string; type?: string; sha?: string; size?: number }>; truncated?: boolean }>(
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch || "HEAD")}`,
      { recursive: "1" },
    );
    const tree = (data.tree || []).filter(
      (item): item is { path: string; type: string; sha?: string; size?: number } =>
        typeof item.path === "string" && typeof item.type === "string",
    );
    return { tree, truncated: Boolean(data.truncated) };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return { tree: [], truncated: false };
    throw error;
  }
}

export async function getRepositoryTree(owner: string, repo: string, branch?: string) {
  return (await getRepositoryTreeDetailed(owner, repo, branch)).tree;
}

export async function getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    const data = await ghGet<Record<string, number>>(`/repos/${owner}/${repo}/languages`);
    const total = Object.values(data).reduce((sum, value) => sum + (typeof value === "number" ? value : 0), 0);
    if (!total) return {};
    return Object.fromEntries(
      Object.entries(data).map(([language, bytes]) => [language, Math.round((bytes / total) * 10000) / 100]),
    );
  } catch {
    return {};
  }
}

export async function getFileContent(owner: string, repo: string, path: string, branch?: string): Promise<string | null> {
  try {
    const data = await ghGet<{ encoding?: string; content?: string }>(
      `/repos/${owner}/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`,
      branch ? { ref: branch } : undefined,
    );
    if (data.encoding === "base64" && typeof data.content === "string") {
      return Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
    }
    return null;
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return null;
    throw error;
  }
}

export async function getHeadSha(owner: string, repo: string, branch: string): Promise<string> {
  const data = await ghGet<{ sha?: string }>(`/repos/${owner}/${repo}/commits/${encodeURIComponent(branch)}`);
  if (!data.sha) throw new GitHubError("Unable to resolve the repository head commit.", 502);
  return data.sha;
}

function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}\n\n... [truncated by OSYSTIC case-study automation]`;
}

function rawAssetUrl(owner: string, repo: string, branch: string, path: string) {
  return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

async function getRawPublicFile(owner: string, repo: string, branch: string, path: string): Promise<string | null> {
  const url = rawAssetUrl(owner, repo, branch, path);
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "OSYSTIC-CaseStudyAutomation/2.0" },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new GitHubError(`GitHub raw-file request timed out for ${path}.`, 504);
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new GitHubError(`Unable to read public repository file ${path} (HTTP ${response.status}).`, 502);
  return response.text();
}

export function getRawAssetUrl(bundle: PublicShowcaseBundle, path: string | null | undefined) {
  if (!path || path.includes("..") || path.startsWith("/")) return null;
  if (!bundle.assetPaths.includes(path)) return null;
  return rawAssetUrl(bundle.repository.owner, bundle.repository.name, bundle.repository.defaultBranch, path);
}

export async function fetchPublicShowcaseBundle(githubUrl: string): Promise<PublicShowcaseBundle> {
  const { owner, repo } = parseAndValidateUrl(githubUrl);
  // Public visibility is proven without credentials before any repository file is read.
  // This keeps private delivery repositories outside the publication trust boundary.
  const repoInfo = await assertPublicRepository(owner, repo);
  const defaultBranch = repoInfo.default_branch || "main";
  const visibility = "public";
  const headSha = await getHeadSha(owner, repo, defaultBranch);
  const { tree, truncated } = await getRepositoryTreeDetailed(owner, repo, defaultBranch);
  if (truncated) throw new GitHubError("Repository tree was truncated by GitHub; public showcase validation cannot continue safely.", 422);

  const filePaths = tree.filter((item) => item.type === "blob").map((item) => item.path);
  const manifestPath = filePaths.includes(".osystic/repository.yml")
    ? ".osystic/repository.yml"
    : filePaths.includes("public-showcase-manifest.json")
      ? "public-showcase-manifest.json"
      : "";
  if (!manifestPath) throw new GitHubError("Missing .osystic/repository.yml (or public-showcase-manifest.json).", 422);

  const [manifestText, readme, caseStudy] = await Promise.all([
    getRawPublicFile(owner, repo, defaultBranch, manifestPath),
    getRawPublicFile(owner, repo, defaultBranch, "README.md"),
    getRawPublicFile(owner, repo, defaultBranch, "case-study.md"),
  ]);
  if (!manifestText) throw new GitHubError("Unable to read the public showcase manifest.", 422);

  let manifestRaw: JsonMap;
  try {
    manifestRaw = parseManifestText(manifestPath, manifestText);
  } catch (error) {
    throw new GitHubError(`Public showcase manifest is invalid: ${error instanceof Error ? error.message : String(error)}`, 422);
  }

  const docsPaths = filePaths
    .filter((path) => /^docs\/.*\.md$/i.test(path))
    .filter((path) => !/(private|secret|credential)/i.test(path))
    .slice(0, 8);
  const docs = (await Promise.all(docsPaths.map(async (path) => ({ path, content: await getRawPublicFile(owner, repo, defaultBranch, path) }))))
    .filter((item): item is { path: string; content: string } => Boolean(item.content))
    .map((item) => ({ ...item, content: truncate(item.content, 12000) }));

  const assetPaths = filePaths
    .filter((path) => /^assets\/.*\.(?:svg|png|jpe?g|webp)$/i.test(path))
    .slice(0, 50);
  const normalizedReadme = truncate(readme || "", 20000);
  const fullCaseStudy = truncate(caseStudy || "", 30000);
  const fingerprintMaterial = [
    manifestText,
    normalizedReadme,
    fullCaseStudy,
    ...docs.map((doc) => `${doc.path}\n${doc.content}`),
    ...assetPaths,
  ].join("\n---OSYSTIC-FINGERPRINT---\n");
  const fingerprint = createHash("sha256").update(fingerprintMaterial).digest("hex");

  return {
    repository: {
      id: repoInfo.id,
      nodeId: repoInfo.node_id || null,
      owner,
      name: repoInfo.name,
      fullName: repoInfo.full_name,
      htmlUrl: repoInfo.html_url,
      defaultBranch,
      visibility,
      archived: Boolean(repoInfo.archived),
      pushedAt: repoInfo.pushed_at || null,
      headSha,
    },
    manifestPath,
    manifestText,
    manifestRaw,
    manifest: normalizeShowcaseManifest(manifestRaw, repoInfo.name),
    readme: normalizedReadme,
    caseStudy: fullCaseStudy,
    docs,
    assetPaths,
    filePaths,
    fingerprint,
  };
}
