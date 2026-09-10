import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creditNotes } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(creditNotes).orderBy(creditNotes.createdAt);
    return NextResponse.json({ creditNotes: all });
  } catch (error) {
    console.error("Credit notes fetch error:", error);
    return NextResponse.json({ creditNotes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.clientName || !body.amount) return NextResponse.json({ error: "Client and amount required" }, { status: 400 });
    const creditNoteNumber = `CN-${Date.now()}`;
    const [cn] = await db.insert(creditNotes).values({
      creditNoteNumber, clientName: body.clientName, clientId: body.clientId,
      invoiceId: body.invoiceId, amount: body.amount.toString(),
      currency: body.currency || "USD", reason: body.reason,
    }).returning();
    return NextResponse.json({ creditNote: cn }, { status: 201 });
  } catch (error) {
    console.error("Credit note create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
