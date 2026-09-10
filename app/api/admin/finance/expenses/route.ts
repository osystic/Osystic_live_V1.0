import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenses } from "@/drizzle/schema";

export async function GET() {
  try {
    const allExpenses = await db.select().from(expenses).orderBy(expenses.createdAt);
    return NextResponse.json({ expenses: allExpenses });
  } catch (error) {
    console.error("Expenses fetch error:", error);
    return NextResponse.json({ expenses: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.amount || !body.expenseDate) {
      return NextResponse.json({ error: "Title, amount, and date are required" }, { status: 400 });
    }
    const [expense] = await db.insert(expenses).values({
      date: body.expenseDate,
      category: body.category || "General",
      description: body.title,
      amount: body.amount.toString(),
      currency: "USD",
    }).returning();
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("Expense create error:", error);
    return NextResponse.json({ error: "Failed to record expense" }, { status: 500 });
  }
}
