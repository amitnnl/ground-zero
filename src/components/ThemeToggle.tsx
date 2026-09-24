"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/themeContext";

interface ThemeToggleProps {
  variant?: "public" | "admin";
  className?: string;
}

export default function ThemeToggle({ variant = "public", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = mounted ? theme === "dark" : false;

  if (variant === "admin") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle dark/light theme"
        title={
          mounted
            ? isDark
              ? "लाइट मोड पर स्विच करें (Switch to Light Mode)"
              : "डार्क मोड पर स्विच करें (Switch to Dark Mode)"
            : "थीम बदलें (Toggle Theme)"
        }
        className={`relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center justify-center cursor-pointer shadow-2xs ${className}`}
      >
        {mounted && isDark ? (
          <Sun size={15} className="text-amber-400 transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon size={15} className="text-slate-700 dark:text-slate-200 transition-transform duration-200 hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle dark/light theme"
      title={isDark ? "लाइट मोड (Light Mode)" : "डार्क मोड (Dark Mode)"}
      className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-all flex items-center justify-center cursor-pointer shadow-2xs ${className}`}
    >
      {isDark ? (
        <Sun size={15} className="text-amber-500 dark:text-amber-400 animate-in spin-in-180 duration-200" />
      ) : (
        <Moon size={15} className="text-slate-700 dark:text-slate-300 animate-in spin-in-180 duration-200" />
      )}
    </button>
  );
}
