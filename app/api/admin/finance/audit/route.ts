import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLog } from "@/drizzle/finance-schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await db.insert(auditLog).values({
      action: body.action,
      entityType: body.entityType,
      entityId: body.entityId,
      description: body.description,
      oldValues: body.oldValues,
      newValues: body.newValues,
      severity: body.severity || "info",
      sourceModule: body.sourceModule,
      projectId: body.projectId,
      amount: body.amount?.toString(),
      amountCurrency: body.amountCurrency,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Audit log error:", error);
    return NextResponse.json({ success: true });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    const logs = await db.select().from(auditLog)
      .orderBy(auditLog.createdAt)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ logs, page, limit });
  } catch (error) {
    console.error("Audit fetch error:", error);
    return NextResponse.json({ logs: [] });
  }
}
