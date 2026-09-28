"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tv,
  ExternalLink,
  Play,
  Save,
  CheckCircle2,
  Eye,
  Settings,
  RefreshCw,
} from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";
import { formatLiveStreamEmbedUrl } from "@/lib/videoUtils";

export default function AdminLiveTVPage() {
  const { b, lang } = useLanguage();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);

  // Instant default state - renders immediately with zero loading spinner or freeze
  const [channelName, setChannelName] = useState("Ground Zero Live 24x7");
  const [isLive, setIsLive] = useState(true);
  const [streamUrl, setStreamUrl] = useState("https://www.youtube.com/watch?v=live_stream");
  const [currentProgram, setCurrentProgram] = useState("ग्राउंड ज़ीरो प्राइम टाइम (Ground Zero Prime Time)");
  const [currentHost, setCurrentHost] = useState("अमित कुमार (प्रधान संपादक)");
  const [upcomingProgram, setUpcomingProgram] = useState("रात 9 बजे विशेष डिबेट: हरियाणा का रण");
  const [crawlTickerText, setCrawlTickerText] = useState("BREAKING NEWS: दक्षिण हरियाणा की सभी 10 सीटों पर चुनाव प्रचार तेज • ग्राउंड ज़ीरो न्यूज़ 24x7 लाइव");
  const [viewerCount, setViewerCount] = useState(14280);

  // Silently sync latest data in background without blocking rendering
  useEffect(() => {
    fetch("/api/live-tv")
      .then((res) => {
        if (!res.ok) return null;
        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? res.json() : null;
      })
      .then((data) => {
        if (data?.success && data?.stream) {
          const s = data.stream;
          if (s.channelName) setChannelName(s.channelName);
          if (s.isLive !== undefined) setIsLive(s.isLive);
          if (s.streamUrl) setStreamUrl(s.streamUrl);
          if (s.currentProgram) setCurrentProgram(s.currentProgram);
          if (s.currentHost) setCurrentHost(s.currentHost);
          if (s.upcomingProgram) setUpcomingProgram(s.upcomingProgram);
          if (s.crawlTickerText) setCrawlTickerText(s.crawlTickerText);
          if (s.viewerCount) setViewerCount(s.viewerCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const normalizedUrl = formatLiveStreamEmbedUrl(streamUrl);
    setStreamUrl(normalizedUrl);

    try {
      const res = await fetch("/api/live-tv", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelName,
          isLive,
          streamUrl: normalizedUrl,
          currentProgram,
          currentHost,
          upcomingProgram,
          crawlTickerText,
          viewerCount,
        }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const embedUrl = formatLiveStreamEmbedUrl(streamUrl);

  return (
    <PermissionGuard permission="MANAGE_LIVE_TV">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <Tv className="text-red-500" />
              {b("Live TV Broadcast & EPG Control Room", "लाइव टीवी प्रसारण एवं ईपीजी नियंत्रण (Live TV Control Room)")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {b(
                "24x7 Digital news broadcast studio, active program lineup, upcoming schedule, and on-screen breaking ticker crawl",
                "24x7 डिजिटल न्यूज़ चैनल ब्रॉडकास्ट, वर्तमान कार्यक्रम, आगामी EPG व ऑन-स्क्रीन ब्रेकिंग टिकर"
              )}
            </p>
          </div>

          <Link
            href="/live-tv"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <span>{b("Watch Public Live TV", "पब्लिक लाइव टीवी देखें")}</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} />
            {b(
              "Live TV settings and on-screen crawl updated successfully!",
              "लाइव टीवी सेटिंग्स व ऑन-स्क्रीन क्रॉल सफलतापूर्वक अद्यतित कर दिया गया!"
            )}
          </div>
        )}

        {/* Control Room Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stream Live Preview (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isLive ? "bg-red-500 animate-ping" : "bg-slate-400"}`}></span>
                <span className={`text-xs font-black uppercase tracking-wider ${isLive ? "text-red-600 dark:text-red-400" : "text-slate-500"}`}>
                  {isLive ? b("BROADCAST LIVE", "लाइव प्रसारण चालू") : b("STREAM OFFLINE", "स्ट्रीम ऑफलाइन")}
                </span>
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1">
                <Eye size={13} className="text-rose-500" />
                {Number(viewerCount || 0).toLocaleString(lang === "hi" ? "hi-IN" : "en-US")} {b("viewers", "दर्शक")}
              </span>
            </div>

            {/* Embedded Player with On-Demand Fast Loading */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-inner relative flex items-center justify-center">
              {embedUrl ? (
                playerLoaded ? (
                  <iframe
                    src={embedUrl}
                    title="Live Stream Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div
                    onClick={() => setPlayerLoaded(true)}
                    className="w-full h-full flex flex-col items-center justify-center text-center p-5 bg-gradient-to-b from-slate-900 to-black text-white cursor-pointer group hover:bg-slate-900/90 transition select-none"
                  >
                    <div className="w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 group-hover:scale-110 text-white flex items-center justify-center shadow-xl shadow-red-950/50 transition duration-200">
                      <Play size={24} className="ml-1 fill-white" />
                    </div>
                    <span className="mt-3 text-xs font-bold text-slate-200 group-hover:text-white">
                      {b("Click to Load Live Player Preview", "लाइव प्लेयर पूर्वावलोकन लोड करने के लिए क्लिक करें")}
                    </span>
                    <span className="mt-1 text-[10px] text-slate-400 font-mono">
                      {channelName}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 gap-2 p-4 text-center">
                  <Tv size={36} className="opacity-40 text-red-500" />
                  <span className="text-xs font-mono">
                    {b("No live stream URL configured", "कोई लाइव स्ट्रीम URL सेट नहीं है")}
                  </span>
                </div>
              )}
            </div>

            {/* Broadcast Program Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400">
                {b("Now Airing:", "वर्तमान में प्रसारित (Now Airing):")}
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                {currentProgram || b("Regular Broadcast", "नियमित प्रसारण")}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {b("Anchor / Host:", "एंकर / होस्ट:")}{" "}
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  {currentHost || b("News Desk", "न्यूज़ डेस्क")}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                {b("Up Next:", "अगला कार्यक्रम:")}{" "}
                <span className="text-slate-900 dark:text-white font-semibold">
                  {upcomingProgram || b("Prime Time Bulletin", "प्राइम टाइम बुलेटिन")}
                </span>
              </div>
            </div>
          </div>

          {/* Stream Configuration Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 mb-4 flex items-center gap-2">
              <Settings size={16} className="text-slate-500 dark:text-slate-400" />
              {b("Broadcast Configuration & Ticker Controls", "प्रसारण कॉन्फ़िगरेशन व टिकर नियंत्रण")}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Channel Name / Identity:", "चैनल का नाम (Channel Identity):")}
                </label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 dark:text-slate-400 font-semibold">
                    {b("Stream URL (YouTube Watch / Live / Embed or HLS):", "स्ट्रीम URL (YouTube Watch / Live / Embed या HLS):")}
                  </label>
                  {streamUrl && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {b("Auto-converted to embed format", "ऑटो-कन्वर्टेड एम्बेड")}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={streamUrl}
                  onChange={(e) => {
                    setStreamUrl(e.target.value);
                    setPlayerLoaded(false);
                  }}
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-hidden focus:border-red-500"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  {b(
                    "Paste any YouTube watch, youtu.be, youtube.com/live, or HLS stream link. It will automatically play without iframe blocking.",
                    "YouTube का कोई भी लिंक (Watch, youtu.be, Live) पेस्ट करें। यह बिना किसी एरर के ऑटोमैटिक स्ट्रीम होगा।"
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                    {b("Current Program (Now Playing):", "वर्तमान कार्यक्रम (Now Playing):")}
                  </label>
                  <input
                    type="text"
                    value={currentProgram}
                    onChange={(e) => setCurrentProgram(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                    {b("Prime Anchor / Desk Host:", "प्राइम एंकर / होस्ट:")}
                  </label>
                  <input
                    type="text"
                    value={currentHost}
                    onChange={(e) => setCurrentHost(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Upcoming Program (Up Next):", "आगामी कार्यक्रम (Up Next):")}
                </label>
                <input
                  type="text"
                  value={upcomingProgram}
                  onChange={(e) => setUpcomingProgram(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("On-Screen Breaking Ticker (Bottom Screen Crawl):", "ऑन-स्क्रीन लाइव ब्रेकिंग टिकर (Bottom Screen Crawl):")}
                </label>
                <textarea
                  rows={3}
                  value={crawlTickerText}
                  onChange={(e) => setCrawlTickerText(e.target.value)}
                  placeholder={b(
                    "Type breaking news headlines to crawl continuously across the bottom of live screen...",
                    "लाइव स्क्रीन पर चलने वाली ब्रेकिंग न्यूज़ हेडलाइन्स लिखें..."
                  )}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={isLive}
                    onChange={(e) => setIsLive(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-red-600 focus:ring-0"
                  />
                  {b("Keep Channel in Live Broadcast State", "चैनल को लाइव स्थिति में रखें")}
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  {b("Save Broadcast Settings", "सेटिंग्स सुरक्षित करें")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
