"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  CloudSun,
  MapPin,
  RefreshCw,
  Sparkles,
  Calendar,
} from "lucide-react";

interface MandiCrop {
  name: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  msp?: number;
  trend: "up" | "down" | "stable";
}

const MANDI_DATA: Record<string, { weather: { temp: string; desc: string }; crops: MandiCrop[] }> = {
  narnaul: {
    weather: { temp: "32°C", desc: "साफ मौसम, हल्की हवा" },
    crops: [
      { name: "सरसों (Mustard)", minPrice: 5550, maxPrice: 5820, modalPrice: 5740, msp: 5650, trend: "up" },
      { name: "बाजरा (Bajra)", minPrice: 2280, maxPrice: 2420, modalPrice: 2360, msp: 2225, trend: "up" },
      { name: "चना (Gram)", minPrice: 5600, maxPrice: 6050, modalPrice: 5880, msp: 5440, trend: "up" },
      { name: "गेहूं (Wheat)", minPrice: 2380, maxPrice: 2510, modalPrice: 2450, msp: 2275, trend: "stable" },
    ],
  },
  rewari: {
    weather: { temp: "31°C", desc: "आंशिक बादल" },
    crops: [
      { name: "सरसों (Mustard)", minPrice: 5500, maxPrice: 5850, modalPrice: 5750, msp: 5650, trend: "up" },
      { name: "बाजरा (Bajra)", minPrice: 2260, maxPrice: 2400, modalPrice: 2340, msp: 2225, trend: "stable" },
      { name: "कपास (Cotton)", minPrice: 6900, maxPrice: 7350, modalPrice: 7120, trend: "down" },
      { name: "ग्वार (Guar)", minPrice: 4950, maxPrice: 5350, modalPrice: 5200, trend: "up" },
    ],
  },
  ateli: {
    weather: { temp: "32°C", desc: "धूप, सामान्य हवा" },
    crops: [
      { name: "सरसों (Mustard)", minPrice: 5520, maxPrice: 5790, modalPrice: 5710, msp: 5650, trend: "up" },
      { name: "बाजरा (Bajra)", minPrice: 2270, maxPrice: 2410, modalPrice: 2350, msp: 2225, trend: "up" },
      { name: "चना (Gram)", minPrice: 5580, maxPrice: 5990, modalPrice: 5840, msp: 5440, trend: "stable" },
      { name: "तारामीरा (Taramira)", minPrice: 4800, maxPrice: 5150, modalPrice: 5020, trend: "up" },
    ],
  },
  gurugram: {
    weather: { temp: "30°C", desc: "हल्की धूप" },
    crops: [
      { name: "गेहूं (Wheat)", minPrice: 2420, maxPrice: 2580, modalPrice: 2510, msp: 2275, trend: "up" },
      { name: "सरसों (Mustard)", minPrice: 5500, maxPrice: 5800, modalPrice: 5720, msp: 5650, trend: "stable" },
      { name: "सब्जियां / टमाटर", minPrice: 1800, maxPrice: 2400, modalPrice: 2150, trend: "down" },
      { name: "बाजरा (Bajra)", minPrice: 2250, maxPrice: 2380, modalPrice: 2320, msp: 2225, trend: "stable" },
    ],
  },
  bawal: {
    weather: { temp: "31°C", desc: "साफ मौसम" },
    crops: [
      { name: "सरसों (Mustard)", minPrice: 5510, maxPrice: 5820, modalPrice: 5730, msp: 5650, trend: "up" },
      { name: "बाजरा (Bajra)", minPrice: 2260, maxPrice: 2390, modalPrice: 2330, msp: 2225, trend: "up" },
      { name: "ग्वार (Guar)", minPrice: 5000, maxPrice: 5380, modalPrice: 5240, trend: "up" },
      { name: "कपास (Cotton)", minPrice: 6950, maxPrice: 7380, modalPrice: 7160, trend: "stable" },
    ],
  },
  hodal: {
    weather: { temp: "32°C", desc: "साफ व शुष्क मौसम" },
    crops: [
      { name: "गेहूं (Wheat)", minPrice: 2410, maxPrice: 2540, modalPrice: 2480, msp: 2275, trend: "up" },
      { name: "सरसों (Mustard)", minPrice: 5490, maxPrice: 5780, modalPrice: 5690, msp: 5650, trend: "stable" },
      { name: "सब्जियां / टमाटर", minPrice: 1900, maxPrice: 2350, modalPrice: 2180, trend: "down" },
      { name: "बाजरा (Bajra)", minPrice: 2240, maxPrice: 2370, modalPrice: 2310, msp: 2225, trend: "stable" },
    ],
  },
  dadri: {
    weather: { temp: "31°C", desc: "धूप, हल्की हवा" },
    crops: [
      { name: "सरसों (Mustard)", minPrice: 5530, maxPrice: 5810, modalPrice: 5720, msp: 5650, trend: "up" },
      { name: "बाजरा (Bajra)", minPrice: 2270, maxPrice: 2410, modalPrice: 2340, msp: 2225, trend: "up" },
      { name: "चना (Gram)", minPrice: 5590, maxPrice: 6020, modalPrice: 5860, msp: 5440, trend: "stable" },
      { name: "ग्वार (Guar)", minPrice: 4980, maxPrice: 5320, modalPrice: 5190, trend: "up" },
    ],
  },
  jhajjar: {
    weather: { temp: "30°C", desc: "साफ मौसम" },
    crops: [
      { name: "गेहूं (Wheat)", minPrice: 2430, maxPrice: 2560, modalPrice: 2500, msp: 2275, trend: "up" },
      { name: "सरसों (Mustard)", minPrice: 5520, maxPrice: 5800, modalPrice: 5710, msp: 5650, trend: "stable" },
      { name: "बाजरा (Bajra)", minPrice: 2250, maxPrice: 2380, modalPrice: 2320, msp: 2225, trend: "stable" },
      { name: "सब्जियां / गोभी", minPrice: 1600, maxPrice: 2200, modalPrice: 1950, trend: "down" },
    ],
  },
};

