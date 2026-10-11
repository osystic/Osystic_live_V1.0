import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAiCaseStudy, updateAiCaseStudy } from "@/lib/case-study/store";
import { parseStoredAnalysis, pushHistory } from "@/lib/case-study/metadata";
import { buildFallbackStructuredSummary, parseSummaryMarkdown } from "@/lib/case-study/summary";

const rollbackSchema = z.object({
  savedAt: z.string().min(1),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await getAiCaseStudy(id);
    if (!existing) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

    const body = await req.json().catch(() => null);
    const parsed = rollbackSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "A valid history entry is required." }, { status: 400 });

    const analysis = parseStoredAnalysis(existing.analysis);
    const automation = analysis.automation;
    if (!automation) return NextResponse.json({ error: "Rollback is unavailable for this legacy draft." }, { status: 422 });

    const entry = (analysis.history || []).find((item) => item.savedAt === parsed.data.savedAt);
    if (!entry) return NextResponse.json({ error: "History entry not found." }, { status: 404 });

    analysis.history = pushHistory(analysis, {
      savedAt: new Date().toISOString(),
      reason: "pre-rollback",
      sourceSha: automation.lastAnalyzedSha,
      generatedContent: existing.generatedContent,
      summary: automation.summary,
    });

    const fallback = automation.summary ?? buildFallbackStructuredSummary({
      repoName: analysis.source?.repository.name || existing.projectTitle || "Case-Study",
      readme: analysis.source?.readme || "",
      caseStudy: analysis.source?.caseStudy || "",
      assetPaths: analysis.source?.assetPaths || [],
    });

    automation.summary = entry.summary ?? parseSummaryMarkdown(entry.generatedContent, fallback);
    automation.pendingSummary = null;
    automation.manualEdited = true;
    automation.manualEditedAt = new Date().toISOString();
    automation.workflowStatus = automation.quality.passed ? "needs_review" : "fact_check_required";
    automation.lastSyncedAt = new Date().toISOString();

    const study = await updateAiCaseStudy(id, {
      generatedContent: entry.generatedContent,
      analysis,
    });

    return NextResponse.json({ study });
  } catch (error) {
    console.error("Unable to restore AI case-study history:", error);
    return NextResponse.json({ error: "Unable to restore the selected history version." }, { status: 500 });
  }
}
