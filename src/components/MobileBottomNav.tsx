"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, User, PlaySquare } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Videos", href: "/videos", icon: PlaySquare },
    { label: "E-Paper", href: "/e-paper", icon: Newspaper },
    { label: "Admin", href: "/admin", icon: User },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.5)] transition-colors"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors ${
              isActive ? "text-[#d90000]" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Icon
              size={20}
              className={`transition-transform duration-200 ${
                isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
              }`}
            />
            <span className={isActive ? "font-bold text-[#d90000]" : ""}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
