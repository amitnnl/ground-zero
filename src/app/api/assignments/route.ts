import { NextRequest, NextResponse } from "next/server";
import { getAssignments, createAssignment, updateAssignmentStatus } from "@/lib/db";

export async function GET() {
  try {
    const assignments = await getAssignments();
    return NextResponse.json({ success: true, assignments });
  } catch (error) {
    console.error("GET /api/assignments error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch assignments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.reporterId) {
      return NextResponse.json({ success: false, error: "Title and reporter are required" }, { status: 400 });
    }

    const assignment = await createAssignment(body);
    return NextResponse.json({ success: true, assignment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/assignments error:", error);
    return NextResponse.json({ success: false, error: "Failed to create assignment" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: "ID and status are required" }, { status: 400 });
    }

    const updated = await updateAssignmentStatus(body.id, body.status);
    return NextResponse.json({ success: true, assignment: updated });
  } catch (error) {
    console.error("PUT /api/assignments error:", error);
    return NextResponse.json({ success: false, error: "Failed to update assignment" }, { status: 500 });
  }
}
