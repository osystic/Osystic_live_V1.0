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

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "OSYSTIC-CaseStudyGenerator/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `token ${token}`;
  return headers;
}

async function ghGet(pathname: string, params?: Record<string, string>): Promise<Record<string, unknown>> {
  const url = new URL(BASE_URL + pathname);
  if (params) {
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: buildHeaders(),
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
  if (response.status === 404) {
    throw new GitHubError("Repository not found. It may be private, deleted, or the URL is wrong.", 404);
  }
  if (response.status === 401 || response.status === 403) {
    throw new GitHubError("Repository is private or access was denied by GitHub.", 403);
  }
  if (!response.ok) {
    throw new GitHubError(`GitHub API error (HTTP ${response.status}). Please try again.`, 502);
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new GitHubError("Invalid response received from GitHub API.", 502);
  }
}

export function parseAndValidateUrl(url: string): { owner: string; repo: string } {
  const result = validateGitHubUrl(url);
  if (!result.valid) throw new GitHubError(result.error, 400);
  return { owner: result.owner, repo: result.repo };
}

export async function getRepositoryInfo(owner: string, repo: string) {
  return ghGet(`/repos/${owner}/${repo}`);
}

export async function getReadmeContent(
  owner: string,
  repo: string,
  branch?: string,
): Promise<{ found: boolean; filename: string | null; content: string | null; size: number | null }> {
  try {
    const params: Record<string, string> = {};
    if (branch) params.ref = branch;
    const data = await ghGet(`/repos/${owner}/${repo}/readme`, params);
    const encoded = typeof data.content === "string" ? data.content : "";
    const content = Buffer.from(encoded, "base64").toString("utf-8");
    return {
      found: true,
      filename: typeof data.name === "string" ? data.name : "README",
      content,
      size: typeof data.size === "number" ? data.size : null,
    };
  } catch {
    return { found: false, filename: null, content: null, size: null };
  }
}

export async function getRepositoryTree(
  owner: string,
  repo: string,
  branch?: string,
): Promise<Array<{ path: string; type: string }>> {
  try {
    const data = await ghGet(`/repos/${owner}/${repo}/git/trees/${branch || "HEAD"}`, { recursive: "1" });
    const tree = Array.isArray(data.tree) ? data.tree : [];
    return tree.filter(
      (item): item is { path: string; type: string } =>
        typeof item === "object" && item !== null && typeof item.path === "string" && typeof item.type === "string",
    );
  } catch {
    return [];
  }
}

export async function getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    const data = await ghGet(`/repos/${owner}/${repo}/languages`);
    const total = Object.values(data).reduce<number>((sum, value) => sum + (typeof value === "number" ? value : 0), 0);
    if (!total) return {};
    const result: Record<string, number> = {};
    for (const [lang, bytes] of Object.entries(data)) {
      if (typeof bytes === "number") result[lang] = Math.round((bytes / total) * 10000) / 100;
    }
    return result;
  } catch {
    return {};
  }
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch?: string,
): Promise<string | null> {
  try {
    const params: Record<string, string> = {};
    if (branch) params.ref = branch;
    const data = await ghGet(`/repos/${owner}/${repo}/contents/${path}`, params);
    if (data.encoding === "base64" && typeof data.content === "string") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return null;
  } catch {
    return null;
  }
}
