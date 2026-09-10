import type { MetadataRoute } from "next";
import { ALL_SLUGS } from "./_data/all-services-data";
import { INDUSTRIES } from "./_data/industries-data";
import { ENGINEERING_SLUGS } from "./services/engineering/_data/engineering-data";
import { DATA_CLOUD_SLUGS } from "./services/data-cloud/_data/data-cloud-data";
import { getPublishedBlogs, getPublishedNews } from "@/lib/public-content";
import { fetchCaseStudies } from "./case-studies/actions";

const BASE = "https://osystic.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, news, cases] = await Promise.all([
    getPublishedBlogs(),
    getPublishedNews(),
    fetchCaseStudies(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/case-studies`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/capabilities`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/capabilities/ai-systems`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/capabilities/product-engineering`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/capabilities/data-cloud`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/insights`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/leadership`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/trust`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/careers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/support`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const services: MetadataRoute.Sitemap = [
    ...ALL_SLUGS.map((slug) => ({ url: `${BASE}/services/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...ENGINEERING_SLUGS.filter((slug) => slug !== "blockchain").map((slug) => ({ url: `${BASE}/services/engineering/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...DATA_CLOUD_SLUGS.map((slug) => ({ url: `${BASE}/services/data-cloud/${slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];

  const industries: MetadataRoute.Sitemap = INDUSTRIES.map((industry) => ({
    url: `${BASE}/industries/${industry.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const dynamic: MetadataRoute.Sitemap = [
    ...blogs.map((item) => ({
      url: `${BASE}/blogs/${item.slug}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...news.map((item) => ({
      url: `${BASE}/newsroom/${item.slug}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...cases.map((item) => ({
      url: `${BASE}/case-studies/${item.slug}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const all = [...staticPages, ...services, ...industries, ...dynamic];
  const seen = new Set<string>();
  return all.filter((item) => !seen.has(item.url) && seen.add(item.url));
}
