import { NextResponse } from "next/server";
import { scanPublicCaseStudyRepositories } from "@/lib/case-study/automation";

export const maxDuration = 300;

export async function POST() {
  try {
    const result = await scanPublicCaseStudyRepositories({ maxProcess: 10, generateNew: true });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Manual GitHub case-study scan failed:", error);
    return NextResponse.json({ error: "Unable to scan GitHub case-study repositories." }, { status: 500 });
  }
}
