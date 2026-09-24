import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/serverAuth";
import { addAuditLog } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    // Record logout audit log
    if (user && user.id !== "system-root") {
      await addAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: "USER_LOGOUT",
        entityType: "user",
        entityId: user.id,
        details: `स्टाफ लॉगआउट संपन्न: ${user.name} (${user.role}) सत्र समाप्त।`,
      }).catch(console.error);
    }

    const response = NextResponse.json({
      success: true,
      message: "सफलतापूर्वक लॉगआउट किया गया (Logged out successfully)",
    });

    // Clear session cookies
    response.cookies.set("gz_active_user", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });

    response.cookies.set("gz_admin_session", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { success: false, error: "लॉगआउट प्रक्रिया में त्रुटि (Logout failed)" },
      { status: 500 }
    );
  }
}
