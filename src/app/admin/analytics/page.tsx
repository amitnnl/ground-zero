"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Share2,
  Tv,
  Bot,
  MapPin,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import PermissionGuard from "@/components/PermissionGuard";

export default function AnalyticsIntelligencePage() {
  const { lang, b } = useLanguage();
  const [selectedReport, setSelectedReport] = useState("daily");

  const reports = {
    daily: {
      title: b("Daily Newsroom Performance Report", "दैनिक न्यूज़रूम परफॉर्मेंस रिपोर्ट (Daily Intelligence)"),
      summary: b(
        "Today, highest readership across South Haryana was recorded on Mahendergarh, Rewari, and Gurugram bureau stories. Mustard and Bajra mandi rates and rural health coverage generated the strongest audience engagement.",
        "आज साउथ हरियाणा क्षेत्र से सबसे अधिक पाठक महेंद्रगढ़, रेवाड़ी एवं गुरुग्राम ब्यूरो की खबरों पर दर्ज किए गए। सरसों-बाजरा मंडी भाव और स्वास्थ्य स्टोरी पर सर्वाधिक एंगेजमेंट रही।"
      ),
      topStories: [
        { title: b("Rewari News | Grand Welcome for Arti Rao in Budhpur", "Rewari News | बूढ़पुर में आरती राव का स्वागत : लगे भावी CM के नारे"), views: 6840, growth: "+52%" },
        { title: b("Mahendergarh News | Multi-speciality Hospital & Trauma Center approved in Narnaul", "महेंद्रगढ़ | नारनौल में 200 बेड के आधुनिक अस्पताल को मंजूरी"), views: 5420, growth: "+38%" },
        { title: b("Gurugram-Manesar Express Metro corridor project survey completed", "गुरुग्राम-मानेसर एक्सप्रेस मेट्रो रूट के डीपीआर को अंतिम रूप"), views: 4210, growth: "+29%" },
      ],
      aiSuggestions: [
        b("Assign a field reporter to cover farmer queues at Mahendergarh millet procurement centers.", "महेंद्रगढ़ जिले में बाजरा खरीद केंद्रों पर किसानों की कतारों को लेकर फील्ड रिपोर्टर को असाइनमेंट भेजें।"),
        b("Citizen complaints regarding traffic congestion in Rewari city are surging; schedule a ground investigation.", "रेवाड़ी शहर में जाम की समस्या पर नागरिक सुझाव बढ़ रहे हैं, इस पर विशेष ग्राउंड रिपोर्ट तैयार करें।"),
        b("Social video reels are generating 2.4x higher reach compared to static image posts.", "सोशल मीडिया पर वीडियो रील्स की पहुंच सामान्य पोस्ट से 2.4 गुना अधिक रही है।"),
      ],
    },
    weekly: {
      title: b("Weekly Trends & Beat Analysis", "साप्ताहिक रुझान एवं बीट विश्लेषण (Weekly Review)"),
      summary: b(
        "Over the past 7 days, 48,200 unique readers engaged on the Ground Zero portal. Agriculture, civic infrastructure, and local politics remained top topics of interest.",
        "पिछले 7 दिनों में कुल 48,200 पाठक डिजिटल पोर्टल पर सक्रिय रहे। कृषि और स्थानीय राजनीति शीर्ष रुचि वाले विषय रहे।"
      ),
      topStories: [
        { title: b("Jhajjar News | Bahadurgarh Industrial Corridor Expansion Project", "Jhajjar News | बहादुरगढ़ औद्योगिक कॉरिडोर के विस्तार को मिली हरी झंडी"), views: 3890, growth: "+21%" },
        { title: b("South Haryana News | e-NAM Mustard Procurement Reaches Record High", "South Haryana News | नारनौल-रेवाड़ी मंडियों में सरसों खरीद ने बनाया नया रिकॉर्ड"), views: 6420, growth: "+15%" },
      ],
      aiSuggestions: [
        b("Increase reporter deployment and bureau ground coverage across Nuh and Palwal districts.", "नूह और पलवल ज़िलों में रिपोर्टर कवरेज बढ़ाने की आवश्यकता है।"),
        b("Live TV prime time debate on Ahirwal political developments is projected to boost viewership by 40%.", "लाइव टीवी प्राइम डिबेट में अहीरवाल की राजनीति पर चर्चा से दर्शक संख्या में 40% की वृद्धि संभव है।"),
      ],
    },
  };

  const current = selectedReport === "daily" ? reports.daily : reports.weekly;

  return (
    <PermissionGuard permission="VIEW_ANALYTICS">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="text-indigo-500" />
            {b("Newsroom Analytics & AI Intelligence", "न्यूज़रूम एनालिटिक्स व AI इंटेलिजेंस (Newsroom Intelligence)")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {b(
              "Readership behavior, regional trends, social syndication performance, and editorial AI recommendations",
              "पाठक व्यवहार, क्षेत्रीय ट्रेंड्स, सोशल परफॉर्मेंस व AI संपादकीय अनुशंसाएं"
            )}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
          <button
            onClick={() => setSelectedReport("daily")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedReport === "daily" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {b("Daily Intelligence", "दैनिक रिपोर्ट")}
          </button>
          <button
            onClick={() => setSelectedReport("weekly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedReport === "weekly" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {b("Weekly Review", "साप्ताहिक रिपोर्ट")}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            {b("Total Pageviews (24h)", "कुल पेजव्यूज (24h)")}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">48,910</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> {b("+14.2% above average", "+14.2% औसत से अधिक")}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            {b("Active Sessions", "सक्रिय सत्र (Sessions)")}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">18,450</div>
          <div className="text-[11px] text-slate-500 mt-1">{b("Avg. Time: 3m 42s", "औसत समय: 3m 42s")}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            {b("Social Shares", "सोशल रेफरल (Shares)")}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">6,240</div>
          <div className="text-[11px] text-slate-500 mt-1">{b("WhatsApp & FB Leaders", "WhatsApp व FB प्रमुख")}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
            {b("Live TV Peak Viewers", "लाइव टीवी दर्शक (Peak)")}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 font-mono">14,280</div>
          <div className="text-[11px] text-slate-500 mt-1">{b("Prime Time Bulletin", "प्राइम टाइम बुलेटिन")}</div>
        </div>
      </div>

      {/* AI News Intelligence Agent Report Card */}
      <div className="bg-gradient-to-r from-indigo-50/60 dark:from-indigo-950/40 via-white dark:via-slate-950 to-slate-50 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-200 dark:border-indigo-900/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40">
              <Bot size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{current.title}</h2>
              <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-mono">AI NEWSROOM INTELLIGENCE BRIEFING</div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            AUTO GENERATED
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-white/80 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          {current.summary}
        </p>

        {/* AI Editorial Recommendations */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} />
            {b("AI Editorial Recommendations:", "संपादकीय निर्णय हेतु AI अनुशंसाएं (Editorial Recommendations):")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {current.aiSuggestions.map((sug, i) => (
              <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 shadow-2xs">
                <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase">
                  {b("Recommendation", "सिफारिश")} #{i + 1}
                </div>
                <div>{sug}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Stories */}
      <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {b("Top Performing Stories", "सर्वाधिक पढ़े जाने वाले समाचार (Top Performing Stories)")}
        </h3>

        <div className="space-y-2.5">
          {current.topStories.map((story, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-base text-slate-400 dark:text-slate-500 w-5 text-center">
                  #{i + 1}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{story.title}</span>
              </div>
              <div className="flex items-center gap-3 font-mono shrink-0">
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {story.views.toLocaleString(lang === "hi" ? "hi-IN" : "en-US")} {b("views", "व्यूज")}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{story.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </PermissionGuard>
  );
}
