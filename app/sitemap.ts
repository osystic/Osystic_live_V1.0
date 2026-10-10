import type { MetadataRoute } from "next";
import { ALL_SLUGS } from "./_data/all-services-data";
import { INDUSTRIES } from "./_data/industries-data";
import { ENGINEERING_SLUGS } from "./services/engineering/_data/engineering-data";
import { DATA_CLOUD_SLUGS } from "./services/data-cloud/_data/data-cloud-data";
import { getPublishedBlogs, getPublishedNews } from "@/lib/public-content";
import { fetchCaseStudies } from "./case-studies/actions";
import { siteConfig } from "./config/site";

const absolute = (path: string) => new URL(path, siteConfig.url).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, news, cases] = await Promise.all([
    getPublishedBlogs(),
    getPublishedNews(),
    fetchCaseStudies(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absolute("/"), changeFrequency: "weekly", priority: 1 },
    { url: absolute("/case-studies"), changeFrequency: "weekly", priority: 0.9 },
    { url: absolute("/capabilities"), changeFrequency: "monthly", priority: 0.95 },
    { url: absolute("/capabilities/ai-systems"), changeFrequency: "monthly", priority: 0.9 },
    { url: absolute("/capabilities/product-engineering"), changeFrequency: "monthly", priority: 0.9 },
    { url: absolute("/capabilities/data-cloud"), changeFrequency: "monthly", priority: 0.9 },
    { url: absolute("/industries"), changeFrequency: "monthly", priority: 0.85 },
    { url: absolute("/insights"), changeFrequency: "weekly", priority: 0.8 },
    { url: absolute("/about"), changeFrequency: "monthly", priority: 0.75 },
    { url: absolute("/leadership"), changeFrequency: "monthly", priority: 0.7 },
    { url: absolute("/trust"), changeFrequency: "monthly", priority: 0.75 },
    { url: absolute("/careers"), changeFrequency: "weekly", priority: 0.65 },
    { url: absolute("/contact"), changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/support"), changeFrequency: "monthly", priority: 0.5 },
    { url: absolute("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absolute("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const services: MetadataRoute.Sitemap = [
    { url: absolute("/services/ai-deep-learning"), changeFrequency: "monthly", priority: 0.82 },
    ...ALL_SLUGS.filter((slug) => slug !== "ai-deep-learning").map((slug) => ({
      url: absolute(`/services/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...ENGINEERING_SLUGS.filter((slug) => slug !== "blockchain").map((slug) => ({
      url: absolute(`/services/engineering/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...DATA_CLOUD_SLUGS.map((slug) => ({
      url: absolute(`/services/data-cloud/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
  ];

  const industries: MetadataRoute.Sitemap = INDUSTRIES.map((industry) => ({
    url: absolute(`/industries/${industry.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const dynamic: MetadataRoute.Sitemap = [
    ...blogs.map((item) => ({
      url: absolute(`/blogs/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : item.publishedAt ? new Date(item.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...news.map((item) => ({
      url: absolute(`/newsroom/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : item.publishedAt ? new Date(item.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
    ...cases.map((item) => ({
      url: absolute(`/case-studies/${item.slug}`),
      lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
  ];

  const all = [...staticPages, ...services, ...industries, ...dynamic];
  const seen = new Set<string>();
  return all.filter((item) => !seen.has(item.url) && seen.add(item.url));
}
