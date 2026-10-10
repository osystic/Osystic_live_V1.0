import type { MetadataRoute } from "next";
import { siteConfig } from "./config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/unauthorized",
        ],
      },
      {
        userAgent: ["GPTBot", "Google-Extended", "CCBot", "anthropic-ai", "Omgilibot"],
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
