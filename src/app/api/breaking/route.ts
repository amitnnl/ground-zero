import { NextResponse } from "next/server";
import { getBreakingItems } from "@/lib/db";

export async function GET() {
  try {
    const items = await getBreakingItems();
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("API GET /api/breaking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch breaking news" },
      { status: 500 }
    );
  }
}
