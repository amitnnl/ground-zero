import { Role, Permission } from "./types";

/**
 * Master Role-Based Access Control (RBAC) Matrix
 * Defines exact permissions for all 13 newsroom roles.
 * Client-safe, zero server dependencies.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "VIEW_DASHBOARD",
    "CREATE_NEWS",
    "PUBLISH_NEWS",
    "APPROVE_NEWS",
    "REJECT_NEWS",
    "DELETE_NEWS",
    "ASSIGN_STORIES",
    "MANAGE_SOCIAL",
    "MANAGE_LIVE_TV",
    "MANAGE_VIDEOS",
    "MANAGE_GALLERY",
    "MANAGE_ADS",
    "MANAGE_NOTIFICATIONS",
    "MANAGE_CITIZEN_REPORTS",
    "VIEW_ANALYTICS",
    "VIEW_AUDIT_LOGS",
    "MANAGE_SETTINGS",
    "MANAGE_USERS",
  ],
  ADMIN: [
    "VIEW_DASHBOARD",
    "CREATE_NEWS",
    "PUBLISH_NEWS",
    "APPROVE_NEWS",
    "REJECT_NEWS",
    "DELETE_NEWS",
    "ASSIGN_STORIES",
    "MANAGE_SOCIAL",
    "MANAGE_LIVE_TV",
    "MANAGE_VIDEOS",
    "MANAGE_GALLERY",
    "MANAGE_ADS",
    "MANAGE_NOTIFICATIONS",
    "MANAGE_CITIZEN_REPORTS",
    "VIEW_ANALYTICS",
    "VIEW_AUDIT_LOGS",
    "MANAGE_SETTINGS",
    "MANAGE_USERS",
  ],
  EDITOR_IN_CHIEF: [
    "VIEW_DASHBOARD",
    "CREATE_NEWS",
    "PUBLISH_NEWS",
    "APPROVE_NEWS",
    "REJECT_NEWS",
    "DELETE_NEWS",
    "ASSIGN_STORIES",
    "MANAGE_SOCIAL",
    "MANAGE_LIVE_TV",
    "MANAGE_VIDEOS",
    "MANAGE_GALLERY",
    "MANAGE_NOTIFICATIONS",
    "MANAGE_CITIZEN_REPORTS",
    "VIEW_ANALYTICS",
    "VIEW_AUDIT_LOGS",
  ],
  EDITOR: [
    "VIEW_DASHBOARD",
    "CREATE_NEWS",
    "PUBLISH_NEWS",
    "APPROVE_NEWS",
    "REJECT_NEWS",
    "ASSIGN_STORIES",
    "MANAGE_NOTIFICATIONS",
    "MANAGE_CITIZEN_REPORTS",
    "VIEW_ANALYTICS",
  ],
  DISTRICT_EDITOR: [
    "VIEW_DASHBOARD",
    "CREATE_NEWS",
    "PUBLISH_NEWS",
    "APPROVE_NEWS",
    "REJECT_NEWS",
    "ASSIGN_STORIES",
    "MANAGE_CITIZEN_REPORTS",
    "VIEW_ANALYTICS",
  ],
  REPORTER: [
    "VIEW_DASHBOARD",
    "CREATE_NEWS",
    "MANAGE_CITIZEN_REPORTS",
  ],
  VIDEO_EDITOR: [
    "VIEW_DASHBOARD",
    "MANAGE_LIVE_TV",
    "MANAGE_VIDEOS",
  ],
  PHOTOGRAPHER: [
    "VIEW_DASHBOARD",
    "MANAGE_GALLERY",
  ],
  SOCIAL_MEDIA_MANAGER: [
    "VIEW_DASHBOARD",
    "MANAGE_SOCIAL",
    "MANAGE_NOTIFICATIONS",
  ],
  SEO_MANAGER: [
    "VIEW_DASHBOARD",
    "VIEW_ANALYTICS",
  ],
  AD_MANAGER: [
    "VIEW_DASHBOARD",
    "MANAGE_ADS",
    "VIEW_ANALYTICS",
  ],
  CITIZEN_CONTRIBUTOR: [
    "VIEW_DASHBOARD",
    "CREATE_NEWS",
  ],
  VIEWER: [],
};

/**
 * Check if a role possesses a specific granular permission
 */
export function hasRolePermission(role: Role, permission: Permission): boolean {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return true;
  const list = ROLE_PERMISSIONS[role];
  if (!list) return false;
  return list.includes(permission);
}
