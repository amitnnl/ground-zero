import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, PlayCircle, Bookmark } from "lucide-react";
import { Article } from "@/lib/types";
import ShareModal from "./ShareModal";

interface NewsCardProps {
  article: Article;
}

function getOptimizedThumbnail(url: string, width = 380, quality = 75): string {
  if (!url) return "/favicon.ico";
  if (url.includes("images.unsplash.com")) {
    if (url.includes("w=")) {
      return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, `q=${quality}`);
    }
    return `${url}&w=${width}&q=${quality}`;
  }
  return url;
}

export default function NewsCard({ article }: NewsCardProps) {
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

  const optimizedImgUrl = getOptimizedThumbnail(article.imageUrl, 380, 75);

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all duration-300 mb-4">
      <div className="flex flex-row-reverse items-start gap-4 sm:gap-5">
        {/* Thumbnail Image */}
        <Link
          href={`/article/${article.slug}`}
          className="shrink-0 relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 w-[110px] h-[80px] sm:w-[160px] sm:h-[110px] md:w-[190px] md:h-[125px]"
        >
          <Image
            src={optimizedImgUrl}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 110px, (max-width: 768px) 160px, 190px"
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          />
          {article.youtubeId && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <PlayCircle className="text-white drop-shadow-md" size={26} />
            </div>
          )}
        </Link>

        {/* Story Text Body */}
        <div className="flex flex-col justify-between grow min-w-0">
          <div>
            {/* Category badge & Timestamp */}
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/category/${article.categorySlug}`}
                className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#E11D48] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-900/60 px-2.5 py-0.5 rounded-full transition-colors"
              >
                {article.category}
              </Link>

              <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <Clock size={11} />
                <span>
                  {new Date(article.createdAt).toLocaleDateString("hi-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>

              {article.views > 0 && (
                <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <Eye size={11} />
                  <span>{article.views.toLocaleString()}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <Link href={`/article/${article.slug}`}>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#E11D48] dark:group-hover:text-rose-400 transition-colors leading-snug text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-3 mb-2">
                {prefix && <span className="text-[#E11D48] dark:text-rose-400">{prefix}</span>}
                <span>{restTitle}</span>
              </h3>
            </Link>

            {/* Excerpt */}
            <p className="hidden md:block text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-3">
              {article.excerpt}
            </p>
          </div>

          {/* Card Footer: Author & Share */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate max-w-[140px] sm:max-w-none font-medium">
              {article.author}
            </span>

            <div className="flex items-center gap-2">
              <ShareModal title={article.title} url={`/article/${article.slug}`} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
