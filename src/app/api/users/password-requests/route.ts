import { NextRequest, NextResponse } from "next/server";
import {
  getPasswordRequests,
  createPasswordRequest,
  updatePasswordRequest,
  getUsers,
  updateUser,
  addAuditLog,
  createPushAlert,
} from "@/lib/db";
import { requirePermission } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "MANAGE_USERS");
    if (!auth.authorized) return auth.errorResponse!;

    const requests = await getPasswordRequests();
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("GET /api/users/password-requests error:", error);
    return NextResponse.json(
      { success: false, error: "पासवर्ड अनुरोध लोड करने में विफल।" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, userId, reason } = body;

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, error: "कृपया अपना पंजीकृत ईमेल या स्टाफ आईडी दर्ज करें।" },
        { status: 400 }
      );
    }

    const allUsers = await getUsers();
    let matchedUser = allUsers.find(
      (u) =>
        (email && u.email.toLowerCase() === String(email).trim().toLowerCase()) ||
        (userId && u.id === userId)
    );

    // Also try case-insensitive partial email or ID match
    if (!matchedUser && email) {
      const q = String(email).trim().toLowerCase();
      matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === q || u.id.toLowerCase() === q
      );
    }

    if (!matchedUser) {
      return NextResponse.json(
        {
          success: false,
          error: "इस ईमेल या यूज़रनेम से कोई भी सक्रिय स्टाफ सदस्य पंजीकृत नहीं मिला। कृपया सही ईमेल दर्ज करें।",
        },
        { status: 404 }
      );
    }

    // Check if user already has an active pending request
    const existingRequests = await getPasswordRequests();
    const existingPending = existingRequests.find(
      (r) => r.userId === matchedUser!.id && r.status === "PENDING"
    );

    if (existingPending) {
      return NextResponse.json({
        success: true,
        message: "आपका पासवर्ड बदलने का अनुरोध पहले से ही व्यवस्थापक (Admin) के पास समीक्षा हेतु लंबित है। व्यवस्थापक जल्द ही आपसे संपर्क करेंगे या नया पासवर्ड जारी करेंगे।",
        request: existingPending,
        alreadyPending: true,
      });
    }

    const newRequest = await createPasswordRequest({
      userId: matchedUser.id,
      userName: matchedUser.name,
      userEmail: matchedUser.email,
      userRole: matchedUser.role,
      reason: reason ? String(reason).trim() : "उपयोगकर्ता द्वारा पासवर्ड रीसेट/बदलने का अनुरोध",
    });

    // Record in Audit Trail
    await addAuditLog({
      userId: matchedUser.id,
      userName: matchedUser.name,
      userRole: matchedUser.role,
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "user",
      entityId: matchedUser.id,
      details: `स्टाफ सदस्य "${matchedUser.name}" (${matchedUser.email}, ${matchedUser.role}) ने पासवर्ड बदलने का अनुरोध भेजा। कारण: ${reason || "N/A"}`,
    });

    // Send internal alert
    try {
      await createPushAlert({
        title: `🔑 पासवर्ड अनुरोध: ${matchedUser.name}`,
        message: `${matchedUser.role} ${matchedUser.name} (${matchedUser.district || "South Haryana"}) ने पासवर्ड रीसेट करने का अनुरोध भेजा है।`,
        targetUrl: "/admin/users",
        category: "प्रशासनिक अलर्ट",
        sentBy: "Security System",
      });
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: `आपका पासवर्ड बदलने का अनुरोध व्यवस्थापक (Admin) को सफलतापूर्वक भेज दिया गया है। व्यवस्थापक इसे स्वीकृत कर नया पासवर्ड निर्धारित करेंगे।`,
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/users/password-requests error:", error);
    return NextResponse.json(
      { success: false, error: "सर्वर त्रुटि: अनुरोध प्रेषित नहीं हो सका।" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "MANAGE_USERS");
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json().catch(() => ({}));
    const { requestId, action, newPassword, adminNotes } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { success: false, error: "requestId और action आवश्यक हैं।" },
        { status: 400 }
      );
    }

    const allRequests = await getPasswordRequests();
    const targetRequest = allRequests.find((r) => r.id === requestId);

    if (!targetRequest) {
      return NextResponse.json(
        { success: false, error: "अनुरोध नहीं मिला।" },
        { status: 404 }
      );
    }

    if (action === "APPROVE") {
      if (!newPassword || String(newPassword).trim().length < 4) {
        return NextResponse.json(
          { success: false, error: "स्वीकृत करने के लिए कम से कम 4 अक्षरों का नया पासवर्ड दर्ज करें।" },
          { status: 400 }
        );
      }

      const cleanPassword = String(newPassword).trim();

      // 1. Update User password
      const updatedUser = await updateUser(targetRequest.userId, {
        password: cleanPassword,
      });

      if (!updatedUser) {
        return NextResponse.json(
          { success: false, error: "संबंधित उपयोगकर्ता खाता नहीं मिला या अपडेट नहीं हो सका।" },
          { status: 404 }
        );
      }

      // 2. Mark request as APPROVED
      const updatedRequest = await updatePasswordRequest(requestId, {
        status: "APPROVED",
        temporaryPassword: cleanPassword,
        adminNotes: adminNotes ? String(adminNotes).trim() : "व्यवस्थापक द्वारा स्वीकृत एवं नया पासवर्ड जारी किया गया",
        resolvedBy: auth.user.name,
        resolvedAt: new Date().toISOString(),
      });

      // 3. Log audit event
      await addAuditLog({
        userId: auth.user.id,
        userName: auth.user.name,
        userRole: auth.user.role,
        action: "APPROVE_PASSWORD_REQUEST",
        entityType: "user",
        entityId: targetRequest.userId,
        details: `व्यवस्थापक ${auth.user.name} ने "${targetRequest.userName}" (${targetRequest.userEmail}) का पासवर्ड अनुरोध स्वीकृत किया और नया पासवर्ड निर्धारित किया।`,
      });

      return NextResponse.json({
        success: true,
        message: `पासवर्ड अनुरोध स्वीकृत! सदस्य "${targetRequest.userName}" का नया पासवर्ड निर्धारित कर दिया गया है।`,
        request: updatedRequest,
      });
    } else if (action === "REJECT") {
      const updatedRequest = await updatePasswordRequest(requestId, {
        status: "REJECTED",
        adminNotes: adminNotes ? String(adminNotes).trim() : "व्यवस्थापक द्वारा अनुरोध अस्वीकार किया गया",
        resolvedBy: auth.user.name,
        resolvedAt: new Date().toISOString(),
      });

      await addAuditLog({
        userId: auth.user.id,
        userName: auth.user.name,
        userRole: auth.user.role,
        action: "REJECT_PASSWORD_REQUEST",
        entityType: "user",
        entityId: targetRequest.userId,
        details: `व्यवस्थापक ${auth.user.name} ने "${targetRequest.userName}" का पासवर्ड अनुरोध अस्वीकार किया। टिप्पणी: ${adminNotes || "N/A"}`,
      });

      return NextResponse.json({
        success: true,
        message: `पासवर्ड अनुरोध अस्वीकार कर दिया गया।`,
        request: updatedRequest,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "अमान्य क्रिया (Invalid action). केवल APPROVE या REJECT मान्य हैं।" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("PUT /api/users/password-requests error:", error);
    return NextResponse.json(
      { success: false, error: "सर्वर त्रुटि: अनुरोध प्रोसेस नहीं हो सका।" },
      { status: 500 }
    );
  }
}
