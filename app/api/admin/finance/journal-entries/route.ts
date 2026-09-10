import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalEntries, journalLines } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const entries = await db.select().from(journalEntries).orderBy(journalEntries.createdAt);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Journal entries fetch error:", error);
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.description || !body.entryDate || !body.lines?.length) {
      return NextResponse.json({ error: "Description, date, and lines are required" }, { status: 400 });
    }

    const totalDebit = body.lines.reduce((s: number, l: { debit?: number }) => s + (l.debit || 0), 0);
    const totalCredit = body.lines.reduce((s: number, l: { credit?: number }) => s + (l.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json({ error: "Debits must equal credits" }, { status: 400 });
    }

    const entryNumber = `JE-${Date.now()}`;

    const [entry] = await db.insert(journalEntries).values({
      entryNumber,
      description: body.description,
      entryDate: body.entryDate,
      totalDebit: totalDebit.toString(),
      totalCredit: totalCredit.toString(),
      currency: body.currency || "PKR",
    }).returning();

    for (const line of body.lines) {
      await db.insert(journalLines).values({
        journalEntryId: entry.id,
        accountId: line.accountId,
        description: line.description,
        debit: (line.debit || 0).toString(),
        credit: (line.credit || 0).toString(),
      });
    }

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Journal entry create error:", error);
    return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 });
  }
}
