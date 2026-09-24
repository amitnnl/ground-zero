import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleByIdOrSlug, getArticles, incrementArticleViews } from "@/lib/db";
import VideoNewsSidebar from "@/components/VideoNewsSidebar";
import CategorySidebar from "@/components/CategorySidebar";
import ShareModal from "@/components/ShareModal";
import NewsCard from "@/components/NewsCard";
import AdBanner from "@/components/AdBanner";
import AudioNewsReader from "@/components/AudioNewsReader";
import ArticleReactionsComments from "@/components/ArticleReactionsComments";
import {
  ArrowLeft,
  Clock,
  Eye,
  User,
  Tag,
  Sparkles,
  Share2,
  Bookmark,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getArticleByIdOrSlug(id);

  if (!article) {
    notFound();
  }

  // Increment views
  incrementArticleViews(article.id).catch(console.error);

  const allArticles = await getArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.categorySlug === article.categorySlug)
    .slice(0, 3);

  let prefix = "";
  let restTitle = article.title;
  if (article.title.includes(":")) {
    const parts = article.title.split(":");
    prefix = parts[0] + " : ";
    restTitle = parts.slice(1).join(":");
  } else if (article.title.includes("|")) {
    const parts = article.title.split("|");
    prefix = parts[0] + " | ";
    restTitle = parts.slice(1).join("|");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [article.imageUrl],
    datePublished: article.createdAt,
    dateModified: article.createdAt,
    author: [
      {
        "@type": "Person",
        name: article.author || "ग्राउंड ज़ीरो ब्यूरो",
      },
    ],
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "GROUND ZERO NEWS",
      url: "https://groundzero.media",
      logo: {
        "@type": "ImageObject",
        url: "https://groundzero.media/favicon.ico",
      },
    },
    description: article.excerpt,
    articleSection: article.category,
    inLanguage: "hi",
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-[1440px]">
      {/* Schema.org NewsArticle Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-5 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-[#E11D48] flex items-center gap-1 font-semibold shrink-0">
          <ArrowLeft size={13} />
          <span>होम</span>
        </Link>
        <span className="text-slate-300">/</span>
        <Link
          href={`/category/${article.categorySlug}`}
          className="hover:text-[#E11D48] font-bold text-slate-700 dark:text-slate-300 shrink-0"
        >
          {article.category}
        </Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-slate-400 dark:text-slate-500 truncate max-w-sm sm:max-w-lg">{article.title}</span>
      </nav>

      {/* 3-Column Layout: Categories / Article Body / Multimedia Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_340px] gap-5 sm:gap-7 items-start">
        {/* Left: Category Rail */}
        <CategorySidebar currentSlug={article.categorySlug} />

        {/* Center: Main Article Container */}
        <article className="min-w-0 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
          {/* Category & Live Indicator */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <Link
              href={`/category/${article.categorySlug}`}
              className="bg-rose-50 dark:bg-rose-950/40 text-[#E11D48] dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            >
              {article.category}
            </Link>

            {article.isBreaking && (
              <span className="bg-[#E11D48] text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>लाइव ब्रेकिंग</span>
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-snug tracking-tight mb-5">
            {prefix && <span className="text-[#E11D48] dark:text-rose-400">{prefix}</span>}
            <span>{restTitle}</span>
          </h1>

          {/* Metadata Bar (Author, Date, Views, Share) */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 mb-6">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <div className="w-7 h-7 rounded-full bg-[#E11D48] text-white flex items-center justify-center text-xs font-black">
                  GZ
                </div>
                <span>{article.author}</span>
              </div>

              <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <Clock size={13} />
                <span>
                  {new Date(article.createdAt).toLocaleString("hi-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </span>

              {article.views > 0 && (
                <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <Eye size={13} />
                  <span>{article.views.toLocaleString()} व्यूज</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">शेयर करें:</span>
              <ShareModal title={article.title} url={`/article/${article.slug}`} />
            </div>
          </div>

          {/* Featured Hero Banner Image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-3 shadow-xs border border-slate-200/80">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 850px"
              className="object-cover"
            />
          </div>
          {article.imageCaption && (
            <p className="text-xs text-slate-500 italic mb-6 px-1">
              फोटो विवरण: {article.imageCaption}
            </p>
          )}

          {/* YouTube Video Section (if video report attached) */}
          {article.youtubeId && (
            <div className="my-7 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-950">
              <div className="bg-[#E11D48] text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
                <span>विशेष वीडियो रिपोर्ट (Ground Zero Exclusive)</span>
                <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded font-black">HD Video</span>
              </div>
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${article.youtubeId}`}
                  title={article.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Audio News Reader */}
          <AudioNewsReader
            title={article.title}
            excerpt={article.excerpt}
            content={article.content}
          />

          {/* Lead Excerpt Callout Box */}
          <div className="bg-rose-50/70 dark:bg-rose-950/30 border-l-4 border-[#E11D48] p-5 rounded-r-2xl mb-6 text-base md:text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs">
            {article.excerpt}
          </div>

          {/* Story Body Paragraphs */}
          <div className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed space-y-5 pt-2">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* In-Article Native Monetization Banner */}
          <AdBanner placement="in_article" district={article.district} />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-9 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Tag size={13} className="text-[#E11D48]" />
                <span>टैग्स (Tags):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?q=${encodeURIComponent(tag)}`}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-[#E11D48] dark:hover:bg-[#E11D48] text-slate-700 dark:text-slate-300 hover:text-white dark:hover:text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reader Reactions & Comments Desk */}
          <ArticleReactionsComments articleId={article.id} />

          {/* Related Stories Grid */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-7 border-t-2 border-slate-900 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-[#E11D48]" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  संबंधित समाचार (Related Coverage)
                </h3>
              </div>
              <div className="space-y-2">
                {relatedArticles.map((rel) => (
                  <NewsCard key={rel.id} article={rel} />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Right: Multimedia Rail */}
        <VideoNewsSidebar articles={allArticles} />
      </div>
    </div>
  );
}
