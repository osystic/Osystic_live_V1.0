export type UrlValidation =
  | { valid: true; owner: string; repo: string; normalizedUrl: string }
  | { valid: false; error: string };

const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

export function validateGitHubUrl(raw: string): UrlValidation {
  const input = (raw || "").trim();
  if (!input) return { valid: false, error: "URL cannot be empty" };

  let candidate = input;
  if (/^github\.com\//i.test(candidate)) candidate = `https://${candidate}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return {
      valid: false,
      error: "Invalid GitHub URL. Expected format: https://github.com/owner/repository",
    };
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { valid: false, error: "GitHub URL must use HTTP or HTTPS." };
  }
  if (url.hostname.toLowerCase() !== "github.com" && url.hostname.toLowerCase() !== "www.github.com") {
    return { valid: false, error: "Only github.com repository URLs are supported." };
  }
  if (url.search || url.hash) {
    return { valid: false, error: "Provide the repository URL only, without query parameters or fragments." };
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length !== 2) {
    return { valid: false, error: "Expected a repository URL in the form https://github.com/owner/repository" };
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!OWNER_PATTERN.test(owner) || !REPO_PATTERN.test(repo) || repo === "." || repo === "..") {
    return { valid: false, error: "GitHub owner or repository name is invalid." };
  }

  return { valid: true, owner, repo, normalizedUrl: `https://github.com/${owner}/${repo}` };
}
