import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalLines, accounts } from "@/drizzle/finance-schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const balance = await db
      .select({
        accountId: accounts.id,
        accountCode: accounts.code,
        accountName: accounts.name,
        accountType: accounts.type,
        totalDebit: sql<number>`coalesce(sum(${journalLines.debit}), 0)`,
        totalCredit: sql<number>`coalesce(sum(${journalLines.credit}), 0)`,
      })
      .from(accounts)
      .leftJoin(journalLines, eq(accounts.id, journalLines.accountId))
      .groupBy(accounts.id, accounts.code, accounts.name, accounts.type)
      .orderBy(accounts.code);
    return NextResponse.json({ trialBalance: balance });
  } catch (error) {
    console.error("Trial balance fetch error:", error);
    return NextResponse.json({ trialBalance: [] });
  }
}
