import type { Metadata } from "next";
import { siteConfig } from "@/app/config/site";

export const DEFAULT_SEO_KEYWORDS = [
  "enterprise AI engineering",
  "AI engineering company",
  "production AI systems",
  "agentic AI engineering",
  "enterprise RAG",
  "AI agents",
  "machine learning engineering",
  "custom software engineering",
  "product engineering",
  "data engineering",
  "cloud engineering",
  "MLOps",
  "LLMOps",
  "platform engineering",
  "AI software development",
] as const;

export type SeoMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  noIndex?: boolean;
};

function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.startsWith("/") ? value : `/${value}`, siteConfig.url).toString();
}

export function createSeoMetadata({
  title,
  description,
  path,
  keywords = [],
  image = siteConfig.ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: SeoMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(image || siteConfig.ogImage);
  const allKeywords = Array.from(new Set([...keywords, ...DEFAULT_SEO_KEYWORDS]));

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type,
    url: canonical,
    siteName: siteConfig.name,
    title,
    description,
    locale: "en_US",
    images: [
      image && image !== siteConfig.ogImage
        ? { url: socialImage, alt: `${title} | ${siteConfig.name}` }
        : {
            url: socialImage,
            width: 2400,
            height: 1260,
            alt: `${title} | ${siteConfig.name}`,
          },
    ],
  };

  if (type === "article") {
    Object.assign(openGraph, {
      publishedTime: publishedTime || undefined,
      modifiedTime: modifiedTime || undefined,
      authors: authors?.length ? authors : [siteConfig.name],
    });
  }

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    robots: noIndex
      ? { index: false, follow: false, noarchive: true, nosnippet: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
