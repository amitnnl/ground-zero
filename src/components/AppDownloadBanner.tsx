"use client";

import React, { useState, useEffect } from "react";
import { X, Smartphone, ArrowRight, Download } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface AppDownloadBannerProps {
  settings: SiteSettings;
}

export default function AppDownloadBanner({ settings }: AppDownloadBannerProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("gz_hide_app_banner");
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("gz_hide_app_banner", "true");
    } catch {}
  };

  if (dismissed || !settings.app_download_banner_enabled) return null;
  if (!settings.play_store_url && !settings.app_store_url) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white border-b border-rose-900/40 py-2.5 px-3 sm:px-4 transition-all">
      <div className="container mx-auto max-w-[1440px] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center shrink-0 font-black text-xs shadow-xs">
            GZ
          </div>
          <div className="truncate">
            <span className="font-extrabold text-white">
              {settings.site_name} Official Mobile App
            </span>
            <span className="hidden sm:inline text-slate-300 ml-2">
              — ब्रेकिंग न्यूज़ और लाइव अपडेट्स सीधे अपने मोबाइल पर पाएं
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {settings.play_store_url && (
            <a
              href={settings.play_store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download size={11} className="text-[#E11D48]" />
              <span>Google Play</span>
            </a>
          )}

          {settings.app_store_url && (
            <a
              href={settings.app_store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download size={11} className="text-[#E11D48]" />
              <span>App Store</span>
            </a>
          )}

          <button
            onClick={handleDismiss}
            aria-label="Close app banner"
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
