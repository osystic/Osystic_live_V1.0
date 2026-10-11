"use server";

import { db } from "@/lib/db";
import { aiCaseStudies, caseStudies } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { isSafePublicImage, sanitizePublishedHtml } from "@/lib/content-security";
import { logHandledContentStoreFailure } from "@/lib/runtime-fallback";

export type PublicCaseStudy = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  featuredImage: string | null;
  githubUrl: string | null;
  viewCount: number | null;
  publishedAt: string | null;
};

function safeStringArray(value: string | null) {
  try {
    const parsed = JSON.parse(value || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function normalize(
  row: typeof caseStudies.$inferSelect,
  githubUrl: string | null,
): PublicCaseStudy {
  return {
    id: row.id,
    title: row.title ?? "",
    slug: row.slug ?? "",
    excerpt: row.excerpt,
    content: sanitizePublishedHtml(row.content ?? ""),
    client: row.client ?? "Confidential Client",
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    results: safeStringArray(row.results),
    technologies: safeStringArray(row.technologies),
    featuredImage: row.featuredImage && isSafePublicImage(row.featuredImage) ? row.featuredImage : null,
    githubUrl,
    viewCount: row.viewCount,
    publishedAt: row.publishedAt ?? null,
  };
}

export async function fetchCaseStudies(limit?: number): Promise<PublicCaseStudy[]> {
  try {
    const query = db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.status, "published"))
      .orderBy(desc(caseStudies.publishedAt), desc(caseStudies.createdAt));

    const rows = typeof limit === "number" ? await query.limit(limit) : await query;
    if (!rows.length) return [];

    const sourceRows = await db
      .select({ publishedId: aiCaseStudies.publishedId, githubUrl: aiCaseStudies.githubUrl })
      .from(aiCaseStudies);
    const sourceByPublishedId = new Map(
      sourceRows
        .filter((item): item is { publishedId: string; githubUrl: string } => Boolean(item.publishedId))
        .map((item) => [item.publishedId, item.githubUrl]),
    );

    return rows.map((row) => normalize(row, sourceByPublishedId.get(row.id) ?? null));
  } catch (error) {
    logHandledContentStoreFailure("Unable to load published case studies", error);
    return [];
  }
}

export async function fetchCaseStudy(slug: string): Promise<PublicCaseStudy | null> {
  try {
    const rows = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1);

    const row = rows[0];
    if (!row || row.status !== "published") return null;

    const source = await db
      .select({ githubUrl: aiCaseStudies.githubUrl })
      .from(aiCaseStudies)
      .where(eq(aiCaseStudies.publishedId, row.id))
      .limit(1);

    return normalize(row, source[0]?.githubUrl ?? null);
  } catch (error) {
    logHandledContentStoreFailure("Unable to load case study", error);
    return null;
  }
}
