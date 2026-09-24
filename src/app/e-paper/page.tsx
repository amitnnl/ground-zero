"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Calendar,
  Layers,
  Share2,
  Crop,
  CheckCircle2,
  Sparkles,
  MapPin,
  Newspaper,
} from "lucide-react";
import { sampleEPaperEditions } from "@/lib/seedData";
import AdBanner from "@/components/AdBanner";

export default function EPaperPage() {
  const [selectedEditionIndex, setSelectedEditionIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [clippingActive, setClippingActive] = useState(false);
  const [clippedNotification, setClippedNotification] = useState(false);

  const edition = sampleEPaperEditions[selectedEditionIndex] || sampleEPaperEditions[0];
  const currentPage = edition.pages[currentPageIndex] || edition.pages[0];

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < edition.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handleZoomIn = () => {
    if (zoomLevel < 2) setZoomLevel((z) => Number((z + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.75) setZoomLevel((z) => Number((z - 0.25).toFixed(2)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleClipShare = () => {
    setClippingActive(true);
    setTimeout(() => {
      setClippingActive(false);
      setClippedNotification(true);
      setTimeout(() => setClippedNotification(false), 3000);
    }, 1200);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen py-4 sm:py-6">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl space-y-4">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="होम पर लौटें"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold uppercase tracking-wider">
                  Ground Zero Digital Print
                </span>
                <span className="text-xs text-slate-400">दैनिक समाचार पत्र</span>
              </div>
              <h1 className="font-extrabold text-lg sm:text-2xl text-slate-900 dark:text-white leading-tight mt-0.5">
                ग्राउंड ज़ीरो डिजिटल ई-पेपर
              </h1>
            </div>
          </div>

          {/* District Edition Selector & Date */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <MapPin size={14} className="text-red-500" />
              <select
                value={selectedEditionIndex}
                onChange={(e) => {
                  setSelectedEditionIndex(Number(e.target.value));
                  setCurrentPageIndex(0);
                }}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                {sampleEPaperEditions.map((ed, idx) => (
                  <option key={ed.id} value={idx} className="bg-white dark:bg-slate-900">
                    {ed.editionName} ({ed.district})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
              <Calendar size={13} className="text-red-500" />
              <span>{edition.formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:px-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
          {/* Page Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              पृष्ठ {currentPage.pageNumber} / {edition.pages.length}
            </span>
            <span className="text-xs text-slate-400 hidden md:inline">
              — {currentPage.title}
            </span>
          </div>

          {/* Zoom & Clipping Tools */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                title="Zoom Out"
                className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-40"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={handleResetZoom}
                className="text-xs font-mono font-bold px-2 text-slate-600 dark:text-slate-300 hover:underline"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2}
                title="Zoom In"
                className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-40"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* News Cutout / Clipping Tool */}
            <button
              onClick={handleClipShare}
              disabled={clippingActive}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              title="खबर की कतरन बनाएं और शेयर करें"
            >
              <Crop size={14} className={clippingActive ? "animate-spin text-red-500" : "text-amber-500"} />
              <span className="hidden sm:inline">
                {clippingActive ? "कतरन काट रहे हैं..." : "खबर कतरन (Clip & Share)"}
              </span>
            </button>

            {/* Download Page */}
            <a
              href={currentPage.imageUrl}
              target="_blank"
              download
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              <Download size={14} />
              <span className="hidden sm:inline">डाउनलोड पेज</span>
            </a>
          </div>
        </div>

        {/* Main E-Paper Page Viewer */}
        <div className="relative bg-slate-200 dark:bg-slate-900 rounded-2xl p-2 sm:p-4 border border-slate-300 dark:border-slate-800 flex items-center justify-center min-h-[500px] overflow-auto shadow-inner">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white disabled:opacity-20 transition-all hover:scale-110 shadow-lg"
            title="पिछला पृष्ठ (Left Arrow)"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Scaled Page Container */}
          <div
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
            className="transition-transform duration-200 ease-out shadow-2xl rounded-lg overflow-hidden bg-white max-w-full"
          >
            <Image
              src={currentPage.imageUrl}
              alt={currentPage.title}
              width={1200}
              height={1600}
              className="w-auto h-auto max-h-[82vh] object-contain select-none"
              priority
              unoptimized
            />
          </div>

          <button
            onClick={handleNext}
            disabled={currentPageIndex === edition.pages.length - 1}
            className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white disabled:opacity-20 transition-all hover:scale-110 shadow-lg"
            title="अगला पृष्ठ (Right Arrow)"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Thumbnail Page Strip */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Layers size={14} className="text-red-500" />
              <span>सभी पृष्ठ (Thumbnails) — {edition.editionName}</span>
            </span>
            <span>पेज पर जाने हेतु क्लिक करें</span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {edition.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`group flex flex-col items-center gap-1.5 shrink-0 transition-all ${
                  idx === currentPageIndex ? "scale-105" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div
                  className={`relative w-20 h-28 sm:w-24 sm:h-32 rounded-lg overflow-hidden border-2 shadow-sm ${
                    idx === currentPageIndex
                      ? "border-red-600 ring-2 ring-red-500/30"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    P.{p.pageNumber}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 line-clamp-1 max-w-[90px]">
                  पेज {p.pageNumber}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cutout Notification Toast */}
        {clippedNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-950 border border-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-emerald-400">कतरन तैयार हो गई!</p>
              <p className="text-slate-300 font-normal mt-0.5">
                ई-पेपर क्लिपिंग WhatsApp पर शेयर करने हेतु तैयार है।
              </p>
            </div>
          </div>
        )}

        {/* In-Article / Footer Monetization Ad */}
        <AdBanner placement="in_article" district={edition.district} />
      </div>
    </div>
  );
}
