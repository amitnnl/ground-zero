"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  TrendingUp,
  Newspaper,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Article } from "@/lib/types";
import { useSettings } from "@/lib/settingsContext";

interface VideoNewsSidebarProps {
  articles: Article[];
}

export default function VideoNewsSidebar({ articles }: VideoNewsSidebarProps) {
  const { settings } = useSettings();
  const videoArticles = articles.filter((a) => a.youtubeId);
  const activeVideo = videoArticles[0] || null;
  const [isPlaying, setIsPlaying] = useState(false);

  const showVideos = settings.homepage_videos_enabled !== false;
  const showTrending = settings.homepage_trending_enabled !== false;
  const trendingCount = settings.homepage_trending_count || 6;

  const trendingArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, trendingCount);

  return (
    <aside className="space-y-6">
      {/* 1. Multimedia Video Spotlight (Dark Obsidian Theatre Card) */}
      {showVideos && (
        <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 text-white shadow-lg border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                <span>वीडियो बुलेटिन</span>
                <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black">HD</span>
              </h3>
            </div>
            <a
              href={settings.youtube_url || "https://youtube.com/@ground_zero_news"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-0.5"
            >
              <span>YouTube</span>
              <ChevronRight size={12} />
            </a>
          </div>

        {activeVideo && (
          <div className="mb-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 mb-3 border border-slate-800">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full cursor-pointer group"
                >
                  <Image
                    src={`https://img.youtube.com/vi/${activeVideo.youtubeId}/hqdefault.jpg`}
                    alt={activeVideo.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 340px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform">
                      <Play fill="white" size={18} className="ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href={`/article/${activeVideo.slug}`}>
              <h4 className="font-bold text-slate-200 hover:text-rose-300 text-xs sm:text-sm line-clamp-2 leading-snug transition-colors">
                {activeVideo.title}
              </h4>
            </Link>
          </div>
        )}

        {/* Video List */}
        <div className="divide-y divide-slate-800/80 border-t border-slate-800 pt-1">
          {videoArticles.slice(1, 4).map((vArt) => (
            <Link
              key={vArt.id}
              href={`/article/${vArt.slug}`}
              className="py-2.5 flex items-center gap-3 group"
            >
              <div className="relative w-16 h-11 shrink-0 rounded-xl overflow-hidden bg-slate-800">
                <Image
                  src={`https://img.youtube.com/vi/${vArt.youtubeId}/hqdefault.jpg`}
                  alt={vArt.title}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-108 transition-transform"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <Play size={11} fill="white" className="text-white" />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-300 group-hover:text-rose-400 line-clamp-2 leading-tight transition-colors">
                {vArt.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
      )}

      {/* 2. Trending Stories */}
      {showTrending && trendingArticles.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#E11D48]" />
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                ट्रेंडिंग समाचार (Trending)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">शीर्ष {trendingCount}</span>
          </div>

        <div className="space-y-3.5">
          {trendingArticles.map((art, idx) => (
            <Link
              key={art.id}
              href={`/article/${art.slug}`}
              className="flex items-start gap-3 group pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
            >
              <span
                className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                  idx === 0
                    ? "bg-[#E11D48] text-white shadow-xs"
                    : idx === 1
                    ? "bg-slate-900 dark:bg-slate-800 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                }`}
              >
                0{idx + 1}
              </span>
              <div className="grow min-w-0">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#E11D48] dark:group-hover:text-rose-400 text-xs sm:text-sm line-clamp-2 leading-snug transition-colors">
                  {art.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="text-[#E11D48] font-semibold">{art.category}</span>
                  <span>•</span>
                  <span>{art.views?.toLocaleString()} पाठकों ने देखा</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      )}

      {/* 3. VIP WhatsApp Community Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 rounded-3xl p-5 text-white shadow-md border border-emerald-700/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
            आधिकारिक कम्युनिटी
          </span>
        </div>
        <h4 className="font-extrabold text-base leading-snug mb-1.5">
          {settings.site_name || "Ground Zero News"} WhatsApp चैनल
        </h4>
        <p className="text-xs text-emerald-100 leading-relaxed mb-4">
          साउथ हरियाणा, रेवाड़ी, नारनौल, गुरुग्राम और अहीरवाल की हर बड़ी खबर सीधे अपने मोबाइल पर प्राप्त करें।
        </p>
        <a
          href={settings.whatsapp_channel_url || "https://whatsapp.com/channel/0029Va9rPwL2ER6m7p2w2504"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1EBE5D] text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-sm hover:scale-102 cursor-pointer"
        >
          <span>WhatsApp से अभी जुड़ें</span>
          <ChevronRight size={14} />
        </a>
      </div>

      {/* 4. Digital E-Paper Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Newspaper size={16} className="text-slate-800 dark:text-slate-200" />
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              डिजिटल ई-पेपर
            </h3>
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">दैनिक अंक</span>
        </div>

        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-200 dark:border-slate-800 shadow-xs group">
          <Image
            src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80"
            alt="E-Paper Today"
            fill
            sizes="300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
            <span className="text-[10px] uppercase font-bold text-rose-300">
              महेंद्रगढ़ - रेवाड़ी मुख्य संस्करण
            </span>
            <span className="text-xs font-extrabold">आज का पूरा अखबार पढ़ें</span>
          </div>
        </div>

        <Link
          href="/e-paper"
          className="flex items-center justify-center gap-1.5 w-full bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs border border-transparent dark:border-slate-700"
        >
          <span>ई-पेपर खोलें</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </aside>
  );
}
