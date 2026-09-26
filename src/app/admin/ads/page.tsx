"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Eye,
  MousePointerClick,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ExternalLink,
  Target,
  Calendar,
  Sparkles,
  BarChart2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AdCampaign } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import { useSettings } from "@/lib/settingsContext";
import PermissionGuard from "@/components/PermissionGuard";

export default function AdminAdsPage() {
  const { hasPermission } = useAuth();
  const { lang, b } = useLanguage();
  const { settings } = useSettings();
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlacement, setFilterPlacement] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Ad Form State
  const [formData, setFormData] = useState({
    advertiserName: "",
    campaignTitle: "",
    placement: "header_leaderboard" as AdCampaign["placement"],
    imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",
    targetUrl: "https://",
    districtTarget: "Haryana",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ads");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setAds(data.ads);
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
    fetchAds();
  }, []);

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        alert("विज्ञापन बनाने में त्रुटि (अमान्य सर्वर प्रतिक्रिया)");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setNotification("नया विज्ञापन अभियान सफलतापूर्वक सक्रिय किया गया!");
        setShowCreateModal(false);
        fetchAds();
      } else {
        alert(data.error || "विज्ञापन बनाने में त्रुटि");
      }
    } catch (err) {
      console.error(err);
      alert("सर्वर से संपर्क करने में असमर्थ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (ad: AdCampaign) => {
    const nextStatus = ad.status === "active" ? "paused" : "active";
    try {
      const res = await fetch("/api/ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ad.id, status: nextStatus }),
      });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setAds((prev) =>
            prev.map((item) => (item.id === ad.id ? { ...item, status: nextStatus } : item))
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm("क्या आप इस विज्ञापन अभियान को हटाना चाहते हैं?")) return;
    try {
      const res = await fetch(`/api/ads?id=${id}`, { method: "DELETE" });
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setAds((prev) => prev.filter((a) => a.id !== id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics calculation
  const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const overallCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
  const activeCount = ads.filter((a) => a.status === "active").length;
  // Sample estimated revenue calculation (e.g. ₹45 per 1000 impressions + ₹12 per click)
  const estimatedRevenue = Math.round((totalImpressions / 1000) * 45 + totalClicks * 12);

  const filteredAds = filterPlacement === "all"
    ? ads
    : ads.filter((a) => a.placement === filterPlacement);

  return (
    <PermissionGuard permission="MANAGE_ADS">
      <div className="space-y-6">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <DollarSign className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                {b("Ad Operations & Monetization", "विज्ञापन डेस्क एवं मुद्रीकरण (Ad Operations)")}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                  Revenue Hub
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {b(
                  "Haryana Digital Network ad campaigns, CTR performance tracking, and geo-targeted slots",
                  "हरियाणा डिजिटल नेटवर्क विज्ञापन अभियान, सीटीआर ट्रैकिंग एवं ज़िला-वार टार्गेटिंग"
                )}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{b("Create New Campaign", "नया विज्ञापन बनाएं (New Campaign)")}</span>
        </button>
      </div>

      {!settings.ads_enabled && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {b(
                "Display Ads are currently globally disabled in Site Settings. Ad banners will not render on public pages.",
                "साइट सेटिंग्स में विज्ञापन (Ads) वर्तमान में वैश्विक रूप से बंद (Disabled) हैं। सार्वजनिक वेबसाइट पर विज्ञापन प्रदर्शित नहीं होंगे।"
              )}
            </span>
          </div>
          <Link href="/admin/settings" className="font-bold underline ml-2 shrink-0">
            {b("Enable in Settings ›", "सेटिंग्स में चालू करें ›")}
          </Link>
        </div>
      )}

      {notification && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs underline hover:text-emerald-950 dark:hover:text-white cursor-pointer">
            {b("Dismiss", "बंद करें")}
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Active Campaigns", "सक्रिय अभियान (Active)")}</span>
            <Target className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {activeCount} <span className="text-xs text-slate-500">/ {ads.length}</span>
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">{b("Slots Live", "स्लॉट्स लाइव")}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Impressions", "इम्प्रेशन्स (Impressions)")}</span>
            <Eye className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalImpressions.toLocaleString()}
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">{b("Total Reach", "कुल रीच")}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Clicks", "क्लिक्स (Clicks)")}</span>
            <MousePointerClick className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">{b("Direct Engagement", "प्रत्यक्ष सहभागिता")}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Avg CTR", "सीटीआर (Avg CTR)")}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {overallCtr}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">{b("Benchmark: 1.8%", "उद्योग मानक: 1.8%")}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 col-span-2 lg:col-span-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Est Revenue", "अनुमानित राजस्व (Est Revenue)")}</span>
            <DollarSign className="w-4 h-4 text-teal-500 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹{estimatedRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1 font-semibold">{b("CPM + CPC Model", "CPM + CPC मॉडल")}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", label: b("All Placements", "सभी स्लॉट (All Placements)") },
          { id: "header_leaderboard", label: "Header Leaderboard (728x90)" },
          { id: "sidebar_sticky", label: "Sidebar Sticky (300x600)" },
          { id: "in_article", label: "In-Article Native (800x450)" },
          { id: "footer_banner", label: "Footer Banner" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPlacement(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterPlacement === tab.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            {b("Active & Scheduled Ad Campaigns", "सक्रिय एवं निर्धारित विज्ञापन अभियान")} ({filteredAds.length})
          </h3>
          <span className="text-xs text-slate-500">Live Ad Server Running</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">{b("Loading ads...", "लोड हो रहा है...")}</div>
        ) : filteredAds.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            {b("No ads found in this placement.", "इस स्लॉट में कोई विज्ञापन नहीं मिला।")}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {filteredAds.map((ad) => {
              const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : "0.00";
              const isActive = ad.status === "active";

              return (
                <div
                  key={ad.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  {/* Left: Banner preview & title */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-slate-100 dark:bg-slate-900">
                      <Image
                        src={ad.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80"}
                        alt={ad.campaignTitle}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {ad.placement.replace("_", " ")}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          {b("Target:", "लक्ष्य:")} {ad.districtTarget || "Haryana"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40"
                              : "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40"
                          }`}
                        >
                          {isActive ? b("● LIVE ACTIVE", "● सक्रिय (LIVE)") : b("PAUSED", "रोक दिया गया")}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 truncate">
                        {ad.campaignTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{ad.advertiserName}</span>
                        <span>•</span>
                        <a
                          href={ad.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-blue-500 dark:text-blue-400 hover:underline"
                        >
                          <span>URL</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span>•</span>
                        <span className="text-slate-500 text-[11px]">
                          {b("Expires:", "समाप्ति:")} {ad.endDate}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Stats & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400">{b("Impressions", "इम्प्रेशन्स")}</div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {ad.impressions.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500 dark:text-slate-400">{b("Clicks", "क्लिक्स")}</div>
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {ad.clicks.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <div className="text-xs text-slate-500 dark:text-slate-400">{b("CTR", "सीटीआर")}</div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {ctr}%
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(ad)}
                        title={isActive ? b("Pause Campaign", "रोकें (Pause)") : b("Activate Campaign", "सक्रिय करें (Activate)")}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        {isActive ? (
                          <ToggleRight className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        title={b("Delete", "हटाएं")}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Ad Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                {b("Launch New Ad Campaign", "नया विज्ञापन अभियान बनाएं (Launch Ad Campaign)")}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAd} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Campaign Title *", "अभियान का शीर्षक (Campaign Title) *")}
                </label>
                <input
                  type="text"
                  required
                  placeholder={b("e.g. Haryana Agri Expo 2026", "उदा. हरियाणा कृषि यंत्र मेला 2026")}
                  value={formData.campaignTitle}
                  onChange={(e) => setFormData({ ...formData, campaignTitle: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Advertiser Name *", "विज्ञापनदाता का नाम (Advertiser Name) *")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={b("e.g. AgroCorp Haryana", "उदा. AgroCorp Haryana")}
                    value={formData.advertiserName}
                    onChange={(e) => setFormData({ ...formData, advertiserName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Slot Placement *", "विज्ञापन स्थान (Slot Placement) *")}
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="header_leaderboard">Header Leaderboard (728x90)</option>
                    <option value="sidebar_sticky">Sidebar Sticky (300x600)</option>
                    <option value="in_article">In-Article Native (800x450)</option>
                    <option value="footer_banner">Footer Banner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Banner Image URL *", "बैनर इमेज URL (Banner Image URL) *")}
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Target Link (Landing Page URL) *", "टारगेट लिंक (Landing Page URL) *")}
                </label>
                <input
                  type="url"
                  required
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Target District", "ज़िला लक्ष्य (Target District)")}
                  </label>
                  <select
                    value={formData.districtTarget}
                    onChange={(e) => setFormData({ ...formData, districtTarget: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="South Haryana">{b("All South Haryana", "संपूर्ण साउथ हरियाणा (All)")}</option>
                    <option value="Mahendergarh">{b("Mahendergarh / Narnaul", "महेंद्रगढ़ / नारनौल")}</option>
                    <option value="Rewari">{b("Rewari / Bawal", "रेवाड़ी / बावल")}</option>
                    <option value="Gurugram">{b("Gurugram / Manesar", "गुरुग्राम / मानेसर")}</option>
                    <option value="Faridabad">{b("Faridabad / Ballabhgarh", "फरीदाबाद / बल्लभगढ़")}</option>
                    <option value="Nuh">{b("Nuh / Mewat", "नूह / मेवात")}</option>
                    <option value="Palwal">{b("Palwal / Hodal", "पलवल / होडल")}</option>
                    <option value="Jhajjar">{b("Jhajjar / Bahadurgarh", "झज्जर / बहादुरगढ़")}</option>
                    <option value="Charkhi Dadri">{b("Charkhi Dadri", "चरखी दादरी")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Start Date", "आरंभ तिथि (Start Date)")}
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {b("End Date", "समाप्ति तिथि (End Date)")}
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  {b("Cancel", "रद्द करें")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? b("Launching...", "सक्रिय कर रहे हैं...") : b("Launch Ad Campaign", "अभियान लॉन्च करें (Launch Ad)")}
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
