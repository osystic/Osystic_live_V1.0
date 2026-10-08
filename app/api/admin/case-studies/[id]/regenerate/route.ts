import { NextRequest, NextResponse } from "next/server";
import { AiError, callGemini } from "@/lib/case-study/gemini";
import { buildRegeneratePrompt } from "@/lib/case-study/prompts";
import { getAiCaseStudy, updateAiCaseStudyContent } from "@/lib/case-study/store";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const study = await getAiCaseStudy(id);
    if (!study) return NextResponse.json({ error: "Case study not found." }, { status: 404 });

    let repository: unknown = { name: study.projectTitle };
    if (study.analysis) {
      try {
        const parsed = JSON.parse(study.analysis) as { repository?: unknown } | null;
        if (parsed && parsed.repository) repository = parsed.repository;
      } catch {
        // Fall back to the minimal repository context.
      }
    }

    const prompt = buildRegeneratePrompt(study.generatedContent, repository);
    const generatedContent = await callGemini(prompt);
    const updated = await updateAiCaseStudyContent(id, generatedContent);

    return NextResponse.json({ study: updated });
  } catch (error) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Case study regeneration failed:", error);
    return NextResponse.json(
      { error: "Case study regeneration failed unexpectedly. Please try again." },
      { status: 500 },
    );
  }
}
