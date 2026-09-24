"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Image as ImageIcon,
  MapPin,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { PhotoAlbum } from "@/lib/types";
import AdBanner from "@/components/AdBanner";

export default function PhotoGalleryPage() {
  const [albums, setAlbums] = useState<PhotoAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox Modal State
  const [activeAlbum, setActiveAlbum] = useState<PhotoAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    async function loadAlbums() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            if (data?.success) {
              setAlbums(data.albums);
            }
          }
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }
    loadAlbums();
  }, []);

  const openLightbox = (album: PhotoAlbum, photoIndex = 0) => {
    setActiveAlbum(album);
    setActivePhotoIndex(photoIndex);
  };

  const handleNextPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex((prev) => (prev + 1) % activeAlbum.photos.length);
  };

  const handlePrevPhoto = () => {
    if (!activeAlbum) return;
    setActivePhotoIndex((prev) =>
      prev === 0 ? activeAlbum.photos.length - 1 : prev - 1
    );
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeAlbum) return;
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
      if (e.key === "Escape") setActiveAlbum(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAlbum]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const currentPhoto =
    activeAlbum && activeAlbum.photos ? activeAlbum.photos[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors">
      {/* Top Header Banner */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 shadow-xs transition-colors">
        <div className="container mx-auto max-w-[1440px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider mb-1">
                <Camera className="w-4 h-4" />
                <span>Ground Zero Photojournalism</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                फ़ोटो गैलरी एवं ऐतिहासिक धरोहर
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                अहीरवाल की संस्कृति, ऐतिहासिक स्थल, ग्रामीण जनजीवन एवं जन-आंदोलनों की उच्च-गुणवत्ता वाली तस्वीरें
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                कुल एल्बम: <strong className="text-slate-900 dark:text-white">{albums.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1440px] px-3 sm:px-4 py-6 space-y-8">
        {/* Leaderboard Ad */}
        <AdBanner placement="header_leaderboard" />

        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
            फ़ोटो एल्बम लोड हो रहे हैं...
          </div>
        ) : albums.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            कोई फ़ोटो एल्बम उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => openLightbox(album, 0)}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-rose-400/50 dark:hover:border-slate-700 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={album.coverImageUrl}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/10">
                        <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                        <span>{album.photos.length} फ़ोटो</span>
                      </span>

                      <span className="text-xs text-white/80 bg-black/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {album.location}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                      <Camera className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-300 font-medium">
                        फ़ोटो पत्रकार: {album.photographerName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
                      {album.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {album.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(album.createdAt).toLocaleDateString("hi-IN")}</span>
                    </span>

                    <span className="text-rose-600 dark:text-rose-400 font-semibold group-hover:underline">
                      गैलरी खोलें ›
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Copied Link Toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>गैलरी लिंक क्लिपबोर्ड पर कॉपी हो गया!</span>
        </div>
      )}

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {activeAlbum && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10 text-white pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {activeAlbum.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>फ़ोटो {activePhotoIndex + 1} / {activeAlbum.photos.length}</span>
                <span>•</span>
                <span>{activeAlbum.photographerName}</span>
                <span>•</span>
                <span>{activeAlbum.location}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="शेयर करें"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveAlbum(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:rotate-90"
                title="बंद करें (Escape)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Large Image Display with Next/Prev Arrows */}
          <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden">
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110"
              title="पिछली तस्वीर (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="relative w-full h-full max-h-[72vh] flex items-center justify-center">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </div>

            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-110"
              title="अगली तस्वीर (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>

          {/* Bottom Caption & Thumbnails Strip */}
          <div className="space-y-3 z-10 pt-3 border-t border-white/10">
            <div className="text-center">
              <p className="text-sm sm:text-base font-semibold text-white max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {currentPhoto.caption}
              </p>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
              {activeAlbum.photos.map((photo, pIdx) => (
                <button
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(pIdx)}
                  className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    pIdx === activePhotoIndex
                      ? "border-rose-500 scale-105 shadow-md shadow-rose-900/50"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
