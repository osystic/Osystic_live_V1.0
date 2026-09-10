import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(subscriptions).orderBy(subscriptions.createdAt);
    return NextResponse.json({ subscriptions: all });
  } catch (error) {
    console.error("Subscriptions fetch error:", error);
    return NextResponse.json({ subscriptions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.amount || !body.startDate) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const [sub] = await db.insert(subscriptions).values({
      name: body.name, vendorId: body.vendorId, amount: body.amount.toString(),
      currency: body.currency || "USD", billingCycle: body.billingCycle || "monthly",
      nextRenewalDate: body.nextRenewalDate, startDate: body.startDate, endDate: body.endDate,
    }).returning();
    return NextResponse.json({ subscription: sub }, { status: 201 });
  } catch (error) {
    console.error("Subscription create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
