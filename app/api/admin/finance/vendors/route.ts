import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendors } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(vendors).orderBy(vendors.createdAt);
    return NextResponse.json({ vendors: all });
  } catch (error) {
    console.error("Vendors fetch error:", error);
    return NextResponse.json({ vendors: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const [vendor] = await db.insert(vendors).values({
      name: body.name, contactPerson: body.contactPerson, email: body.email,
      phone: body.phone, address: body.address, taxRegistration: body.taxRegistration,
      ntn: body.ntn, paymentTerms: body.paymentTerms || "Net 30",
    }).returning();
    return NextResponse.json({ vendor }, { status: 201 });
  } catch (error) {
    console.error("Vendor create error:", error);
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    const { id, ...updates } = body;
    const [vendor] = await db.update(vendors).set({ ...updates, updatedAt: new Date() }).where(eq(vendors.id, id)).returning();
    return NextResponse.json({ vendor });
  } catch (error) {
    console.error("Vendor update error:", error);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}
