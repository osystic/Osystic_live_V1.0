import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAiCaseStudy, updateAiCaseStudy } from "@/lib/case-study/store";
import { parseStoredAnalysis, pushHistory } from "@/lib/case-study/metadata";
import { buildFallbackStructuredSummary, parseSummaryMarkdown } from "@/lib/case-study/summary";

const updateSchema = z.object({
  generated_content: z.string().trim().min(1).max(40000),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const study = await getAiCaseStudy(id);
    if (!study) return NextResponse.json({ error: "Case study not found." }, { status: 404 });
    return NextResponse.json({ study });
  } catch (error) {
    console.error("Unable to load AI case study:", error);
    return NextResponse.json({ error: "Unable to load case study." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await getAiCaseStudy(id);
    if (!existing) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

    const body = await req.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Content cannot be empty." }, { status: 400 });

    const analysis = parseStoredAnalysis(existing.analysis);
    const automation = analysis.automation;
    if (automation) {
      const fallback = automation.summary ?? buildFallbackStructuredSummary({
        repoName: analysis.source?.repository.name || existing.projectTitle || "Case-Study",
        readme: analysis.source?.readme || "",
        caseStudy: analysis.source?.caseStudy || "",
        assetPaths: analysis.source?.assetPaths || [],
      });
      analysis.history = pushHistory(analysis, {
        savedAt: new Date().toISOString(),
        reason: "manual-edit",
        sourceSha: automation.lastAnalyzedSha,
        generatedContent: existing.generatedContent,
        summary: automation.summary,
      });
      automation.summary = parseSummaryMarkdown(parsed.data.generated_content, fallback);
      automation.pendingSummary = null;
      automation.manualEdited = true;
      automation.manualEditedAt = new Date().toISOString();
      automation.workflowStatus = automation.quality.passed ? "needs_review" : "fact_check_required";
      automation.lastSyncedAt = new Date().toISOString();
    }

    const study = await updateAiCaseStudy(id, {
      generatedContent: parsed.data.generated_content,
      analysis,
    });
    return NextResponse.json({ study });
  } catch (error) {
    console.error("Unable to update AI case study:", error);
    return NextResponse.json({ error: "Unable to save changes." }, { status: 500 });
  }
}
