"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Bot,
  Share2,
  Tv,
  MapPin,
  Users,
  ShieldAlert,
  BarChart3,
  FileClock,
  Settings,
  PlusCircle,
  Radio,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  UserCheck,
  DollarSign,
  Video,
  Image as ImageIcon,
  BellRing,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { Role, Permission } from "@/lib/types";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/languageContext";
import { useSettings } from "@/lib/settingsContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, allUsers, switchRole, hasPermission, logout } = useAuth();
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Dynamically sync browser document title & favicon with Site Settings
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (settings.site_name) {
        document.title = `${settings.site_name} - Newsroom Console`;
      }
      if (settings.site_favicon) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement("link");
          link.rel = "shortcut icon";
          document.head.appendChild(link);
        }
        link.href = settings.site_favicon;
      }
    }
  }, [settings.site_name, settings.site_favicon]);

  const brandInitials = React.useMemo(() => {
    if (!settings.site_name) return "GZ";
    const parts = settings.site_name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return settings.site_name.slice(0, 2).toUpperCase();
  }, [settings.site_name]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gz_admin_sidebar_collapsed");
      if (saved !== null) {
        setSidebarCollapsed(saved === "true");
      }
    } catch {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("gz_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const navItems: {
    href: string;
    label: string;
    icon: any;
    permission: Permission;
    badge?: string;
  }[] = [
    { href: "/admin", label: t("nav_dashboard"), icon: LayoutDashboard, permission: "VIEW_DASHBOARD" },
    { href: "/admin/editorial", label: t("nav_editorial"), icon: Newspaper, permission: "APPROVE_NEWS", badge: t("badge_review") },
    { href: "/admin/ai-newsroom", label: t("nav_ai_newsroom"), icon: Bot, permission: "CREATE_NEWS", badge: t("badge_ai") },
    { href: "/admin/social", label: t("nav_social"), icon: Share2, permission: "MANAGE_SOCIAL" },
    { href: "/admin/live-tv", label: t("nav_live_tv"), icon: Tv, permission: "MANAGE_LIVE_TV" },
    { href: "/admin/videos", label: t("nav_videos"), icon: Video, permission: "MANAGE_VIDEOS" },
    { href: "/admin/gallery", label: t("nav_gallery"), icon: ImageIcon, permission: "MANAGE_GALLERY" },
    { href: "/admin/ads", label: t("nav_ads"), icon: DollarSign, permission: "MANAGE_ADS", badge: t("badge_ads") },
    { href: "/admin/notifications", label: t("nav_notifications"), icon: BellRing, permission: "MANAGE_NOTIFICATIONS", badge: t("badge_push") },
    { href: "/admin/locations", label: t("nav_locations"), icon: MapPin, permission: "VIEW_DASHBOARD" },
    { href: "/admin/assignments", label: t("nav_assignments"), icon: Users, permission: "ASSIGN_STORIES" },
    { href: "/admin/citizen-reports", label: t("nav_citizen_reports"), icon: ShieldAlert, permission: "MANAGE_CITIZEN_REPORTS", badge: t("badge_new") },
    { href: "/admin/analytics", label: t("nav_analytics"), icon: BarChart3, permission: "VIEW_ANALYTICS" },
    { href: "/admin/users", label: t("nav_users"), icon: UserCheck, permission: "MANAGE_USERS", badge: t("badge_rbac") },
    { href: "/admin/audit-logs", label: t("nav_audit_logs"), icon: FileClock, permission: "VIEW_AUDIT_LOGS" },
    { href: "/admin/settings", label: t("nav_settings"), icon: Settings, permission: "MANAGE_SETTINGS" },
  ];

  const roleOptions: { role: Role; label: string; tag: string }[] = [
    { role: "SUPER_ADMIN", label: t("role_super_admin"), tag: t("tag_all_access") },
    { role: "EDITOR_IN_CHIEF", label: t("role_editor_in_chief"), tag: t("tag_publish_auth") },
    { role: "DISTRICT_EDITOR", label: t("role_district_editor"), tag: t("tag_bureau_chief") },
    { role: "REPORTER", label: t("role_reporter"), tag: t("tag_field_draft") },
    { role: "SOCIAL_MEDIA_MANAGER", label: t("role_social_media_manager"), tag: t("tag_syndication") },
    { role: "CITIZEN_CONTRIBUTOR", label: t("role_citizen_contributor"), tag: t("tag_tips_reports") },
  ];

  // Filter sidebar options strictly based on current role permissions
  const allowedNavItems = navItems.filter((item) => hasPermission(item.permission));

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Newsroom Control Header */}
      <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer border border-slate-200 dark:border-slate-700"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            type="button"
            aria-label="Toggle Sidebar"
            title={sidebarCollapsed ? t("sidebar_expand") : t("sidebar_collapse")}
            className="hidden lg:flex p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition items-center justify-center cursor-pointer shadow-xs"
          >
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5 group">
            {settings.site_logo ? (
              <img
                src={settings.site_logo}
                alt={settings.site_name || "Newsroom"}
                className="h-8 max-h-8 w-auto max-w-[120px] object-contain rounded-md shrink-0 bg-white/95 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-800 shadow-xs"
              />
            ) : (
              <span
                style={{ backgroundColor: settings.primary_color || "#E11D48" }}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-base tracking-wider shadow-md shrink-0"
              >
                {brandInitials}
              </span>
            )}
            <div className="hidden sm:block">
              <div className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                <span className="truncate max-w-[180px] lg:max-w-[260px]">
                  {settings.site_name || "GROUND ZERO"}
                </span>
                <span
                  style={{
                    borderColor: `${settings.primary_color || "#E11D48"}40`,
                    color: settings.primary_color || "#E11D48",
                  }}
                  className="text-xs px-2 py-0.5 rounded bg-rose-500/10 font-bold shrink-0"
                >
                  NEWSROOM OS
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate max-w-[240px]">
                  {settings.site_tagline || "LIVE PRODUCTION • HAR-NEWS-DESK"}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center/Right Controls: Role Switcher, Quick Actions, Language, Theme, Public Site */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI & Create Actions - role scoped */}
          {hasPermission("CREATE_NEWS") && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/admin/ai-newsroom"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 transition-colors"
              >
                <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span>{t("btn_ai_news_desk")}</span>
              </Link>
              <Link
                href="/admin/new"
                style={{ backgroundColor: settings.primary_color || "#E11D48" }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-white hover:opacity-90 transition shadow-sm"
              >
                <PlusCircle size={14} />
                <span className="hidden sm:inline">{t("btn_write_story")}</span>
              </Link>
            </div>
          )}

          {/* Interactive Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Switch RBAC Role to test permissions"
            >
              <UserCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
              <span className="hidden sm:inline font-semibold">{t("label_role")}:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentUser.role}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in-50 text-slate-800 dark:text-slate-200">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t("simulator_title")}
                </div>
                <div className="space-y-1 mt-1 max-h-72 overflow-y-auto">
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        switchRole(opt.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                        currentUser.role === opt.role
                          ? "bg-rose-600/10 dark:bg-rose-600/20 text-[#E11D48] dark:text-rose-300 font-bold border border-rose-500/40"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{opt.tag}</div>
                      </div>
                      {currentUser.role === opt.role && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher (EN | HI) */}
          <LanguageSwitcher />

          {/* Theme Toggle (Dark / Light Mode) */}
          <ThemeToggle variant="admin" />

          {/* External Link to Public Site */}
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
            title={t("btn_open_public")}
          >
            <ExternalLink size={16} />
          </Link>

          {/* Newsroom Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title={t("btn_logout")}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">{t("btn_logout")}</span>
          </button>
        </div>
      </header>

      {/* Maintenance Mode Alert Banner if active */}
      {settings.maintenance_mode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs z-30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>
              {lang === "hi"
                ? "⚠️ अलर्ट: मेंटेनेंस मोड सक्रिय है! पब्लिक वेबसाइट पर पाठकों को मेंटेनेंस संदेश दिख रहा है।"
                : "⚠️ ALERT: Maintenance Mode is ACTIVE! Public visitors are currently seeing the maintenance screen."}
            </span>
          </div>
          <Link
            href="/admin/settings"
            className="underline hover:text-white transition ml-2 font-black shrink-0"
          >
            {lang === "hi" ? "सेटिंग्स बदलें ›" : "Manage Settings ›"}
          </Link>
        </div>
      )}

      {/* Main Studio Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar with Collapse / Expand */}
        <aside
          className={`hidden lg:flex ${
            sidebarCollapsed ? "w-20" : "w-64"
          } bg-white dark:bg-slate-950/90 border-r border-slate-200 dark:border-slate-800/80 flex-col shrink-0 transition-all duration-300 ease-in-out`}
        >
          <div
            className={`p-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between ${
              sidebarCollapsed ? "text-center text-[10px]" : ""
            }`}
          >
            <span>{sidebarCollapsed ? "NAV" : t("nav_title")}</span>
            {!sidebarCollapsed && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                {allowedNavItems.length} {t("nav_active")}
              </span>
            )}
          </div>

          <nav className="flex-1 px-2.5 space-y-1 overflow-y-auto pb-6">
            {allowedNavItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  style={active ? { backgroundColor: settings.primary_color || "#E11D48" } : undefined}
                  className={`flex items-center ${
                    sidebarCollapsed ? "justify-center py-3 px-2" : "justify-between px-3 py-2.5"
                  } rounded-xl text-xs font-semibold transition-all group relative ${
                    active
                      ? "text-white shadow-md shadow-rose-900/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-2.5"} min-w-0`}>
                    <Icon
                      size={18}
                      className={`shrink-0 ${
                        active
                          ? "text-white"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>
                  {item.badge && (
                    sidebarCollapsed ? (
                      <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                        title={item.badge}
                      />
                    ) : (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-black tracking-wide shrink-0 ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-[#E11D48] dark:text-rose-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card at bottom of sidebar */}
          <div className={`p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 ${sidebarCollapsed ? "flex justify-center" : ""}`}>
            {!sidebarCollapsed ? (
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono truncate">{currentUser.district || currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition shrink-0 cursor-pointer"
                  title={t("btn_logout")}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                title={`${t("btn_logout")}: ${currentUser.name} (${currentUser.role})`}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white dark:bg-slate-950 h-full p-4 flex flex-col border-r border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2 overflow-hidden">
                  {settings.site_logo ? (
                    <img
                      src={settings.site_logo}
                      alt={settings.site_name}
                      className="h-7 w-auto max-w-[100px] object-contain rounded"
                    />
                  ) : (
                    <span
                      style={{ backgroundColor: settings.primary_color || "#E11D48" }}
                      className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-xs"
                    >
                      {brandInitials}
                    </span>
                  )}
                  <div className="font-black text-sm text-slate-900 dark:text-white truncate">
                    {settings.site_name || (lang === "hi" ? "न्यूज़रूम मेन्यू" : "NEWSROOM MENU")}
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-1 flex-1 overflow-y-auto">
                {allowedNavItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      style={active ? { backgroundColor: settings.primary_color || "#E11D48" } : undefined}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                        active
                          ? "text-white shadow-md shadow-rose-900/30"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={active ? "text-white" : "text-slate-500 dark:text-slate-400"} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-black tracking-wide shrink-0 ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-[#E11D48] dark:text-rose-400 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Drawer Logout Button */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>{t("btn_logout_newsroom")}</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 transition-colors">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 mx-auto border border-rose-200 dark:border-rose-500/20">
              <LogOut size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white text-center">
              {t("logout_modal_title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-1.5 mb-6">
              {t("logout_modal_desc")} <span className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</span> ({currentUser.role}).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                {t("btn_cancel")}
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await logout();
                }}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
              >
                {t("btn_confirm_logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
