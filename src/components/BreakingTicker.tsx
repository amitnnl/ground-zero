"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Radio } from "lucide-react";
import { BreakingItem } from "@/lib/types";

interface BreakingTickerProps {
  initialItems?: BreakingItem[];
  maxCount?: number;
}

export default function BreakingTicker({ initialItems = [], maxCount = 5 }: BreakingTickerProps) {
  const [items, setItems] = useState<BreakingItem[]>(initialItems);

  useEffect(() => {
    if (initialItems.length === 0) {
      fetch("/api/breaking")
        .then((res) => {
          if (!res.ok) return null;
          const ct = res.headers.get("content-type") || "";
          return ct.includes("application/json") ? res.json() : null;
        })
        .then((data) => {
          if (data?.success && data?.items) {
            setItems(data.items);
          }
        })
        .catch(() => {});
    }
  }, [initialItems]);

  const limitedItems = items.slice(0, maxCount);
  if (limitedItems.length === 0) return null;

  const displayList = [...limitedItems, ...limitedItems, ...limitedItems];

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800">
      <div className="container mx-auto max-w-[1440px] px-3 sm:px-4 flex items-center h-9 sm:h-10 overflow-hidden">
        {/* Glowing Live Ticker Badge */}
        <div className="flex items-center gap-1.5 bg-[#E11D48] text-white text-[11px] font-black uppercase px-2.5 sm:px-3 py-1 rounded-full shrink-0 shadow-xs z-10">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="hidden sm:inline tracking-wider">BREAKING</span>
          <span className="sm:hidden tracking-wider">LIVE</span>
        </div>

        {/* Marquee Track */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center pl-3">
          <div className="flex items-center animate-marquee">
            {displayList.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center shrink-0">
                <Link
                  href={item.url}
                  className="px-3 sm:px-4 text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:underline whitespace-nowrap transition-colors flex items-center gap-2"
                >
                  <span className="text-[#E11D48] font-bold text-[10px] bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                    {item.category}
                  </span>
                  <span>{item.title}</span>
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60 shrink-0" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
