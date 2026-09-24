"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import { Category } from "@/lib/types";

interface CategorySidebarProps {
  currentSlug?: string;
  categories?: Category[];
}

const SOUTH_HARYANA_CATEGORIES = [
  { name: "ताज़ा खबरें", slug: "top", href: "/" },
  { name: "महेंद्रगढ़ / नारनौल", slug: "mahendergarh", href: "/category/mahendergarh" },
  { name: "रेवाड़ी / बावल", slug: "rewari", href: "/category/rewari" },
  { name: "गुरुग्राम / मानेसर", slug: "gurugram", href: "/category/gurugram" },
  { name: "फरीदाबाद / बल्लभगढ़", slug: "faridabad", href: "/category/faridabad" },
  { name: "नूह (मेवात)", slug: "nuh", href: "/category/nuh" },
  { name: "पलवल / होडल", slug: "palwal", href: "/category/palwal" },
  { name: "झज्जर / बहादुरगढ़", slug: "jhajjar", href: "/category/jhajjar" },
  { name: "चरखी दादरी / बाढड़ा", slug: "charkhi-dadri", href: "/category/charkhi-dadri" },
  { name: "कृषि व मंडी भाव", slug: "mandi-bhav", href: "/category/mandi-bhav" },
  { name: "अहीरवाल हलचल", slug: "ahirwal", href: "/category/ahirwal" },
  { name: "साउथ हरियाणा विशेष", slug: "south-haryana", href: "/category/south-haryana" },
];

export default function CategorySidebar({
  currentSlug = "top",
  categories = [],
}: CategorySidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block sticky top-24 space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Compass size={14} className="text-[#E11D48]" />
            <span>साउथ हरियाणा कवरेज</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">हब</span>
        </div>

        <nav className="flex flex-col gap-0.5 pt-2">
          {SOUTH_HARYANA_CATEGORIES.map((cat) => {
            const isActive =
              (cat.slug === "top" && pathname === "/") ||
              pathname === cat.href ||
              currentSlug === cat.slug;

            const countObj = categories.find((c) => c.slug === cat.slug);

            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center justify-between group ${
                  isActive
                    ? "bg-[#E11D48] text-white shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? "bg-white" : "bg-slate-300 dark:bg-slate-600 group-hover:bg-[#E11D48]"
                    }`}
                  />
                  <span>{cat.name}</span>
                </div>

                {countObj?.count !== undefined && countObj.count > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {countObj.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
