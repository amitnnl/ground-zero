"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Video,
  PlusCircle,
  Film,
  Play,
  Trash2,
  ExternalLink,
  Eye,
  Clock,
  MapPin,
  Sparkles,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { VideoItem } from "@/lib/types";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";

export default function AdminVideosPage() {
  const { b, lang } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "dewccxNzJbU",
    thumbnailUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    duration: "04:30",
    category: "स्वास्थ्य",
    location: "महेंद्रगढ़",
    format: "16:9" as "16:9" | "9:16",
    isShort: false,
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/videos");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setVideos(data.videos);
          }
        }
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isShort: formData.format === "9:16",
        }),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        alert(b("Failed to publish video (invalid server response)", "वीडियो प्रकाशित करने में विफल (अमान्य प्रतिक्रिया)"));
        return;
      }
      const data = await res.json();
      if (data.success) {
        setNotification(b("Video bulletin published successfully!", "वीडियो बुलेटिन सफलतापूर्वक प्रकाशित हुआ!"));
        setShowCreateModal(false);
        fetchVideos();
      } else {
        alert(data.error || b("Failed to publish video", "वीडियो प्रकाशित करने में विफल"));
      }
    } catch (err) {
      console.error(err);
      alert(b("Unable to connect to server", "सर्वर से संपर्क करने में असमर्थ"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(b("Are you sure you want to remove this video?", "क्या आप इस वीडियो को हटाना चाहते हैं?"))) return;
    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setVideos((prev) => prev.filter((v) => v.id !== id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const shortsCount = videos.filter((v) => v.isShort || v.format === "9:16").length;
  const bulletinsCount = videos.filter((v) => !v.isShort && v.format === "16:9").length;

  return (
    <PermissionGuard permission="MANAGE_VIDEOS">
      <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              <Video className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {b("Video Studio & Shorts Hub", "वीडियो स्टूडियो व शॉर्ट्स हब")}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30">
                  {b("Multimedia Desk", "मल्टीमीडिया डेस्क")}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {b(
                  "16:9 In-depth ground investigation bulletins & 9:16 vertical shorts/reels syndication desk",
                  "16:9 एक्सक्लूसिव ग्राउंड बुलेटिन एवं 9:16 सोशल शॉर्ट्स/रील्स प्रकाशन डेस्क"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/videos"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span>{b("View Live Hub", "लाइव हब देखें")}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{b("Add New Video", "नया वीडियो अपलोड (Add Video)")}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs underline hover:text-emerald-900 dark:hover:text-white cursor-pointer">
            {b("Dismiss", "बंद करें")}
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Total Videos", "कुल वीडियो (Total)")}</span>
            <Film className="w-4 h-4 text-red-500 dark:text-red-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{videos.length}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {b("Published Dispatches", "प्रकाशित रिपोर्ट")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{b("9:16 Shorts & Reels", "9:16 शॉर्ट्स & रील्स")}</span>
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">{shortsCount}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {b("Social-First Format", "सोशल-फर्स्ट फॉर्मेट")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{b("16:9 Bulletins", "16:9 विस्तृत बुलेटिन")}</span>
            <Video className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">{bulletinsCount}</div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {b("Deep Field Reports", "खोजी व डीप रिपोर्ट")}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Total Video Views", "कुल वीडियो व्यूज")}</span>
            <Eye className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {totalViews.toLocaleString(lang === "hi" ? "hi-IN" : "en-US")}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            {b("Network Engagement", "नेटवर्क एंगेजमेंट")}
          </p>
        </div>
      </div>

      {/* Videos List Table */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-red-500 dark:text-red-400" />
            {b(`Published Video Catalog (${videos.length})`, `प्रकाशित वीडियो कैटलॉग (${videos.length})`)}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {b("YouTube & HLS Sync Active", "YouTube व HLS सिंक सक्रिय")}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            {b("Loading videos...", "लोड हो रहा है...")}
          </div>
        ) : videos.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
            {b("No videos available. Upload your first video bulletin.", "कोई वीडियो उपलब्ध नहीं है। नया वीडियो जोड़ें।")}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative w-28 h-18 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={vid.thumbnailUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80"}
                      alt={vid.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/30">
                        {vid.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          vid.format === "9:16"
                            ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {vid.format === "9:16" ? "9:16 SHORT" : "16:9 BULLETIN"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {vid.location}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {vid.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{b("Views", "व्यूज")}</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {vid.views.toLocaleString(lang === "hi" ? "hi-IN" : "en-US")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://youtube.com/watch?v=${vid.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                      title={b("Watch on YouTube", "यूट्यूब पर देखें")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(vid.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title={b("Delete", "हटाएं")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Publish Video */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                {b("Publish New Video Bulletin", "नया वीडियो प्रकाशित करें (Publish Video)")}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Video Title *", "वीडियो शीर्षक (Title) *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={b("e.g. Narnaul Medical College Trauma Center Ground Investigation", "उदा. नारनौल मेडिकल कॉलेज ट्रॉमा सेंटर की ग्राउंड रिपोर्ट")}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Short Description", "संक्षिप्त विवरण (Description)")}
                </label>
                <textarea
                  rows={3}
                  placeholder={b("Key bullet points of this video investigation...", "वीडियो रिपोर्ट की मुख्य बातें...")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Format *", "फॉर्मेट (Format) *")}
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                  >
                    <option value="16:9">{b("16:9 Landscape Bulletin", "16:9 लैंडस्केप बुलेटिन (Landscape)")}</option>
                    <option value="9:16">{b("9:16 Vertical Reel/Shorts", "9:16 वर्टिकल रील/शॉर्ट (Shorts)")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    YouTube Video ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="dewccxNzJbU"
                    value={formData.youtubeId}
                    onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Category *", "श्रेणी (Category) *")}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                  >
                    <option value="स्वास्थ्य">{b("Health", "स्वास्थ्य")}</option>
                    <option value="कृषि">{b("Agriculture", "कृषि")}</option>
                    <option value="ट्रैफिक">{b("Traffic", "ट्रैफिक")}</option>
                    <option value="खेल">{b("Sports", "खेल")}</option>
                    <option value="संस्कृति">{b("Culture", "संस्कृति")}</option>
                    <option value="विकास">{b("Development", "विकास")}</option>
                    <option value="राजनीति">{b("Politics", "राजनीति")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Location *", "स्थान (Location) *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Duration (e.g. 05:20)", "अवधि (Duration, e.g. 05:20)")}
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Thumbnail Image URL *", "थंबनेल URL (Thumbnail Image) *")}
                </label>
                <input
                  type="url"
                  required
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  {b("Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting
                    ? b("Publishing...", "प्रकाशित कर रहे हैं...")
                    : b("Publish Video Bulletin", "प्रकाशित करें (Publish Video)")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </PermissionGuard>
  );
}
