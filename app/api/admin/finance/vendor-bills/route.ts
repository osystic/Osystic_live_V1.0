import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vendorBills } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(vendorBills).orderBy(vendorBills.createdAt);
    return NextResponse.json({ bills: all });
  } catch (error) {
    console.error("Vendor bills fetch error:", error);
    return NextResponse.json({ bills: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.vendorName || !body.billDate) return NextResponse.json({ error: "Vendor and date required" }, { status: 400 });
    const billNumber = `VB-${Date.now()}`;
    const [bill] = await db.insert(vendorBills).values({
      billNumber, vendorName: body.vendorName, vendorId: body.vendorId,
      description: body.description, billDate: body.billDate, dueDate: body.dueDate,
      currency: body.currency || "PKR", subtotal: (body.subtotal || 0).toString(),
      taxAmount: (body.taxAmount || 0).toString(), withholdingTax: (body.withholdingTax || 0).toString(),
      totalAmount: (body.totalAmount || 0).toString(), notes: body.notes,
    }).returning();
    return NextResponse.json({ bill }, { status: 201 });
  } catch (error) {
    console.error("Vendor bill create error:", error);
    return NextResponse.json({ error: "Failed to create vendor bill" }, { status: 500 });
  }
}
