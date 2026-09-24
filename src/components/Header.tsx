"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  User,
  Search,
  X,
  TrendingUp,
  Calendar,
  CloudSun,
  ShieldAlert,
  LogIn,
  LogOut,
  MapPin,
  ChevronDown,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/authContext";

interface HeaderProps {
  currentCategory?: string;
}

export default function Header({ currentCategory = "top" }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  // Core news verticals - NO city names directly crowding the navbar
  const mainNavLinks = [
    { name: "ताज़ा", slug: "top", href: "/" },
    { name: "अहीरवाल", slug: "ahirwal", href: "/category/ahirwal" },
    { name: "कृषि व मंडी भाव", slug: "mandi-bhav", href: "/category/mandi-bhav" },
    { name: "वीडियो", slug: "videos", href: "/videos" },
    { name: "ई-पेपर", slug: "epaper", href: "/e-paper" },
    { name: "लाइव TV", slug: "livetv", href: "/live-tv", isLive: true },
  ];

  // South Haryana Districts - cleanly organized into a 1-click dropdown
  const southHaryanaDistricts = [
    { name: "महेंद्रगढ़ / नारनौल", slug: "mahendergarh" },
    { name: "रेवाड़ी / बावल", slug: "rewari" },
    { name: "गुरुग्राम / मानेसर", slug: "gurugram" },
    { name: "फरीदाबाद / बल्लभगढ़", slug: "faridabad" },
    { name: "नूह (मेवात)", slug: "nuh" },
    { name: "पलवल / होडल", slug: "palwal" },
    { name: "झज्जर / बहादुरगढ़", slug: "jhajjar" },
    { name: "चरखी दादरी / बाढड़ा", slug: "charkhi-dadri" },
  ];

  const isDistrictActive = southHaryanaDistricts.some(
    (d) => pathname === `/category/${d.slug}` || currentCategory === d.slug
  );

  const trendingTags = [
    "रेवाड़ी बाईपास",
    "आरती राव",
    "नारनौल मेडिकल",
    "मानेसर उद्योग",
    "सरसों मंडी भाव",
    "अहीरवाल",
    "बहादुरगढ़",
    "मेवात विकास",
  ];

  const todayStr = new Date().toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Close district dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target as Node)
      ) {
        setDistrictDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* 1. Top Editorial Micro-Bar */}
      <div className="hidden md:block bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="container mx-auto max-w-[1440px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar size={12} className="text-[#E11D48]" />
              <span>{todayStr}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <CloudSun size={13} className="text-amber-400" />
              <span>साउथ हरियाणा: नारनौल 32°C • रेवाड़ी 31°C • गुरुग्राम 30°C • फरीदाबाद 31°C • नूह 31°C • झज्जर 30°C • दादरी 31°C</span>
            </span>
          </div>

          {/* Trending Topic Chips & Social Links */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                <TrendingUp size={11} />
                <span>ट्रेंडिंग:</span>
              </span>
              <div className="flex items-center gap-1">
                {trendingTags.slice(0, 5).map((tag) => (
                  <Link
                    key={tag}
                    href={`/?q=${encodeURIComponent(tag)}`}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded text-[10px] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 border-l border-slate-800 pl-2.5">
              <a
                href="https://youtube.com/@ground_zero_news"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-5 h-5 rounded-full bg-red-950 text-red-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M 23.498 6.186 a 3.016 3.016 0 0 0 -2.122 -2.136 C 19.505 3.545 12 3.545 12 3.545 s -7.505 0 -9.377 0.505 A 3.017 3.017 0 0 0 0.502 6.186 C 0 8.07 0 12 0 12 s 0 3.93 0.502 5.814 a 3.016 3.016 0 0 0 2.122 2.136 c 1.871 0.505 9.376 0.505 9.376 0.505 s 7.505 0 9.377 -0.505 a 3.015 3.015 0 0 0 2.122 -2.136 C 24 15.93 24 12 24 12 s 0 -3.93 -0.502 -5.814 z M 9.545 15.568 V 8.432 L 15.818 12 l -6.273 3.568 z" />
                </svg>
              </a>
              <a
                href="https://whatsapp.com/channel/0029Va9rPwL2ER6m7p2w2504"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Channel"
                className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 448 512">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Executive Header Bar */}
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3 max-w-[1440px] flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white flex items-center justify-center font-black text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
            GZ
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg sm:text-2xl text-slate-900 dark:text-white tracking-tight leading-none transition-colors">
                GROUND ZERO
              </span>
              <span className="bg-[#E11D48] text-white text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded tracking-wider shadow-xs">
                NEWS
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              दक्षिण हरियाणा का #1 न्यूज़ नेटवर्क
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation - Clean, focused, NO horizontal city names */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/90 p-1 rounded-full border border-slate-200/80 dark:border-slate-800 transition-colors">
          {mainNavLinks.map((item) => {
            const isActive =
              (item.slug === "top" && pathname === "/") ||
              pathname === item.href ||
              currentCategory === item.slug;

            return (
              <Link
                key={item.slug}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#E11D48] text-white shadow-xs"
                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                )}
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* South Haryana Districts 1-Click Dropdown */}
          <div className="relative" ref={districtDropdownRef}>
            <button
              onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                isDistrictActive || districtDropdownOpen
                  ? "bg-rose-100 text-[#E11D48] dark:bg-rose-950/60 dark:text-rose-300"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
              }`}
              title="साउथ हरियाणा के सभी 8 ज़िले"
            >
              <MapPin size={12} className={isDistrictActive ? "text-[#E11D48]" : "text-slate-500 dark:text-slate-400"} />
              <span>ज़िलेवार</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  districtDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {districtDropdownOpen && (
              <div className="absolute top-full left-0 mt-2.5 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>साउथ हरियाणा ज़िला कवरेज</span>
                  <span className="text-[#E11D48] font-bold">8 ज़िले</span>
                </div>
                <div className="grid grid-cols-2 gap-1 pt-1.5">
                  {southHaryanaDistricts.map((dist) => (
                    <Link
                      key={dist.slug}
                      href={`/category/${dist.slug}`}
                      onClick={() => setDistrictDropdownOpen(false)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-[#E11D48] dark:hover:text-rose-400 transition-colors flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="truncate">{dist.name.split("/")[0]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Icons & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Citizen Reporter Send News */}
          <Link
            href="/send-news"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60 text-xs font-bold transition-all"
            title="नागरिक पत्रकारिता - अपनी खबर भेजें"
          >
            <ShieldAlert size={13} className="text-amber-600 dark:text-amber-400" />
            <span className="text-[11px]">खबर भेजें</span>
          </Link>

          {/* Search Trigger with Ctrl+K shortcut badge */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors text-xs font-medium cursor-pointer border border-slate-200/80 dark:border-slate-700 shadow-2xs"
            title="खोजें (Ctrl + K)"
          >
            <Search size={14} className="text-slate-500 dark:text-slate-400" />
            <span className="hidden md:inline text-[11px] text-slate-500 dark:text-slate-400">खोजें...</span>
            <kbd className="hidden xl:inline text-[9px] bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 font-mono px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Breaking Alerts Notification Bell */}
          <NotificationBell />

          {/* Dark / Light Theme Toggle */}
          <ThemeToggle variant="public" />

          {/* Staff Login / Active Newsroom Session */}
          {isAuthenticated && currentUser.role !== "VIEWER" ? (
            <div className="flex items-center gap-1">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[#E11D48] dark:text-rose-400 hover:bg-[#E11D48] hover:text-white border border-rose-200/80 dark:border-rose-900/60 transition-all font-bold text-xs shadow-2xs"
                title={`${currentUser.name} (${currentUser.role}) — न्यूज़रूम खोलें`}
              >
                <User size={13} />
                <span className="hidden sm:inline text-[11px] truncate max-w-[90px]">{currentUser.name.split(" ")[0]}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-rose-200 dark:bg-rose-900/80 text-rose-800 dark:text-rose-200 rounded font-mono hidden md:inline">
                  {currentUser.role}
                </span>
              </Link>
              <button
                onClick={async () => await logout()}
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                title="लॉगआउट करें (Logout)"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 transition-all font-bold text-xs shadow-2xs cursor-pointer"
              title="न्यूज़रूम स्टाफ लॉगिन"
            >
              <LogIn size={13} className="text-[#E11D48]" />
              <span className="hidden sm:inline text-[11px]">लॉगिन</span>
            </Link>
          )}
        </div>
      </div>

      {/* 3. Expandable Search Box with Backdrop */}
      {searchOpen && (
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 px-4 animate-in slide-in-from-top-2 duration-200 transition-colors">
          <form onSubmit={handleSearch} className="container mx-auto max-w-xl flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="साउथ हरियाणा की खबरें खोजें (उदा. रेवाड़ी, नारनौल, गुरुग्राम, आरती राव, मंडी भाव...)"
              className="flex-1 px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#E11D48] text-slate-900 dark:text-white shadow-xs transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              खोजें
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* 4. Mobile Category Horizontal Bar - Clean & crisp, without bulky city strings */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 px-3 py-2 bg-white dark:bg-slate-950 transition-colors">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {mainNavLinks.map((item) => {
            const isActive =
              (item.slug === "top" && pathname === "/") ||
              pathname === item.href ||
              currentCategory === item.slug;
            return (
              <Link
                key={item.slug}
                href={item.href}
                className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  isActive
                    ? "bg-[#E11D48] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                )}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
