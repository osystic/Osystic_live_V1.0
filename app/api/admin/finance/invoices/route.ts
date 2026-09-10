import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeInvoices } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const invoices = await db.select().from(financeInvoices).orderBy(financeInvoices.createdAt);
    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Invoices fetch error:", error);
    return NextResponse.json({ invoices: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.clientName || !body.issueDate) {
      return NextResponse.json({ error: "Client name and issue date are required" }, { status: 400 });
    }
    const invoiceNumber = `INV-${Date.now()}`;
    const [invoice] = await db.insert(financeInvoices).values({
      invoiceNumber,
      clientName: body.clientName,
      description: body.description,
      issueDate: body.issueDate,
      dueDate: body.dueDate,
      currency: body.currency || "USD",
      subtotal: (body.subtotal || 0).toString(),
      taxAmount: (body.taxAmount || 0).toString(),
      discountAmount: (body.discountAmount || 0).toString(),
      totalAmount: (body.totalAmount || 0).toString(),
      outstandingAmount: (body.totalAmount || 0).toString(),
      notes: body.notes,
    }).returning();
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error("Invoice create error:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
