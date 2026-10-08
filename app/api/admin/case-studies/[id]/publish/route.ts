import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiCaseStudies, caseStudies } from "@/drizzle/schema";
import { buildPublicDraft } from "@/lib/case-study/publish";
import { ensureAiCaseStudiesTable, setAiCaseStudyPublishedId } from "@/lib/case-study/store";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = base;
  let suffix = 2;
  for (;;) {
    const rows = await db
      .select({ id: caseStudies.id })
      .from(caseStudies)
      .where(eq(caseStudies.slug, slug))
      .limit(1);
    if (!rows.length || rows[0].id === excludeId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
    if (suffix > 50) return `${base}-${Date.now()}`;
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureAiCaseStudiesTable();
    const { id } = await params;
    const study = await db.select().from(aiCaseStudies).where(eq(aiCaseStudies.id, id)).limit(1);
    const record = study[0];
    if (!record) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

    let action: "publish" | "unpublish" = "publish";
    try {
      const body = await req.json();
      if (body?.action === "unpublish") action = "unpublish";
    } catch {
      // Empty body means publish.
    }

    if (action === "unpublish") {
      if (record.publishedId) {
        await db
          .update(caseStudies)
          .set({ status: "draft", updatedAt: new Date().toISOString() })
          .where(eq(caseStudies.id, record.publishedId));
      }
      await setAiCaseStudyPublishedId(id, null);
      return NextResponse.json({ published: false });
    }

    const draft = buildPublicDraft({
      githubUrl: record.githubUrl,
      projectTitle: record.projectTitle,
      generatedContent: record.generatedContent,
    });

    if (record.publishedId) {
      const existing = await db
        .select({ id: caseStudies.id, slug: caseStudies.slug })
        .from(caseStudies)
        .where(eq(caseStudies.id, record.publishedId))
        .limit(1);
      if (existing[0]) {
        const slug = await uniqueSlug(draft.slug, existing[0].id);
        await db
          .update(caseStudies)
          .set({
            title: draft.title,
            slug,
            excerpt: draft.excerpt,
            content: draft.content,
            client: draft.client,
            challenge: draft.challenge,
            solution: draft.solution,
            results: JSON.stringify(draft.results),
            technologies: JSON.stringify(draft.technologies),
            status: "published",
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .where(eq(caseStudies.id, existing[0].id));
        return NextResponse.json({ published: true, slug });
      }
      await setAiCaseStudyPublishedId(id, null);
    }

    const slug = await uniqueSlug(draft.slug);
    const inserted = await db
      .insert(caseStudies)
      .values({
        title: draft.title,
        slug,
        excerpt: draft.excerpt,
        content: draft.content,
        client: draft.client,
        challenge: draft.challenge,
        solution: draft.solution,
        results: JSON.stringify(draft.results),
        technologies: JSON.stringify(draft.technologies),
        status: "published",
        publishedAt: new Date().toISOString(),
      })
      .returning();

    const created = inserted[0];
    if (created) await setAiCaseStudyPublishedId(id, created.id);

    return NextResponse.json({ published: true, slug });
  } catch (error) {
    console.error("Unable to publish AI case study:", error);
    return NextResponse.json({ error: "Unable to publish case study." }, { status: 500 });
  }
}
