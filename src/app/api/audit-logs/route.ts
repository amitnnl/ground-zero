import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/db";
import { requirePermission } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "VIEW_AUDIT_LOGS");
    if (!auth.authorized) return auth.errorResponse!;

    const logs = await getAuditLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("GET /api/audit-logs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
