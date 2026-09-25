import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";
import { requirePermission } from "@/lib/serverAuth";

export async function GET(request: NextRequest) {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "सेटिंग्स प्राप्त करने में विफलता" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requirePermission(request, "MANAGE_SETTINGS");
    if (!auth.authorized) return auth.errorResponse!;

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "अमान्य सेटिंग्स डेटा" },
        { status: 400 }
      );
    }

    const updated = await updateSiteSettings(body);
    return NextResponse.json({
      success: true,
      settings: updated,
      message: "साइट सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गईं!",
    });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "सेटिंग्स सहेजने में विफलता" },
      { status: 500 }
    );
  }
}