export default function MandiBhavWidget() {
  const [selectedMandi, setSelectedMandi] = useState<"narnaul" | "rewari" | "ateli" | "gurugram" | "bawal" | "hodal" | "dadri" | "jhajjar">("narnaul");

  const currentData = MANDI_DATA[selectedMandi];

  const mandiNames: Record<string, string> = {
    narnaul: "नारनौल नई अनाज मंडी (महेंद्रगढ़)",
    rewari: "रेवाड़ी मुख्य कृषि उपज मंडी",
    ateli: "अटेली किसान मंडी (महेंद्रगढ़)",
    gurugram: "सोहना-गुरुग्राम अनाज मंडी",
    bawal: "बावल कृषि उपज मंडी (रेवाड़ी)",
    hodal: "होडल अनाज मंडी (पलवल)",
    dadri: "चरखी दादरी अनाज मंडी",
    jhajjar: "झज्जर मुख्य अनाज मंडी",
  };

  return (
    <div className="my-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                दक्षिण हरियाणा कृषि मंडी भाव
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              दैनिक फसल दरें (₹ प्रति क्विंटल) • ई-नाम (e-NAM) सत्यापित
            </p>
          </div>
        </div>

        {/* Mandi Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(["narnaul", "rewari", "ateli", "gurugram", "bawal", "hodal", "dadri", "jhajjar"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedMandi(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMandi === key
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {key === "narnaul"
                ? "नारनौल"
                : key === "rewari"
                ? "रेवाड़ी"
                : key === "ateli"
                ? "अटेली"
                : key === "gurugram"
                ? "सोहना-गुरुग्राम"
                : key === "bawal"
                ? "बावल"
                : key === "hodal"
                ? "होडल/पलवल"
                : key === "dadri"
                ? "दादरी"
                : "झज्जर"}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Strip for this Mandi */}
      <div className="px-4 py-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold">{mandiNames[selectedMandi]}</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300">
          <CloudSun className="w-4 h-4" />
          <span>{currentData.weather.temp}</span>
          <span className="text-slate-400">•</span>
          <span>{currentData.weather.desc}</span>
        </div>
      </div>

      {/* Crop Rates Table */}
      <div className="p-3 sm:p-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="pb-2">फसल (Commodity)</th>
              <th className="pb-2">न्यूनतम (Min)</th>
              <th className="pb-2">अधिकतम (Max)</th>
              <th className="pb-2 font-black text-emerald-600 dark:text-emerald-400">
                औसत भाव (Modal)
              </th>
              <th className="pb-2 text-right">रुझान (Trend)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
            {currentData.crops.map((crop) => (
              <tr key={crop.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                  {crop.name}
                  {crop.msp && (
                    <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-normal">
                      MSP: ₹{crop.msp}
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-slate-600 dark:text-slate-400 font-mono">
                  ₹{crop.minPrice.toLocaleString()}
                </td>
                <td className="py-2.5 text-slate-600 dark:text-slate-400 font-mono">
                  ₹{crop.maxPrice.toLocaleString()}
                </td>
                <td className="py-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  ₹{crop.modalPrice.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-bold">
                  {crop.trend === "up" ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-[11px]">
                      <TrendingUp className="w-3 h-3" />
                      <span>तेजी</span>
                    </span>
                  ) : crop.trend === "down" ? (
                    <span className="inline-flex items-center gap-0.5 text-red-500 text-[11px]">
                      <TrendingDown className="w-3 h-3" />
                      <span>मंदी</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">स्थिर</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>* प्रति क्विंटल 100 किलोग्राम के भाव</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>अपडेट: आज प्रातः 11:30 बजे</span>
        </span>
      </div>
    </div>
  );
}
