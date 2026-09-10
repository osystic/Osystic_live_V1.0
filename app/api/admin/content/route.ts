import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { blogs, caseStudies, newsroom } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { verifyAdminToken } from "@/lib/admin-auth";
import { isSafePublicImage, sanitizePublishedHtml } from "@/lib/content-security";

const kindSchema = z.enum(["blog", "case-study", "news"]);
const statusSchema = z.enum(["draft", "published", "archived"]);

const articleSchema = z.object({
  id: z.string().uuid().optional(),
  kind: kindSchema,
  title: z.string().trim().min(3).max(220),
  slug: z.string().trim().min(3).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(800).optional().default(""),
  content: z.string().min(1).max(120000),
  author: z.string().max(160).optional().default("OSYSTIC"),
  category: z.string().max(120).optional().default("Engineering"),
  featuredImage: z.string().max(1600).optional().default("").refine(isSafePublicImage, "Featured image must be a site-relative path or HTTPS URL"),
  status: statusSchema.optional().default("draft"),
  tags: z.array(z.string().max(80)).max(20).optional().default([]),
  client: z.string().max(200).optional().default("Confidential"),
  challenge: z.string().max(4000).optional().default(""),
  solution: z.string().max(8000).optional().default(""),
  results: z.array(z.string().max(500)).max(20).optional().default([]),
  technologies: z.array(z.string().max(100)).max(30).optional().default([]),
});

async function authorized() {
  const token = (await cookies()).get("admin-auth-token")?.value;
  return token ? verifyAdminToken(token) : null;
}

function tableFor(kind: z.infer<typeof kindSchema>) {
  if (kind === "blog") return blogs;
  if (kind === "case-study") return caseStudies;
  return newsroom;
}

async function slugExists(kind: z.infer<typeof kindSchema>, slug: string, excludeId?: string): Promise<boolean> {
  const table = tableFor(kind);
  const rows = await db.select({ id: table.id }).from(table).where(eq(table.slug, slug)).limit(1);
  return rows.length > 0 && (!excludeId || rows[0].id !== excludeId);
}

export async function GET(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsedKind = kindSchema.safeParse(req.nextUrl.searchParams.get("kind"));
  if (!parsedKind.success) return NextResponse.json({ error: "Invalid content type" }, { status: 400 });

  try {
    const kind = parsedKind.data;
    if (kind === "blog") {
      const items = await db.select().from(blogs).orderBy(desc(blogs.updatedAt));
      return NextResponse.json({ items });
    }
    if (kind === "case-study") {
      const items = await db.select().from(caseStudies).orderBy(desc(caseStudies.updatedAt));
      return NextResponse.json({ items });
    }
    const items = await db.select().from(newsroom).orderBy(desc(newsroom.updatedAt));
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin content read failed", error);
    return NextResponse.json({ error: "Unable to load content" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = articleSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid content" }, { status: 400 });
  const data = { ...parsed.data, content: sanitizePublishedHtml(parsed.data.content) };
  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  try {
    if (await slugExists(data.kind, data.slug)) {
      return NextResponse.json({ error: "A record with this slug already exists. Please use a unique slug." }, { status: 409 });
    }
    if (data.kind === "blog") {
      const [item] = await db.insert(blogs).values({
        title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content,
        author: data.author, category: data.category, tags: JSON.stringify(data.tags),
        featuredImage: data.featuredImage || null, status: data.status, publishedAt,
      }).returning();
      return NextResponse.json({ item }, { status: 201 });
    }
    if (data.kind === "case-study") {
      const [item] = await db.insert(caseStudies).values({
        title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content,
        client: data.client || "Confidential", challenge: data.challenge || "Not published",
        solution: data.solution || data.content, results: JSON.stringify(data.results), technologies: JSON.stringify(data.technologies),
        featuredImage: data.featuredImage || null, status: data.status, publishedAt,
      }).returning();
      return NextResponse.json({ item }, { status: 201 });
    }
    const [item] = await db.insert(newsroom).values({
      title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content,
      author: data.author, category: data.category, tags: JSON.stringify(data.tags),
      featuredImage: data.featuredImage || null, status: data.status, publishedAt,
    }).returning();
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Admin content create failed", error);
    return NextResponse.json({ error: "Unable to create content. Check slug uniqueness and database connectivity." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = articleSchema.extend({ id: z.string().uuid() }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid content" }, { status: 400 });
  const data = { ...parsed.data, content: sanitizePublishedHtml(parsed.data.content) };
  const updatedAt = new Date().toISOString();
  const publishedAt = data.status === "published" ? new Date().toISOString() : null;

  try {
    if (await slugExists(data.kind, data.slug, data.id)) {
      return NextResponse.json({ error: "A record with this slug already exists. Please use a unique slug." }, { status: 409 });
    }
    if (data.kind === "blog") {
      const [item] = await db.update(blogs).set({
        title:data.title,slug:data.slug,excerpt:data.excerpt,content:data.content,author:data.author,
        category:data.category,tags:JSON.stringify(data.tags),featuredImage:data.featuredImage||null,status:data.status,publishedAt,updatedAt,
      }).where(eq(blogs.id,data.id)).returning();
      return NextResponse.json({ item });
    }
    if (data.kind === "case-study") {
      const [item] = await db.update(caseStudies).set({
        title:data.title,slug:data.slug,excerpt:data.excerpt,content:data.content,client:data.client||"Confidential",
        challenge:data.challenge||"Not published",solution:data.solution||data.content,results:JSON.stringify(data.results),technologies:JSON.stringify(data.technologies),
        featuredImage:data.featuredImage||null,status:data.status,publishedAt,updatedAt,
      }).where(eq(caseStudies.id,data.id)).returning();
      return NextResponse.json({ item });
    }
    const [item] = await db.update(newsroom).set({
      title:data.title,slug:data.slug,excerpt:data.excerpt,content:data.content,author:data.author,
      category:data.category,tags:JSON.stringify(data.tags),featuredImage:data.featuredImage||null,status:data.status,publishedAt,updatedAt,
    }).where(eq(newsroom.id,data.id)).returning();
    return NextResponse.json({ item });
  } catch (error) {
    console.error("Admin content update failed", error);
    return NextResponse.json({ error: "Unable to update content" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const kind = kindSchema.safeParse(req.nextUrl.searchParams.get("kind"));
  const id = z.string().uuid().safeParse(req.nextUrl.searchParams.get("id"));
  if (!kind.success || !id.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    if (kind.data === "blog") await db.delete(blogs).where(eq(blogs.id, id.data));
    else if (kind.data === "case-study") await db.delete(caseStudies).where(eq(caseStudies.id, id.data));
    else await db.delete(newsroom).where(eq(newsroom.id, id.data));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin content delete failed", error);
    return NextResponse.json({ error: "Unable to delete content" }, { status: 500 });
  }
}
