"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  Sparkles,
  FileText,
  Link2,
  Mic,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Send,
  Save,
  Share2,
  Tv,
  Languages,
  Clock,
  Copy,
  Check,
  ChevronDown,
  Layers,
  Flame,
  Search,
  ShieldCheck,
  Star,
  ImageIcon,
  UploadCloud,
  Trash2,
  RefreshCw,
  Camera,
  ExternalLink,
  Eye,
  Wand2,
  Plus,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";
import HumanVerificationModal from "@/components/HumanVerificationModal";
import PermissionGuard from "@/components/PermissionGuard";
import { Article } from "@/lib/types";

// Curated South Haryana beat presets for news photography
const SOUTH_HARYANA_IMAGE_PRESETS = [
  {
    id: "highway",
    name: "रेवाड़ी-गुरुग्राम हाईवे / NH-48",
    nameEn: "Rewari-Gurugram Highway",
    url: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    caption: "रेवाड़ी-गुरुग्राम राष्ट्रीय राजमार्ग एवं आधुनिक हाईवे कॉरिडोर का दृश्य",
    credit: "ग्राउंड ज़ीरो ब्यूरो",
  },
  {
    id: "hospital",
    name: "नारनौल अस्पताल / स्वास्थ्य",
    nameEn: "Narnaul Civil Hospital",
    url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    caption: "नारनौल नागरिक अस्पताल एवं नवनिर्मित अत्याधुनिक ट्रॉमा सेंटर परिसर",
    credit: "विशेष संवाददाता",
  },
  {
    id: "mandi",
    name: "अनाज मंडी / किसान",
    nameEn: "Grain Mandi / Agriculture",
    url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80",
    caption: "नई अनाज मंडी में फसल की आवक व न्यूनतम समर्थन मूल्य पर खरीद कार्य",
    credit: "ग्राउंड ज़ीरो ब्यूरो",
  },
  {
    id: "admin",
    name: "प्रशासन / डीसी सचिवालय",
    nameEn: "DC Office / Secretariat",
    url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    caption: "जिला लघु सचिवालय परिसर एवं प्रशासनिक बैठक कक्ष",
    credit: "डीआईपीआरओ",
  },
  {
    id: "police",
    name: "हरियाणा पुलिस / सुरक्षा",
    nameEn: "Haryana Police / Security",
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    caption: "कानून व्यवस्था बनाए रखने हेतु जिले भर में पुलिस का सघन जांच अभियान",
    credit: "पुलिस पीआरओ",
  },
  {
    id: "sports",
    name: "दंगल / कुश्ती खेल",
    nameEn: "Dangal / Sports Arena",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    caption: "अहीरवाल क्षेत्र में आयोजित पारंपरिक कुश्ती दंगल में दांव-पेंच आजमाते पहलवान",
    credit: "ग्राउंड ज़ीरो खेल डेस्क",
  },
];

const PHOTO_CREDIT_TAGS = [
  "ग्राउंड ज़ीरो ब्यूरो",
  "विशेष संवाददाता",
  "फाइल फोटो",
  "PTI / भाषा",
  "ANI",
  "साभार: सोशल मीडिया",
  "डीआईपीआरओ हरियाणा",
];

type Mode = "topic" | "source_text" | "notes" | "url" | "audio";

