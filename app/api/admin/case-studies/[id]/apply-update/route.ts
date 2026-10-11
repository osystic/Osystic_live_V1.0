import { NextRequest, NextResponse } from "next/server";
import { getAiCaseStudy, updateAiCaseStudy } from "@/lib/case-study/store";
import { parseStoredAnalysis, pushHistory } from "@/lib/case-study/metadata";
import { summaryToMarkdown, validateStructuredSummary } from "@/lib/case-study/summary";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const study = await getAiCaseStudy(id);
    if (!study) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

    const analysis = parseStoredAnalysis(study.analysis);
    const automation = analysis.automation;
    const pending = automation?.pendingSummary;
    if (!automation || !pending) {
      return NextResponse.json({ error: "No reviewed GitHub update is waiting to be applied." }, { status: 409 });
    }

    const validation = validateStructuredSummary(pending);
    if (!validation.valid) {
      return NextResponse.json({ error: `Suggested update is incomplete: ${validation.issues.join(" ")}` }, { status: 422 });
    }

    analysis.history = pushHistory(analysis, {
      savedAt: new Date().toISOString(),
      reason: "apply-github-update",
      sourceSha: automation.lastAnalyzedSha,
      generatedContent: study.generatedContent,
      summary: automation.summary,
    });
    automation.summary = pending;
    automation.pendingSummary = null;
    automation.manualEdited = false;
    automation.manualEditedAt = null;
    automation.workflowStatus = automation.quality.passed ? "needs_review" : "fact_check_required";
    automation.lastSyncedAt = new Date().toISOString();

    const updated = await updateAiCaseStudy(id, {
      projectTitle: pending.title,
      generatedContent: summaryToMarkdown(pending),
      analysis,
    });
    return NextResponse.json({ study: updated });
  } catch (error) {
    console.error("Unable to apply GitHub case-study update:", error);
    return NextResponse.json({ error: "Unable to apply the GitHub update." }, { status: 500 });
  }
}
