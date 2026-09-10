import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeInvoices, payments, journalLines, accounts } from "@/drizzle/finance-schema";
import { expenses } from "@/drizzle/schema";
import { eq, sql, sum } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("type") || "pnl";

    if (reportType === "pnl") {
      const [revenue] = await db.select({ total: sum(financeInvoices.totalAmount) }).from(financeInvoices);
      const [expenseTotal] = await db.select({ total: sum(expenses.amount) }).from(expenses);
      return NextResponse.json({
        report: "Profit & Loss",
        revenue: Number(revenue?.total || 0),
        expenses: Number(expenseTotal?.total || 0),
        netProfit: Number(revenue?.total || 0) - Number(expenseTotal?.total || 0),
      });
    }

    if (reportType === "ar_aging") {
      const outstanding = await db.select().from(financeInvoices).where(sql`${financeInvoices.outstandingAmount} > 0`);
      return NextResponse.json({ report: "AR Aging", invoices: outstanding });
    }

    if (reportType === "ap_aging") {
      const outstanding = await db.select().from(payments).where(sql`${payments.type} = 'vendor_payment' AND ${payments.status} != 'POSTED'`);
      return NextResponse.json({ report: "AP Aging", payments: outstanding });
    }

    return NextResponse.json({ report: reportType, data: [] });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ report: "error", data: [] });
  }
}
