import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { taxConfig, taxEntries } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const config = await db.select().from(taxConfig);
    const entries = await db.select().from(taxEntries).orderBy(taxEntries.createdAt);
    return NextResponse.json({ config, entries });
  } catch (error) {
    console.error("Tax fetch error:", error);
    return NextResponse.json({ config: [], entries: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.rate) return NextResponse.json({ error: "Name and rate required" }, { status: 400 });
    const [tc] = await db.insert(taxConfig).values({
      name: body.name, rate: body.rate.toString(), type: body.type || "percentage",
    }).returning();
    return NextResponse.json({ taxConfig: tc }, { status: 201 });
  } catch (error) {
    console.error("Tax config create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
