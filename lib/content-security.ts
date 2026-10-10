import sanitizeHtml from "sanitize-html";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function configuredImageHosts() {
  const hosts = new Set(["images.unsplash.com", "res.cloudinary.com"]);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      hosts.add(new URL(supabaseUrl).hostname.toLowerCase());
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

function isAllowedContentImage(value: string) {
  if (!value) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return url.protocol === "https:" && configuredImageHosts().has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function sanitizePublishedHtml(input: string) {
  if (!input) return "";

  return sanitizeHtml(input, {
    allowedTags: [
      "p", "h2", "h3", "h4", "h5", "strong", "em", "b", "i", "u", "s",
      "ul", "ol", "li", "blockquote", "code", "pre", "a", "br", "hr",
      "figure", "figcaption", "img", "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      code: ["class"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    nonTextTags: ["style", "script", "textarea", "option", "noscript"],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          ...(attribs.target === "_blank" ? { rel: "noopener noreferrer" } : {}),
        },
      }),
      img: (_tagName, attribs) => ({
        tagName: "img",
        attribs: {
          src: attribs.src || "",
          alt: attribs.alt || "",
          loading: "lazy",
          ...(attribs.width ? { width: attribs.width } : {}),
          ...(attribs.height ? { height: attribs.height } : {}),
        },
      }),
    },
    exclusiveFilter: (frame) =>
      frame.tag === "img" && (!frame.attribs.src || !isAllowedContentImage(frame.attribs.src)),
  });
}

export function isSafePublicImage(value: string) {
  if (!value) return true;
  return isAllowedContentImage(value);
}
