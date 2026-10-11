import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiCaseStudies, caseStudies } from "@/drizzle/schema";
import { buildPublicDraft } from "@/lib/case-study/publish";
import { parseStoredAnalysis } from "@/lib/case-study/metadata";
import { validateStructuredSummary } from "@/lib/case-study/summary";
import { updateAiCaseStudy } from "@/lib/case-study/store";

function publishingBlockReason(record: typeof aiCaseStudies.$inferSelect) {
  const analysis = parseStoredAnalysis(record.analysis);
  const automation = analysis.automation;
  if (!automation) return "This draft predates the publication safety workflow. Refresh it from GitHub first.";
  if (!automation.eligibility.eligible) return automation.eligibility.reasons.join(" ") || "Repository is not eligible for publishing.";
  if (!automation.safety.passed) return automation.safety.issues.join(" ") || "Public-source safety checks failed.";
  if (!automation.quality.passed) return automation.quality.issues.join(" ") || "Case-study quality gate has not passed.";
  if (automation.pendingSummary) return "A GitHub update is waiting for review. Apply or dismiss it before publishing.";
  if (["blocked", "not_eligible", "possible_duplicate", "fact_check_required", "update_available"].includes(automation.workflowStatus)) {
    return `Case study status is ${automation.workflowStatus.replaceAll("_", " ")}. Complete review before publishing.`;
  }
  if (!automation.summary) return "Structured case-study summary is missing. Refresh from GitHub first.";
  const validation = validateStructuredSummary(automation.summary);
  if (!validation.valid) return validation.issues.join(" ");
  return null;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await db.select().from(aiCaseStudies).where(eq(aiCaseStudies.id, id)).limit(1);
    const record = rows[0];
    if (!record) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

    let action: "publish" | "unpublish" = "publish";
    const body = await req.json().catch(() => null);
    if (body?.action === "unpublish") action = "unpublish";

    const analysis = parseStoredAnalysis(record.analysis);
    const automation = analysis.automation;

    if (action === "unpublish") {
      if (record.publishedId) {
        await db
          .update(caseStudies)
          .set({ status: "draft", updatedAt: new Date().toISOString() })
          .where(eq(caseStudies.id, record.publishedId));
      }
      if (automation) {
        automation.workflowStatus = "needs_review";
        automation.lastSyncedAt = new Date().toISOString();
      }
      await updateAiCaseStudy(id, { publishedId: null, analysis });
      revalidatePath("/case-studies");
      if (record.publishedId) {
        revalidatePath(`/case-studies/${(await db.select().from(caseStudies).where(eq(caseStudies.id, record.publishedId)).limit(1))[0]?.slug || ""}`);
      }
      revalidatePath("/sitemap.xml");
      return NextResponse.json({ published: false });
    }

    const blocked = publishingBlockReason(record);
    if (blocked) return NextResponse.json({ error: blocked }, { status: 422 });

    const draft = buildPublicDraft({
      githubUrl: record.githubUrl,
      projectTitle: record.projectTitle,
      generatedContent: record.generatedContent,
      analysis: record.analysis,
    });

    let publicRecord = record.publishedId
      ? (await db.select().from(caseStudies).where(eq(caseStudies.id, record.publishedId)).limit(1))[0]
      : undefined;

    if (!publicRecord) {
      publicRecord = (await db.select().from(caseStudies).where(eq(caseStudies.slug, draft.slug)).limit(1))[0];
    }

    const now = new Date().toISOString();
    if (publicRecord) {
      await db
        .update(caseStudies)
        .set({
          title: draft.title,
          slug: publicRecord.slug,
          excerpt: draft.excerpt,
          content: draft.content,
          featuredImage: draft.featuredImage,
          client: draft.client,
          challenge: draft.challenge,
          solution: draft.solution,
          results: JSON.stringify(draft.results),
          technologies: JSON.stringify(draft.technologies),
          status: "published",
          publishedAt: publicRecord.publishedAt || now,
          updatedAt: now,
        })
        .where(eq(caseStudies.id, publicRecord.id));
    } else {
      const inserted = await db
        .insert(caseStudies)
        .values({
          title: draft.title,
          slug: draft.slug,
          excerpt: draft.excerpt,
          content: draft.content,
          featuredImage: draft.featuredImage,
          client: draft.client,
          challenge: draft.challenge,
          solution: draft.solution,
          results: JSON.stringify(draft.results),
          technologies: JSON.stringify(draft.technologies),
          status: "published",
          publishedAt: now,
        })
        .returning();
      publicRecord = inserted[0];
    }

    if (!publicRecord) return NextResponse.json({ error: "Unable to create the public case study." }, { status: 500 });

    if (automation) {
      automation.workflowStatus = "published";
      automation.lastPublishedSha = automation.lastAnalyzedSha || automation.headSha;
      automation.lastSyncedAt = now;
    }
    await updateAiCaseStudy(id, {
      publishedId: publicRecord.id,
      analysis,
    });

    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${publicRecord.slug}`);
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ published: true, slug: publicRecord.slug });
  } catch (error) {
    console.error("Unable to publish AI case study:", error);
    return NextResponse.json({ error: "Unable to publish case study." }, { status: 500 });
  }
}
