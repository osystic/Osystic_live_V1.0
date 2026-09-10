import { NextResponse } from "next/server";
export async function GET(){ return NextResponse.json({ error: "Legacy booking API disabled. Use the Cal.com embed." }, { status: 410 }); }
export async function POST(){ return NextResponse.json({ error: "Legacy booking API disabled. Use the Cal.com embed." }, { status: 410 }); }
