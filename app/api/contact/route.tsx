import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "drizzle-orm";
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
  website: z.string().max(200).optional().default(""),
});

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, { count: number; reset: number }>();

function pruneBuckets(now: number) {
  for (const [key, value] of buckets) {
    if (value.reset < now) buckets.delete(key);
  }
}

function isRateLimited(ip: string) {
  const now = Date.now();
  pruneBuckets(now);
  const existing = buckets.get(ip);
  return Boolean(existing && existing.reset >= now && existing.count >= RATE_LIMIT);
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const existing = buckets.get(ip);
  if (!existing || existing.reset < now) {
    buckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
  } else {
    existing.count += 1;
  }
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

async function ensureContactTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      service TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      ip TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

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
    const ip = clientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a few minutes before trying again." },
        { status: 429 },
      );
    }

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
      await ensureContactTable();
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

    recordAttempt(ip);
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
