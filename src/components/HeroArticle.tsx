import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Sparkles } from "lucide-react";
import { Article } from "@/lib/types";
import ShareModal from "./ShareModal";

interface HeroArticleProps {
  article: Article;
}

function getOptimizedThumbnail(url: string, width = 760) {
  if (!url) return "/news_cover_placeholder.jpg";
  if (url.includes("images.unsplash.com")) {
    const cleanUrl = url.split("?")[0];
    return `${cleanUrl}?w=${width}&auto=format&fit=crop&q=75`;
  }
  return url;
}

export default function HeroArticle({ article }: HeroArticleProps) {
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

  return (
    <article className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden group hover:shadow-md transition-all duration-300 mb-6">
      {/* Featured Banner Image */}
      <Link href={`/article/${article.slug}`} className="block relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={getOptimizedThumbnail(article.imageUrl, 760)}
          alt={article.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 850px"
          className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
        />
        {article.isBreaking && (
          <div className="absolute top-3.5 left-3.5 bg-[#E11D48] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>लाइव ब्रेकिंग</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <Link href={`/article/${article.slug}`}>
          <h2 className="font-black text-slate-900 dark:text-slate-100 group-hover:text-[#E11D48] dark:group-hover:text-rose-400 transition-colors text-lg sm:text-2xl md:text-3xl leading-snug tracking-tight mb-3">
            {prefix && <span className="text-[#E11D48] dark:text-rose-400">{prefix}</span>}
            <span>{restTitle}</span>
          </h2>
        </Link>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 mb-5">
          {article.excerpt}
        </p>

        {/* Card Footer Bar */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href={`/category/${article.categorySlug}`}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E11D48] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/60 px-3 py-1 rounded-full transition-colors"
            >
              <span>{article.category}</span>
              <span className="text-rose-400">›</span>
            </Link>

            <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[11px]">
              <Clock size={12} />
              <span>
                {new Date(article.createdAt).toLocaleDateString("hi-IN", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </span>

            {article.views > 0 && (
              <span className="hidden sm:flex items-center gap-1 text-slate-400 dark:text-slate-500 text-[11px]">
                <Eye size={12} />
                <span>{article.views.toLocaleString()}</span>
              </span>
            )}
          </div>

          <ShareModal title={article.title} url={`/article/${article.slug}`} />
        </div>
      </div>
    </article>
  );
}
