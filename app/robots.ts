/* ══════════════════════════════════════════════════════════
   app/robots.ts  —  Next.js MetadataRoute.Robots
   Generates /robots.txt automatically.

   Rules:
   - Allow all public content
   - Block API routes, _next internals, admin paths
   - Reference sitemap for crawler discovery
══════════════════════════════════════════════════════════ */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/dashboard/",
          "/*.json$",
        ],
      },
      /* ── Block AI training scrapers ── */
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "CCBot",
          "anthropic-ai",
          "Omgilibot",
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://osystic.com/sitemap.xml",
    host:    "https://osystic.com",
  };
}