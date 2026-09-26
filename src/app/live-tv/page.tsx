import React from "react";
import Link from "next/link";
import { Tv, Radio, Flame, Eye, Calendar, Clock, Share2, ArrowLeft } from "lucide-react";
import { getLiveStream, getArticles } from "@/lib/db";
import { formatLiveStreamEmbedUrl } from "@/lib/videoUtils";

export const metadata = {
  title: "Live TV 24x7 - Ground Zero News (ग्राउंड ज़ीरो लाइव टीवी)",
  description:
    "ग्राउंड ज़ीरो न्यूज़ 24x7 लाइव प्रसारण देखें। हरियाणा, देश और दुनिया की ताज़ा खबरें और प्राइम टाइम बुलेटिन लाइव।",
};

export default async function PublicLiveTVPage() {
  const stream = await getLiveStream();
  const breakingArticles = await getArticles({ isBreaking: true });

  const scheduleList = [
    { time: "07:00 AM", title: "मॉर्निंग हरियाणा बुलेटिन (सुबह की सुर्खियां)", host: "विकास पुनिया" },
    { time: "12:00 PM", title: "साउथ हरियाणा स्पेशल: नारनौल-रेवाड़ी लाइव", host: "सतीश यादव" },
    { time: "05:00 PM", title: "किसान चौपाल: मंडी भाव एवं कृषि चर्चा", host: "सुरेश शर्मा" },
    { time: "08:00 PM", title: "प्राइम डिबेट: अहीरवाल की सियासत व जनता का मूड", host: "अमित कुमार" },
    { time: "10:00 PM", title: "दिनभर की बड़ी खबरें (Night Wrap)", host: "न्यूज़ डेस्क" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb & Live Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
              <ArrowLeft size={14} /> मुख्य पृष्ठ (Home)
            </Link>
            <span>/</span>
            <span className="text-red-600 dark:text-red-400 font-bold">Live TV 24x7</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-red-500/10 dark:bg-red-600/30 text-red-600 dark:text-red-400 border border-red-500/30 dark:border-red-500/50">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              ON AIR 24x7
            </span>
          </div>
        </div>

        {/* Main Broadcast Player Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Video Stream Player (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black border border-slate-300 dark:border-slate-800 shadow-2xl relative flex items-center justify-center">
              {stream.streamUrl ? (
                <iframe
                  src={formatLiveStreamEmbedUrl(stream.streamUrl)}
                  title={stream.channelName}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full border-0"
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 gap-3 p-6 text-center">
                  <Tv size={48} className="opacity-40 text-red-500 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-300">
                    लाइव प्रसारण वर्तमान में ऑफ़लाइन है (Broadcast Offline)
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Screen Breaking News Crawl */}
            <div className="bg-red-700 text-white rounded-xl p-2.5 flex items-center gap-3 overflow-hidden shadow-md">
              <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-black/40 tracking-wider shrink-0 flex items-center gap-1">
                <Flame size={13} className="text-amber-300 animate-pulse" />
                लाइव क्रॉल
              </span>
              <div className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                {stream.crawlTickerText}
              </div>
            </div>

            {/* Current Program Details Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div>
                <div className="text-[11px] font-black uppercase text-red-600 dark:text-red-400 tracking-wider">
                  वर्तमान में ऑन-एयर (Now Playing)
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {stream.currentProgram}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  प्रस्तोता: <span className="text-slate-700 dark:text-slate-200 font-semibold">{stream.currentHost}</span> • चैनल:{" "}
                  <span className="text-slate-900 dark:text-white font-semibold">{stream.channelName}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {stream.viewerCount?.toLocaleString("hi-IN") || "14,280"}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">लाइव दर्शक</div>
                </div>
              </div>
            </div>
          </div>

          {/* Electronic Program Guide / EPG Schedule (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={16} className="text-red-600 dark:text-red-400" />
                दैनिक प्रसारण समय-सारणी (EPG Schedule)
              </h2>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">आज का शेड्यूल</span>
            </div>

            <div className="space-y-3">
              {scheduleList.map((prog, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition ${
                    idx === 3
                      ? "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800/80 ring-1 ring-red-500/30"
                      : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold font-mono text-red-600 dark:text-red-400 flex items-center gap-1">
                      <Clock size={11} />
                      {prog.time}
                    </span>
                    {idx === 3 && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{prog.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">होस्ट: {prog.host}</div>
                </div>
              ))}
            </div>

            {/* Quick Public Link to Citizen News */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/send-news"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <span>अपने क्षेत्र की खबर हमें भेजें →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
