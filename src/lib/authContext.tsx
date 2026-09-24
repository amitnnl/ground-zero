"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role, Permission } from "./types";
import { demoUsers } from "./seedData";
import { ROLE_PERMISSIONS, hasRolePermission } from "./permissions";

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  isAuthenticated: boolean;
  switchUser: (userId: string) => void;
  switchRole: (role: Role) => void;
  hasPermission: (permission: Permission | string) => boolean;
  refreshUsers: () => Promise<void>;
  login: (credentials: {
    email?: string;
    username?: string;
    password?: string;
    userId?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: User = {
  id: "guest-user",
  name: "अतिथि पाठक (Guest Reader)",
  email: "guest@groundzero.com",
  role: "VIEWER",
  status: "active",
  district: "हरियाणा / Haryana",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(demoUsers[0]);
  const [allUsers, setAllUsers] = useState<User[]>(demoUsers);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const syncActiveCookie = (userId: string) => {
    try {
      if (typeof document !== "undefined") {
        document.cookie = `gz_active_user=${userId}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch {}
  };

  const clearActiveCookie = () => {
    try {
      if (typeof document !== "undefined") {
        document.cookie = "gz_active_user=; path=/; max-age=0; SameSite=Lax";
      }
    } catch {}
  };

  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data?.success && data?.users) {
        setAllUsers(data.users);
        const currentSaved = localStorage.getItem("groundzero_active_user");
        if (currentSaved) {
          const found = data.users.find((u: User) => u.id === currentSaved);
          if (found) {
            setCurrentUser(found);
            syncActiveCookie(found.id);
          }
        }
      }
    } catch {
      // fallback to demoUsers
    }
  };

  useEffect(() => {
    const savedUserId = localStorage.getItem("groundzero_active_user");
    const loggedInFlag = localStorage.getItem("groundzero_logged_in");

    if (loggedInFlag === "false") {
      setIsAuthenticated(false);
      setCurrentUser(GUEST_USER);
      clearActiveCookie();
    } else if (savedUserId) {
      const found = demoUsers.find((u) => u.id === savedUserId);
      if (found) {
        setCurrentUser(found);
        setIsAuthenticated(true);
        syncActiveCookie(found.id);
      }
    } else {
      // Default to demo admin for frictionless first-time experience
      setIsAuthenticated(true);
      setCurrentUser(demoUsers[0]);
      localStorage.setItem("groundzero_active_user", demoUsers[0].id);
      localStorage.setItem("groundzero_logged_in", "true");
      syncActiveCookie(demoUsers[0].id);
    }

    // Only fetch dynamic users list if visiting admin newsroom or login pages
    if (typeof window !== "undefined" && (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/login"))) {
      refreshUsers();
    }
  }, []);

  const login = async (credentials: {
    email?: string;
    username?: string;
    password?: string;
    userId?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok && data?.success && data?.user) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("groundzero_active_user", data.user.id);
        localStorage.setItem("groundzero_logged_in", "true");
        syncActiveCookie(data.user.id);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data?.error || "लॉगिन असफल रहा" };
      }
    } catch (err: any) {
      console.error("Login error:", err);
      return { success: false, error: "सर्वर से संपर्क करने में असमर्थ" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(GUEST_USER);
      localStorage.removeItem("groundzero_active_user");
      localStorage.setItem("groundzero_logged_in", "false");
      clearActiveCookie();

      // If user is currently inside the admin console, redirect to login
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        window.location.href = "/login";
      }
    }
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId) || demoUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("groundzero_active_user", user.id);
      localStorage.setItem("groundzero_logged_in", "true");
      syncActiveCookie(user.id);
    }
  };

  const switchRole = (role: Role) => {
    const user = allUsers.find((u) => u.role === role) || demoUsers.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("groundzero_active_user", user.id);
      localStorage.setItem("groundzero_logged_in", "true");
      syncActiveCookie(user.id);
    }
  };

  const hasPermission = (permission: Permission | string): boolean => {
    if (!isAuthenticated && currentUser.role === "VIEWER") {
      return false;
    }
    return hasRolePermission(currentUser.role, permission as Permission);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        switchUser,
        switchRole,
        hasPermission,
        refreshUsers,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
