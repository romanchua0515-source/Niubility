import { NextResponse } from "next/server";
import { runHealthCheck } from "../runner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const summary = await runHealthCheck({ limit: 3 });
  return NextResponse.json(summary);
}
