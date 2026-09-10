import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contractors } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(contractors).orderBy(contractors.createdAt);
    return NextResponse.json({ contractors: all });
  } catch (error) {
    console.error("Contractors fetch error:", error);
    return NextResponse.json({ contractors: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const [contractor] = await db.insert(contractors).values({
      name: body.name, email: body.email, phone: body.phone,
      dailyRate: body.dailyRate?.toString(), currency: body.currency || "USD",
      contractStart: body.contractStart, contractEnd: body.contractEnd, department: body.department,
    }).returning();
    return NextResponse.json({ contractor }, { status: 201 });
  } catch (error) {
    console.error("Contractor create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
