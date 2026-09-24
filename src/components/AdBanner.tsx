"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Info } from "lucide-react";
import { AdCampaign } from "@/lib/types";

interface AdBannerProps {
  placement: AdCampaign["placement"];
  district?: string;
  className?: string;
  fallbackText?: string;
}

export default function AdBanner({
  placement,
  district,
  className = "",
  fallbackText,
}: AdBannerProps) {
  const [ad, setAd] = useState<AdCampaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAd() {
      try {
        const query = new URLSearchParams({
          placement,
          ...(district ? { district } : {}),
        });
        const res = await fetch(`/api/ads?${query.toString()}`);
        if (!res.ok) return;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return;
        const data = await res.json();
        if (isMounted && data?.success && data?.ads && data?.ads.length > 0) {
          // Pick randomly among matched active ads for rotation
          const picked = data.ads[Math.floor(Math.random() * data.ads.length)];
          setAd(picked);

          // Track impression
          fetch("/api/ads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "track_impression", adId: picked.id }),
          }).catch(() => {});
        }
      } catch {
        // silent fail
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAd();
    return () => {
      isMounted = false;
    };
  }, [placement, district]);

  const handleAdClick = () => {
    if (!ad) return;
    fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "track_click", adId: ad.id }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center p-4 text-xs text-slate-400 ${className}`}>
        विज्ञापन लोड हो रहा है...
      </div>
    );
  }

  if (!ad) {
    if (!fallbackText) return null;
    return (
      <div className={`border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400 ${className}`}>
        <p className="font-semibold text-slate-500 dark:text-slate-400">विज्ञापन स्थान (Ad Space Available)</p>
        <p className="mt-1">ग्राउंड ज़ीरो नेटवर्क पर लाखों पाठकों तक अपना ब्रांड पहुंचाएं: ads@groundzero.media</p>
      </div>
    );
  }

  // Style variations based on placement
  if (placement === "header_leaderboard") {
    return (
      <div className={`w-full my-4 bg-slate-900/5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${className}`}>
        <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            प्रायोजित विज्ञापन (SPONSORED)
          </span>
          <span className="text-[10px] text-slate-400">{ad.advertiserName}</span>
        </div>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleAdClick}
          className="group block relative w-full h-24 sm:h-28 md:h-32 overflow-hidden bg-slate-950"
        >
          <Image
            src={ad.imageUrl}
            alt={ad.campaignTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-4 sm:p-6">
            <div className="max-w-xl text-white">
              <span className="inline-block px-2 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded uppercase tracking-wider mb-1">
                Featured Partner
              </span>
              <h4 className="text-sm sm:text-base md:text-lg font-bold line-clamp-1 group-hover:text-amber-300 transition-colors">
                {ad.campaignTitle}
              </h4>
              <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                {ad.advertiserName} — अभी जाने
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-semibold group-hover:bg-white group-hover:text-slate-950 transition-all">
              <span>विस्तार देखें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </a>
      </div>
    );
  }

  if (placement === "sidebar_sticky") {
    return (
      <div className={`w-full bg-slate-900/5 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all ${className}`}>
        <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            विज्ञापन
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{ad.advertiserName}</span>
        </div>
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleAdClick}
          className="group block relative w-full h-64 overflow-hidden bg-slate-950"
        >
          <Image
            src={ad.imageUrl}
            alt={ad.campaignTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
              {ad.advertiserName}
            </span>
            <h4 className="text-sm font-bold line-clamp-2 mt-1 group-hover:text-amber-300 transition-colors">
              {ad.campaignTitle}
            </h4>
            <div className="mt-3 flex items-center justify-center gap-1 w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md group-hover:brightness-110 transition-all">
              <span>अभी क्लिक करें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </a>
      </div>
    );
  }

  // in_article or footer_banner
  return (
    <div className={`w-full my-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          प्रायोजित संदेश (SPONSORED STORY)
        </span>
        <span className="text-[10px] text-slate-400">{ad.advertiserName}</span>
      </div>
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleAdClick}
        className="group flex flex-col sm:flex-row items-center gap-4 p-4 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
      >
        <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-950">
          <Image
            src={ad.imageUrl}
            alt={ad.campaignTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {ad.advertiserName}
          </span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {ad.campaignTitle}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            अधिक जानकारी एवं विशेष ऑफर के लिए यहां क्लिक करें
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 group-hover:underline">
            <span>ऑफर देखें</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </a>
    </div>
  );
}
