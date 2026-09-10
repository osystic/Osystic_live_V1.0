import { db } from "@/lib/db";
import { blogs, newsroom } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { isSafePublicImage, sanitizePublishedHtml } from "@/lib/content-security";

export type PublicArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  author: string;
  tags: string[];
  category: string | null;
  publishedAt: string | null;
  source: "blog" | "newsroom";
};

export async function getPublishedBlogs(limit?: number): Promise<PublicArticle[]> {
  try {
    const base = db.select().from(blogs).where(eq(blogs.status, "published")).orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));
    const rows = typeof limit === "number" ? await base.limit(limit) : await base;
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: sanitizePublishedHtml(row.content),
      featuredImage: row.featuredImage && isSafePublicImage(row.featuredImage) ? row.featuredImage : null,
      author: row.author,
      tags: JSON.parse(row.tags || "[]"),
      category: row.category,
      publishedAt: row.publishedAt ?? null,
      source: "blog" as const,
    }));
  } catch (error) {
    console.error("Unable to load published blog posts:", error);
    return [];
  }
}

export async function getPublishedNews(limit?: number): Promise<PublicArticle[]> {
  try {
    const base = db.select().from(newsroom).where(eq(newsroom.status, "published")).orderBy(desc(newsroom.publishedAt), desc(newsroom.createdAt));
    const rows = typeof limit === "number" ? await base.limit(limit) : await base;
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: sanitizePublishedHtml(row.content),
      featuredImage: row.featuredImage && isSafePublicImage(row.featuredImage) ? row.featuredImage : null,
      author: row.author,
      tags: JSON.parse(row.tags || "[]"),
      category: row.category,
      publishedAt: row.publishedAt ?? null,
      source: "newsroom" as const,
    }));
  } catch (error) {
    console.error("Unable to load published newsroom items:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<PublicArticle | null> {
  try {
    const rows = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
    const row = rows[0];
    if (!row || row.status !== "published") return null;
    return {
      id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt, content: sanitizePublishedHtml(row.content),
      featuredImage: row.featuredImage && isSafePublicImage(row.featuredImage) ? row.featuredImage : null, author: row.author, tags: JSON.parse(row.tags || "[]"), category: row.category,
      publishedAt: row.publishedAt ?? null, source: "blog",
    };
  } catch (error) {
    console.error("Unable to load blog post:", error);
    return null;
  }
}

export async function getNewsBySlug(slug: string): Promise<PublicArticle | null> {
  try {
    const rows = await db.select().from(newsroom).where(eq(newsroom.slug, slug)).limit(1);
    const row = rows[0];
    if (!row || row.status !== "published") return null;
    return {
      id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt, content: sanitizePublishedHtml(row.content),
      featuredImage: row.featuredImage && isSafePublicImage(row.featuredImage) ? row.featuredImage : null, author: row.author, tags: JSON.parse(row.tags || "[]"), category: row.category,
      publishedAt: row.publishedAt ?? null, source: "newsroom",
    };
  } catch (error) {
    console.error("Unable to load newsroom article:", error);
    return null;
  }
}
