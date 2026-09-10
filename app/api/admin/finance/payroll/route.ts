import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payrollLines, payrollRuns, employees } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const runs = await db.select().from(payrollRuns).orderBy(payrollRuns.createdAt);
    const emps = await db.select().from(employees).orderBy(employees.name);
    return NextResponse.json({ runs, employees: emps });
  } catch (error) {
    console.error("Payroll fetch error:", error);
    return NextResponse.json({ runs: [], employees: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === "create_employee") {
      if (!body.employeeCode || !body.name) {
        return NextResponse.json({ error: "Employee code and name required" }, { status: 400 });
      }
      const [emp] = await db.insert(employees).values({
        employeeCode: body.employeeCode,
        name: body.name,
        email: body.email,
        department: body.department,
        designation: body.designation,
        basicSalary: body.basicSalary,
        currency: body.currency || "PKR",
      }).returning();
      return NextResponse.json({ employee: emp }, { status: 201 });
    }

    if (action === "create_run") {
      if (!body.periodStart || !body.periodEnd) {
        return NextResponse.json({ error: "Period start and end required" }, { status: 400 });
      }
      const runNumber = `PR-${Date.now()}`;
      const [run] = await db.insert(payrollRuns).values({
        runNumber, periodStart: body.periodStart, periodEnd: body.periodEnd,
        totalGross: (body.totalGross || 0),
        totalDeductions: (body.totalDeductions || 0),
        totalNet: (body.totalNet || 0),
      }).returning();
      return NextResponse.json({ run }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action. Use 'create_employee' or 'create_run'." }, { status: 400 });
  } catch (error) {
    console.error("Payroll error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
