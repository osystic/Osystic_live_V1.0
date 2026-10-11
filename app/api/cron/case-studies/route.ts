import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { scanPublicCaseStudyRepositories } from "@/lib/case-study/automation";

export const runtime = "nodejs";
export const maxDuration = 300;

function authorized(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const actual = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || !actual) return false;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await scanPublicCaseStudyRepositories({ maxProcess: 10, generateNew: true });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Scheduled GitHub case-study scan failed:", error);
    return NextResponse.json({ error: "Scheduled case-study scan failed." }, { status: 500 });
  }
}
