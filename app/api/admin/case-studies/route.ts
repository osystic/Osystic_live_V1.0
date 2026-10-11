import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AiError } from "@/lib/case-study/gemini";
import { GitHubError } from "@/lib/case-study/github";
import { syncPublicCaseStudyRepository } from "@/lib/case-study/automation";
import { listAiCaseStudies } from "@/lib/case-study/store";

const importSchema = z.object({
  github_url: z.string().trim().min(1).max(300),
});

function errorResponse(error: unknown) {
  if (error instanceof GitHubError || error instanceof AiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Case study sync failed:", error);
  return NextResponse.json({ error: "Case study sync failed unexpectedly. Please try again." }, { status: 500 });
}

export async function GET() {
  try {
    const items = await listAiCaseStudies();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Unable to list AI case studies:", error);
    return NextResponse.json({ error: "Unable to load case studies." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = importSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a public OSYSTIC GitHub case-study repository URL." }, { status: 400 });
    }

    const result = await syncPublicCaseStudyRepository(parsed.data.github_url, { forceGeneration: true });
    if (!result.study) {
      return NextResponse.json({ error: "Repository sync completed without creating a review record." }, { status: 500 });
    }

    return NextResponse.json({
      study: result.study,
      action: result.action,
      workflowStatus: result.workflowStatus,
      warnings: result.warnings,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
