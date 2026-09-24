"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { BreakingItem } from "@/lib/types";

interface SiteLayoutWrapperProps {
  children: React.ReactNode;
  breakingItems: BreakingItem[];
}

export default function SiteLayoutWrapper({
  children,
  breakingItems,
}: SiteLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // When inside the Admin Console, eliminate the public Header, Ticker, Footer, and MobileBottomNav
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        {children}
      </div>
    );
  }

  // On all public pages, keep the complete Header (Preheader + Navbar), Breaking Ticker, Footer, and MobileNav intact.
  return (
    <>
      <Header />
      <BreakingTicker initialItems={breakingItems} />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
