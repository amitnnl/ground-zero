"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  Flame,
  CheckCircle2,
  Clock,
  Bot,
  Users,
  Eye,
  ShieldAlert,
  ArrowUpRight,
  PlusCircle,
  Share2,
  TrendingUp,
  FileEdit,
  Send,
  Radio,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Article, CitizenReport, AuditLog } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import { useSettings } from "@/lib/settingsContext";

interface DashboardData {
  stats: {
    totalArticles: number;
    publishedCount: number;
    underReviewCount: number;
    submittedCount: number;
    aiDraftsCount: number;
    breakingCount: number;
    totalViews: number;
    pendingCitizenReports: number;
    activeAssignments: number;
    scheduledSocialPosts: number;
    totalReporters: number;
  };
  recentArticles: Article[];
  publishingQueue: Article[];
  recentCitizenReports: CitizenReport[];
  recentLogs: AuditLog[];
}

export default function AdminDashboardPage() {
  const { currentUser, hasPermission } = useAuth();
  const { b, lang } = useLanguage();
  const { settings } = useSettings();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) {
        console.warn("Dashboard fetch returned status:", res.status);
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Dashboard fetch returned non-JSON content-type:", contentType);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handlePublishNow = async (articleId: string) => {
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PUBLISHED", publishedAt: new Date().toISOString() }),
      });
      if (res.ok) {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Newsroom Status & Quick Welcome */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-rose-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              style={{
                borderColor: `${settings.primary_color || "#E11D48"}40`,
                color: settings.primary_color || "#E11D48",
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/20 border"
            >
              <span
                style={{ backgroundColor: settings.primary_color || "#E11D48" }}
                className="w-1.5 h-1.5 rounded-full animate-ping"
              ></span>
              {b(`${settings.site_name?.toUpperCase() || "LIVE"} NEWS DESK`, `${settings.site_name || "लाइव"} न्यूज़ डेस्क`)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {b("Welcome", "स्वागत है")}, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {b("Jurisdiction:", "कार्यक्षेत्र:")} <span className="text-slate-900 dark:text-slate-200 font-semibold">{currentUser.district || b("Haryana", "हरियाणा")}</span> • {b("Role:", "भूमिका:")}{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">{currentUser.role}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition flex items-center gap-1.5 cursor-pointer"
            title={b("Refresh Newsroom Data", "रिफ्रेश")}
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-rose-500 dark:text-rose-400" : ""} />
            <span className="hidden sm:inline font-semibold">{b("Refresh", "रिफ्रेश")}</span>
          </button>
          <Link
            href="/admin/ai-newsroom"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Bot size={15} />
            <span>AI News Desk</span>
          </Link>
          <Link
            href="/admin/new"
            style={{ backgroundColor: settings.primary_color || "#E11D48" }}
            className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-90 transition flex items-center gap-2"
          >
            <PlusCircle size={15} />
            <span>{b("Publish Story", "समाचार प्रकाशित करें")}</span>
          </Link>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Articles */}
        <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{b("Total News", "कुल समाचार")}</span>
            <Newspaper size={18} className="text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {loading ? "..." : data?.stats.totalArticles}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data?.stats.publishedCount}</span> {b("Published", "प्रकाशित")}
          </div>
        </div>

        {/* Pending Review */}
        <Link
          href="/admin/editorial"
          className="bg-white dark:bg-slate-950/80 border border-amber-200 dark:border-amber-900/40 hover:border-amber-400 dark:hover:border-amber-700/60 rounded-2xl p-4 shadow-sm relative overflow-hidden group transition"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{b("Under Review", "समीक्षाधीन (Review)")}</span>
            <Clock size={18} className="text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300">
            {loading ? "..." : (data?.stats.underReviewCount || 0) + (data?.stats.submittedCount || 0)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{b("Drafts & Verification", "रिपोर्टर ड्राफ्ट व जांच")}</span>
            <ArrowUpRight size={12} className="text-amber-500 dark:text-amber-400" />
          </div>
        </Link>

        {/* AI Drafts */}
        <Link
          href="/admin/ai-newsroom"
          className="bg-white dark:bg-slate-950/80 border border-indigo-200 dark:border-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-700/60 rounded-2xl p-4 shadow-sm relative overflow-hidden group transition"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{b("AI Drafts", "AI Generated Drafts")}</span>
            <Bot size={18} className="text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-300">
            {loading ? "..." : data?.stats.aiDraftsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{b("Verification Needed", "सत्यापन आवश्यक")}</span>
            <ArrowUpRight size={12} className="text-indigo-500 dark:text-indigo-400" />
          </div>
        </Link>

        {/* Breaking News */}
        <div className="bg-white dark:bg-slate-950/80 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold text-[#E11D48] dark:text-rose-400">{b("Breaking News", "ब्रेकिंग न्यूज़")}</span>
            <Flame size={18} className="text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#E11D48] dark:text-rose-400">
            {loading ? "..." : data?.stats.breakingCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {b("Active on website ticker", "वेबसाइट टिकर पर सक्रिय")}
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 rounded-2xl p-4 shadow-sm relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{b("Total Readership", "कुल पाठक संख्या")}</span>
            <Eye size={18} className="text-purple-500 dark:text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {loading ? "..." : data?.stats.totalViews.toLocaleString(lang === "hi" ? "hi-IN" : "en-US")}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} />
            {b("+18.4% from last week", "+18.4% पिछले सप्ताह से")}
          </div>
        </div>

        {/* Citizen Reports */}
        <Link
          href="/admin/citizen-reports"
          className="bg-white dark:bg-slate-950/80 border border-orange-200 dark:border-orange-900/40 hover:border-orange-400 dark:hover:border-orange-700/60 rounded-2xl p-4 shadow-sm relative overflow-hidden group transition"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">{b("Citizen Tips", "नागरिक सूचनाएं")}</span>
            <ShieldAlert size={18} className="text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-300">
            {loading ? "..." : data?.stats.pendingCitizenReports}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{b("Pending Verification", "जांच हेतु लंबित")}</span>
            <ArrowUpRight size={12} className="text-orange-500 dark:text-orange-400" />
          </div>
        </Link>

        {/* Field Assignments */}
        <Link
          href="/admin/assignments"
          className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 shadow-sm relative overflow-hidden group transition"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{b("Field Assignments", "सक्रिय फील्ड असाइनमेंट")}</span>
            <Users size={18} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-700 dark:text-cyan-300">
            {loading ? "..." : data?.stats.activeAssignments}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{data?.stats.totalReporters || 0} {b("reporters on field", "रिपोर्टर फील्ड पर")}</span>
            <ArrowUpRight size={12} className="text-cyan-500 dark:text-cyan-400" />
          </div>
        </Link>

        {/* Social Publishing Queue */}
        <Link
          href="/admin/social"
          className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 shadow-sm relative overflow-hidden group transition"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">{b("Social Publishing Queue", "सोशल मीडिया कतार")}</span>
            <Share2 size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
            {loading ? "..." : data?.stats.scheduledSocialPosts}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{b("7-Platform Automation", "7 प्लेटफ़ॉर्म ऑटोमेशन")}</span>
            <ArrowUpRight size={12} className="text-emerald-500 dark:text-emerald-400" />
          </div>
        </Link>
      </div>

      {/* Operations 2-Column Grid: Left (Editorial Pipeline) / Right (AI Assistant & Logs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Editorial Queue & Recent Published Articles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Editorial Review & Approval Pipeline */}
          <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock size={18} className="text-amber-500 dark:text-amber-400" />
                  {b("Editorial Review Queue", "संपादकीय कतार (Editorial Review Queue)")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {b("Drafts prepared by reporters and AI awaiting review and approval", "रिपोर्टरों और AI द्वारा तैयार ड्राफ्ट जिन्हें सत्यापन और स्वीकृति की आवश्यकता है")}
                </p>
              </div>
              <Link
                href="/admin/editorial"
                className="text-xs font-bold text-[#E11D48] dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                {b("View All", "सभी देखें")} <ArrowUpRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">{b("Loading...", "लोड हो रहा है...")}</div>
            ) : !data?.publishingQueue.length ? (
              <div className="py-8 text-center text-xs text-slate-500">
                {b("No stories pending review. Everything is approved.", "वर्तमान में कोई समाचार समीक्षाधीन नहीं है। सभी स्वीकृत हैं।")}
              </div>
            ) : (
              <div className="space-y-3">
                {data.publishingQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            item.status === "UNDER_REVIEW"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                              : item.status === "APPROVED"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.aiGenerated && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1">
                            <Bot size={10} /> {b("AI Draft", "AI ड्राफ्ट")}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {item.category} • {item.district || b("Haryana", "हरियाणा")}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {b("Author / Reporter:", "लेखक / रिपोर्टर:")} <span className="text-slate-800 dark:text-slate-300 font-medium">{item.author}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {hasPermission("PUBLISH_NEWS") && (
                        <button
                          onClick={() => handlePublishNow(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                        >
                          <CheckCircle2 size={13} />
                          {b("Approve & Go Live", "स्वीकृत व लाइव करें")}
                        </button>
                      )}
                      <Link
                        href={`/admin/news/edit?id=${item.id}`}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition"
                        title={b("Edit / Review", "संपादन / समीक्षा")}
                      >
                        <FileEdit size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent News Articles Management Table */}
          <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Newspaper size={18} className="text-blue-500 dark:text-blue-400" />
                  {b("Recent News Bulletins", "हालिया समाचार बुलेटिन")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {b("Latest published stories active on the public portal", "लाइव पोर्टल पर उपलब्ध नवीनतम प्रकाशित समाचार")}
                </p>
              </div>
              <Link
                href="/admin/editorial"
                className="text-xs font-bold text-[#E11D48] dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                {b("Manage", "प्रबंधन करें")} <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">{b("Title & Category", "शीर्षक व श्रेणी")}</th>
                    <th className="p-3">{b("Status", "स्थिति")}</th>
                    <th className="p-3 text-center">{b("Readers", "पाठक")}</th>
                    <th className="p-3 text-right">{b("Actions", "कार्रवाई")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
                  {data?.recentArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                      <td className="p-3 max-w-xs sm:max-w-md">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{article.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-[#E11D48] dark:text-rose-400 font-semibold">{article.category}</span>
                          <span>•</span>
                          <span>{article.district || b("Haryana", "हरियाणा")}</span>
                          {article.isBreaking && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-[#E11D48] dark:text-rose-400 font-bold border border-rose-500/30">
                              BREAKING
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {article.status || "PUBLISHED"}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-800 dark:text-slate-200">
                        {article.views?.toLocaleString(lang === "hi" ? "hi-IN" : "en-US") || 0}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/article/${article.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
                            title="View Public Article"
                          >
                            <ArrowUpRight size={13} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Assistant Quick Workspace & Citizen Triage */}
        <div className="space-y-6">
          {/* AI News Desk Quick Generator */}
          <div className="bg-gradient-to-b from-indigo-50 dark:from-indigo-950/50 to-white dark:to-slate-950 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-indigo-900/40 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI News Desk</h3>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-300 font-medium">{b("Instant Story Drafter", "त्वरित समाचार ड्राफ्टर")}</div>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              {b("Enter press releases, topics or field notes to instantly generate packages and social threads.", "प्रेस विज्ञप्ति, विषय या फील्ड नोट्स दर्ज करके तुरंत पूर्ण समाचार पैकेज और सोशल पोस्ट तैयार करें।")}
            </p>

            <Link
              href="/admin/ai-newsroom"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Bot size={15} />
              {b("Open AI News Desk", "पूर्ण AI न्यूज़रूम खोलें")}
            </Link>
          </div>

          {/* Citizen Reporter Tips Desk */}
          <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert size={16} className="text-orange-500 dark:text-orange-400" />
                {b("Citizen Journalism Tips", "नागरिक पत्रकारिता सूचनाएं")}
              </h3>
              <Link
                href="/admin/citizen-reports"
                className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                {b("View All", "सभी देखें")}
              </Link>
            </div>

            {loading ? (
              <div className="py-4 text-center text-xs text-slate-400">{b("Loading...", "लोड हो रहा है...")}</div>
            ) : !data?.recentCitizenReports.length ? (
              <div className="py-4 text-center text-xs text-slate-500">{b("No new citizen tips.", "कोई नई सूचना नहीं है।")}</div>
            ) : (
              <div className="space-y-3">
                {data.recentCitizenReports.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30">
                        {tip.district}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {b("Urgency:", "अर्जेंसी:")} {tip.aiClassification?.urgencyScore || 75}%
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{tip.headline}</div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-[11px]">{tip.description}</p>
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{b("From:", "प्रेषक:")} {tip.citizenName}</span>
                      <Link
                        href={`/admin/citizen-reports?id=${tip.id}`}
                        className="text-[#E11D48] dark:text-rose-400 font-bold hover:underline"
                      >
                        {b("Assign to Reporter →", "रिपोर्टर को सौंपें →")}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Audit Log Feed */}
          <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {b("Audit Logs (Newsroom Activity)", "ऑडिट लॉग (Newsroom Activity)")}
              </h3>
              <Link
                href="/admin/audit-logs"
                className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {b("Full History", "पूर्ण इतिहास")}
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {data?.recentLogs.length === 0 ? (
                <div className="text-slate-400 text-center py-3 text-[11px]">
                  {b("Session active: all activities are being recorded.", "सत्र प्रारंभ: सभी गतिविधियां रिकॉर्ड की जा रही हैं।")}
                </div>
              ) : (
                data?.recentLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{log.userName}</span>
                      <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-US")}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">{log.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
