import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bankTransfers } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(bankTransfers).orderBy(bankTransfers.createdAt);
    return NextResponse.json({ transfers: all });
  } catch (error) {
    console.error("Transfers fetch error:", error);
    return NextResponse.json({ transfers: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.fromAccountId || !body.toAccountId || !body.amount || !body.transferDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const [transfer] = await db.insert(bankTransfers).values({
      fromAccountId: body.fromAccountId, toAccountId: body.toAccountId,
      amount: body.amount.toString(), exchangeRate: (body.exchangeRate || 1).toString(),
      convertedAmount: body.convertedAmount?.toString(),
      transferDate: body.transferDate, reference: body.reference, notes: body.notes,
    }).returning();
    return NextResponse.json({ transfer }, { status: 201 });
  } catch (error) {
    console.error("Transfer create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
