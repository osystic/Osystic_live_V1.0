import { NextResponse } from "next/server";

// Legacy unauthenticated email endpoint disabled. Careers and contact use dedicated validated routes.
export async function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
