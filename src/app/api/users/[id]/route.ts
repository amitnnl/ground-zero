import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser, addAuditLog, getUsers } from "@/lib/db";
import { requirePermission } from "@/lib/serverAuth";
import { Role } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Do not return password in response
    const { password, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission(req, "MANAGE_USERS");
    if (!auth.authorized) return auth.errorResponse!;

    const { id } = await params;
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "उपयोगकर्ता नहीं मिला (User not found)" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, email, role, district, phone, bio, department, status, password } = body;

    const updates: Record<string, any> = {};

    if (name !== undefined) updates.name = String(name).trim();
    if (email !== undefined) updates.email = String(email).trim().toLowerCase();
    if (district !== undefined) updates.district = String(district).trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (department !== undefined) updates.department = String(department).trim();
    if (status !== undefined) updates.status = status === "inactive" ? "inactive" : "active";

    // Handle role update
    if (role !== undefined) {
      const validRoles: Role[] = [
        "SUPER_ADMIN",
        "ADMIN",
        "EDITOR_IN_CHIEF",
        "EDITOR",
        "DISTRICT_EDITOR",
        "REPORTER",
        "VIDEO_EDITOR",
        "PHOTOGRAPHER",
        "SOCIAL_MEDIA_MANAGER",
        "SEO_MANAGER",
        "AD_MANAGER",
        "VIEWER",
        "CITIZEN_CONTRIBUTOR",
      ];
      if (!validRoles.includes(role as Role)) {
        return NextResponse.json(
          { success: false, error: "अमान्य भूमिका (Invalid role specified)" },
          { status: 400 }
        );
      }

      // Safeguard: Do not allow demoting primary super admin if they are the only super admin
      if (id === "usr-super-admin" && role !== "SUPER_ADMIN") {
        const allUsers = await getUsers();
        const superAdmins = allUsers.filter((u) => u.role === "SUPER_ADMIN" && u.id !== id);
        if (superAdmins.length === 0) {
          return NextResponse.json(
            { success: false, error: "प्राथमिक सुपर एडमिन की भूमिका नहीं बदली जा सकती क्योंकि सिस्टम में अन्य कोई सुपर एडमिन नहीं है।" },
            { status: 400 }
          );
        }
      }
      updates.role = role as Role;
    }

    // Handle password update (Only Admin can set/change passwords)
    let passwordChanged = false;
    if (password !== undefined && password !== null && String(password).trim().length > 0) {
      const cleanPassword = String(password).trim();
      if (cleanPassword.length < 4) {
        return NextResponse.json(
          { success: false, error: "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।" },
          { status: 400 }
        );
      }
      updates.password = cleanPassword;
      passwordChanged = true;
    }

    const updatedUser = await updateUser(id, updates);
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "अपडेट करने में विफल (Failed to update user)" },
        { status: 500 }
      );
    }

    // Add Audit Log
    if (passwordChanged) {
      await addAuditLog({
        userId: auth.user.id,
        userName: auth.user.name,
        userRole: auth.user.role,
        action: "CHANGE_USER_PASSWORD",
        entityType: "user",
        entityId: updatedUser.id,
        details: `व्यवस्थापक ${auth.user.name} (${auth.user.role}) ने सदस्य "${updatedUser.name}" (${updatedUser.email}) का पासवर्ड सीधे अपडेट किया।`,
      });
    }

    if (Object.keys(updates).filter(k => k !== "password").length > 0) {
      await addAuditLog({
        userId: auth.user.id,
        userName: auth.user.name,
        userRole: auth.user.role,
        action: "UPDATE_USER",
        entityType: "user",
        entityId: updatedUser.id,
        details: `व्यवस्थापक ${auth.user.name} ने सदस्य "${updatedUser.name}" की प्रोफ़ाइल/भूमिका अपडेट की (Role: ${updatedUser.role}, District: ${updatedUser.district || "N/A"}, Status: ${updatedUser.status || "active"})`,
      });
    }

    const { password: _, ...safeUser } = updatedUser;
    return NextResponse.json({
      success: true,
      message: passwordChanged
        ? `सदस्य "${updatedUser.name}" का विवरण एवं नया पासवर्ड सफलतापूर्वक सहेज लिया गया!`
        : `सदस्य "${updatedUser.name}" का विवरण सफलतापूर्वक अपडेट कर दिया गया!`,
      user: safeUser,
    });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "सर्वर त्रुटि: यूज़र अपडेट नहीं हो सका।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission(req, "MANAGE_USERS");
    if (!auth.authorized) return auth.errorResponse!;

    const { id } = await params;

    // Safeguard: Cannot delete yourself
    if (auth.user.id === id) {
      return NextResponse.json(
        { success: false, error: "आप अपने स्वयं के सक्रिय खाते को हटा नहीं सकते।" },
        { status: 400 }
      );
    }

    // Safeguard: Cannot delete primary super admin
    if (id === "usr-super-admin") {
      return NextResponse.json(
        { success: false, error: "प्राथमिक सुपर व्यवस्थापक (Primary Super Admin) खाता हटाया नहीं जा सकता।" },
        { status: 400 }
      );
    }

    const targetUser = await getUserById(id);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "सदस्य नहीं मिला।" },
        { status: 404 }
      );
    }

    const deleted = await deleteUser(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "हटाने में विफलता।" },
        { status: 500 }
      );
    }

    await addAuditLog({
      userId: auth.user.id,
      userName: auth.user.name,
      userRole: auth.user.role,
      action: "DELETE_USER",
      entityType: "user",
      entityId: id,
      details: `व्यवस्थापक ${auth.user.name} ने सदस्य "${targetUser.name}" (${targetUser.role}) का खाता हटा दिया।`,
    });

    return NextResponse.json({
      success: true,
      message: `सदस्य "${targetUser.name}" को सफलतापूर्वक हटा दिया गया।`,
    });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "सर्वर त्रुटि: यूज़र हटाया नहीं जा सका।" },
      { status: 500 }
    );
  }
}
