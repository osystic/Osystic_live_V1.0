import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeNotifications } from "@/drizzle/finance-schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const whereClause = userId ? eq(financeNotifications.userId, userId) : undefined;
    const all = await db.select().from(financeNotifications).where(whereClause).orderBy(financeNotifications.createdAt);
    return NextResponse.json({ notifications: all });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json({ notifications: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.userId || !body.title || !body.message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const [notif] = await db.insert(financeNotifications).values({
      userId: body.userId, title: body.title, message: body.message,
      type: body.type, priority: body.priority || "normal",
      entityType: body.entityType, entityId: body.entityId,
    }).returning();
    return NextResponse.json({ notification: notif }, { status: 201 });
  } catch (error) {
    console.error("Notification create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
