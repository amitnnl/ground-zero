import { NextRequest, NextResponse } from "next/server";
import { getCitizenReports, createCitizenReport, updateCitizenReportStatus } from "@/lib/db";

export async function GET() {
  try {
    const reports = await getCitizenReports();
    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("GET /api/citizen-reports error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch citizen reports" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.headline || !body.citizenName || !body.phone || !body.description) {
      return NextResponse.json({ success: false, error: "All required fields must be provided" }, { status: 400 });
    }

    // Automated AI pre-classification simulation
    const urgency = body.headline.includes("हादसा") || body.headline.includes("जाम") || body.headline.includes("आग") ? 90 : 65;
    const aiClassification = {
      category: body.category || "नागरिक समस्या",
      urgencyScore: urgency,
      summary: `नागरिक रिपोर्ट: ${body.headline.substring(0, 60)}...`,
    };

    const newReport = await createCitizenReport({
      citizenName: body.citizenName,
      phone: body.phone,
      email: body.email || "",
      district: body.district || "हरियाणा",
      locationDetails: body.locationDetails || "",
      category: body.category || "नागरिक समस्या",
      headline: body.headline,
      description: body.description,
      mediaUrls: body.mediaUrls || [],
      status: "pending_triage",
      aiClassification,
    });

    return NextResponse.json({ success: true, report: newReport }, { status: 201 });
  } catch (error) {
    console.error("POST /api/citizen-reports error:", error);
    return NextResponse.json({ success: false, error: "Failed to create citizen report" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: "ID and status are required" }, { status: 400 });
    }

    const updated = await updateCitizenReportStatus(body.id, body.status, body.assignedReporterId);
    return NextResponse.json({ success: true, report: updated });
  } catch (error) {
    console.error("PUT /api/citizen-reports error:", error);
    return NextResponse.json({ success: false, error: "Failed to update report status" }, { status: 500 });
  }
}
