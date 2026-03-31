import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Verify CRON_SECRET header
  // Fetch data from beehivemonitoring API
  // Save readings to database
  return NextResponse.json({ ok: true, message: "Scale readings sync placeholder" });
}
