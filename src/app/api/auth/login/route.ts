import { NextRequest, NextResponse } from "next/server";
import { getUsers, addAuditLog } from "@/lib/db";
import { User } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, username, password, userId } = body;

    const users = await getUsers();
    let matchedUser: User | undefined;

    // 1. If direct userId provided (quick 1-click staff switcher / testing)
    if (userId) {
      matchedUser = users.find((u) => u.id === userId);
    }

    // 2. If email or username provided
    if (!matchedUser && (email || username)) {
      const query = (email || username || "").trim().toLowerCase();
      // First try exact email match
      matchedUser = users.find((u) => u.email.toLowerCase() === query);

      // Next try user ID match
      if (!matchedUser) {
        matchedUser = users.find((u) => u.id.toLowerCase() === query);
      }

      // Next try username before '@' or name substring
      if (!matchedUser) {
        const queryPrefix = query.split("@")[0];
        matchedUser = users.find((u) => {
          const userEmailPrefix = u.email.toLowerCase().split("@")[0];
          return (
            userEmailPrefix === queryPrefix ||
            u.email.toLowerCase().includes(queryPrefix) ||
            u.name.toLowerCase().includes(queryPrefix) ||
            u.role.toLowerCase() === query.toUpperCase()
          );
        });
      }
    }

    // 3. Fallback demo admin if username is "admin"
    if (!matchedUser && ((username === "admin" || email === "admin@groundzero.com") && password === "admin123")) {
      matchedUser = users.find((u) => u.role === "SUPER_ADMIN") || users[0];
    }

    if (!matchedUser) {
      return NextResponse.json(
        {
          success: false,
          error: "अमान्य क्रेडेंशियल्स (Invalid credentials): दिया गया ईमेल या स्टाफ सदस्य नहीं मिला।",
        },
        { status: 401 }
      );
    }

    // Password verification:
    // Allow if standard master password "groundzero123" or "admin123" is entered, or if 1-click login was used
    const validPasswords = ["groundzero123", "admin123", "password", "gz2026"];
    if (password && !validPasswords.includes(password) && password !== matchedUser.id) {
      return NextResponse.json(
        {
          success: false,
          error: "गलत पासवर्ड (Incorrect password): कृपया सही पासवर्ड दर्ज करें। (डिफ़ॉल्ट: groundzero123)",
        },
        { status: 401 }
      );
    }

    // Create session response
    const response = NextResponse.json({
      success: true,
      message: `स्वागत है, ${matchedUser.name}! लॉगिन सफल रहा।`,
      user: matchedUser,
    });

    // Set active user cookie (readable by both client and server)
    response.cookies.set("gz_active_user", matchedUser.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    // Set secure HTTP session token
    response.cookies.set("gz_admin_session", `gz_sess_${matchedUser.id}_${Date.now()}`, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    // Record login in audit trail
    await addAuditLog({
      userId: matchedUser.id,
      userName: matchedUser.name,
      userRole: matchedUser.role,
      action: "USER_LOGIN",
      entityType: "user",
      entityId: matchedUser.id,
      details: `स्टाफ लॉगिन संपन्न: ${matchedUser.name} (${matchedUser.role}) - ${matchedUser.district || "Headquarters"}`,
    }).catch(console.error);

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "सर्वर प्रमाणीकरण त्रुटि (Authentication failed)" },
      { status: 500 }
    );
  }
}
