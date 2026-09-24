import React from "react";
import Link from "next/link";
import CategorySidebar from "@/components/CategorySidebar";
import NewsCard from "@/components/NewsCard";
import VideoNewsSidebar from "@/components/VideoNewsSidebar";
import HeroArticle from "@/components/HeroArticle";
import { getArticles, getCategories } from "@/lib/db";
import { ArrowLeft, Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === slug);
  const categoryName = currentCategory ? currentCategory.name : slug;

  const articles = await getArticles({ categorySlug: slug });
  const allArticles = await getArticles();

  const leadStory = articles[0] || null;
  const restArticles = articles.slice(1);

  return (
    <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-[1440px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
        <Link href="/" className="hover:text-[#E11D48] flex items-center gap-1 font-semibold">
          <ArrowLeft size={13} />
          <span>होम</span>
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">{categoryName}</span>
      </nav>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_340px] gap-5 sm:gap-7 items-start">
        {/* Left Sidebar */}
        <CategorySidebar currentSlug={slug} categories={categories} />

        {/* Center Main Stream */}
        <section className="min-w-0">
          <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-slate-900 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
              <h1 className="font-black text-base sm:text-xl text-slate-900 dark:text-white uppercase tracking-tight">
                {categoryName} समाचार
              </h1>
            </div>
            <span className="text-xs font-bold text-[#E11D48] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-3 py-0.5 rounded-full">
              कुल खबरें: {articles.length}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
              <Newspaper size={44} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                इस श्रेणी में अभी कोई खबर नहीं है
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                कृपया मुख्य पृष्ठ पर जाकर अन्य समाचार पढ़ें।
              </p>
            </div>
          ) : (
            <div>
              {leadStory && (
                <div className="mb-5">
                  <HeroArticle article={leadStory} />
                </div>
              )}

              <div className="space-y-2">
                {restArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Sidebar */}
        <VideoNewsSidebar articles={allArticles} />
      </div>
    </div>
  );
}
