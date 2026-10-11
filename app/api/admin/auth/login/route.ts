import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";
import { adminUsers } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { getAllowedAdminEmail } from "@/lib/admin-identity";
import { signAdminToken } from "@/lib/admin-auth";
import { adminLoginLimiter, clientRateLimitId, consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const rate = await consumeRateLimit(adminLoginLimiter, clientRateLimitId(req));
  if (rate.unavailable) {
    return NextResponse.json(
      { error: "Admin authentication is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
  if (!rate.success) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rate) },
    );
  }

  try {
    if (!process.env.ADMIN_JWT_SECRET || process.env.ADMIN_JWT_SECRET.length < 32) {
      console.error("ADMIN_JWT_SECRET is missing or too short.");
      return NextResponse.json({ error: "Admin authentication is not configured." }, { status: 503 });
    }

    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
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

    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

    if (!user || user.status !== "active") {
      const code = user?.status === "pending" ? "PENDING" : undefined;
      return NextResponse.json(
        { error: code ? "Account pending approval" : "Invalid email or password", code },
        { status: code ? 403 : 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(parsed.data.password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await db.update(adminUsers).set({ lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).where(eq(adminUsers.id, user.id));

    const token = signAdminToken({ id: user.id, email: user.email, name: user.name, role: user.role ?? undefined });
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set("admin-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
