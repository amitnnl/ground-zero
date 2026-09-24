"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  Layers,
  ChevronRight,
  Building,
  Home,
  Compass,
  PlusCircle,
  Newspaper,
} from "lucide-react";
import { LocationNode } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";

export default function LocationsAdminPage() {
  const { b } = useLanguage();
  const [locations, setLocations] = useState<LocationNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => {
        if (!res.ok) return null;
        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? res.json() : null;
      })
      .then((data) => {
        if (data?.success) {
          setLocations(data.locations);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const state = locations.find((l) => l.type === "state");
  const districts = locations.filter((l) => l.type === "district");
  const subLocations = locations.filter((l) => l.type === "city" || l.type === "tehsil");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <MapPin className="text-rose-500" />
            {b("7-Tier Hierarchical Location Engine", "7-स्तरीय लोकेशन इंजन (Hierarchical Location Engine)")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {b(
              "Country → State (Haryana) → Districts (Mahendragarh, Rewari, Gurugram, Jhajjar...) → Tehsils & Cities (Narnaul, Bawal, Manesar...)",
              "देश → राज्य (हरियाणा) → ज़िला (महेंद्रगढ़, रेवाड़ी, गुरुग्राम, झज्जर...) → तहसील व नगर (नारनौल, बावल, मानेसर...)"
            )}
          </p>
        </div>
      </div>

      {/* Visual Hierarchy Cards */}
      <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-6">
        {/* State Root */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-slate-100 dark:from-rose-950/40 dark:to-slate-900 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#E11D48] text-white shadow-xs">
              <Compass size={22} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                {b("State HQ Level", "राज्य स्तर (State HQ)")}
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {state?.nameHi || "हरियाणा"} ({state?.name || "Haryana"})
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {b(
                  "South Haryana dedicated regional digital news network coverage",
                  "साउथ हरियाणा विशेष डिजिटल नेटवर्क कवरेज"
                )}
              </div>
            </div>
          </div>
          <Link
            href="/location/haryana"
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs"
          >
            <span>{b("View Live Page", "लाइव पेज देखें")}</span>
            <ExternalLink size={13} />
          </Link>
        </div>

        {/* Districts Grid */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Building size={14} className="text-rose-500 dark:text-rose-400" />
            {b("Active Districts", "सक्रिय ज़िले (Active Districts)")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districts.map((district) => {
              const children = subLocations.filter(
                (sub) => sub.district?.toLowerCase() === district.name.toLowerCase()
              );

              return (
                <div
                  key={district.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                        {b("District", "ज़िला (District)")}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                        <Newspaper size={12} />
                        {district.newsCount || 15} {b("Stories", "समाचार")}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {district.nameHi} ({district.name})
                    </h3>

                    {/* Sub-locations (Tehsils & Cities) */}
                    {children.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          {b("Tehsils & Sub-towns:", "तहसील व उप-नगर:")}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {children.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/location/${sub.slug}`}
                              target="_blank"
                              className="text-[11px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1"
                            >
                              <span>{sub.nameHi}</span>
                              <ChevronRight size={10} className="text-slate-400 dark:text-slate-500" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {b("Slug:", "स्लग:")} /{district.slug}
                    </span>
                    <Link
                      href={`/location/${district.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1"
                    >
                      {b("Portal Page", "पोर्टल पेज")} <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
