import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exchangeRates } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(exchangeRates).orderBy(exchangeRates.createdAt);
    return NextResponse.json({ rates: all });
  } catch (error) {
    console.error("Exchange rates fetch error:", error);
    return NextResponse.json({ rates: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.fromCurrency || !body.toCurrency || !body.rate || !body.effectiveDate) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const [rate] = await db.insert(exchangeRates).values({
      fromCurrency: body.fromCurrency, toCurrency: body.toCurrency,
      rate: body.rate.toString(), effectiveDate: body.effectiveDate,
    }).returning();
    return NextResponse.json({ exchangeRate: rate }, { status: 201 });
  } catch (error) {
    console.error("Exchange rate create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
