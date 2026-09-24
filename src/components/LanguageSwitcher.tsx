"use client";

import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { lang, setLang, toggleLang, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 text-xs ${className}`}
      title={lang === "en" ? "Switch to Hindi (हिंदी में बदलें)" : "Switch to English (अंग्रेजी में बदलें)"}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
          lang === "en"
            ? "bg-white dark:bg-slate-900 text-[#E11D48] dark:text-rose-400 shadow-xs"
            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
        aria-label="Switch language to English"
      >
        <span className="text-[11px] tracking-wide">EN</span>
      </button>

      <span className="text-slate-300 dark:text-slate-600 text-[10px] select-none">|</span>

      <button
        type="button"
        onClick={() => setLang("hi")}
        className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
          lang === "hi"
            ? "bg-white dark:bg-slate-900 text-[#E11D48] dark:text-rose-400 shadow-xs"
            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        }`}
        aria-label="भाषा हिंदी में बदलें"
      >
        <span className="text-[11px] tracking-wide">हिं</span>
      </button>
    </div>
  );
}
