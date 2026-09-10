import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fiscalYears, fiscalPeriods } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const years = await db.select().from(fiscalYears).orderBy(fiscalYears.startDate);
    const periods = await db.select().from(fiscalPeriods).orderBy(fiscalPeriods.startDate);
    return NextResponse.json({ years, periods });
  } catch (error) {
    console.error("Fiscal calendar fetch error:", error);
    return NextResponse.json({ years: [], periods: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.startDate || !body.endDate) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const [year] = await db.insert(fiscalYears).values({
      name: body.name, startDate: body.startDate, endDate: body.endDate,
    }).returning();
    return NextResponse.json({ fiscalYear: year }, { status: 201 });
  } catch (error) {
    console.error("Fiscal year create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
