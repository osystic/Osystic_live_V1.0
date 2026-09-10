/**
 * Small, dependency-free helpers for public CMS/email content.
 * This is intentionally conservative. If the CMS later needs a richer HTML
 * feature set, replace this with an allow-list sanitizer such as sanitize-html.
 */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizePublishedHtml(input: string) {
  if (!input) return "";
  return input
    // Remove HTML comments.
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove executable/embedded document elements entirely.
    .replace(/<(script|style|iframe|object|embed|form|base|meta|link)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|base|meta|link)\b[^>]*\/?\s*>/gi, "")
    // Remove event-handler attributes such as onclick/onerror.
    .replace(/\s+on[a-z]+\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s>]+)/gi, "")
    // Remove inline style attributes. Public content uses the site stylesheet.
    .replace(/\s+style\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s>]+)/gi, "")
    // Neutralize dangerous URL schemes in href/src attributes.
    .replace(/\s+(href|src)\s*=\s*([\"'])\s*(?:javascript|vbscript|data):[\s\S]*?\2/gi, ' $1="#"')
    .replace(/\s+(href|src)\s*=\s*(?:javascript|vbscript|data):[^\s>]+/gi, ' $1="#"');
}

function configuredImageHosts() {
  const hosts = new Set(["images.unsplash.com", "res.cloudinary.com"]);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      hosts.add(new URL(supabaseUrl).hostname);
    } catch {
      // Invalid configuration is ignored here and will fail where Supabase is initialized.
    }
  }

  for (const host of (process.env.NEXT_PUBLIC_IMAGE_HOSTS || "").split(",")) {
    const normalized = host.trim().toLowerCase();
    if (normalized && !normalized.includes("/") && !normalized.includes(":")) hosts.add(normalized);
  }
  return hosts;
}

export function isSafePublicImage(value: string) {
  if (!value) return true;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && configuredImageHosts().has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
