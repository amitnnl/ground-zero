import { NextRequest, NextResponse } from "next/server";
import { getLiveStream, updateLiveStream } from "@/lib/db";

export async function GET() {
  try {
    const stream = await getLiveStream();
    return NextResponse.json({ success: true, stream });
  } catch (error) {
    console.error("GET /api/live-tv error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch live stream" }, { status: 500 });
  }
}

import { requirePermission } from "@/lib/serverAuth";

export async function PUT(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "MANAGE_LIVE_TV");
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const updated = await updateLiveStream(body);
    return NextResponse.json({ success: true, stream: updated });
  } catch (error) {
    console.error("PUT /api/live-tv error:", error);
    return NextResponse.json({ success: false, error: "Failed to update live stream" }, { status: 500 });
  }
}
