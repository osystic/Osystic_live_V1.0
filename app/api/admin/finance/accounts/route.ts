import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allAccounts = await db.select().from(accounts).orderBy(accounts.code);
    return NextResponse.json({ accounts: allAccounts });
  } catch (error) {
    console.error("Accounts fetch error:", error);
    return NextResponse.json({ accounts: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.name || !body.type) {
      return NextResponse.json({ error: "Code, name, and type are required" }, { status: 400 });
    }
    const [account] = await db.insert(accounts).values({
      code: body.code,
      name: body.name,
      type: body.type,
      parentId: body.parentId,
      description: body.description,
      currency: body.currency || "PKR",
    }).returning();
    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    console.error("Account create error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
