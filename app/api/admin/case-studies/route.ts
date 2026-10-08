import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeRepository } from "@/lib/case-study/analysis";
import { GitHubError } from "@/lib/case-study/github";
import { AiError, callGemini } from "@/lib/case-study/gemini";
import { buildGeneratePrompt } from "@/lib/case-study/prompts";
import { listAiCaseStudies, upsertAiCaseStudy } from "@/lib/case-study/store";
import { validateGitHubUrl } from "@/lib/case-study/validate";

const generateSchema = z.object({
  github_url: z.string().trim().min(1).max(300),
  project_description: z.string().trim().max(2000).optional().default(""),
});

function errorResponse(error: unknown) {
  if (error instanceof GitHubError || error instanceof AiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("Case study generation failed:", error);
  return NextResponse.json(
    { error: "Case study generation failed unexpectedly. Please try again." },
    { status: 500 },
  );
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
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a GitHub repository URL." }, { status: 400 });
    }

    const urlCheck = validateGitHubUrl(parsed.data.github_url);
    if (!urlCheck.valid) {
      return NextResponse.json({ error: urlCheck.error }, { status: 400 });
    }

    const description = parsed.data.project_description || undefined;
    const analysis = await analyzeRepository(parsed.data.github_url, description);
    const prompt = buildGeneratePrompt(analysis, description);
    const generatedContent = await callGemini(prompt);

    const projectTitle =
      (typeof analysis.repository.name === "string" ? analysis.repository.name : null) ||
      `${urlCheck.owner}/${urlCheck.repo}`;

    const study = await upsertAiCaseStudy({
      githubUrl: parsed.data.github_url,
      projectTitle,
      generatedContent,
      analysis,
    });

    return NextResponse.json({ study });
  } catch (error) {
    return errorResponse(error);
  }
}
