import { NextRequest, NextResponse } from "next/server";
import {
  getPushAlerts,
  createPushAlert,
  registerPushSubscription,
  addAuditLog,
} from "@/lib/db";
import { requirePermission } from "@/lib/serverAuth";

export async function GET() {
  try {
    const alerts = await getPushAlerts();
    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error("Error fetching push alerts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "subscribe" && body.endpoint) {
      const sub = await registerPushSubscription(body.endpoint);
      return NextResponse.json({ success: true, subscription: sub });
    }

    // Broadcasting push alert requires MANAGE_NOTIFICATIONS
    const auth = await requirePermission(request, "MANAGE_NOTIFICATIONS");
    if (!auth.authorized) return auth.errorResponse!;

    const { title, message, targetUrl, category, district, isBreaking } = body;
    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required title or message" },
        { status: 400 }
      );
    }

    const newAlert = await createPushAlert({
      title,
      message,
      targetUrl: targetUrl || "/",
      category: category || "ब्रेकिंग",
      district: district || "हरियाणा",
      isBreaking: Boolean(isBreaking),
      sentBy: "न्यूज़रूम कंट्रोल डेस्क",
    });

    await addAuditLog({
      userId: "usr-admin",
      userName: "Breaking News Editor",
      userRole: "EDITOR_IN_CHIEF",
      action: "SEND_PUSH_NOTIFICATION",
      entityType: "article",
      entityId: newAlert.id,
      details: `Dispatched push alert: "${title}" (${newAlert.deliveredCount} subscribers)`,
    });

    return NextResponse.json({ success: true, alert: newAlert }, { status: 201 });
  } catch (error) {
    console.error("Error creating push notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to broadcast notification" },
      { status: 500 }
    );
  }
}
