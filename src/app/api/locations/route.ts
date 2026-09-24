import { NextResponse } from "next/server";
import { getLocations } from "@/lib/db";

export async function GET() {
  try {
    const locations = await getLocations();
    return NextResponse.json({ success: true, locations });
  } catch (error) {
    console.error("GET /api/locations error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch locations" }, { status: 500 });
  }
}
