import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { financeInvoices, payments, vendorBills, financeClients } from "@/drizzle/finance-schema";
import { eq, sql, sum } from "drizzle-orm";

export async function GET() {
  try {
    const [invoiceStats] = await db
      .select({
        totalRevenue: sum(financeInvoices.totalAmount),
        outstandingAR: sum(financeInvoices.outstandingAmount),
      })
      .from(financeInvoices);

    const [paymentStats] = await db
      .select({ totalPayments: sum(payments.amount) })
      .from(payments)
      .where(eq(payments.status, "POSTED"));

    const [billStats] = await db
      .select({ outstandingAP: sum(vendorBills.totalAmount) })
      .from(vendorBills)
      .where(sql`${vendorBills.status} != 'PAID' AND ${vendorBills.status} != 'VOID'`);

    const stats = {
      totalRevenue: Number(invoiceStats?.totalRevenue || 0),
      totalExpenses: Number(paymentStats?.totalPayments || 0),
      outstandingAR: Number(invoiceStats?.outstandingAR || 0),
      outstandingAP: Number(billStats?.outstandingAP || 0),
      netProfit: Number(invoiceStats?.totalRevenue || 0) - Number(paymentStats?.totalPayments || 0),
      activeProjects: 0,
      pendingApprovals: 0,
      overdueInvoices: 0,
    };

    return NextResponse.json({ stats, recentTransactions: [], pendingItems: [] });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ stats: {}, recentTransactions: [], pendingItems: [] });
  }
}
