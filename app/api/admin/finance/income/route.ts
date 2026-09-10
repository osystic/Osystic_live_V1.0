import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { income } from "@/drizzle/schema";

export async function GET() {
  try {
    const allIncome = await db.select().from(income).orderBy(income.createdAt);
    return NextResponse.json({ income: allIncome });
  } catch (error) {
    console.error("Income fetch error:", error);
    return NextResponse.json({ income: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.amount || !body.incomeDate) {
      return NextResponse.json({ error: "Amount and date are required" }, { status: 400 });
    }
    const [record] = await db.insert(income).values({
      date: body.incomeDate,
      projectName: body.title,
      amount: body.amount,
      currency: "USD",
      rate: 1,
      notes: body.description || "",
    }).returning();
    return NextResponse.json({ income: record }, { status: 201 });
  } catch (error) {
    console.error("Income create error:", error);
    return NextResponse.json({ error: "Failed to record income" }, { status: 500 });
  }
}
