import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fixedAssets } from "@/drizzle/finance-schema";

export async function GET() {
  try {
    const all = await db.select().from(fixedAssets).orderBy(fixedAssets.createdAt);
    return NextResponse.json({ assets: all });
  } catch (error) {
    console.error("Fixed assets fetch error:", error);
    return NextResponse.json({ assets: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.purchaseCost || !body.usefulLifeMonths || !body.purchaseDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const assetCode = `FA-${Date.now()}`;
    const nbv = +body.purchaseCost - +(body.residualValue || 0);
    const [asset] = await db.insert(fixedAssets).values({
      assetCode, name: body.name, description: body.description,
      purchaseDate: body.purchaseDate, purchaseCost: Number(body.purchaseCost),
      residualValue: Number(body.residualValue || 0),
      usefulLifeMonths: body.usefulLifeMonths, depreciationMethod: body.depreciationMethod || "straight_line",
      netBookValue: nbv, categoryId: body.categoryId,
    }).returning();
    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error("Fixed asset create error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
