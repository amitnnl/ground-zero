import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser, addAuditLog } from "@/lib/db";
import { requirePermission } from "@/lib/serverAuth";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch newsroom users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "MANAGE_USERS");
    if (!auth.authorized) return auth.errorResponse!;

    const body = await req.json();
    const { name, email, role, district, phone, bio, department } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      name,
      email,
      role,
      district: district || "हरियाणा",
      phone: phone || "",
      bio: bio || "Newsroom Team Member",
      department: department || "Editorial",
      status: "active",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
    });

    await addAuditLog({
      userId: auth.user.id,
      userName: auth.user.name,
      userRole: auth.user.role,
      action: "CREATE_USER",
      entityType: "system",
      entityId: newUser.id,
      details: `Created new staff member: "${newUser.name}" with role "${newUser.role}" (${newUser.district})`,
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
