import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { jobApplications } from "@/drizzle/schema";
import { deleteCVFromStorage, uploadCVToStorage } from "@/lib/supabase";
import { sendApplicationEmails } from "@/lib/resend";
import { sanitizeMultiline, sanitizeSingleLine } from "@/lib/input-security";
import { careersLimiter, clientRateLimitId, consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const singleLine = (max: number, min = 0) =>
  z.preprocess(
    (value) => (typeof value === "string" ? sanitizeSingleLine(value) : value),
    z.string().min(min).max(max),
  );

const optionalHttpsUrl = z.preprocess(
  (value) => (typeof value === "string" ? sanitizeSingleLine(value) : value),
  z.string().max(500).refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && Boolean(url.hostname);
    } catch {
      return false;
    }
  }, "URL must be a valid HTTPS URL"),
);

const applicationSchema = z.object({
  firstName: singleLine(80, 1),
  lastName: singleLine(80, 1),
  email: z.preprocess(
    (value) => (typeof value === "string" ? sanitizeSingleLine(value).toLowerCase() : value),
    z.string().email().max(254),
  ),
  phone: singleLine(40, 5),
  city: singleLine(100).optional().default(""),
  country: singleLine(100, 2),
  linkedIn: optionalHttpsUrl.optional().default(""),
  portfolio: optionalHttpsUrl.optional().default(""),
  position: singleLine(160, 2),
  yearsExp: singleLine(40, 1),
  currentRole: singleLine(160).optional().default(""),
  currentCompany: singleLine(160).optional().default(""),
  coverLetter: z.preprocess(
    (value) => (typeof value === "string" ? sanitizeMultiline(value) : value),
    z.string().min(50).max(8000),
  ),
  website: z.preprocess(
    (value) => (typeof value === "string" ? sanitizeSingleLine(value) : value),
    z.string().max(0),
  ).optional().default(""),
});

function validCvSignature(buffer: ArrayBuffer, mime: string) {
  const bytes = new Uint8Array(buffer.slice(0, 8));
  const starts = (...expected: number[]) => expected.every((value, index) => bytes[index] === value);
  if (mime === "application/pdf") return starts(0x25, 0x50, 0x44, 0x46, 0x2d);
  if (mime === "application/msword") return starts(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1);
  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return starts(0x50, 0x4b, 0x03, 0x04) || starts(0x50, 0x4b, 0x05, 0x06) || starts(0x50, 0x4b, 0x07, 0x08);
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Applications are temporarily unavailable. Please try again later." }, { status: 503 });
    }
    const declaredLength = Number(req.headers.get("content-length"));
    if (declaredLength > 6 * 1024 * 1024) return NextResponse.json({ error: "Application upload is too large" }, { status: 413 });
    const rateId = clientRateLimitId(req);
    const rate = await consumeRateLimit(careersLimiter, rateId);
    if (rate.unavailable) {
      return NextResponse.json(
        { error: "Applications are temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many applications from this connection. Please try again later." },
        { status: 429, headers: rateLimitHeaders(rate) },
      );
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || "unknown";

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
          .map((item) => sanitizeSingleLine(item))
          .filter(Boolean)
          .slice(0, 30)
          .map((item) => item.slice(0, 80));
      }
    } catch {
      skills = [];
    }

    const cvBuffer = await cvFile.arrayBuffer();
    if (!validCvSignature(cvBuffer, cvFile.type)) {
      return NextResponse.json({ error: "CV file content does not match the selected document type" }, { status: 400 });
    }

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
        cvFileName: sanitizeSingleLine(cvFile.name).slice(0, 255),
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
