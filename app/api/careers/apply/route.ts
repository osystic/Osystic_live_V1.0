import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { jobApplications } from "@/drizzle/schema";
import { deleteCVFromStorage, uploadCVToStorage } from "@/lib/supabase";
import { sendApplicationEmails } from "@/lib/resend";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(5).max(40),
  city: z.string().trim().max(100).optional().default(""),
  country: z.string().trim().min(2).max(100),
  linkedIn: z.string().trim().max(500).optional().default("").refine((v) => !v || /^https:\/\//i.test(v), "LinkedIn URL must use HTTPS"),
  portfolio: z.string().trim().max(500).optional().default("").refine((v) => !v || /^https:\/\//i.test(v), "Portfolio URL must use HTTPS"),
  position: z.string().trim().min(2).max(160),
  yearsExp: z.string().trim().min(1).max(40),
  currentRole: z.string().trim().max(160).optional().default(""),
  currentCompany: z.string().trim().max(160).optional().default(""),
  coverLetter: z.string().trim().min(50).max(8000),
  website: z.string().max(0).optional().default(""),
});

const buckets = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 4;

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || current.reset <= now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  buckets.set(ip, current);
  return current.count > MAX_SUBMISSIONS;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Applications are temporarily unavailable. Please try again later." }, { status: 503 });
    }
    const declaredLength = Number(req.headers.get("content-length"));
    if (declaredLength > 6 * 1024 * 1024) return NextResponse.json({ error: "Application upload is too large" }, { status: 413 });
    const ip = clientIp(req);
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many applications from this connection. Please try again later." }, { status: 429 });
    }

    const fd = await req.formData();
    const getText = (key: string) => {
      const value = fd.get(key);
      return typeof value === "string" ? value : "";
    };

    const parsed = applicationSchema.safeParse({
      firstName: getText("firstName"),
      lastName: getText("lastName"),
      email: getText("email"),
      phone: getText("phone"),
      city: getText("city"),
      country: getText("country"),
      linkedIn: getText("linkedIn"),
      portfolio: getText("portfolio"),
      position: getText("position"),
      yearsExp: getText("yearsExp"),
      currentRole: getText("currentRole"),
      currentCompany: getText("currentCompany"),
      coverLetter: getText("coverLetter"),
      website: getText("website"),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Please check the application fields." }, { status: 400 });
    }

    const data = parsed.data;
    const cvFile = fd.get("cv");
    if (!(cvFile instanceof File) || cvFile.size === 0) {
      return NextResponse.json({ error: "CV required" }, { status: 400 });
    }
    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "CV max 5 MB" }, { status: 400 });
    }

    const allowed = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);
    if (!allowed.has(cvFile.type)) {
      return NextResponse.json({ error: "CV must be a PDF or Word document" }, { status: 400 });
    }

    let skills: string[] = [];
    try {
      const decoded = JSON.parse(getText("skills"));
      if (Array.isArray(decoded)) {
        skills = decoded
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 30)
          .map((item) => item.slice(0, 80));
      }
    } catch {
      skills = [];
    }

    const cvBuffer = await cvFile.arrayBuffer();
    const { path: cvPath, url: cvUrl } = await uploadCVToStorage(
      cvBuffer,
      cvFile.name,
      cvFile.type,
      `${data.firstName}-${data.lastName}`,
    );

    const [inserted] = await db
      .insert(jobApplications)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        city: data.city || null,
        country: data.country,
        linkedIn: data.linkedIn || null,
        portfolio: data.portfolio || null,
        position: data.position,
        yearsExp: data.yearsExp,
        currentRole: data.currentRole || null,
        currentCompany: data.currentCompany || null,
        skills: JSON.stringify(skills),
        coverLetter: data.coverLetter,
        cvUrl,
        cvPath,
        cvFileName: cvFile.name.slice(0, 255),
        cvTextContent: null,
        status: "new",
        ip,
      })
      .returning({ id: jobApplications.id })
      .catch(async error => {
        await deleteCVFromStorage(cvPath);
        throw error;
      });

    after(() => sendApplicationEmails({
      applicantName: data.firstName,
      applicantEmail: data.email.toLowerCase(),
      position: data.position,
      fullName: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      location: data.city ? `${data.city}, ${data.country}` : data.country,
      yearsExp: data.yearsExp,
      skills,
      coverLetter: data.coverLetter,
      cvUrl,
      applicationId: inserted.id,
    }).catch((error) => console.error("[careers/apply] email error:", error)));

    return NextResponse.json({ success: true, applicationId: inserted.id }, { status: 201 });
  } catch (error) {
    console.error("[careers/apply]", error);
    return NextResponse.json({ error: "Unable to submit the application right now. Please try again." }, { status: 500 });
  }
}
