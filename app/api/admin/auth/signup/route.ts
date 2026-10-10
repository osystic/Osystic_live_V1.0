import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";
import { adminUsers } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { getAllowedAdminEmail } from "@/lib/admin-identity";
import { sanitizeSingleLine } from "@/lib/input-security";

const signupSchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === "string" ? sanitizeSingleLine(value) : value),
    z.string().min(2).max(120),
  ),
  email: z.string().email().max(254),
  password: z.string().min(12).max(128),
});

export async function POST(req: NextRequest) {
  if (process.env.ADMIN_SIGNUP_ENABLED !== "true") {
    return NextResponse.json({ error: "Admin registration is disabled." }, { status: 404 });
  }

  try {
    const parsed = signupSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const allowedEmail = getAllowedAdminEmail();
    if (!allowedEmail) {
      console.error("ADMIN_ALLOWED_EMAIL is not configured.");
      return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    if (email !== allowedEmail) {
      return NextResponse.json({ error: "This account is not authorized for admin access." }, { status: 403 });
    }

    const [existing] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const password = await bcrypt.hash(parsed.data.password, 12);
    const [newUser] = await db.insert(adminUsers).values({
      name: parsed.data.name,
      email,
      password,
      role: "developer",
      status: "pending",
    }).returning({ id: adminUsers.id });

    return NextResponse.json({ success: true, userId: newUser?.id }, { status: 201 });
  } catch (error) {
    console.error("Admin signup failed", error);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
