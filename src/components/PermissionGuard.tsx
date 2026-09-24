"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Permission, Role } from "@/lib/types";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

import { useLanguage } from "@/lib/languageContext";

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export default function PermissionGuard({
  permission,
  children,
  fallbackTitle,
  fallbackMessage,
}: PermissionGuardProps) {
  const { currentUser, hasPermission, switchRole } = useAuth();
  const { b } = useLanguage();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  // Find which roles have this permission
  const authorizedRoles = (Object.keys(ROLE_PERMISSIONS) as Role[]).filter((r) =>
    ROLE_PERMISSIONS[r].includes(permission)
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert size={36} />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
            {b("403 - Access Denied", "403 - अनधिकृत पहुंच (Access Denied)")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-3">
            {fallbackTitle || b("Your access to this module is restricted", "इस मॉड्यूल तक आपकी पहुंच प्रतिबंधित है")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {fallbackMessage ||
              b(
                `Your current role (${currentUser.role}) does not have '${permission}' privileges. According to security protocols, this section is restricted to authorized roles.`,
                `आपकी वर्तमान भूमिका (${currentUser.role}) को '${permission}' करने का विशेषाधिकार प्राप्त नहीं है। सुरक्षा एवं संपादकीय प्रोटोकॉल के अनुसार यह पृष्ठ केवल अधिकृत पदों के लिए उपलब्ध है।`
              )}
          </p>
        </div>

        {/* Current Role Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{b("Active User:", "सक्रिय उपयोगकर्ता:")}</span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{b("Current Role:", "वर्तमान पद / भूमिका:")}</span>
            <span className="px-2 py-0.5 rounded font-black text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {currentUser.role}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{b("Required Permission:", "अपेक्षित अनुमति:")}</span>
            <span className="font-mono font-bold text-red-600 dark:text-red-400">{permission}</span>
          </div>
        </div>

        {/* Authorized Roles & Role Switcher */}
        {authorizedRoles.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-left space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <KeyRound size={14} />
              <span>{b("Switch to an authorized role in simulator:", "सिमुलेटर में अधिकृत पद पर स्विच करें:")}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {authorizedRoles.slice(0, 3).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 hover:bg-amber-600 hover:text-white transition cursor-pointer shadow-xs"
                >
                  Switch to {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>{b("Back to Dashboard", "डैशबोर्ड पर वापस जाएं")}</span>
          </Link>
          <button
            onClick={() => switchRole("SUPER_ADMIN")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-900/30 transition-all cursor-pointer"
          >
            <CheckCircle2 size={14} />
            <span>{b("Acquire Super Admin", "Super Admin अनुमति लें")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
