import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeClients } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(financeClients).orderBy(financeClients.createdAt);
    return NextResponse.json({ clients: all });
  } catch (error) {
    console.error("Clients fetch error:", error);
    return NextResponse.json({ clients: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const [client] = await db.insert(financeClients).values({
      name: body.name, contactPerson: body.contactPerson, email: body.email,
      phone: body.phone, address: body.address, taxRegistration: body.taxRegistration,
      currency: body.currency || "USD", paymentTerms: body.paymentTerms || "Net 30",
    }).returning();
    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("Client create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
