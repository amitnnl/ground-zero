"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Flame,
  Clock,
  Eye,
  Share2,
  Heart,
  ChevronUp,
  ChevronDown,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Film,
  Tv,
  CheckCircle2,
} from "lucide-react";
import { VideoItem } from "@/lib/types";
import AdBanner from "@/components/AdBanner";

export default function VideosHubPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "shorts" | "bulletins">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Shorts / Reels Modal State
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Landscape Bulletin Modal State
  const [activeBulletin, setActiveBulletin] = useState<VideoItem | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        if (res.ok) {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            if (data?.success) {
              setVideos(data.videos);
            }
          }
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  const shorts = videos.filter((v) => v.isShort || v.format === "9:16");
  const bulletins = videos.filter((v) => !v.isShort && v.format === "16:9");

  const filteredVideos = videos.filter((v) => {
    if (activeTab === "shorts" && !v.isShort && v.format !== "9:16") return false;
    if (activeTab === "bulletins" && (v.isShort || v.format === "9:16")) return false;
    if (selectedCategory !== "all" && v.category !== selectedCategory) return false;
    return true;
  });

  const categories = ["all", "स्वास्थ्य", "कृषि", "ट्रैफिक", "खेल", "संस्कृति", "विकास"];

  // Reel Navigation
  const handleNextReel = () => {
    if (activeReelIndex !== null && activeReelIndex < shorts.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
    }
  };

  const handlePrevReel = () => {
    if (activeReelIndex !== null && activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
    }
  };

  // Keyboard navigation for Shorts player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeReelIndex === null) return;
      if (e.key === "ArrowDown") handleNextReel();
      if (e.key === "ArrowUp") handlePrevReel();
      if (e.key === "Escape") setActiveReelIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReelIndex, shorts.length]);

  const toggleLike = (id: string) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleShare = (video: VideoItem) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const currentReel = activeReelIndex !== null ? shorts[activeReelIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 shadow-xs transition-colors">
        <div className="container mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-500 text-xs font-black uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span>Ground Zero Video Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                वीडियो बुलेटिन एवं 9:16 शॉर्ट्स
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                दक्षिण हरियाणा की हर बड़ी घटना का ग्राउंड Reality टेस्ट, एक्सक्लूसिव वीडियो एवं त्वरित रील्स
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/live-tv"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition-all hover:scale-105"
              >
                <Tv className="w-4 h-4 animate-pulse" />
                <span>लाइव टीवी 24x7 देखें</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1440px] px-3 sm:px-4 py-6 space-y-8">
        {/* Leaderboard Ad */}
        <AdBanner placement="header_leaderboard" />

        {/* 9:16 Shorts Shelf / Carousel */}
        {shorts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20">
                  <Flame className="w-4 h-4 fill-current" />
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  ट्रेंडिंग शॉर्ट्स & रील्स (Trending 9:16 Shorts)
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                फुलस्क्रीन में देखने हेतु क्लिक करें
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
              {shorts.map((short, idx) => (
                <div
                  key={short.id}
                  onClick={() => setActiveReelIndex(idx)}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer bg-slate-900 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md hover:border-red-500/50 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <Image
                    src={short.thumbnailUrl}
                    alt={short.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-3 text-white">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
                        9:16 REEL
                      </span>
                      <span className="text-[10px] bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-slate-300 flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        {short.views.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 mx-auto group-hover:scale-110 group-hover:bg-red-600 transition-all">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <h4 className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                        {short.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                        <MapPin className="w-2.5 h-2.5 text-red-400" />
                        <span>{short.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Switcher & Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-slate-200 dark:border-slate-800 py-4">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "सभी वीडियो (All)" },
              { id: "bulletins", label: "16:9 ग्राउंड बुलेटिन" },
              { id: "shorts", label: "9:16 शॉर्ट्स & रील्स" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {cat === "all" ? "सभी श्रेणियां" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* 16:9 Landscape Bulletins & Videos Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Film className="w-4 h-4 text-red-600 dark:text-red-500" />
              <span>वीडियो बुलेटिन रिपोर्ट ({filteredVideos.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">वीडियो लोड हो रहे हैं...</div>
          ) : filteredVideos.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              इस श्रेणी में कोई वीडियो उपलब्ध नहीं है।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    if (vid.isShort || vid.format === "9:16") {
                      const sIdx = shorts.findIndex((s) => s.id === vid.id);
                      if (sIdx !== -1) setActiveReelIndex(sIdx);
                    } else {
                      setActiveBulletin(vid);
                    }
                  }}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-red-400/50 dark:hover:border-slate-700 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                      {vid.duration}
                    </span>

                    {/* Category & Format Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E11D48] text-white shadow-xs">
                        {vid.category}
                      </span>
                      {vid.format === "9:16" && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black">
                          9:16
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                        {vid.title}
                      </h3>
                      {vid.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5">
                          {vid.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{vid.location || "हरियाणा"}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{vid.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>ताज़ा</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Copy Notification Toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>वीडियो लिंक क्लिपबोर्ड पर कॉपी हो गया!</span>
        </div>
      )}

      {/* 9:16 FULLSCREEN SHORTS / REELS PLAYER MODAL */}
      {currentReel && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <button
            onClick={() => setActiveReelIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div className="relative w-full max-w-sm h-[88vh] max-h-[820px] rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex">
            {/* Embedded YouTube 9:16 Player */}
            <iframe
              src={`https://www.youtube.com/embed/${currentReel.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&controls=0&modestbranding=1&rel=0`}
              title={currentReel.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full object-cover pointer-events-auto"
            />

            {/* Bottom Story Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5 text-white pointer-events-none">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                  {currentReel.category}
                </span>
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {currentReel.location}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold line-clamp-3 drop-shadow-md">
                {currentReel.title}
              </h3>
              {currentReel.description && (
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 drop-shadow-sm">
                  {currentReel.description}
                </p>
              )}

              <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-3">
                <span>ग्राउंड ज़ीरो एक्सक्लूसिव</span>
                <span>•</span>
                <span>{currentReel.views.toLocaleString()} व्यूज</span>
              </div>
            </div>

            {/* Right Action Rail */}
            <div className="absolute right-3 bottom-16 flex flex-col items-center gap-4 z-20">
              {/* Sound Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg"
                title={isMuted ? "आवाज चालू करें" : "म्यूट करें"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
              </button>

              {/* Like Button */}
              <button
                onClick={() => toggleLike(currentReel.id)}
                className="flex flex-col items-center group"
              >
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white group-hover:text-red-500 flex items-center justify-center hover:scale-110 transition-all shadow-lg">
                  <Heart className={`w-5 h-5 ${likesMap[currentReel.id] ? "fill-red-500 text-red-500" : ""}`} />
                </div>
                <span className="text-[10px] text-white font-bold mt-1">
                  {1420 + (likesMap[currentReel.id] || 0)}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => handleShare(currentReel)}
                className="flex flex-col items-center group"
              >
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white group-hover:text-blue-400 flex items-center justify-center hover:scale-110 transition-all shadow-lg">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-white font-bold mt-1">शेयर</span>
              </button>

              {/* Prev / Next Reels Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/20">
                <button
                  onClick={handlePrevReel}
                  disabled={activeReelIndex === 0}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white flex items-center justify-center transition-all"
                  title="पिछला रील (Up Arrow)"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextReel}
                  disabled={activeReelIndex === shorts.length - 1}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white flex items-center justify-center transition-all"
                  title="अगला रील (Down Arrow)"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 16:9 LANDSCAPE BULLETIN FULLSCREEN MODAL */}
      {activeBulletin && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-xs font-black uppercase tracking-wider">
                  {activeBulletin.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeBulletin.location}
                </span>
              </div>
              <button
                onClick={() => setActiveBulletin(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeBulletin.youtubeId}?autoplay=1`}
                title={activeBulletin.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {activeBulletin.title}
              </h2>
              {activeBulletin.description && (
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeBulletin.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span>अवधि: {activeBulletin.duration}</span>
                  <span>व्यूज: {activeBulletin.views.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleShare(activeBulletin)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>शेयर करें</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
