"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Video,
  Image as ImageIcon,
  Bot,
  CheckCircle,
  Wand2,
  Share2,
} from "lucide-react";
import SocialSyndicationModal from "@/components/SocialSyndicationModal";
import { SocialPostPayload } from "@/lib/socialFormatter";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";

function ArticleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { b, lang } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(editId));

  // AI Agent States
  const [aiTopic, setAiTopic] = useState("");
  const [aiCity, setAiCity] = useState("South Haryana");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");

  // Social Syndication States
  const [postToFacebook, setPostToFacebook] = useState(true);
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [postToYouTube, setPostToYouTube] = useState(true);
  const [postToWhatsApp, setPostToWhatsApp] = useState(true);
  const [postToTwitter, setPostToTwitter] = useState(true);

  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [socialPostsPayload, setSocialPostsPayload] = useState<Record<string, SocialPostPayload>>({});
  const [publishedArticleTitle, setPublishedArticleTitle] = useState("");

  // Article Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("हरियाणा");
  const [categorySlug, setCategorySlug] = useState("haryana");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"
  );
  const [imageCaption, setImageCaption] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Ground Zero Reporter");
  const [tagsStr, setTagsStr] = useState("Haryana, Breaking, Ground Zero");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isLeadStory, setIsLeadStory] = useState(false);

  const categories = [
    { name: b("Top News", "प्रमुख समाचार"), slug: "top" },
    { name: b("Mahendragarh / Narnaul", "महेंद्रगढ़ / नारनौल"), slug: "mahendergarh" },
    { name: b("Rewari / Bawal", "रेवाड़ी / बावल"), slug: "rewari" },
    { name: b("Gurugram / Manesar", "गुरुग्राम / मानेसर"), slug: "gurugram" },
    { name: b("Faridabad", "फरीदाबाद"), slug: "faridabad" },
    { name: b("Nuh / Mewat", "नूंह (मेवात)"), slug: "nuh" },
    { name: b("Palwal / Hodal", "पलवल / होडल"), slug: "palwal" },
    { name: b("Mandi Bhav", "मंडी भाव"), slug: "mandi-bhav" },
    { name: b("Ahirwal Special", "अहीरवाल हलचल"), slug: "ahirwal" },
  ];

  const quickPrompts = [
    b("Foundation stone laid for new 4-lane bypass in Rewari", "रेवाड़ी में नए 4-लेन बाईपास का शिलान्यास"),
    b("New specialized trauma facilities inaugurated at Narnaul Civil Hospital", "नारनौल नागरिक अस्पताल में नई स्वास्थ्य सुविधाएं"),
    b("Ahirwal Dangal championship concludes in Kanina", "कनीना में विशाल अहीरवाल केसरी दंगल का भव्य समापन"),
    b("Special security & transit checkpoints set up across Delhi-Jaipur highway NH-48 in Bawal & Dharuhera", "दिल्ली-जयपुर हाईवे NH-48 बावल व धारूहेड़ा में सघन सुरक्षा व ट्रैफिक प्रबंध"),
  ];

  // If in edit mode, fetch existing article
  useEffect(() => {
    if (editId) {
      fetch(`/api/articles/${editId}`)
        .then((res) => {
          if (!res.ok) return null;
          const ct = res.headers.get("content-type") || "";
          return ct.includes("application/json") ? res.json() : null;
        })
        .then((data) => {
          if (data?.success && data?.article) {
            const art = data.article;
            setTitle(art.title);
            setCategory(art.category);
            setCategorySlug(art.categorySlug);
            setImageUrl(art.imageUrl);
            setImageCaption(art.imageCaption || "");
            setYoutubeId(art.youtubeId || "");
            setExcerpt(art.excerpt);
            setContent(art.content);
            setAuthor(art.author);
            setTagsStr(art.tags?.join(", ") || "");
            setIsBreaking(art.isBreaking);
            setIsLeadStory(art.isLeadStory);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [editId]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = categories.find((c) => c.slug === e.target.value);
    if (selected) {
      setCategory(selected.name);
      setCategorySlug(selected.slug);
    }
  };

  // AI Generator Handler
  const handleGenerateWithAI = async (topicToUse?: string) => {
    const finalTopic = topicToUse || aiTopic;
    if (!finalTopic.trim()) {
      alert(b("Please enter a news headline or event topic.", "कृपया कोई समाचार विषय या संकेत दर्ज करें।"));
      return;
    }

    setAiLoading(true);
    setAiSuccessMessage("");

    try {
      const res = await fetch("/api/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: finalTopic,
          city: aiCity,
          categorySlug,
        }),
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        alert(b("Error generating AI draft. Please try again.", "एआई ड्राफ्ट जनरेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।"));
        return;
      }

      const data = await res.json();

      if (data.success && data.data) {
        const d = data.data;
        setTitle(d.title);
        setCategory(d.category);
        setCategorySlug(d.categorySlug);
        setExcerpt(d.excerpt);
        setContent(d.content);
        setAuthor(d.author);
        setImageUrl(d.imageUrl);
        setImageCaption(d.imageCaption || "");
        setTagsStr(d.tags?.join(", ") || "");
        setIsBreaking(Boolean(d.isBreaking));
        setIsLeadStory(Boolean(d.isLeadStory));

        setAiSuccessMessage(
          b(
            `Draft generated successfully! (${d.sourceContext || "AI News Desk"})`,
            `सफलतापूर्वक ड्राफ्ट तैयार हुआ! (${d.sourceContext || "AI News Desk"})`
          )
        );
      } else {
        alert(b("Failed to generate draft: ", "ड्राफ्ट जनरेट नहीं हो सका: ") + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert(b("Network error during AI generation.", "AI जनरेशन में नेटवर्क त्रुटि आई।"));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      category,
      categorySlug,
      imageUrl,
      imageCaption,
      youtubeId: youtubeId.trim() || undefined,
      excerpt,
      content,
      author,
      tags,
      isBreaking,
      isLeadStory,
    };

    try {
      const url = editId ? `/api/articles/${editId}` : "/api/articles";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        alert(b("Error saving article. Invalid server response.", "समाचार सहेजने में त्रुटि आई। सर्वर से अमान्य प्रतिक्रिया मिली।"));
        return;
      }

      const data = await res.json();
      if (data.success) {
        const savedArticle = data.article;
        setPublishedArticleTitle(savedArticle.title);

        // Check if any social channels are selected
        const selectedChannels = [];
        if (postToFacebook) selectedChannels.push("facebook");
        if (postToInstagram) selectedChannels.push("instagram");
        if (postToYouTube) selectedChannels.push("youtube");
        if (postToWhatsApp) selectedChannels.push("whatsapp");
        if (postToTwitter) selectedChannels.push("twitter");

        if (selectedChannels.length > 0) {
          try {
            const socialRes = await fetch("/api/social/publish", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                article: savedArticle,
                channels: selectedChannels,
              }),
            });
            const sCt = socialRes.headers.get("content-type") || "";
            if (socialRes.ok && sCt.includes("application/json")) {
              const socialData = await socialRes.json();
              if (socialData.success && socialData.posts) {
                setSocialPostsPayload(socialData.posts);
                setSocialModalOpen(true);
                return; // Wait for user to interact with social modal before routing
              }
            }
          } catch (socialErr) {
            console.error("Social cross-posting error:", socialErr);
          }
        }

        router.push("/admin");
      } else {
        alert(b("Error: ", "त्रुटि: ") + data.error);
      }
    } catch {
      alert(b("Unable to connect to the server.", "सर्वर से संपर्क करने में समस्या आई।"));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-12 text-center text-gray-500">
        {b("Loading article contents...", "समाचार डेटा लोड हो रहा है...")}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-4xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {editId
                ? b("Edit Article & Metadata", "समाचार संपादित करें (Edit Article)")
                : b("Publish News Story", "नया समाचार प्रकाशित करें (New Article)")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {b(
                "Author, review and distribute verified ground journalism across portal and social networks",
                "ग्राउंड ज़ीरो न्यूज़ पोर्टल और सोशल मीडिया चैनलों के लिए खबर प्रकाशित करें"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 🤖 AI News Reporter Assistant Card */}
      {!editId && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-gray-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-red-800/40 mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#d90000] flex items-center justify-center text-white shadow-xs">
                <Bot size={20} />
              </div>
              <div>
                <h2 className="font-black text-base sm:text-lg flex items-center gap-2 tracking-tight">
                  <span>{b("AI News Reporter Agent", "AI न्यूज़ रिपोर्टर (AI News Agent)")}</span>
                  <span className="text-[10px] bg-red-600/60 text-white border border-red-400/40 px-2 py-0.5 rounded-full font-bold">
                    {b("Auto-Writer", "ऑटो-राइटर")}
                  </span>
                </h2>
                <p className="text-xs text-gray-300">
                  {b(
                    "Simply provide a topic or bullet points — AI will auto-structure headline, category, lead excerpt, and complete draft",
                    "सिर्फ विषय लिखें — AI शीर्षक, श्रेणी, फोटो, सारांश व पूरा समाचार ऑटो-फिल कर देगा"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Input row */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder={b(
                "Enter news topic (e.g. Rewari new bypass inauguration, Narnaul healthcare inspection...)",
                "समाचार का विषय दर्ज करें (उदा. रेवाड़ी में नई सड़क का उद्घाटन, नारनौल में स्वास्थ्य निरीक्षण...)"
              )}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-gray-900/90 border border-gray-700 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:border-[#d90000]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleGenerateWithAI();
                }
              }}
            />

            <select
              value={aiCity}
              onChange={(e) => setAiCity(e.target.value)}
              className="px-3 py-2.5 text-xs bg-gray-900/90 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#d90000] font-medium"
            >
              <option value="South Haryana">{b("South Haryana", "साउथ हरियाणा")}</option>
              <option value="Rewari">{b("Rewari / Bawal", "रेवाड़ी / बावल")}</option>
              <option value="Narnaul / Mahendragarh">{b("Mahendragarh / Narnaul", "महेंद्रगढ़ / नारनौल")}</option>
              <option value="Gurugram">{b("Gurugram / Manesar", "गुरुग्राम / मानेसर")}</option>
              <option value="Faridabad">{b("Faridabad / Ballabhgarh", "फरीदाबाद / बल्लभगढ़")}</option>
              <option value="Nuh">{b("Nuh / Mewat", "नूंह / मेवात")}</option>
              <option value="Palwal">{b("Palwal / Hodal", "पलवल / होडल")}</option>
              <option value="Charkhi Dadri">{b("Charkhi Dadri / Jhajjar", "चरखी दादरी / झज्जर")}</option>
              <option value="Sports">{b("Ahirwal Sports", "अहीरवाल खेल")}</option>
            </select>

            <button
              type="button"
              onClick={() => handleGenerateWithAI()}
              disabled={aiLoading}
              className="flex items-center justify-center gap-2 bg-[#d90000] hover:bg-[#b80000] disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              {aiLoading ? (
                <>
                  <Wand2 size={16} className="animate-spin" />
                  <span>{b("Generating...", "तैयार हो रहा है...")}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>{b("Draft with AI", "AI से ड्राफ्ट करें")}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick topic chips */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-gray-400 text-[11px] font-semibold">{b("Suggested Topics:", "सुझाए गए विषय:")}</span>
            {quickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setAiTopic(q);
                  handleGenerateWithAI(q);
                }}
                className="bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-white/5"
              >
                + {q}
              </button>
            ))}
          </div>

          {/* Success Notification Banner */}
          {aiSuccessMessage && (
            <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-5 transition-colors">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {b("Story Details", "समाचार विवरण (Story Details)")}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {b("* Marked fields are mandatory", "* चिन्हित फ़ील्ड्स अनिवार्य हैं")}
          </span>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            {b("Headline *", "समाचार शीर्षक (Headline) *")}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={b("e.g. Rewari News | Grand Welcome for Minister at District Secretariat", "उदा. Rewari News | आरती राव का हुआ भव्य स्वागत : लगे नारे")}
            className="w-full px-3.5 py-2.5 text-sm md:text-base font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#d90000]"
            required
          />
        </div>

        {/* Category & Author Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              {b("Category *", "श्रेणी (Category) *")}
            </label>
            <select
              value={categorySlug}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#d90000] bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              {b("Author Byline / Bureau", "रिपोर्टर / ब्यूरो (Author Byline)")}
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={b("Ground Zero Newsroom Bureau", "ग्राउंड ज़ीरो ब्यूरो")}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#d90000]"
            />
          </div>
        </div>

        {/* Image URL & Caption */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
            <ImageIcon size={14} className="text-[#d90000]" />
            <span>{b("Featured Image URL", "मुख्य फोटो URL (Featured Image)")}</span>
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#d90000]"
            required
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400">{b("Quick Presets:", "क्विक फोटो सैंपल्स:")}</span>
            <button
              type="button"
              onClick={() =>
                setImageUrl(
                  "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80"
                )
              }
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded cursor-pointer"
            >
              {b("Politics", "राजनीति / सभा")}
            </button>
            <button
              type="button"
              onClick={() =>
                setImageUrl(
                  "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80"
                )
              }
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded cursor-pointer"
            >
              {b("Infrastructure", "सड़क / विकास")}
            </button>
            <button
              type="button"
              onClick={() =>
                setImageUrl(
                  "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80"
                )
              }
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded cursor-pointer"
            >
              {b("Festival / Cultural", "मेला / उत्सव")}
            </button>
            <button
              type="button"
              onClick={() =>
                setImageUrl(
                  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
                )
              }
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded cursor-pointer"
            >
              {b("Sports", "खेल / कुश्ती")}
            </button>
          </div>
          <input
            type="text"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            placeholder={b("Photo Caption / Source Credits", "फोटो विवरण (Image Caption)")}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
          />
        </div>

        {/* YouTube Video ID (Optional) */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
            <Video size={15} className="text-[#ff0000]" />
            <span>{b("YouTube Video ID (Optional — e.g. cJvDOqBeYG4)", "YouTube वीडियो ID (वैकल्पिक - e.g. cJvDOqBeYG4)")}</span>
          </label>
          <input
            type="text"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder={b("e.g. cJvDOqBeYG4 (11-character video ID)", "जैसे: cJvDOqBeYG4 (केवल 11 अक्षरों का वीडियो ID)")}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#d90000]"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            {b("Lead Summary / Excerpt *", "संक्षिप्त सारांश (Excerpt / Lead Summary) *")}
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder={b("Key takeaway in 1-2 concise sentences...", "खबर का 1-2 पंक्तियों में मुख्य सार...")}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#d90000]"
            required
          />
        </div>

        {/* Full Content */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            {b("Full Story Body *", "विस्तृत समाचार सामग्री (Full News Body) *")}
          </label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={b("Full news report (hit enter twice between paragraphs)...", "पूरा समाचार यहां लिखें (पैराग्राफ अलग करने के लिए दो बार Enter दबाएं)...")}
            className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#d90000] leading-relaxed"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            {b("Tags (Comma-separated)", "टैग्स (Tags - अल्पविराम से अलग करें)")}
          </label>
          <input
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            placeholder={b("Haryana, Rewari, Election, Politics", "हरियाणा, रेवाड़ी, चुनाव, राजनीति")}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#d90000]"
          />
        </div>

        {/* 📢 Social Media Cross-Posting Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-[#d90000]" />
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wide">
              {b("Multi-Platform Social Auto-Syndication", "सोशल मीडिया ऑटो-सिंडिकेशन (Multi-Platform Cross-Posting)")}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {b(
              "Upon publication, native formatted dispatches and links will be queued across chosen channels:",
              "कहानी प्रकाशित होते ही इन सभी प्लेटफॉर्म्स के अपने-अपने फॉर्मेट में पोस्ट्स तैयार हो जाएंगी:"
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {/* Facebook */}
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-[#1877F2] transition-colors">
              <input
                type="checkbox"
                checked={postToFacebook}
                onChange={(e) => setPostToFacebook(e.target.checked)}
                className="w-4 h-4 text-[#1877F2] rounded"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Facebook</span>
            </label>

            {/* Instagram */}
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-[#dc2743] transition-colors">
              <input
                type="checkbox"
                checked={postToInstagram}
                onChange={(e) => setPostToInstagram(e.target.checked)}
                className="w-4 h-4 text-[#dc2743] rounded"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Instagram</span>
            </label>

            {/* YouTube */}
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-[#FF0000] transition-colors">
              <input
                type="checkbox"
                checked={postToYouTube}
                onChange={(e) => setPostToYouTube(e.target.checked)}
                className="w-4 h-4 text-[#FF0000] rounded"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">YouTube</span>
            </label>

            {/* WhatsApp */}
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-[#25D366] transition-colors">
              <input
                type="checkbox"
                checked={postToWhatsApp}
                onChange={(e) => setPostToWhatsApp(e.target.checked)}
                className="w-4 h-4 text-[#25D366] rounded"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">WhatsApp</span>
            </label>

            {/* X / Twitter */}
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-black transition-colors">
              <input
                type="checkbox"
                checked={postToTwitter}
                onChange={(e) => setPostToTwitter(e.target.checked)}
                className="w-4 h-4 text-black dark:text-white rounded"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">X (Twitter)</span>
            </label>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="w-4 h-4 text-[#d90000] accent-[#d90000] rounded"
            />
            <span className="flex items-center gap-1">
              <Sparkles size={14} className="text-[#d90000]" />
              <span>{b("Show on Breaking News Marquee Ticker", "ब्रेकिंग न्यूज़ टिकर में दिखाएं (Show on Marquee Ticker)")}</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={isLeadStory}
              onChange={(e) => setIsLeadStory(e.target.checked)}
              className="w-4 h-4 text-[#d90000] accent-[#d90000] rounded"
            />
            <span>{b("Featured Homepage Lead Story", "होमपेज पर मुख्य लीड स्टोरी बनाएं (Make Lead Story)")}</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {b("Cancel", "रद्द करें (Cancel)")}
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#d90000] hover:bg-[#b80000] disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Save size={16} />
            <span>
              {loading
                ? b("Publishing article...", "प्रकाशित हो रहा है...")
                : b("Publish & Syndicate to Social", "प्रकाशित करें व सोशल शेयर करें (Publish & Post)")}
            </span>
          </button>
        </div>
      </form>

      {/* Social Syndication Hub Modal */}
      <SocialSyndicationModal
        isOpen={socialModalOpen}
        onClose={() => {
          setSocialModalOpen(false);
          router.push("/admin");
        }}
        posts={socialPostsPayload}
        articleTitle={publishedArticleTitle}
      />
    </div>
  );
}

export default function NewArticlePage() {
  const { b } = useLanguage();
  return (
    <PermissionGuard permission="CREATE_NEWS">
      <Suspense fallback={<div className="p-8 text-center text-gray-400">{b("Loading editor...", "लोड हो रहा है...")}</div>}>
        <ArticleForm />
      </Suspense>
    </PermissionGuard>
  );
}
