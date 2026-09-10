import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalEntries, financeInvoices, vendorBills, payments, budgets } from "@/drizzle/finance-schema";
import { eq } from "drizzle-orm";

const STATUS_MAP: Record<string, Record<string, string[]>> = {
  expense: { DRAFT: ["SUBMITTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] },
  income: { DRAFT: ["SUBMITTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] },
  invoice: { DRAFT: ["SUBMITTED","VOID"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["ISSUED"], ISSUED: ["PAID","OVERDUE","VOID"] },
  vendor_bill: { DRAFT: ["SUBMITTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"] },
  journal_entry: { DRAFT: ["SUBMITTED"], SUBMITTED: ["VERIFIED","REJECTED"], VERIFIED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"], POSTED: ["REVERSED"] },
  credit_note: { DRAFT: ["SUBMITTED"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"] },
  payment: { DRAFT: ["SUBMITTED"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"] },
  budget: { DRAFT: ["SUBMITTED"], SUBMITTED: ["APPROVED","REJECTED"] },
  payroll: { DRAFT: ["SUBMITTED"], SUBMITTED: ["APPROVED","REJECTED"], APPROVED: ["POSTED"] },
};

const ACTION_TO_STATUS: Record<string, string> = {
  submit: "SUBMITTED", verify: "VERIFIED", approve: "APPROVED",
  post: "POSTED", reject: "REJECTED", reverse: "REVERSED",
  issue: "ISSUED", cancel: "CANCELLED", void: "VOID", reopen: "DRAFT",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABLE_MAP: Record<string, any> = {
  journal_entry: journalEntries, invoice: financeInvoices,
  vendor_bill: vendorBills, payment: payments, budget: budgets,
};

export async function POST(req: NextRequest) {
  try {
    const { module, recordId, action, reason } = await req.json();
    if (!module || !recordId || !action) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const transitions = STATUS_MAP[module];
    if (!transitions) {
      return NextResponse.json({ success: false, error: `Unknown module: ${module}` }, { status: 400 });
    }

    const table = TABLE_MAP[module];
    if (!table) {
      return NextResponse.json({ success: false, error: `No table for module: ${module}` }, { status: 400 });
    }

    const [record] = await db.select().from(table).where(eq(table.id, recordId)).limit(1);
    if (!record) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
    }

    const currentStatus = (record as Record<string, unknown>).status as string;
    const targetStatus = ACTION_TO_STATUS[action];
    if (!targetStatus) {
      return NextResponse.json({ success: false, error: `Invalid action: ${action}` }, { status: 400 });
    }

    const allowed = transitions[currentStatus];
    if (!allowed || !allowed.includes(targetStatus)) {
      return NextResponse.json({ success: false, error: `Cannot ${action} from ${currentStatus}` }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status: targetStatus, updatedAt: new Date() };
    if (targetStatus === "POSTED") updateData.postedAt = new Date();
    if (reason) updateData.rejectionReason = reason;

    await db.update(table).set(updateData).where(eq(table.id, recordId));

    return NextResponse.json({ success: true, status: targetStatus, message: `Document ${action}ed successfully` });
  } catch (error) {
    console.error("Workflow error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
