import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { budgets, budgetLines } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(budgets).orderBy(budgets.createdAt);
    return NextResponse.json({ budgets: all });
  } catch (error) {
    console.error("Budgets fetch error:", error);
    return NextResponse.json({ budgets: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.totalAmount || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const [budget] = await db.insert(budgets).values({
      name: body.name, description: body.description, category: body.category,
      totalAmount: body.totalAmount.toString(), startDate: body.startDate, endDate: body.endDate,
      projectId: body.projectId, department: body.department,
    }).returning();
    if (body.lines?.length) {
      for (const line of body.lines) {
        await db.insert(budgetLines).values({
          budgetId: budget.id, accountId: line.accountId, description: line.description,
          plannedAmount: line.plannedAmount.toString(),
        });
      }
    }
    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    console.error("Budget create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
