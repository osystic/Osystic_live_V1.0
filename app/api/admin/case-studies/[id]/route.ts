import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAiCaseStudy, updateAiCaseStudyContent } from "@/lib/case-study/store";

const updateSchema = z.object({
  generated_content: z.string().trim().min(1).max(60000),
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

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Content cannot be empty." }, { status: 400 });
    }

    const study = await updateAiCaseStudyContent(id, parsed.data.generated_content);
    return NextResponse.json({ study });
  } catch (error) {
    console.error("Unable to update AI case study:", error);
    return NextResponse.json({ error: "Unable to save changes." }, { status: 500 });
  }
}
