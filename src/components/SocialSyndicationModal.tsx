"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  Copy,
  ExternalLink,
  Share2,
  Send,
  Sparkles,
} from "lucide-react";
import { SocialPostPayload } from "@/lib/socialFormatter";
import { useLanguage } from "@/lib/languageContext";

interface SocialSyndicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Record<string, SocialPostPayload>;
  articleTitle: string;
}

export default function SocialSyndicationModal({
  isOpen,
  onClose,
  posts,
  articleTitle,
}: SocialSyndicationModalProps) {
  const { b } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("facebook");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const tabs = [
    { id: "facebook", name: "Facebook", bg: "bg-[#1877F2]", color: "text-[#1877F2]" },
    { id: "instagram", name: "Instagram", bg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]", color: "text-[#dc2743]" },
    { id: "youtube", name: "YouTube", bg: "bg-[#FF0000]", color: "text-[#FF0000]" },
    { id: "whatsapp", name: "WhatsApp", bg: "bg-[#25D366]", color: "text-[#25D366]" },
    { id: "twitter", name: "X (Twitter)", bg: "bg-black", color: "text-black" },
  ];

  const currentPost = posts[activeTab] || Object.values(posts)[0];

  const handleCopy = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDirectShare = (tabId: string) => {
    const post = posts[tabId];
    if (!post) return;

    if (tabId === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.text)}`, "_blank");
    } else if (tabId === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text)}`, "_blank");
    } else if (tabId === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.shareUrl)}`, "_blank");
    } else if (tabId === "instagram") {
      // Instagram doesn't have a direct prefill web URL, so copy caption and open Creator Studio/Web
      handleCopy(post.text, tabId);
      window.open("https://business.facebook.com/creatorstudio", "_blank");
    } else if (tabId === "youtube") {
      handleCopy(post.text, tabId);
      window.open("https://studio.youtube.com", "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-gray-950 via-slate-900 to-gray-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d90000] flex items-center justify-center text-white shadow-xs">
              <Share2 size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2">
                <span>{b("Social Media Auto-Posting Hub", "सोशल मीडिया ऑटो-पोस्टिंग हब")}</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  {b("Published", "प्रकाशित")}
                </span>
              </h3>
              <p className="text-xs text-slate-300 truncate max-w-md">
                {articleTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-[#d90000] text-slate-900 dark:text-white bg-white dark:bg-slate-900"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${tab.bg}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content: Platform Formatted Payload */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#d90000]" />
              <span>{b(`Customized Format for ${activeTab.toUpperCase()}:`, `${activeTab.toUpperCase()} के लिए कस्टमाइज्ड फॉर्मेट:`)}</span>
            </span>
            <span>{currentPost?.text?.length || 0} {b("characters", "अक्षर")}</span>
          </div>

          {/* Formatted Text Preview Area */}
          <div className="relative">
            <textarea
              readOnly
              value={currentPost?.text || ""}
              rows={9}
              className="w-full p-3.5 text-xs sm:text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none select-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => handleCopy(currentPost?.text || "", activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                copiedTab === activeTab
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {copiedTab === activeTab ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedTab === activeTab ? b("Copied!", "कॉपी हो गया!") : b("Copy Text", "टेक्स्ट कॉपी करें")}</span>
            </button>

            <button
              onClick={() => handleDirectShare(activeTab)}
              className="flex items-center gap-1.5 bg-[#d90000] hover:bg-[#b80000] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Send size={14} />
              <span>
                {activeTab === "whatsapp"
                  ? b("Share on WhatsApp", "WhatsApp पर शेयर करें")
                  : activeTab === "twitter"
                  ? b("Post on X", "X पर पोस्ट करें")
                  : activeTab === "facebook"
                  ? b("Post to Facebook", "Facebook पर पोस्ट करें")
                  : b(`Open & Post to ${activeTab.toUpperCase()}`, `${activeTab.toUpperCase()} खोलें व पोस्ट करें`)}
              </span>
              <ExternalLink size={12} className="ml-0.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {b("Ground Zero Newsroom Syndication Engine", "ग्राउंड ज़ीरो न्यूज़ सोशल सिंडिकेशन इंजन")}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-black dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {b("Done", "पूर्ण")}
          </button>
        </div>
      </div>
    </div>
  );
}
