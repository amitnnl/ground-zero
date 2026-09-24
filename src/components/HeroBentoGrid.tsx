"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Sparkles, BookOpen, ChevronRight } from "lucide-react";
import { Article } from "@/lib/types";

interface HeroBentoGridProps {
  articles: Article[];
}

function getOptimizedThumbnail(url: string, width = 720, quality = 80): string {
  if (!url) return "/favicon.ico";
  if (url.includes("images.unsplash.com")) {
    if (url.includes("w=")) {
      return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`);
    }
    return `${url}&w=${width}&q=${quality}`;
  }
  return url;
}

export default function HeroBentoGrid({ articles }: HeroBentoGridProps) {
  if (!articles || articles.length === 0) return null;

  const mainStory = articles[0];
  const subStory1 = articles[1];
  const subStory2 = articles[2];

  // Helper to extract prefix from title
  const formatTitle = (title: string) => {
    let prefix = "";
    let restTitle = title;
    if (title.includes(":")) {
      const parts = title.split(":");
      prefix = parts[0] + " : ";
      restTitle = parts.slice(1).join(":");
    } else if (title.includes("|")) {
      const parts = title.split("|");
      prefix = parts[0] + " | ";
      restTitle = parts.slice(1).join("|");
    }
    return { prefix, restTitle };
  };

  const mainTitleFormatted = formatTitle(mainStory.title);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>प्रमुख समाचार</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">/ Top Spotlight</span>
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          संपादकीय चयन
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* 1. Main Cinematic Lead Story (7 cols) */}
        {mainStory && (
          <article className="lg:col-span-7 relative group overflow-hidden rounded-3xl bg-slate-950 shadow-md border border-slate-200/80 dark:border-slate-800 aspect-[16/11] sm:aspect-[16/10] flex flex-col justify-end">
            <Link href={`/article/${mainStory.slug}`} className="absolute inset-0 z-0">
              <Image
                src={getOptimizedThumbnail(mainStory.imageUrl, 720, 80)}
                alt={mainStory.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </Link>

            {/* Floating Content on Gradient */}
            <div className="relative z-10 p-5 sm:p-7 text-white flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#E11D48] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                  {mainStory.category}
                </span>
                {mainStory.isBreaking && (
                  <span className="bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    ब्रेकिंग
                  </span>
                )}
                <span className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                  <Clock size={12} />
                  <span>
                    {new Date(mainStory.createdAt).toLocaleDateString("hi-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </span>
              </div>

              <Link href={`/article/${mainStory.slug}`}>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-snug tracking-tight group-hover:text-rose-200 transition-colors mb-2.5">
                  {mainTitleFormatted.prefix && (
                    <span className="text-rose-400">{mainTitleFormatted.prefix}</span>
                  )}
                  <span>{mainTitleFormatted.restTitle}</span>
                </h3>
              </Link>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                {mainStory.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/15 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200">
                  {mainStory.author}
                </span>
                <span className="flex items-center gap-1 text-rose-300 font-bold group-hover:translate-x-1 transition-transform">
                  <span>पूरी खबर पढ़ें</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </article>
        )}

        {/* 2. Secondary Stacked Stories (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 justify-between">
          {[subStory1, subStory2].filter(Boolean).map((story, idx) => {
            const formatted = formatTitle(story.title);
            return (
              <article
                key={story.id}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row p-4 gap-4"
              >
                {/* Thumbnail */}
                <Link
                  href={`/article/${story.slug}`}
                  className="relative aspect-video sm:aspect-square sm:w-40 sm:h-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0"
                >
                  <Image
                    src={getOptimizedThumbnail(story.imageUrl, 380, 75)}
                    alt={story.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#E11D48] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                      {story.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col justify-between grow min-w-0">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-1.5">
                      <Clock size={11} />
                      <span>
                        {new Date(story.createdAt).toLocaleDateString("hi-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <Link href={`/article/${story.slug}`}>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E11D48] dark:group-hover:text-rose-400 transition-colors leading-snug text-sm sm:text-base line-clamp-3 mb-2">
                        {formatted.prefix && (
                          <span className="text-[#E11D48] dark:text-rose-400">{formatted.prefix}</span>
                        )}
                        <span>{formatted.restTitle}</span>
                      </h4>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="truncate max-w-[120px] font-medium text-slate-700 dark:text-slate-300">
                      {story.author}
                    </span>
                    <span className="text-[#E11D48] dark:text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                      पढ़ें ›
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
