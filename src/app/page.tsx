import React from "react";
import HeroBentoGrid from "@/components/HeroBentoGrid";
import NewsCard from "@/components/NewsCard";
import VideoNewsSidebar from "@/components/VideoNewsSidebar";
import CategorySidebar from "@/components/CategorySidebar";
import AdBanner from "@/components/AdBanner";
import MandiBhavWidget from "@/components/MandiBhavWidget";
import DistrictFilterBar from "@/components/DistrictFilterBar";
import { Suspense } from "react";
import { getArticles, getCategories } from "@/lib/db";
import { Sparkles, Newspaper, Layers } from "lucide-react";
import Link from "next/link";

export const revalidate = 30; // Blazing fast cached page loads with 30s background revalidation

interface HomePageProps {
  searchParams?: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = resolvedSearchParams?.q;

  // Run data queries in parallel
  const [allArticles, categories] = await Promise.all([
    getArticles({ search: query }),
    getCategories(),
  ]);

  // For Bento Showcase (Top 3 stories when no search query)
  const bentoArticles = allArticles.slice(0, 3);
  const streamArticles = query ? allArticles : allArticles.slice(3);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-[1440px]">
      {query && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-center justify-between text-sm shadow-xs transition-colors">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            खोज परिणाम: <span className="text-[#E11D48] dark:text-rose-400 font-bold">&quot;{query}&quot;</span> ({allArticles.length} परिणाम मिले)
          </p>
          <Link href="/" className="text-xs text-[#E11D48] dark:text-rose-400 hover:underline font-bold">
            सारे समाचार देखें ›
          </Link>
        </div>
      )}

      {/* 1. Hero Bento Grid Showcase (Only on Homepage without search) */}
      {!query && bentoArticles.length > 0 && (
        <HeroBentoGrid articles={bentoArticles} />
      )}

      {/* 2. Top Leaderboard Monetization Slot */}
      <AdBanner placement="header_leaderboard" className="mb-6" />

      {/* South Haryana District & City 1-Click Filter Ribbon */}
      <Suspense fallback={<div className="h-14 mb-6 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />}>
        <DistrictFilterBar />
      </Suspense>

      {/* 3. Main Content Stream Layout with Left Categories and Right Multimedia */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_340px] gap-5 sm:gap-7 items-start">
        {/* Left: Quick Category Navigation Rail */}
        <CategorySidebar currentSlug="top" categories={categories} />

        {/* Center: Latest News Feed Stream */}
        <section className="min-w-0">
          {/* South Haryana Mandi Bhav & Weather Widget */}
          {!query && <MandiBhavWidget />}

          <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-slate-900 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
              <h2 className="font-black text-base sm:text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                {query ? "खोजे गए परिणाम" : "दक्षिण हरियाणा ताज़ा समाचार स्ट्रीम (South Haryana News)"}
              </h2>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              साउथ हरियाणा लाइव
            </span>
          </div>

          {allArticles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
              <Newspaper size={44} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">कोई समाचार नहीं मिला</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                कृपया अन्य कीवर्ड खोजें या होमपेज पर लौटें।
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {(query ? allArticles : streamArticles).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Right: Video News & Trending Spotlight */}
        <VideoNewsSidebar articles={allArticles} />
      </div>
    </div>
  );
}
