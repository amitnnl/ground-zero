"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Calendar,
  Send,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { SocialPost, SocialPlatform } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";

const PLATFORMS: { id: SocialPlatform; name: string; color: string; bg: string; followers: string }[] = [
  { id: "facebook", name: "Facebook Page", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", followers: "420K" },
  { id: "instagram", name: "Instagram Reels", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", followers: "185K" },
  { id: "twitter", name: "X / Twitter", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", followers: "95K" },
  { id: "youtube", name: "YouTube Channel", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", followers: "310K" },
  { id: "whatsapp", name: "WhatsApp Channel", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", followers: "78K" },
  { id: "telegram", name: "Telegram News", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", followers: "44K" },
  { id: "linkedin", name: "LinkedIn Network", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", followers: "22K" },
];

export default function SocialCommandCenterPage() {
  const { b, lang } = useLanguage();
  const { hasPermission } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<SocialPost | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Quick compose form
  const [composePlatform, setComposePlatform] = useState<SocialPlatform>("facebook");
  const [composeContent, setComposeContent] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/social/posts");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setPosts(data.posts);
          }
        }
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    setDeletingPost(true);
    try {
      const res = await fetch(`/api/social/posts?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotification(b("Social post deleted successfully!", "सोशल पोस्ट सफलतापूर्वक हटा दी गई!"));
        setTimeout(() => setNotification(null), 3500);
        setDeleteConfirmPost(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to delete social post:", err);
    } finally {
      setDeletingPost(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/social/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: composePlatform,
          content: composeContent,
          status: scheduleTime ? "scheduled" : "published",
          scheduledFor: scheduleTime || undefined,
        }),
      });
      if (res.ok) {
        setShowComposeModal(false);
        setComposeContent("");
        setScheduleTime("");
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedPlatform !== "all" && p.platform !== selectedPlatform) return false;
    return true;
  });

  return (
    <PermissionGuard permission="MANAGE_SOCIAL">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Share2 className="text-emerald-500 dark:text-emerald-400" />
            {b("Social Media Command Center", "सोशल मीडिया कमांड सेंटर (Social Command Center)")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {b(
              "Automated syndication across 7 social channels, multi-account queue management, and audience engagement tracking",
              "7 सोशल प्लेटफॉर्म्स पर स्वचालित प्रकाशन, कतार प्रबंधन व एंगेजमेंट एनालिटिक्स"
            )}
          </p>
        </div>

        {hasPermission("MANAGE_SOCIAL") && (
          <button
            onClick={() => setShowComposeModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>{b("Compose Social Post", "सोशल पोस्ट बनाएं")}</span>
          </button>
        )}
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          {notification}
        </div>
      )}

      {/* 7 Connected Platforms Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {PLATFORMS.map((plat) => {
          const count = posts.filter((p) => p.platform === plat.id).length;
          return (
            <div
              key={plat.id}
              onClick={() => setSelectedPlatform(selectedPlatform === plat.id ? "all" : plat.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                plat.bg
              } ${selectedPlatform === plat.id ? "ring-2 ring-emerald-400" : "hover:scale-102"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black uppercase ${plat.color}`}>{plat.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div>
                <div className="text-lg font-black text-white">{plat.followers}</div>
                <div className="text-[10px] text-slate-400">
                  {count} {b("active posts", "पोस्ट सक्रिय")}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setSelectedPlatform("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedPlatform === "all"
                ? "bg-emerald-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            {b(`All Platforms (${posts.length})`, `सभी प्लेटफ़ॉर्म (${posts.length})`)}
          </button>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition uppercase cursor-pointer ${
                selectedPlatform === p.id
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>

        <button
          onClick={fetchPosts}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition cursor-pointer"
          title={b("Refresh Feed", "रिफ्रेश फीड")}
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-emerald-400" : ""} />
        </button>
      </div>

      {/* Posts Feed & Queue */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">
          {b("Loading social feeds...", "लोड हो रहा है...")}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-xs shadow-xs">
          {b("No social posts match the current filter.", "कोई सोशल पोस्ट उपलब्ध नहीं है।")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => {
            const platformConfig = PLATFORMS.find((p) => p.id === post.platform);

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between gap-3.5 shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                        platformConfig?.bg || "bg-slate-800"
                      } ${platformConfig?.color || "text-white"}`}
                    >
                      {post.platform.toUpperCase()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          post.status === "published"
                            ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                            : "bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => setDeleteConfirmPost(post)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title={b("Delete Social Post", "सोशल पोस्ट हटाएं")}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    {post.likes !== undefined && (
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={12} className="text-blue-500 dark:text-blue-400" />
                        {post.likes} {b("likes", "लाइक्स")}
                      </span>
                    )}
                    {post.shares !== undefined && (
                      <span className="flex items-center gap-1">
                        <Share2 size={12} className="text-emerald-500 dark:text-emerald-400" />
                        {post.shares} {b("shares", "शेयर")}
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : b("Scheduled", "शेड्यूल किया गया")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="text-emerald-500 dark:text-emerald-400" />
                {b("Compose New Social Post", "नई सोशल पोस्ट तैयार करें")}
              </h3>
              <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {b("Select Target Platform:", "प्लेटफ़ॉर्म चुनें:")}
                </label>
                <select
                  value={composePlatform}
                  onChange={(e) => setComposePlatform(e.target.value as SocialPlatform)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {b("Post Content & Hashtags:", "पोस्ट सामग्री (Content & Hashtags):")}
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder={b(
                    "Write engaging copy, key highlights, hashtags and source link...",
                    "सोशल मीडिया के लिए आकर्षक कैप्शन, लिंक व हैशटैग लिखें..."
                  )}
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {b(
                    "Schedule Time (Optional — leave empty to broadcast immediately):",
                    "शेड्यूल समय (वैकल्पिक - तुरंत पब्लिश करने के लिए खाली छोड़ें):"
                  )}
                </label>
                <input
                  type="datetime-local"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {b("Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  {scheduleTime
                    ? b("Schedule Broadcast", "शेड्यूल करें")
                    : b("Publish Now", "तुरंत पोस्ट करें")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Social Post Confirmation Modal */}
      {deleteConfirmPost && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b("Delete Social Post", "सोशल पोस्ट हटाएं")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {b("This social dispatch will be removed from your queue.", "यह सोशल पोस्ट आपकी कतार से हटा दी जाएगी।")}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 line-clamp-3">
              {deleteConfirmPost.content}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmPost(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {b("Cancel", "रद्द करें")}
              </button>
              <button
                type="button"
                disabled={deletingPost}
                onClick={() => handleDeletePost(deleteConfirmPost.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={13} />
                {deletingPost ? b("Deleting...", "हटाया जा रहा है...") : b("Delete Post", "पोस्ट हटाएं")}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PermissionGuard>
  );
}
