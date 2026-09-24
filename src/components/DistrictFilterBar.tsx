"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, Sparkles } from "lucide-react";

const DISTRICT_CHIPS = [
  { label: "सभी साउथ हरियाणा", query: "" },
  { label: "महेंद्रगढ़", query: "महेंद्रगढ़" },
  { label: "नारनौल", query: "नारनौल" },
  { label: "रेवाड़ी", query: "रेवाड़ी" },
  { label: "बावल", query: "बावल" },
  { label: "गुरुग्राम", query: "गुरुग्राम" },
  { label: "मानेसर", query: "मानेसर" },
  { label: "फरीदाबाद", query: "फरीदाबाद" },
  { label: "बल्लभगढ़", query: "बल्लभगढ़" },
  { label: "नूह (मेवात)", query: "नूह" },
  { label: "तावडू", query: "तावडू" },
  { label: "पलवल", query: "पलवल" },
  { label: "होडल", query: "होडल" },
  { label: "झज्जर", query: "झज्जर" },
  { label: "बहादुरगढ़", query: "बहादुरगढ़" },
  { label: "चरखी दादरी", query: "दादरी" },
];

export default function DistrictFilterBar() {
  const searchParams = useSearchParams();
  const currentQ = searchParams?.get("q") || "";

  return (
    <div className="mb-6 bg-white dark:bg-slate-900/90 rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="flex items-center gap-2 mb-2 px-1">
        <MapPin size={13} className="text-[#E11D48] shrink-0" />
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          साउथ हरियाणा ज़िला व नगर फ़िल्टर:
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
          (1-क्लिक हाइपरलोकल कवरेज)
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {DISTRICT_CHIPS.map((chip) => {
          const isActive =
            (!chip.query && !currentQ) ||
            (chip.query && currentQ.toLowerCase().includes(chip.query.toLowerCase()));

          const href = chip.query ? `/?q=${encodeURIComponent(chip.query)}` : "/";

          return (
            <Link
              key={chip.label}
              href={href}
              className={`shrink-0 whitespace-nowrap text-[11px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-[#E11D48] text-white shadow-xs scale-102"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
