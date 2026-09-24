import { NextRequest, NextResponse } from "next/server";
import { User, Role, Permission } from "./types";
import { getUsers, addAuditLog } from "./db";
import { ROLE_PERMISSIONS, hasRolePermission } from "./permissions";

// Re-export for server-side callers
export { ROLE_PERMISSIONS, hasRolePermission };

/**
 * Resolves the authenticated user performing the request.
 * Priority:
 * 1. Explicit `x-user-id` request header
 * 2. `gz_active_user` cookie (which tracks the active newsroom user from frontend role selector)
 * 3. `x-user-role` header (creates a synthetic user session for testing/integrations)
 * 4. Defaults to the Super Admin (Ashok Tanwar, user-1)
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<User> {
  const users = await getUsers();

  // 1. Check custom request header
  const headerUserId = req.headers.get("x-user-id");
  if (headerUserId) {
    const user = users.find((u) => u.id === headerUserId);
    if (user) return user;
  }

  // 2. Check active user cookie set by the newsroom role switcher
  const cookieUserId = req.cookies.get("gz_active_user")?.value;
  if (cookieUserId) {
    const user = users.find((u) => u.id === cookieUserId);
    if (user) return user;
  }

  // 3. Check role override header
  const headerRole = req.headers.get("x-user-role") as Role | null;
  if (headerRole) {
    const matchingUser = users.find((u) => u.role === headerRole);
    if (matchingUser) return matchingUser;

    return {
      id: `synthetic-${headerRole.toLowerCase()}`,
      name: `${headerRole} (Synthetic Session)`,
      email: `${headerRole.toLowerCase()}@groundzero.com`,
      role: headerRole,
      status: "active",
      district: "Haryana",
    };
  }

  // 4. Default to Super Admin user
  return (
    users.find((u) => u.role === "SUPER_ADMIN") ||
    users[0] || {
      id: "system-root",
      name: "Ashok Tanwar (Super Admin)",
      email: "ashok.tanwar@groundzero.com",
      role: "SUPER_ADMIN",
      status: "active",
      district: "नारनौल / Mahendergarh",
    }
  );
}

/**
 * Middleware check helper for Next.js Route Handlers.
 * If unauthorized, logs a security audit event and returns a 403 Forbidden NextResponse.
 */
export async function requirePermission(
  req: NextRequest,
  permission: Permission
): Promise<{ authorized: true; user: User } | { authorized: false; user: User; errorResponse: NextResponse }> {
  const user = await getAuthenticatedUser(req);
  const authorized = hasRolePermission(user.role, permission);

  if (!authorized) {
    // Record security audit log for unauthorized attempt
    await addAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "UNAUTHORIZED_ACCESS_ATTEMPT",
      entityType: "system",
      entityId: permission,
      details: `User with role '${user.role}' attempted restricted action requiring '${permission}' on path: ${req.nextUrl.pathname}`,
    }).catch(console.error);

    return {
      authorized: false,
      user,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `FORBIDDEN`,
          message: `अनधिकृत पहुंच (Access Denied): आपकी वर्तमान भूमिका '${user.role}' को '${permission}' करने की अनुमति नहीं है।`,
          requiredPermission: permission,
          userRole: user.role,
        },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}
