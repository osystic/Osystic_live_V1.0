import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { jobApplications } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { canReadApplications } from "@/lib/careers-admin";
import { CV_BUCKET, getStorageClient } from "@/lib/supabase";

const headers = { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow" };
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await canReadApplications())) return NextResponse.json({ error: "Unauthorized" }, { status: 403, headers });
    const { id } = await params;
    if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: "Invalid application" }, { status: 400, headers });
    const [item] = await db.select({ path: jobApplications.cvPath }).from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
    if (!item) return NextResponse.json({ error: "Application not found" }, { status: 404, headers });
    const storage = getStorageClient().storage;
    const bucket = await storage.getBucket(CV_BUCKET);
    if (bucket.error || !bucket.data || bucket.data.public) throw new Error("Private CV storage required");
    const { data, error } = await storage.from(CV_BUCKET).createSignedUrl(item.path, 60, { download: true });
    if (error || !data) throw new Error("CV unavailable");
    return new NextResponse(null, { status: 303, headers: { ...headers, Location: data.signedUrl } });
  } catch {
    return NextResponse.json({ error: "CV download unavailable. Please return to the inbox and try again." }, { status: 503, headers });
  }
}
