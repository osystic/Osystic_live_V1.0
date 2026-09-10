import { NextResponse } from "next/server";

// Destructive public database seeding has intentionally been removed from production.
export async function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
