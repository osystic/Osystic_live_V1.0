import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financialAccounts } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(financialAccounts).orderBy(financialAccounts.createdAt);
    return NextResponse.json({ accounts: all });
  } catch (error) {
    console.error("Banking fetch error:", error);
    return NextResponse.json({ accounts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.type) return NextResponse.json({ error: "Name and type required" }, { status: 400 });
    const [account] = await db.insert(financialAccounts).values({
      name: body.name, type: body.type, currency: body.currency || "PKR",
      openingBalance: (body.openingBalance || 0).toString(),
      currentBalance: (body.currentBalance || 0).toString(),
      bankName: body.bankName, accountNumber: body.accountNumber,
      swiftCode: body.swiftCode, iban: body.iban,
    }).returning();
    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("Bank account create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
