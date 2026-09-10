"use server";

import { db } from "@/lib/db";
import { caseStudies } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { isSafePublicImage, sanitizePublishedHtml } from "@/lib/content-security";

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
  viewCount: number | null;
  publishedAt: string | null;
};

function normalize(row: typeof caseStudies.$inferSelect): PublicCaseStudy {
  return {
    id: row.id,
    title: row.title ?? "",
    slug: row.slug ?? "",
    excerpt: row.excerpt,
    content: sanitizePublishedHtml(row.content ?? ""),
    client: row.client ?? "Confidential",
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    results: JSON.parse(row.results || "[]"),
    technologies: JSON.parse(row.technologies || "[]"),
    featuredImage: row.featuredImage && isSafePublicImage(row.featuredImage) ? row.featuredImage : null,
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
    return rows.map(normalize);
  } catch (error) {
    console.error("Unable to load published case studies:", error);
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
    return normalize(row);
  } catch (error) {
    console.error("Unable to load case study:", error);
    return null;
  }
}
