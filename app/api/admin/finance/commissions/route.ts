import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { commissions } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(commissions).orderBy(commissions.createdAt);
    return NextResponse.json({ commissions: all });
  } catch (error) {
    console.error("Commissions fetch error:", error);
    return NextResponse.json({ commissions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.personName || !body.commissionAmount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const [comm] = await db.insert(commissions).values({
      personName: body.personName, projectId: body.projectId, clientId: body.clientId,
      type: body.type || "percentage", rate: body.rate?.toString(),
      baseAmount: body.baseAmount?.toString(), commissionAmount: body.commissionAmount.toString(),
    }).returning();
    return NextResponse.json({ commission: comm }, { status: 201 });
  } catch (error) {
    console.error("Commission create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
