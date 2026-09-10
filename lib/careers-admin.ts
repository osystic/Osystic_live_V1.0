import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminUsers } from "@/drizzle/schema";
import { db } from "./db";
import { verifyAdminToken } from "./admin-auth";

// Recruitment data does not inherit the content editor's broad permissions.
export async function canReadApplications() {
  const token = (await cookies()).get("admin-auth-token")?.value;
  const claims = token ? verifyAdminToken(token) : null;
  if (!claims || !z.string().uuid().safeParse(claims.id).success) return false;
  const [user] = await db.select({ role: adminUsers.role, status: adminUsers.status })
    .from(adminUsers).where(eq(adminUsers.id, claims.id)).limit(1);
  return user?.status === "active" && user.role === "super_admin";
}
