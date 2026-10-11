import { NextRequest, NextResponse } from "next/server";
import { AiError } from "@/lib/case-study/gemini";
import { GitHubError } from "@/lib/case-study/github";
import { syncPublicCaseStudyRepository } from "@/lib/case-study/automation";
import { getAiCaseStudy } from "@/lib/case-study/store";

export const maxDuration = 300;

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const study = await getAiCaseStudy(id);
    if (!study) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

    const result = await syncPublicCaseStudyRepository(study.githubUrl, { forceGeneration: true });
    return NextResponse.json({
      study: result.study,
      action: result.action,
      workflowStatus: result.workflowStatus,
      warnings: result.warnings,
    });
  } catch (error) {
    if (error instanceof GitHubError || error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Case study GitHub refresh failed:", error);
    return NextResponse.json({ error: "Unable to refresh this case study from GitHub." }, { status: 500 });
  }
}
