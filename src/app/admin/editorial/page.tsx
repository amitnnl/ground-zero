"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Bot,
  Filter,
  Search,
  ExternalLink,
  Flame,
  ArrowUpDown,
  FileEdit,
  ShieldCheck,
  Send,
  Calendar,
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react";
import { Article, ArticleStatus } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import HumanVerificationModal from "@/components/HumanVerificationModal";
import PermissionGuard from "@/components/PermissionGuard";

export default function EditorialQueuePage() {
  const { currentUser, hasPermission } = useAuth();
  const { b, lang } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<ArticleStatus | "ALL" | "AI_DRAFTS">("ALL");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectModalArticle, setRejectModalArticle] = useState<Article | null>(null);
  const [verificationModalArticle, setVerificationModalArticle] = useState<Article | null>(null);
  const [deleteModalArticle, setDeleteModalArticle] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/articles?status=all");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setArticles(data.articles);
          }
        }
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    setDeletingArticle(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionSuccess(b("News article permanently deleted!", "समाचार स्थायी रूप से हटा दिया गया!"));
        setTimeout(() => setActionSuccess(null), 4000);
        setDeleteModalArticle(null);
        fetchArticles();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Failed to delete article");
      }
    } catch (err) {
      console.error("Error deleting article:", err);
    } finally {
      setDeletingArticle(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ArticleStatus, extraData: Record<string, any> = {}) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          editorId: currentUser.id,
          editorName: currentUser.name,
          ...extraData,
        }),
      });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setActionSuccess(`स्थिति सफलतापूर्वक "${newStatus}" में अद्यतित की गई।`);
          setTimeout(() => setActionSuccess(null), 4000);
          fetchArticles();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBreaking = async (article: Article) => {
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBreaking: !article.isBreaking }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, isBreaking: !a.isBreaking } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLeadStory = async (article: Article) => {
    try {
      const newLead = !article.isLeadStory;
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLeadStory: newLead }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, isLeadStory: newLead } : a))
        );
        setActionSuccess(
          newLead
            ? `समाचार "${article.title.substring(0, 35)}..." को होमपेज पर शीर्ष मुख्य समाचार (Lead Story) बना दिया गया है।`
            : `समाचार से मुख्य समाचार का दर्जा हटा दिया गया है।`
        );
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalArticle) return;

    await handleUpdateStatus(rejectModalArticle.id, "NEEDS_CHANGES", {
      rejectionReason: rejectionReason,
    });
    setRejectModalArticle(null);
    setRejectionReason("");
  };

  // Filter logic
  const filtered = articles.filter((a) => {
    if (selectedTab === "AI_DRAFTS") {
      if (!a.aiGenerated) return false;
    } else if (selectedTab !== "ALL") {
      if ((a.status || "PUBLISHED") !== selectedTab) return false;
    }

    if (districtFilter !== "all") {
      if (
        !a.district?.toLowerCase().includes(districtFilter.toLowerCase()) &&
        !a.tags?.some((t) => t.toLowerCase().includes(districtFilter.toLowerCase()))
      ) {
        return false;
      }
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const getStatusBadge = (status?: ArticleStatus) => {
    switch (status) {
      case "PUBLISHED":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{b("Live / Published", "लाइव / प्रकाशित")}</span>;
      case "APPROVED":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">{b("Approved", "स्वीकृत (Approved)")}</span>;
      case "UNDER_REVIEW":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">{b("Under Review", "समीक्षाधीन (Under Review)")}</span>;
      case "SUBMITTED":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">{b("Submitted by Reporter", "रिपोर्टर द्वारा प्रेषित")}</span>;
      case "NEEDS_CHANGES":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">{b("Needs Revision", "संशोधन अपेक्षित")}</span>;
      case "REJECTED":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">{b("Rejected", "अस्वीकृत (Rejected)")}</span>;
      case "SCHEDULED":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">{b("Scheduled", "शेड्यूल किया गया")}</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">{b("Draft", "ड्राफ्ट (Draft)")}</span>;
    }
  };

  return (
    <PermissionGuard permission="APPROVE_NEWS">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Newspaper className="text-rose-500" />
            {b("Editorial Review & Publishing Desk (Editorial Queue)", "संपादकीय समीक्षा एवं प्रकाशन डेस्क (Editorial Queue)")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {b("9-Tier Editorial Workflow: Draft → Reporter Submission → Fact-Check → Approval → Scheduling → Publishing", "9-स्तरीय संपादकीय वर्कफ़्लो: ड्राफ्ट → रिपोर्टर प्रेषण → तथ्य जांच → स्वीकृति → शेड्यूलिंग → प्रकाशन")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/new"
            className="px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
          >
            {b("+ Write New Story", "+ नया समाचार लिखें")}
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          {actionSuccess}
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto shadow-xs">
        <button
          onClick={() => setSelectedTab("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedTab === "ALL" ? "bg-rose-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          {b("All Stories", "सभी समाचार")} ({articles.length})
        </button>
        <button
          onClick={() => setSelectedTab("UNDER_REVIEW")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            selectedTab === "UNDER_REVIEW" ? "bg-amber-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Clock size={12} />
          {b("Under Review", "समीक्षाधीन (Under Review)")}
        </button>
        <button
          onClick={() => setSelectedTab("SUBMITTED")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedTab === "SUBMITTED" ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          {b("Reporter Drafts", "रिपोर्टर ड्राफ्ट (Submitted)")}
        </button>
        <button
          onClick={() => setSelectedTab("AI_DRAFTS")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            selectedTab === "AI_DRAFTS" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Bot size={12} />
          {b("AI Generated Drafts", "AI जनरेटेड ड्राफ्ट्स")}
        </button>
        <button
          onClick={() => setSelectedTab("APPROVED")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedTab === "APPROVED" ? "bg-cyan-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          {b("Approved (Ready to Publish)", "स्वीकृत (Ready to Publish)")}
        </button>
        <button
          onClick={() => setSelectedTab("PUBLISHED")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedTab === "PUBLISHED" ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          {b("Live Published", "लाइव प्रकाशित")} ({articles.filter((a) => (a.status || "PUBLISHED") === "PUBLISHED").length})
        </button>
      </div>

      {/* Filters: District & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{b("District Filter:", "ज़िला फ़िल्टर:")}</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="all">{b("All South Haryana Districts", "सभी ज़िले (साउथ हरियाणा)")}</option>
            <option value="mahendergarh">महेंद्रगढ़ (Mahendergarh)</option>
            <option value="narnaul">नारनौल (Narnaul)</option>
            <option value="rewari">रेवाड़ी (Rewari)</option>
            <option value="gurugram">गुरुग्राम (Gurugram)</option>
            <option value="faridabad">फरीदाबाद (Faridabad)</option>
            <option value="nuh">नूह (Nuh / Mewat)</option>
            <option value="palwal">पलवल (Palwal)</option>
            <option value="jhajjar">झज्जर (Jhajjar)</option>
            <option value="charkhi-dadri">चरखी दादरी (Charkhi Dadri)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={b("Search title, author or keyword...", "शीर्षक, लेखक या कीवर्ड खोजें...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
          />
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">{b("Loading...", "लोड हो रहा है...")}</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
          <p className="text-slate-500 dark:text-slate-400 text-sm">{b("No stories available in this category.", "इस श्रेणी में कोई समाचार उपलब्ध नहीं है।")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(item.status)}
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-500/20">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    📍 {item.district || b("Haryana", "हरियाणा")} {item.city ? `(${item.city})` : ""}
                  </span>
                  {item.aiGenerated && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1">
                      <Bot size={11} /> {b("AI Draft", "AI Generated Draft")}
                    </span>
                  )}
                  {item.isLeadStory && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-2xs">
                      <Star size={11} className="fill-current text-amber-500" /> {b("Top / Lead Story", "शीर्ष मुख्य समाचार (Top)")}
                    </span>
                  )}
                  {item.needsVerification && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle size={11} /> {b("Fact-Check Pending", "सत्यापन आवश्यक (Fact-Check Pending)")}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  {new Date(item.createdAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Title & Excerpt */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition">
                  <Link href={`/article/${item.slug}`} target="_blank">
                    {item.title}
                  </Link>
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{item.subtitle}</p>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2">{item.excerpt}</p>
              </div>

              {/* Author, Breaking Toggle, & Action Controls */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <span>
                    {b("Author / Reporter:", "लेखक / रिपोर्टर:")} <strong className="text-slate-800 dark:text-slate-200">{item.author}</strong>
                  </span>
                  {item.views !== undefined && (
                    <span>• {item.views.toLocaleString(lang === "hi" ? "hi-IN" : "en-US")} {b("views", "व्यूज")}</span>
                  )}
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Toggle Breaking News */}
                  {hasPermission("PUBLISH_NEWS") && (
                    <button
                      onClick={() => handleToggleBreaking(item)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        item.isBreaking
                          ? "bg-rose-600 text-white border-rose-500 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      <Flame size={13} className={item.isBreaking ? "animate-pulse" : ""} />
                      {item.isBreaking ? b("Breaking Active", "ब्रेकिंग सक्रिय") : b("Make Breaking", "ब्रेकिंग बनाएं")}
                    </button>
                  )}

                  {/* Toggle Lead Story / Pin to Top */}
                  {hasPermission("PUBLISH_NEWS") && (
                    <button
                      onClick={() => handleToggleLeadStory(item)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        item.isLeadStory
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-950 dark:hover:text-white"
                      }`}
                      title={item.isLeadStory ? "शीर्ष मुख्य समाचार से हटाएं" : "होमपेज पर सबसे ऊपर (Top Story) लगाएं"}
                    >
                      <Star size={13} className={item.isLeadStory ? "fill-current text-slate-950" : ""} />
                      {item.isLeadStory ? b("★ Top Story", "★ मुख्य समाचार") : b("Make Top Story", "शीर्ष पर लगाएं")}
                    </button>
                  )}

                  {/* Move to Under Review */}
                  {item.status === "SUBMITTED" && hasPermission("APPROVE_NEWS") && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, "UNDER_REVIEW")}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-600/30 hover:bg-amber-100 dark:hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-white border border-amber-300 dark:border-amber-500/40 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Clock size={13} />
                      {b("Start Review", "समीक्षा प्रारंभ करें")}
                    </button>
                  )}

                  {/* Human Verification & Multi-Platform Distribution Pipeline */}
                  {item.status !== "PUBLISHED" && hasPermission("PUBLISH_NEWS") && (
                    <button
                      onClick={() => setVerificationModalArticle(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <ShieldCheck size={14} className="text-emerald-200" />
                      {b("Verification & Distribute", "मानव सत्यापन व ऑटो-वितरण")}
                    </button>
                  )}

                  {/* Quick Approve without Immediate Distribution */}
                  {(item.status === "UNDER_REVIEW" || item.status === "SUBMITTED" || !item.status) &&
                    hasPermission("APPROVE_NEWS") && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "APPROVED")}
                        className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-600/30 hover:bg-cyan-100 dark:hover:bg-cyan-600 text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white border border-cyan-300 dark:border-cyan-500/40 font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        {b("Approve", "स्वीकृत करें (Approve)")}
                      </button>
                    )}

                  {/* Request Changes / Reject */}
                  {item.status !== "PUBLISHED" && hasPermission("REJECT_NEWS") && (
                    <button
                      onClick={() => setRejectModalArticle(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/50 font-semibold transition flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle size={13} />
                      {b("Request Changes", "संशोधन मांगें")}
                    </button>
                  )}

                  <Link
                    href={`/admin/news/edit?id=${item.id}`}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                    title={b("Edit News", "संपादित करें")}
                  >
                    <FileEdit size={14} />
                  </Link>

                  <Link
                    href={`/article/${item.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
                    title={b("Preview Public Page", "पब्लिक व्यू")}
                  >
                    <ExternalLink size={14} />
                  </Link>

                  {hasPermission("DELETE_NEWS") && (
                    <button
                      onClick={() => setDeleteModalArticle(item)}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer"
                      title={b("Delete News Article", "समाचार स्थायी रूप से हटाएं")}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection / Needs Changes Modal */}
      {rejectModalArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-amber-400" />
                {b("Editorial Revision Instructions", "संपादकीय संशोधन निर्देश (Editorial Feedback)")}
              </h3>
              <button
                onClick={() => setRejectModalArticle(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              {b("Story:", "समाचार:")} <strong className="text-white">"{rejectModalArticle.title}"</strong>
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  {b("Reason for revision or required facts:", "संशोधन का कारण अथवा आवश्यक तथ्य:")}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={b("Please provide clear instructions for the reporter, e.g.: include police statement, verify local data...", "कृपया रिपोर्टर के लिए स्पष्ट निर्देश लिखें, जैसे: पुलिस बयान शामिल करें, स्थानीय आंकड़ों की पुष्टि करें...")}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRejectModalArticle(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {b("Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
                >
                  {b("Return to Reporter", "रिपोर्टर को वापस भेजें")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Human Verification Gate & Multi-Platform Distribution Pipeline Modal */}
      {verificationModalArticle && (
        <HumanVerificationModal
          article={verificationModalArticle}
          onClose={() => setVerificationModalArticle(null)}
          onDistributed={() => {
            setVerificationModalArticle(null);
            setActionSuccess(
              "सत्यापन संपन्न! समाचार लाइव हो चुका है और सभी 6 प्लेटफ़ॉर्म्स पर स्वचालित रूप से प्रसारित कर दिया गया है।"
            );
            setTimeout(() => setActionSuccess(null), 5000);
            fetchArticles();
          }}
        />
      )}

      {/* Delete News Confirmation Modal */}
      {deleteModalArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b("Delete News Article", "समाचार स्थायी रूप से हटाएं")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {b("This article will be completely removed from Ground Zero News.", "यह समाचार वेबसाइट से स्थायी रूप से हटा दिया जाएगा।")}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 line-clamp-3">
              {deleteModalArticle.title}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {b("Cancel", "रद्द करें")}
              </button>
              <button
                type="button"
                disabled={deletingArticle}
                onClick={() => handleDeleteArticle(deleteModalArticle.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={13} />
                {deletingArticle ? b("Deleting...", "हटाया जा रहा है...") : b("Confirm & Delete", "हटाना सुनिश्चित करें")}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PermissionGuard>
  );
}
