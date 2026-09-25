"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import MaintenanceModeOverlay from "@/components/MaintenanceModeOverlay";
import AppDownloadBanner from "@/components/AppDownloadBanner";
import { BreakingItem, SiteSettings } from "@/lib/types";
import { useSettings } from "@/lib/settingsContext";

interface SiteLayoutWrapperProps {
  children: React.ReactNode;
  breakingItems: BreakingItem[];
  settings?: SiteSettings;
}

export default function SiteLayoutWrapper({
  children,
  breakingItems,
  settings: initialSettings,
}: SiteLayoutWrapperProps) {
  const pathname = usePathname();
  const contextSettings = useSettings()?.settings;
  const settings = contextSettings || initialSettings;

  const isAdmin = pathname?.startsWith("/admin");
  const isAuth = pathname?.startsWith("/login");

  // When inside the Admin Console or Auth pages, eliminate the public Header, Ticker, Footer, and MobileBottomNav
  if (isAdmin || isAuth) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        {children}
      </div>
    );
  }

  // If maintenance mode is enabled by administrator and user is not in admin console, display maintenance overlay
  if (settings?.maintenance_mode) {
    return <MaintenanceModeOverlay settings={settings} />;
  }

  // On all public pages, keep the complete Header, Breaking Ticker, Footer, and MobileNav intact
  return (
    <>
      {settings?.app_download_banner_enabled && <AppDownloadBanner settings={settings} />}
      <Header />
      {settings?.homepage_breaking_news_enabled !== false && (
        <BreakingTicker
          initialItems={breakingItems}
          maxCount={settings?.homepage_breaking_count || 5}
        />
      )}
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
