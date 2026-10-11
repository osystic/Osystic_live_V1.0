import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/drizzle/schema";
import { sanitizeMultiline, sanitizeSingleLine } from "@/lib/input-security";
import { clientRateLimitId, consumeRateLimit, contactLimiter, rateLimitHeaders } from "@/lib/rate-limit";

const singleLine = (max: number, min = 0) =>
  z.preprocess(
    (value) => (typeof value === "string" ? sanitizeSingleLine(value) : value),
    z.string().min(min).max(max),
  );

const schema = z.object({
  name: singleLine(100, 2),
  email: z.preprocess(
    (value) => (typeof value === "string" ? sanitizeSingleLine(value).toLowerCase() : value),
    z.string().email().max(200),
  ),
  company: singleLine(160).optional().default(""),
  projectType: singleLine(120).optional().default(""),
  budget: singleLine(80).optional().default(""),
  timeline: singleLine(80).optional().default(""),
  message: z.preprocess(
    (value) => (typeof value === "string" ? sanitizeMultiline(value) : value),
    z.string().min(20).max(5000),
  ),
  website: singleLine(200).optional().default(""),
});

async function sendContactEmail(data: {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.ADMIN_EMAIL || "hello@osystic.com";
    const from = process.env.RESEND_FROM || "OSYSTIC <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `OSYSTIC project inquiry — ${data.company || data.name}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || "—"}\nProject type: ${data.projectType || "—"}\nBudget: ${data.budget || "—"}\nTimeline: ${data.timeline || "—"}\n\n${data.message}`,
    });
    if (error) {
      console.error("Contact form email failed:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Contact form email failed:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateId = clientRateLimitId(req);
    const rate = await consumeRateLimit(contactLimiter, rateId);
    if (rate.unavailable) {
      return NextResponse.json(
        { error: "Inquiry submissions are temporarily unavailable. Please email hello@osystic.com." },
        { status: 503 },
      );
    }
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a few minutes before trying again." },
        { status: 429, headers: rateLimitHeaders(rate) },
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || "unknown";

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body. Please reload the page and try again." }, { status: 400 });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form fields (name, valid email, and project details of at least 20 characters) and try again." },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const honeypotTriggered = Boolean(data.website.trim());

    const detailedMessage = [
      data.message,
      "",
      `Project type: ${data.projectType || "Not specified"}`,
      `Budget: ${data.budget || "Not specified"}`,
      `Timeline: ${data.timeline || "Not specified"}`,
    ].join("\n");

    let saved = false;
    try {
      await db.insert(contactSubmissions).values({
        name: data.name,
        email: data.email.toLowerCase(),
        company: data.company || null,
        service: data.projectType || null,
        message: detailedMessage,
        ip,
        userAgent: req.headers.get("user-agent") || "unknown",
        status: honeypotTriggered ? "spam" : "new",
      });
      saved = true;
    } catch (error) {
      console.error("Contact DB insert failed:", error);
    }

    let emailed = false;
    if (!honeypotTriggered) {
      emailed = await sendContactEmail({
        name: data.name,
        email: data.email,
        company: data.company,
        projectType: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        message: data.message,
      });
    }

    if (!saved && !emailed) {
      return NextResponse.json(
        { error: "Unable to submit your inquiry right now. Please email hello@osystic.com." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission failed:", error);
    return NextResponse.json(
      { error: "Unable to submit your inquiry right now. Please email hello@osystic.com." },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
