import { NextResponse } from "next/server";
export async function POST(){ return NextResponse.json({ error: "Use /api/careers/apply" }, { status: 410 }); }
