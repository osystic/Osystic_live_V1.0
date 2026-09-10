import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/drizzle/schema";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  projectType: z.string().trim().max(120).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  timeline: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(20).max(5000),
  website: z.string().max(0).optional().default(""),
});

const buckets = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const existing = buckets.get(ip);
  if (!existing || existing.reset < now) {
    buckets.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return false;
  }
  existing.count += 1;
  return existing.count > 5;
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    if (rateLimited(ip)) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
    const data = parsed.data;

    const detailedMessage = [
      data.message,
      "",
      `Project type: ${data.projectType || "Not specified"}`,
      `Budget: ${data.budget || "Not specified"}`,
      `Timeline: ${data.timeline || "Not specified"}`,
    ].join("\n");

    await db.insert(contactSubmissions).values({
      name: data.name,
      email: data.email.toLowerCase(),
      company: data.company || null,
      service: data.projectType || null,
      message: detailedMessage,
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "new",
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const to = process.env.ADMIN_EMAIL || "hello@osystic.com";
      const from = process.env.RESEND_FROM || "OSYSTIC <onboarding@resend.dev>";
      await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `OSYSTIC project inquiry — ${data.company || data.name}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "—"}\nProject type: ${data.projectType || "—"}\nBudget: ${data.budget || "—"}\nTimeline: ${data.timeline || "—"}\n\n${data.message}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return NextResponse.json({ error: "Unable to submit your inquiry right now. Please email hello@osystic.com." }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
