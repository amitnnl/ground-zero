import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Newspaper, Flame, ArrowLeft, CloudSun, Compass } from "lucide-react";
import { getArticles, getLocations, getLocationBySlug } from "@/lib/db";
import NewsCard from "@/components/NewsCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) return { title: "Location News - Ground Zero News" };

  return {
    title: `${location.nameHi} (${location.name}) News - Ground Zero News`,
    description: `${location.nameHi} ज़िले एवं आसपास के ताज़ा हिंदी समाचार, प्रशासनिक निर्णय और ग्राउंड रिपोर्ट्स।`,
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  // Fetch articles associated with this district/location or tagged with it
  const articles = await getArticles({
    district: location.slug === "haryana" ? undefined : location.name,
    status: "PUBLISHED",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Location Breadcrumb & Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-rose-900/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-rose-300 mb-3">
          <Link href="/" className="hover:underline flex items-center gap-1">
            <ArrowLeft size={14} /> मुख्य पृष्ठ (Home)
          </Link>
          <span>/</span>
          <span>दक्षिण हरियाणा</span>
          <span>/</span>
          <span className="text-white font-bold">{location.nameHi}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <MapPin size={12} />
                {location.type.toUpperCase()} BUREAU
              </span>
              <span className="text-xs text-slate-400">ग्राउंड ज़ीरो विशेष कवरेज</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {location.nameHi} <span className="text-rose-400 font-serif font-normal">({location.name})</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
              {location.nameHi} ज़िले, तहसील व ग्रामीण क्षेत्रों की पल-पल की ताज़ा खबरें, प्रशासनिक आदेश, अपराध, शिक्षा, स्वास्थ्य एवं राजनीति का सबसे विश्वसनीय स्रोत।
            </p>
          </div>

          {/* Local Weather & Station Widget */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs shrink-0 flex items-center gap-3.5">
            <CloudSun size={32} className="text-amber-400" />
            <div>
              <div className="font-bold text-white text-base">31°C • साफ मौसम</div>
              <div className="text-slate-400 text-[11px]">साउथ हरियाणा क्षेत्रीय मौसम केंद्र</div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]"></span>
            {location.nameHi} से ताज़ा सुर्खियां
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{articles.length} समाचार उपलब्ध</span>
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              वर्तमान में {location.nameHi} के लिए कोई विशेष समाचार सूचीबद्ध नहीं है।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
