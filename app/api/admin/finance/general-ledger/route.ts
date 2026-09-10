import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalLines, journalEntries, accounts } from "@/drizzle/finance-schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const ledger = await db
      .select({
        id: journalLines.id,
        journalEntryId: journalLines.journalEntryId,
        accountId: journalLines.accountId,
        accountCode: accounts.code,
        accountName: accounts.name,
        description: journalLines.description,
        debit: journalLines.debit,
        credit: journalLines.credit,
        entryDate: journalEntries.entryDate,
        entryNumber: journalEntries.entryNumber,
        entryDescription: journalEntries.description,
        status: journalEntries.status,
      })
      .from(journalLines)
      .innerJoin(journalEntries, eq(journalLines.journalEntryId, journalEntries.id))
      .innerJoin(accounts, eq(journalLines.accountId, accounts.id))
      .orderBy(journalEntries.entryDate);
    return NextResponse.json({ ledger });
  } catch (error) {
    console.error("General ledger fetch error:", error);
    return NextResponse.json({ ledger: [] });
  }
}
