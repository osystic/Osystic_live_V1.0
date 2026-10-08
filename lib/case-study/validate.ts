export type UrlValidation =
  | { valid: true; owner: string; repo: string }
  | { valid: false; error: string };

export function validateGitHubUrl(raw: string): UrlValidation {
  const url = (raw || "").trim();
  if (!url) return { valid: false, error: "URL cannot be empty" };

  const patterns = [
    /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/?$/,
    /^github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/?$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      let repo = match[2];
      if (repo.endsWith(".git")) repo = repo.slice(0, -4);
      return { valid: true, owner: match[1], repo };
    }
  }

  if (url.toLowerCase().includes("github.com")) {
    return {
      valid: false,
      error: "Malformed GitHub URL. Expected format: https://github.com/owner/repo",
    };
  }

  return {
    valid: false,
    error: "Invalid GitHub URL. Please provide a valid GitHub repository URL like: https://github.com/owner/repo",
  };
}
