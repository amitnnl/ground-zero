import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/serverAuth";

export async function GET(request: NextRequest) {
  try {
    const cookieUser = request.cookies.get("gz_active_user")?.value;
    const cookieSession = request.cookies.get("gz_admin_session")?.value;

    if (!cookieUser && !cookieSession) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    const user = await getAuthenticatedUser(request);
    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Failed to verify session" },
      { status: 500 }
    );
  }
}
