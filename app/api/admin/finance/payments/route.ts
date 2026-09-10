import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments } from "@/drizzle/finance-schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(payments).where(sql`${payments.type} = 'customer_payment'`).orderBy(payments.createdAt);
    return NextResponse.json({ payments: all });
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json({ payments: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.entityId || !body.amount || !body.paymentDate) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const paymentNumber = `PMT-${Date.now()}`;
    const [payment] = await db.insert(payments).values({
      paymentNumber, type: "customer_payment", entityId: body.entityId,
      entityType: "invoice", amount: body.amount.toString(),
      currency: body.currency || "USD", paymentDate: body.paymentDate,
      paymentMethod: body.paymentMethod, reference: body.reference, notes: body.notes,
    }).returning();
    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