export default function AINewsroomPage() {
  const router = useRouter();
  const { currentUser, hasPermission } = useAuth();
  const { b } = useLanguage();
  const [verificationArticle, setVerificationArticle] = useState<Article | null>(null);

  // Mode Selection
  const [activeMode, setActiveMode] = useState<Mode>("topic");
  const [topicInput, setTopicInput] = useState(
    "नारनौल में नए ट्रॉमा सेंटर और 100 बेड वाले आधुनिक अस्पताल भवन का शिलान्यास"
  );
  const [cityInput, setCityInput] = useState("महेंद्रगढ़ (नारनौल)");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Center Pane: Editable Article Draft
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("साउथ हरियाणा");
  const [categorySlug, setCategorySlug] = useState("south-haryana");
  const [district, setDistrict] = useState("महेंद्रगढ़");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  // Featured Image & Caption Studio State
  const [imageTab, setImageTab] = useState<"upload" | "url" | "presets">("upload");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isLeadStory, setIsLeadStory] = useState(false);

  // Right Pane: AI Intelligence Assets
  const [headlineVariants, setHeadlineVariants] = useState<Record<string, string>>({});
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [factCheck, setFactCheck] = useState<any>(null);
  const [socialVariants, setSocialVariants] = useState<any>(null);
  const [scripts, setScripts] = useState<any>(null);
  const [translations, setTranslations] = useState<any>(null);
  const [activeToolTab, setActiveToolTab] = useState<"headlines" | "factcheck" | "social" | "scripts" | "translate" | "preview">("headlines");

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError(b("Please select an image file (JPG, PNG, WEBP, GIF, AVIF)", "कृपया केवल फ़ोटो फ़ाइल चुनें (JPG, PNG, WEBP, GIF, AVIF)"));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(b("Image size must be less than 10MB", "तस्वीर का आकार 10MB से अधिक नहीं होना चाहिए (अधिकतम 10MB)"));
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setImageUrl(data.url);
          if (!imageCaption.trim()) {
            const cleanTitle = title.trim();
            setImageCaption(cleanTitle ? `${cleanTitle} (फोटो: ग्राउंड ज़ीरो ब्यूरो)` : `घटना स्थल की तस्वीर (फोटो: ग्राउंड ज़ीरो ब्यूरो)`);
          }
          setIsUploadingImage(false);
          return;
        }
      }

      // Resilient FileReader data-URL fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setImageUrl(dataUrl);
          if (!imageCaption.trim()) {
            const cleanTitle = title.trim();
            setImageCaption(cleanTitle ? `${cleanTitle} (फोटो: ग्राउंड ज़ीरो ब्यूरो)` : `घटना स्थल की तस्वीर (फोटो: ग्राउंड ज़ीरो ब्यूरो)`);
          }
        }
        setIsUploadingImage(false);
      };
      reader.onerror = () => {
        setUploadError(b("Failed to read image file", "तस्वीर पढ़ने में त्रुटि हुई"));
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn("Upload request failed, using data URL fallback:", err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setImageUrl(dataUrl);
          if (!imageCaption.trim()) {
            const cleanTitle = title.trim();
            setImageCaption(cleanTitle ? `${cleanTitle} (फोटो: ग्राउंड ज़ीरो ब्यूरो)` : `घटना स्थल की तस्वीर (फोटो: ग्राउंड ज़ीरो ब्यूरो)`);
          }
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const handleApplyHeadlineAsCaption = () => {
    if (!title.trim()) {
      alert("कृपया पहले मुख्य शीर्षक (Headline) दर्ज करें।");
      return;
    }
    setImageCaption(`${title.trim()} (फोटो: ग्राउंड ज़ीरो ब्यूरो)`);
  };

  const handleAddCredit = (credit: string) => {
    if (!imageCaption.trim()) {
      setImageCaption(`घटना स्थल की तस्वीर (फोटो: ${credit})`);
      return;
    }
    if (/\(फोटो:[^)]+\)/.test(imageCaption)) {
      setImageCaption(imageCaption.replace(/\(फोटो:[^)]+\)/, `(फोटो: ${credit})`));
    } else {
      setImageCaption(`${imageCaption.trim()} (फोटो: ${credit})`);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicInput,
          sourceText: topicInput,
          city: cityInput,
          mode: activeMode,
        }),
      });

      if (!res.ok) {
        console.warn("AI generation failed with status:", res.status);
        alert("AI सेवा प्रतिक्रिया देने में असमर्थ रही। कृपया पुनः प्रयास करें।");
        return;
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("AI generation returned non-JSON:", contentType);
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setTitle(d.title);
        setSubtitle(d.subtitle || "");
        setCategory(d.category);
        setCategorySlug(d.categorySlug);
        setDistrict(d.district || "महेंद्रगढ़");
        setExcerpt(d.excerpt);
        setContent(d.content);
        setImageUrl(d.imageUrl);
        setImageCaption(d.imageCaption);
        setTags(d.tags || []);
        setIsBreaking(d.isBreaking || false);

        setHeadlineVariants(d.headlineVariants || {});
        setKeyPoints(d.keyPoints || []);
        setFactCheck(d.factCheckAssistant);
        setSocialVariants(d.socialVariants);
        setScripts(d.scripts);
        setTranslations(d.translations);
      }
    } catch (err) {
      console.error("AI Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async (status: "DRAFT" | "SUBMITTED" | "PUBLISHED") => {
    if (!title.trim()) {
      alert("कृपया पहले शीर्षक दर्ज करें या AI ड्राफ्ट जनरेट करें।");
      return;
    }

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          excerpt,
          content,
          category,
          categorySlug,
          district,
          state: "Haryana",
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
          imageCaption,
          tags,
          isBreaking,
          isLeadStory,
          author: `${currentUser.name} (AI Assisted)`,
          status,
          aiGenerated: true,
          aiDraftPrompt: topicInput,
          needsVerification: status !== "PUBLISHED",
          headlineVariants,
        }),
      });

      if (!res.ok) {
        console.warn("Save draft failed with status:", res.status);
        alert("समाचार सहेजने में त्रुटि आई।");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSaveStatus(
          status === "PUBLISHED"
            ? "समाचार सफलतापूर्वक लाइव प्रकाशित कर दिया गया!"
            : status === "SUBMITTED"
            ? "ड्राफ्ट संपादकीय समीक्षा कतार में भेज दिया गया!"
            : "ड्राफ्ट सफलतापूर्वक सहेजा गया।"
        );
        setTimeout(() => {
          if (status === "SUBMITTED" || status === "PUBLISHED") {
            router.push("/admin/editorial");
          }
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert("समाचार सहेजने में त्रुटि आई।");
    }
  };

  const handleOpenVerificationPipeline = async () => {
    if (!title.trim()) {
      alert("कृपया पहले समाचार विषय जनरेट करें या शीर्षक दर्ज करें।");
      return;
    }

    const draftPayload = {
      title,
      subtitle,
      excerpt: excerpt || content.substring(0, 160),
      content,
      category,
      categorySlug,
      district,
      state: "Haryana",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
      imageCaption,
      tags,
      isBreaking,
      isLeadStory,
      author: `${currentUser.name} (AI Assisted)`,
      status: "SUBMITTED",
      aiGenerated: true,
      aiDraftPrompt: topicInput,
      needsVerification: true,
      headlineVariants,
    };

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftPayload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.article) {
          setVerificationArticle(data.article);
          return;
        }
      }
    } catch (err) {
      console.warn("Auto-save before verification failed, falling back to client draft:", err);
    }

    setVerificationArticle({
      id: `art-${Date.now()}`,
      title,
      subtitle,
      excerpt,
      content,
      category,
      categorySlug,
      district,
      state: "Haryana",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
      imageCaption,
      tags,
      isBreaking,
      isLeadStory,
      author: `${currentUser.name} (AI Assisted)`,
      views: 0,
      createdAt: new Date().toISOString(),
      slug: (title || "news").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").substring(0, 50),
      aiGenerated: true,
      aiDraftPrompt: topicInput,
      needsVerification: true,
    });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <PermissionGuard permission="CREATE_NEWS">
      <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/40">
              <Bot size={22} />
            </span>
            {b("AI News Desk — 3-Pane Newsroom Studio", "AI News Desk — 3-पेन न्यूज़रूम स्टूडियो")}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {b(
              "Source Ingest → AI Generation & Live Editing → Headline Engine, Fact Check, Social Syndication & Broadcast Script",
              "स्रोत इनपुट → AI ड्राफ्ट व लाइव संपादन → हेडलाइन इंजन, तथ्य सत्यापन, सोशल व स्क्रिप्ट पैकेज"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40 font-bold flex items-center gap-1.5">
            <AlertTriangle size={12} />
            {b("Human Verification Required", "मानव सत्यापन अनिवार्य")}
          </span>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          {saveStatus}
        </div>
      )}

      {/* 3-Pane Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[750px]">
        {/* =========================================================
            PANE 1 (LEFT): Source / Input (3 cols)
        ========================================================= */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xs transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {b("1. Source & Input Mode", "1. स्रोत व इनपुट मोड")}
              </span>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">MODE: {activeMode.toUpperCase()}</span>
            </div>

            {/* Mode Selector Buttons */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setActiveMode("topic")}
                className={`p-2 rounded-xl text-xs font-semibold text-left transition flex items-center gap-1.5 ${
                  activeMode === "topic"
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                <Sparkles size={13} />
                {b("Topic / Angle", "विषय (Topic)")}
              </button>
              <button
                onClick={() => setActiveMode("source_text")}
                className={`p-2 rounded-xl text-xs font-semibold text-left transition flex items-center gap-1.5 ${
                  activeMode === "source_text"
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                <FileText size={13} />
                {b("Press Release", "प्रेस विज्ञप्ति")}
              </button>
              <button
                onClick={() => setActiveMode("notes")}
                className={`p-2 rounded-xl text-xs font-semibold text-left transition flex items-center gap-1.5 ${
                  activeMode === "notes"
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                <Upload size={13} />
                {b("Field Notes", "फील्ड नोट्स")}
              </button>
              <button
                onClick={() => setActiveMode("url")}
                className={`p-2 rounded-xl text-xs font-semibold text-left transition flex items-center gap-1.5 ${
                  activeMode === "url"
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                <Link2 size={13} />
                {b("URL / Source", "URL / सोर्स")}
              </button>
            </div>

            {/* Location Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {b("District / Bureau (Location Target):", "ज़िला / केंद्र (Location Target):")}
              </label>
              <select
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="साउथ हरियाणा" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("South Haryana (All)", "साउथ हरियाणा (समग्र)")}</option>
                <option value="महेंद्रगढ़ (नारनौल)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Mahendergarh / Narnaul", "महेंद्रगढ़ / नारनौल")}</option>
                <option value="रेवाड़ी" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Rewari / Bawal", "रेवाड़ी / बावल")}</option>
                <option value="गुरुग्राम" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Gurugram / Manesar", "गुरुग्राम / मानेसर")}</option>
                <option value="फरीदाबाद" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Faridabad / Ballabhgarh", "फरीदाबाद / बल्लभगढ़")}</option>
                <option value="नूह" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Nuh / Mewat", "नूह / मेवात")}</option>
                <option value="पलवल" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Palwal / Hodal", "पलवल / होडल")}</option>
                <option value="झज्जर" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Jhajjar / Bahadurgarh", "झज्जर / बहादुरगढ़")}</option>
                <option value="चरखी दादरी" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{b("Charkhi Dadri", "चरखी दादरी")}</option>
              </select>
            </div>

            {/* Input Content Area */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {activeMode === "topic"
                  ? b("Enter news topic / prompt angle:", "समाचार का विषय / संकेत दर्ज करें:")
                  : activeMode === "source_text"
                  ? b("Paste press release or announcement text:", "प्रेस विज्ञप्ति या घोषणा का पाठ पेस्ट करें:")
                  : activeMode === "notes"
                  ? b("Enter reporter field notes:", "रिपोर्टर के कच्चे नोट्स दर्ज करें:")
                  : b("Website URL or source link:", "वेबसाइट URL या स्रोत लिंक:")}
              </label>
              <textarea
                rows={9}
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder={b("Write news story details or raw draft points here...", "यहाँ समाचार का विवरण या विषय लिखें...")}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? b("Generating AI Package...", "AI पैकेज तैयार हो रहा है...") : b("Generate Draft & Package", "ड्राफ्ट व पैकेज जनरेट करें")}
          </button>
        </div>

        {/* =========================================================
            PANE 2 (CENTER): AI Draft & Interactive Editor (5 cols)
        ========================================================= */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-xs">
          <div className="space-y-3.5 overflow-y-auto max-h-[660px] pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {b("2. Draft & Live Editor", "2. ड्राफ्ट व लाइव संपादन")}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  AI DRAFT
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-rose-600 focus:ring-0"
                />
                <Flame size={13} />
                {b("Breaking News", "ब्रेकिंग न्यूज़")}
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {b("Headline:", "मुख्य शीर्षक (Headline):")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={b("AI generated or custom headline...", "AI द्वारा तैयार शीर्षक...")}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {b("Subtitle:", "उप-शीर्षक (Subtitle):")}
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder={b("Subtitle or key hook...", "उप-शीर्षक या मुख्य निष्कर्ष...")}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {b("Summary (Excerpt):", "संक्षिप्त सारांश (Excerpt):")}
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={b("Brief summary in 1-2 sentences...", "1-2 वाक्यों में संक्षिप्त विवरण...")}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                {b("Full Article Body:", "समाचार का विस्तृत विवरण (Full Content):")}
              </label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={b("Full news story body...", "पूर्ण समाचार पाठ...")}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs leading-relaxed text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-rose-500 font-sans"
              />
            </div>

            {/* Featured Image & Caption Studio */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              {/* Studio Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <ImageIcon size={14} />
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    {b("Featured Image & Caption", "मुख्य तस्वीर व कैप्शन (Featured Image & Caption)")}
                  </span>
                </div>
                {imageUrl ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={11} />
                    {b("Image Attached", "तस्वीर संलग्न")}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {b("Upload photo from device", "डिवाइस से फोटो अपलोड करें")}
                  </span>
                )}
              </div>

              {/* If Image is attached: Preview & Replace/Remove Toolbar */}
              {imageUrl ? (
                <div className="space-y-3">
                  <div className="relative group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-black/30">
                    <img
                      src={imageUrl}
                      alt="Featured Preview"
                      className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3 opacity-95">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                          <Camera size={11} className="text-rose-400" />
                          {imageUrl.startsWith("/uploads/")
                            ? b("Local Upload", "डिवाइस से अपलोड")
                            : imageUrl.startsWith("data:")
                            ? b("Direct Photo", "प्रत्यक्ष फोटो")
                            : b("Web Image", "वेब तस्वीर")}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw size={11} />
                            {b("Replace Photo", "तस्वीर बदलें")}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl("");
                              setUploadError(null);
                            }}
                            className="p-1 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow-xs transition cursor-pointer"
                            title={b("Remove Image", "तस्वीर हटाएं")}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Overlay Caption Preview */}
                      {imageCaption && (
                        <div className="text-[11px] text-white/95 font-medium line-clamp-1 bg-black/40 px-2 py-1 rounded backdrop-blur-xs">
                          📷 {imageCaption}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* No Image Attached: 3-Way Picker (Upload / URL / Presets) */
                <div className="space-y-2.5">
                  {/* Source Tabs */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageTab("upload")}
                      className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        imageTab === "upload"
                          ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <UploadCloud size={13} />
                      <span>{b("Manual Upload", "📁 डिवाइस से अपलोड")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab("url")}
                      className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        imageTab === "url"
                          ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Link2 size={13} />
                      <span>{b("Image URL", "🌐 वेब लिंक")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab("presets")}
                      className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        imageTab === "presets"
                          ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Sparkles size={13} />
                      <span>{b("Haryana Presets", "⚡ बीट प्रीसेट्स")}</span>
                    </button>
                  </div>

                  {/* Tab 1: Manual File Upload Drag & Drop */}
                  {imageTab === "upload" && (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? "border-rose-500 bg-rose-500/10 dark:bg-rose-500/20"
                          : "border-slate-300 dark:border-slate-700 hover:border-rose-400 bg-white dark:bg-slate-950/60"
                      }`}
                    >
                      <div className="p-2.5 rounded-full bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                        {isUploadingImage ? (
                          <RefreshCw size={22} className="animate-spin" />
                        ) : (
                          <UploadCloud size={22} />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {isUploadingImage
                          ? b("Uploading photo to server...", "तस्वीर अपलोड हो रही है...")
                          : b("Click to upload from device or drag & drop", "फ़ोटो चुनने के लिए क्लिक करें या फ़ाइल ड्रैग करें")}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {b("Supports JPG, PNG, WEBP, GIF, AVIF up to 10MB", "JPG, PNG, WEBP, GIF, AVIF (अधिकतम 10MB)")}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Custom Image URL */}
                  {imageTab === "url" && (
                    <div className="space-y-2 bg-white dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/... या कोई भी फोटो लिंक"
                          className="flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customUrlInput.trim()) {
                              setImageUrl(customUrlInput.trim());
                              setCustomUrlInput("");
                            }
                          }}
                          className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                        >
                          {b("Apply", "लागू करें")}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {b("Paste photo URL from official sources, PTI, ANI, or Unsplash.", "आधिकारिक स्रोतों, पीटीआई, एएनआई या वेब से फोटो लिंक पेस्ट करें।")}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: South Haryana Beat Presets */}
                  {imageTab === "presets" && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      {SOUTH_HARYANA_IMAGE_PRESETS.map((preset) => (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setImageUrl(preset.url);
                            if (!imageCaption.trim()) {
                              setImageCaption(preset.caption);
                            }
                          }}
                          className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-rose-500 cursor-pointer transition text-left"
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-14 object-cover group-hover:scale-105 transition duration-200"
                          />
                          <div className="p-1.5 bg-slate-900/90 text-white">
                            <div className="text-[10px] font-bold truncate">{preset.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hidden File Input for Manual Uploading */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleImageFileUpload}
                className="hidden"
              />

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-medium flex items-center gap-1.5">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Dedicated Image Caption & Photo Credit Field */}
              <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Camera size={13} className="text-rose-500" />
                    <span>{b("Image Caption & Editorial Credit:", "तस्वीर कैप्शन व फोटो क्रेडिट (Image Caption):")}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyHeadlineAsCaption}
                    className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 size={10} />
                    {b("Use Headline as Caption", "शीर्षक से कैप्शन बनाएं")}
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder={b(
                    "e.g. Health officials inspecting new ICU ward at Narnaul Civil Hospital... (Photo: Ground Zero Bureau)",
                    "उदा: नारनौल नागरिक अस्पताल में नवनिर्मित आईसीयू वार्ड का निरीक्षण करते स्वास्थ्य अधिकारी... (फोटो: ग्राउंड ज़ीरो ब्यूरो)"
                  )}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:border-rose-500 leading-relaxed"
                />

                {/* Quick 1-Click Photo Credit Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {b("Quick Credit:", "क्विक क्रेडिट:")}
                  </span>
                  {PHOTO_CREDIT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddCredit(tag)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editorial Placement & Priority Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1">
                <span>{b("Homepage Placement:", "होमपेज प्राथमिकता:")}</span>
              </span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 dark:text-slate-200 select-none hover:text-amber-600 transition">
                  <input
                    type="checkbox"
                    checked={isLeadStory}
                    onChange={(e) => setIsLeadStory(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                  />
                  <Star size={13} className={isLeadStory ? "fill-current text-amber-500" : "text-slate-400"} />
                  <span>{b("Top / Lead Story", "⭐ मुख्य समाचार (Top Story)")}</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 dark:text-slate-200 select-none hover:text-rose-600 transition">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                  />
                  <Flame size={13} className={isBreaking ? "text-rose-600 fill-current" : "text-slate-400"} />
                  <span>{b("Breaking News", "🚨 ताज़ा ब्रेकिंग")}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => handleSaveDraft("DRAFT")}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              {b("Save Draft", "ड्राफ्ट सहेजें")}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveDraft("SUBMITTED")}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Clock size={14} />
                {b("Send to Editor (Review)", "संपादक को भेजें (Review)")}
              </button>

              {hasPermission("PUBLISH_NEWS") && (
                <button
                  onClick={handleOpenVerificationPipeline}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  {b("Human Verification & Distribute →", "मानव सत्यापन व ऑटो-वितरण →")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            PANE 3 (RIGHT): AI Tools Workspace (4 cols)
        ========================================================= */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xs">
          <div className="space-y-3 overflow-y-auto max-h-[660px] pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {b("3. AI News Package Tools", "3. AI न्यूज़ पैकेज टूल्स")}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">GROUND ZERO ENGINE</span>
            </div>

            {/* Tool Nav Pills */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveToolTab("headlines")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeToolTab === "headlines"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {b("Headlines (7)", "हेडलाइन्स (7)")}
              </button>
              <button
                onClick={() => setActiveToolTab("factcheck")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeToolTab === "factcheck"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {b("Fact Check", "तथ्य जांच")}
              </button>
              <button
                onClick={() => setActiveToolTab("social")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeToolTab === "social"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {b("Social Media", "सोशल मीडिया")}
              </button>
              <button
                onClick={() => setActiveToolTab("scripts")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeToolTab === "scripts"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {b("Video Script", "वीडियो स्क्रिप्ट")}
              </button>
              <button
                onClick={() => setActiveToolTab("translate")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  activeToolTab === "translate"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {b("English Translation", "अंग्रेजी अनुवाद")}
              </button>
              <button
                onClick={() => setActiveToolTab("preview")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                  activeToolTab === "preview"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Eye size={12} />
                {b("Live Preview", "लाइव पूर्वावलोकन")}
              </button>
            </div>

            {/* Tool Content Views */}
            {activeToolTab === "headlines" && (
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                  {b("Click any headline variant to apply it directly to the editor:", "किसी भी हेडलाइन को एडिटर में लागू करने के लिए क्लिक करें:")}
                </div>
                {Object.entries(headlineVariants).length === 0 ? (
                  <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {b("Generate an AI draft first to see headline variations.", "हेडलाइन विकल्प देखने के लिए पहले AI ड्राफ्ट जनरेट करें।")}
                  </div>
                ) : (
                  Object.entries(headlineVariants).map(([key, val]) => (
                    <div
                      key={key}
                      onClick={() => setTitle(val)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition space-y-1 group"
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                        <span>{key} FORMAT</span>
                        <span className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                          {b("Apply ↵", "लागू करें ↵")}
                        </span>
                      </div>
                      <div className="text-slate-900 dark:text-white font-medium text-xs leading-snug">{val}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeToolTab === "factcheck" && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-300 mb-1">
                    {b("AI Confidence Score:", "AI कॉन्फिडेंस स्कोर:")}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${factCheck?.confidenceScore || 85}%` }}
                      ></div>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {factCheck?.confidenceScore || 85}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle size={13} />
                    {b("Points Requiring Human Verification:", "सत्यापन हेतु आवश्यक बिंदु:")}
                  </div>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
                    {factCheck?.requiresVerification?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
                    {b("Extracted Claims:", "निकाले गए मुख्य दावे (Extracted Claims):")}
                  </div>
                  <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                    {factCheck?.extractedClaims?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-500">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeToolTab === "social" && (
              <div className="space-y-2.5 text-xs">
                {socialVariants ? (
                  <>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        <span>FACEBOOK POST</span>
                        <button
                          onClick={() => copyToClipboard(socialVariants.facebook, "fb")}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
                        >
                          {copiedKey === "fb" ? b("Copied!", "कॉपी किया!") : b("Copy", "कॉपी")}
                        </button>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 text-[11px] whitespace-pre-wrap line-clamp-4">
                        {socialVariants.facebook}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-sky-600 dark:text-sky-400">
                        <span>X / TWITTER</span>
                        <button
                          onClick={() => copyToClipboard(socialVariants.twitter, "x")}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
                        >
                          {copiedKey === "x" ? b("Copied!", "कॉपी किया!") : b("Copy", "कॉपी")}
                        </button>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 text-[11px] whitespace-pre-wrap">
                        {socialVariants.twitter}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span>WHATSAPP BULLET</span>
                        <button
                          onClick={() => copyToClipboard(socialVariants.whatsapp, "wa")}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
                        >
                          {copiedKey === "wa" ? b("Copied!", "कॉपी किया!") : b("Copy", "कॉपी")}
                        </button>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 text-[11px] whitespace-pre-wrap">
                        {socialVariants.whatsapp}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {b("Generate an AI draft first to create social media copy.", "सोशल पोस्ट तैयार करने के लिए पहले AI ड्राफ्ट जनरेट करें।")}
                  </div>
                )}
              </div>
            )}

            {activeToolTab === "scripts" && (
              <div className="space-y-3 text-xs">
                {scripts ? (
                  <>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-purple-600 dark:text-purple-400">
                        <span>60-SECOND NEWS BULLETIN SCRIPT</span>
                        <button
                          onClick={() => copyToClipboard(scripts.videoScript60s, "vs")}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
                        >
                          {copiedKey === "vs" ? b("Copied!", "कॉपी किया!") : b("Copy", "कॉपी")}
                        </button>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 text-[11px] whitespace-pre-wrap font-mono">
                        {scripts.videoScript60s}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-pink-600 dark:text-pink-400">
                        <span>30-SECOND REEL / SHORT HOOK</span>
                        <button
                          onClick={() => copyToClipboard(scripts.reelScript30s, "rs")}
                          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium cursor-pointer"
                        >
                          {copiedKey === "rs" ? b("Copied!", "कॉपी किया!") : b("Copy", "कॉपी")}
                        </button>
                      </div>
                      <div className="text-slate-700 dark:text-slate-300 text-[11px] whitespace-pre-wrap">
                        {scripts.reelScript30s}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {b("Generate an AI draft first to view broadcast and video scripts.", "वीडियो स्क्रिप्ट देखने के लिए पहले AI ड्राफ्ट जनरेट करें।")}
                  </div>
                )}
              </div>
            )}

            {activeToolTab === "translate" && (
              <div className="space-y-3 text-xs">
                {translations ? (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      English Headline & Summary
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{translations.englishHeadline}</div>
                    <div className="text-slate-700 dark:text-slate-300 text-[11px]">{translations.englishSummary}</div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {b("Generate an AI draft first to view English translations.", "अंग्रेज़ी अनुवाद देखने के लिए पहले AI ड्राफ्ट जनरेट करें।")}
                  </div>
                )}
              </div>
            )}

            {activeToolTab === "preview" && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
                  {/* Category & Badges */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white uppercase tracking-wider">
                      {category || "साउथ हरियाणा"}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      {isBreaking && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/30 flex items-center gap-1">
                          <Flame size={10} /> {b("BREAKING", "ताज़ा ब्रेकिंग")}
                        </span>
                      )}
                      {isLeadStory && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1">
                          <Star size={10} /> {b("TOP STORY", "मुख्य खबर")}
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        📍 {district || "महेंद्रगढ़"}
                      </span>
                    </div>
                  </div>

                  {/* Headline & Subtitle */}
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                    {title || b("Headline will appear here...", "समाचार का मुख्य शीर्षक...")}
                  </h3>
                  {subtitle && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {subtitle}
                    </div>
                  )}

                  {/* Featured Image with Editorial Caption */}
                  {imageUrl ? (
                    <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-black/5 dark:bg-black/30">
                      <img
                        src={imageUrl}
                        alt={imageCaption || title || "Preview"}
                        className="w-full h-44 object-cover"
                      />
                      {imageCaption ? (
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 italic flex items-start gap-1.5">
                          <Camera size={13} className="text-rose-500 shrink-0 mt-0.5" />
                          <span>फोटो विवरण: {imageCaption}</span>
                        </div>
                      ) : (
                        <div className="p-2 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 italic">
                          {b("(No image caption added)", "(कोई फोटो कैप्शन नहीं लिखा गया)")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-950/40 text-slate-400 text-xs">
                      {b("No image attached yet. Upload photo in Editor pane.", "कोई तस्वीर संलग्न नहीं है। एडिटर में फोटो अपलोड करें।")}
                    </div>
                  )}

                  {/* Byline */}
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between">
                    <span>✍️ {currentUser.name} (AI Assisted Desk)</span>
                    <span>{b("Live Article Preview", "लाइव पूर्वावलोकन")}</span>
                  </div>

                  {/* Excerpt */}
                  {excerpt && (
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed font-serif">
                      <span className="font-bold text-slate-900 dark:text-white mr-1">सारांश:</span>
                      {excerpt}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>{b("Verification Policy & Rules", "सत्यापन दिशानिर्देश")}</span>
            <Link href="/admin/editorial" className="text-rose-600 dark:text-rose-400 hover:underline font-semibold">
              {b("Read Editorial Guidelines →", "संपादकीय नियम पढ़ें →")}
            </Link>
          </div>
        </div>
      </div>

      {/* Human Verification Gate & Multi-Platform Distribution Pipeline Modal */}
      {verificationArticle && (
        <HumanVerificationModal
          article={verificationArticle}
          onClose={() => setVerificationArticle(null)}
          onDistributed={() => {
            setVerificationArticle(null);
            setSaveStatus(
              "सत्यापन संपन्न! समाचार लाइव हो चुका है और सभी प्लेटफ़ॉर्म्स पर स्वचालित रूप से प्रसारित कर दिया गया है।"
            );
            setTimeout(() => {
              router.push("/admin/editorial");
            }, 1800);
          }}
        />
      )}
      </div>
    </PermissionGuard>
  );
}
