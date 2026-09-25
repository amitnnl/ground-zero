"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Globe,
  Shield,
  Bot,
  Tv,
  Bell,
  Database,
  Search,
  Share2,
  BarChart3,
  Palette,
  FileText,
  UploadCloud,
  ImageIcon,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Code,
  Smartphone,
  Flame,
  Star,
  Download,
  Upload,
  Copy,
  Check,
  Wrench,
  Eye,
} from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";
import { useSettings } from "@/lib/settingsContext";
import { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { b } = useLanguage();
  const { updateSettingsState } = useSettings();
  const [activeTab, setActiveTab] = useState<
    "identity" | "seo" | "social" | "monetization" | "appearance" | "articles" | "maintenance"
  >("identity");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  // Settings State matching settings.txt schema
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "Ground Zero News",
    site_tagline: "हरियाणा की आवाज़",
    site_description:
      "South Haryana's leading digital news network. Real-time updates, breaking news, live blogs and local reporting.",
    site_logo: null,
    site_favicon: null,
    contact_email: "gznarnaul@gmail.com",
    contact_phone: "+91 9217070880",
    contact_address: "Media Tower, Nizampur Road, Narnaul, India, 123001",
    default_meta_title: "Ground Zero News - Haryana Hindi News, ब्रेकिंग न्यूज़",
    default_meta_description:
      "ग्राउंड ज़ीरो न्यूज़ पर पढ़ें हरियाणा, देश और दुनिया की ताज़ा हिंदी खबरें, ब्रेकिंग न्यूज़ और विश्लेषण।",
    default_meta_keywords:
      "ground zero news, haryana news, hindi news, breaking news haryana, ग्राउंड ज़ीरो न्यूज़, हरियाणा न्यूज़",
    google_search_console_verification: null,
    bing_webmaster_verification: null,
    og_image: null,
    og_site_name: "Ground Zero News",
    robots_txt:
      "User-agent: *\nAllow: /\n\nSitemap: https://www.groundzeronews.com/sitemap.xml\nSitemap: https://www.groundzeronews.com/news-sitemap.xml",
    sitemap_enabled: true,
    facebook_url: "https://facebook.com/groundzeronewshry",
    twitter_url: "https://twitter.com/groundzeronewshry",
    youtube_url: "https://youtube.com/c/groundzeronewshry",
    instagram_url: null,
    whatsapp_channel_url: null,
    telegram_url: null,
    koo_url: null,
    sharechat_url: null,
    gtm_id: "GTM-MJQ5P6C4",
    ga4_id: null,
    clarity_id: null,
    facebook_pixel_id: null,
    adsense_publisher_id: null,
    adsense_enabled: false,
    ads_enabled: true,
    ads_between_paragraphs: true,
    web_push_enabled: false,
    onesignal_app_id: null,
    onesignal_enabled: false,
    vapid_public_key: null,
    primary_color: "#DC2626",
    secondary_color: "#1F2937",
    accent_color: "#F59E0B",
    dark_mode_enabled: true,
    dark_mode_default: false,
    homepage_breaking_news_enabled: true,
    homepage_featured_enabled: true,
    homepage_trending_enabled: true,
    homepage_videos_enabled: true,
    homepage_articles_per_page: 12,
    homepage_trending_count: 6,
    homepage_breaking_count: 5,
    comments_enabled_globally: true,
    related_articles_enabled: true,
    related_articles_count: 5,
    reading_time_enabled: true,
    author_bio_enabled: true,
    image_watermark_enabled: false,
    watermark_text: "© Ground Zero News",
    play_store_url: null,
    app_store_url: null,
    app_download_banner_enabled: false,
    maintenance_mode: false,
    maintenance_message: "We are performing scheduled maintenance. We'll be back shortly.",
    maintenance_end_time: null,
  });

  // Load existing settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "site_logo" | "site_favicon" | "og_image",
    setLoadingState: (b: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          handleChange(field, data.url);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("अपलोड में त्रुटि हुई।");
    } finally {
      setLoadingState(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSaved(true);
          updateSettingsState(settings);
          setTimeout(() => setSaved(false), 3500);
        } else {
          setErrorMessage(data.error || "सेटिंग्स सहेजने में विफल।");
        }
      } else {
        setErrorMessage("सर्वर त्रुटि: सेटिंग्स सुरक्षित नहीं हो सकीं।");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      setErrorMessage("नेटवर्क त्रुटि: कृपया पुनः प्रयास करें।");
    } finally {
      setSaving(false);
    }
  };

  // Export current config as JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ground_zero_settings_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper toggle switch component
  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
      <div className="space-y-0.5">
        <div className="text-xs font-bold text-slate-900 dark:text-white">{label}</div>
        {description && <div className="text-[11px] text-slate-500 dark:text-slate-400">{description}</div>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
      </label>
    </div>
  );

  return (
    <PermissionGuard permission="MANAGE_SETTINGS">
      <div className="space-y-6 pb-12">
        {/* Header matching settings.txt */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <Settings size={20} />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Ground Zero News Admin Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {b("Site Settings", "साइट सेटिंग्स (Site Settings)")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {b(
                "Manage site identity, SEO meta tags, social channels, tracking codes, monetization, layout and enterprise policies.",
                "साइट पहचान, एसईओ मेटा टैग, सोशल चैनल, एनालिटिक्स ट्रैकिंग, विज्ञापन, लेआउट और नीतियां प्रबंधित करें।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-xs"
              title="Export configuration as JSON"
            >
              <Download size={13} />
              <span>{b("Export JSON", "JSON निर्यात")}</span>
            </button>
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? b("Saving...", "सहेज रहा है...") : b("Save Changes", "परिवर्तन सहेजें")}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {saved && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{b("All site settings have been updated and saved successfully!", "सभी साइट सेटिंग्स सफलतापूर्वक सहेज दी गईं!")}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab("identity")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "identity"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Globe size={14} />
            <span>{b("1. Identity & Contact", "1. पहचान व संपर्क")}</span>
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "seo"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Search size={14} />
            <span>{b("2. SEO, Meta & Robots", "2. एसईओ व रोबोट्स")}</span>
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "social"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Share2 size={14} />
            <span>{b("3. Social & Mobile Apps", "3. सोशल व ऐप्स")}</span>
          </button>
          <button
            onClick={() => setActiveTab("monetization")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "monetization"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 size={14} />
            <span>{b("4. Ads, Push & Tracking", "4. विज्ञापन व ट्रैकिंग")}</span>
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "appearance"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette size={14} />
            <span>{b("5. Theme & Homepage", "5. रंग व होमपेज")}</span>
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "articles"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText size={14} />
            <span>{b("6. Articles & Limits", "6. लेख व सीमाएं")}</span>
          </button>
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "maintenance"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Wrench size={14} />
            <span>{b("7. Maintenance & Security", "7. मेंटेनेंस व नीतियां")}</span>
          </button>
        </div>

        {/* Tab Form Containers */}
        <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* TAB 1: SITE IDENTITY & CONTACT */}
          {activeTab === "identity" && (
            <div className="space-y-8">
              {/* Section 1: Site Identity */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Site Identity", "साइट पहचान (Site Identity)")}</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b("Primary website branding, name, tagline, logo, and favicon.", "वेबसाइट का मुख्य नाम, टैगलाइन, लोगो और फेविकॉन।")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Site Name *", "साइट का नाम (Site Name) *")}
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => handleChange("site_name", e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold focus:outline-hidden focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Tagline / Slogan", "टैगलाइन / स्लोगन (Tagline)")}
                    </label>
                    <input
                      type="text"
                      value={settings.site_tagline}
                      onChange={(e) => handleChange("site_tagline", e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Site Description", "साइट का विवरण (Site Description)")}
                  </label>
                  <textarea
                    rows={2}
                    value={settings.site_description}
                    onChange={(e) => handleChange("site_description", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500 leading-relaxed"
                  />
                </div>

                {/* Logo & Favicon Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {b("Site Logo URL", "साइट लोगो (Site Logo)")}
                      </span>
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={uploadingLogo}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <UploadCloud size={12} className={uploadingLogo ? "animate-spin" : ""} />
                        <span>{uploadingLogo ? b("Uploading...", "अपलोड...") : b("Upload Logo", "अपलोड")}</span>
                      </button>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "site_logo", setUploadingLogo)}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="text"
                      value={settings.site_logo || ""}
                      onChange={(e) => handleChange("site_logo", e.target.value || null)}
                      placeholder="/logo.png या https://..."
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {b("Favicon URL", "साइट फेविकॉन (Favicon)")}
                      </span>
                      <button
                        type="button"
                        onClick={() => faviconInputRef.current?.click()}
                        disabled={uploadingFavicon}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <UploadCloud size={12} className={uploadingFavicon ? "animate-spin" : ""} />
                        <span>{uploadingFavicon ? b("Uploading...", "अपलोड...") : b("Upload Favicon", "अपलोड")}</span>
                      </button>
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "site_favicon", setUploadingFavicon)}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="text"
                      value={settings.site_favicon || ""}
                      onChange={(e) => handleChange("site_favicon", e.target.value || null)}
                      placeholder="/favicon.ico या https://..."
                      className="w-full p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Information */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Contact Information", "संपर्क जानकारी (Contact Information)")}</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b("Public editorial bureau contact email, phone, and headquarters address.", "संपादकीय ब्यूरो का ईमेल, फोन व मुख्य कार्यालय पता।")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Contact Email", "संपर्क ईमेल (Contact Email)")}
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleChange("contact_email", e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Contact Phone", "संपर्क फोन / हेल्पलाइन (Contact Phone)")}
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone}
                      onChange={(e) => handleChange("contact_phone", e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Bureau Headquarters Address", "मुख्यालय का पता (Bureau Address)")}
                  </label>
                  <input
                    type="text"
                    value={settings.contact_address}
                    onChange={(e) => handleChange("contact_address", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEO, META & ROBOTS */}
          {activeTab === "seo" && (
            <div className="space-y-8">
              {/* Default Meta Tags */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Default Meta Tags", "डिफ़ॉल्ट मेटा टैग (Default Meta Tags)")}</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b("Search engine titles, meta description, and keywords for indexation.", "सर्च इंजन इंडेक्सेशन हेतु शीर्षक, मेटा विवरण एवं कीवर्ड्स।")}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Default Meta Title", "डिफ़ॉल्ट मेटा शीर्षक (Default Meta Title)")}
                  </label>
                  <input
                    type="text"
                    value={settings.default_meta_title}
                    onChange={(e) => handleChange("default_meta_title", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Default Meta Description", "डिफ़ॉल्ट मेटा विवरण (Meta Description)")}
                  </label>
                  <textarea
                    rows={2}
                    value={settings.default_meta_description}
                    onChange={(e) => handleChange("default_meta_description", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {b("Default Meta Keywords", "डिफ़ॉल्ट मेटा कीवर्ड्स (Meta Keywords)")}
                  </label>
                  <input
                    type="text"
                    value={settings.default_meta_keywords}
                    onChange={(e) => handleChange("default_meta_keywords", e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Google Search Console Verification", "Google Search Console सत्यापन कोड")}
                    </label>
                    <input
                      type="text"
                      value={settings.google_search_console_verification || ""}
                      onChange={(e) => handleChange("google_search_console_verification", e.target.value || null)}
                      placeholder="google-site-verification=..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Bing Webmaster Verification", "Bing Webmaster सत्यापन कोड")}
                    </label>
                    <input
                      type="text"
                      value={settings.bing_webmaster_verification || ""}
                      onChange={(e) => handleChange("bing_webmaster_verification", e.target.value || null)}
                      placeholder="msvalidate.01=..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Share2 size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Open Graph (Social Sharing)", "ओपन ग्राफ (सोशल शेयरिंग)")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("OG Site Name", "OG साइट नाम (OG Site Name)")}
                    </label>
                    <input
                      type="text"
                      value={settings.og_site_name}
                      onChange={(e) => handleChange("og_site_name", e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {b("Default OG Image URL", "डिफ़ॉल्ट OG फोटो URL")}
                      </label>
                      <button
                        type="button"
                        onClick={() => ogImageInputRef.current?.click()}
                        disabled={uploadingOgImage}
                        className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                      >
                        {uploadingOgImage ? b("Uploading...", "अपलोड...") : b("Upload Image", "फोटो अपलोड")}
                      </button>
                      <input
                        ref={ogImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "og_image", setUploadingOgImage)}
                        className="hidden"
                      />
                    </div>
                    <input
                      type="text"
                      value={settings.og_image || ""}
                      onChange={(e) => handleChange("og_image", e.target.value || null)}
                      placeholder="/og-image.jpg या https://..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Robots & Sitemap */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Code size={16} className="text-rose-600 dark:text-rose-400" />
                      <span>{b("Robots & Sitemap", "रोबोट्स व साइटमैप (Robots & Sitemap)")}</span>
                    </h2>
                  </div>
                  <ToggleSwitch
                    checked={settings.sitemap_enabled}
                    onChange={(checked) => handleChange("sitemap_enabled", checked)}
                    label={b("Enable XML Sitemap", "XML साइटमैप सक्रिय रखें")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {b("robots.txt Content", "robots.txt सामग्री:")}
                  </label>
                  <textarea
                    rows={6}
                    value={settings.robots_txt}
                    onChange={(e) => handleChange("robots_txt", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-700 focus:outline-hidden focus:border-rose-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL LINKS & MOBILE APPS */}
          {activeTab === "social" && (
            <div className="space-y-8">
              {/* Social Links */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Share2 size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Official Social Channels", "आधिकारिक सोशल मीडिया लिंक्स")}</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b("Links to official Ground Zero social accounts across platforms.", "ग्राउंड ज़ीरो के सभी आधिकारिक सोशल अकाउंट्स के लिंक्स।")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebook_url || ""}
                      onChange={(e) => handleChange("facebook_url", e.target.value || null)}
                      placeholder="https://facebook.com/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Twitter / X URL
                    </label>
                    <input
                      type="url"
                      value={settings.twitter_url || ""}
                      onChange={(e) => handleChange("twitter_url", e.target.value || null)}
                      placeholder="https://twitter.com/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={settings.youtube_url || ""}
                      onChange={(e) => handleChange("youtube_url", e.target.value || null)}
                      placeholder="https://youtube.com/c/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagram_url || ""}
                      onChange={(e) => handleChange("instagram_url", e.target.value || null)}
                      placeholder="https://instagram.com/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Channel URL
                    </label>
                    <input
                      type="url"
                      value={settings.whatsapp_channel_url || ""}
                      onChange={(e) => handleChange("whatsapp_channel_url", e.target.value || null)}
                      placeholder="https://whatsapp.com/channel/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Telegram Channel URL
                    </label>
                    <input
                      type="url"
                      value={settings.telegram_url || ""}
                      onChange={(e) => handleChange("telegram_url", e.target.value || null)}
                      placeholder="https://t.me/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Applications */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Mobile Applications", "मोबाइल ऍप्लिकेशन्स (Mobile Apps)")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Google Play Store URL
                    </label>
                    <input
                      type="url"
                      value={settings.play_store_url || ""}
                      onChange={(e) => handleChange("play_store_url", e.target.value || null)}
                      placeholder="https://play.google.com/store/apps/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Apple App Store URL
                    </label>
                    <input
                      type="url"
                      value={settings.app_store_url || ""}
                      onChange={(e) => handleChange("app_store_url", e.target.value || null)}
                      placeholder="https://apps.apple.com/app/..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <ToggleSwitch
                  checked={settings.app_download_banner_enabled}
                  onChange={(checked) => handleChange("app_download_banner_enabled", checked)}
                  label={b("Show App Download Smart Banner", "मोबाइल उपयोगकर्ताओं को ऐप डाउनलोड बैनर दिखाएं")}
                  description={b("Displays install prompt for Android/iOS users on mobile browsers", "मोबाइल ब्राउज़र पर ऐप इनस्टॉल बैनर प्रदर्शित करता है")}
                />
              </div>
            </div>
          )}

          {/* TAB 4: ADS, PUSH & TRACKING */}
          {activeTab === "monetization" && (
            <div className="space-y-8">
              {/* Tracking Codes */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Tracking & Analytics Codes", "ट्रैकिंग व एनालिटिक्स कोड्स")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Google Tag Manager ID
                    </label>
                    <input
                      type="text"
                      value={settings.gtm_id || ""}
                      onChange={(e) => handleChange("gtm_id", e.target.value || null)}
                      placeholder="GTM-XXXXXXX"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Google Analytics 4 ID
                    </label>
                    <input
                      type="text"
                      value={settings.ga4_id || ""}
                      onChange={(e) => handleChange("ga4_id", e.target.value || null)}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Microsoft Clarity Project ID
                    </label>
                    <input
                      type="text"
                      value={settings.clarity_id || ""}
                      onChange={(e) => handleChange("clarity_id", e.target.value || null)}
                      placeholder="e.g. k5m8..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Meta / Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      value={settings.facebook_pixel_id || ""}
                      onChange={(e) => handleChange("facebook_pixel_id", e.target.value || null)}
                      placeholder="e.g. 1234567890..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Monetization & Google AdSense */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tv size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Google AdSense & Advertisements", "गूगल ऐडसेंस व विज्ञापन सेटिंग्स")}</span>
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    AdSense Publisher ID
                  </label>
                  <input
                    type="text"
                    value={settings.adsense_publisher_id || ""}
                    onChange={(e) => handleChange("adsense_publisher_id", e.target.value || null)}
                    placeholder="pub-xxxxxxxxxxxxxxxx"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <ToggleSwitch
                    checked={settings.adsense_enabled}
                    onChange={(checked) => handleChange("adsense_enabled", checked)}
                    label={b("Enable Google AdSense", "Google AdSense सक्रिय करें")}
                  />
                  <ToggleSwitch
                    checked={settings.ads_enabled}
                    onChange={(checked) => handleChange("ads_enabled", checked)}
                    label={b("Enable Advertisements", "विज्ञापन स्लॉट सक्रिय रखें")}
                  />
                  <ToggleSwitch
                    checked={settings.ads_between_paragraphs}
                    onChange={(checked) => handleChange("ads_between_paragraphs", checked)}
                    label={b("Show Ads In Paragraphs", "पैराग्राफ के बीच विज्ञापन")}
                  />
                </div>
              </div>

              {/* Mobile Push Notifications (OneSignal) */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Mobile & Web Push Notifications", "पुश नोटिफिकेशन सेटिंग्स (OneSignal / WebPush)")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      OneSignal App ID
                    </label>
                    <input
                      type="text"
                      value={settings.onesignal_app_id || ""}
                      onChange={(e) => handleChange("onesignal_app_id", e.target.value || null)}
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      VAPID Public Key (Native WebPush)
                    </label>
                    <input
                      type="text"
                      value={settings.vapid_public_key || ""}
                      onChange={(e) => handleChange("vapid_public_key", e.target.value || null)}
                      placeholder="BEl62iUYgUivx..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ToggleSwitch
                    checked={settings.onesignal_enabled}
                    onChange={(checked) => handleChange("onesignal_enabled", checked)}
                    label={b("Enable OneSignal Push", "OneSignal पुश नोटिफिकेशन सक्रिय करें")}
                  />
                  <ToggleSwitch
                    checked={settings.web_push_enabled}
                    onChange={(checked) => handleChange("web_push_enabled", checked)}
                    label={b("Enable Web Browser Push", "वेब ब्राउज़र पुश नोटिफिकेशन")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THEME & HOMEPAGE */}
          {activeTab === "appearance" && (
            <div className="space-y-8">
              {/* Brand Colors */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Brand Colors", "ब्रांड रंग (Brand Colors)")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      {b("Primary Color (Ground Zero Red)", "प्राथमिक रंग (Primary Color)")}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => handleChange("primary_color", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.primary_color}
                        onChange={(e) => handleChange("primary_color", e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white uppercase"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      {b("Secondary Color", "द्वितीयक रंग (Secondary Color)")}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => handleChange("secondary_color", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.secondary_color}
                        onChange={(e) => handleChange("secondary_color", e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white uppercase"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      {b("Accent Color (Gold / Amber)", "एक्सेंट रंग (Accent Color)")}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.accent_color}
                        onChange={(e) => handleChange("accent_color", e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.accent_color}
                        onChange={(e) => handleChange("accent_color", e.target.value)}
                        className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <ToggleSwitch
                    checked={settings.dark_mode_enabled}
                    onChange={(checked) => handleChange("dark_mode_enabled", checked)}
                    label={b("Enable Dark Mode Toggle", "डार्क मोड टॉगल सक्रिय रखें")}
                    description={b("Allows visitors to switch between Light and Dark themes", "पाठकों को लाइट व डार्क थीम बदलने की सुविधा")}
                  />
                  <ToggleSwitch
                    checked={settings.dark_mode_default}
                    onChange={(checked) => handleChange("dark_mode_default", checked)}
                    label={b("Default to Dark Mode", "डिफ़ॉल्ट रूप से डार्क मोड रखें")}
                    description={b("New visitors see dark mode by default", "नए पाठकों को पहली बार डार्क मोड दिखेगा")}
                  />
                </div>
              </div>

              {/* Homepage Sections */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Homepage Sections & Blocks", "होमपेज सेक्शन्स व लेआउट")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ToggleSwitch
                    checked={settings.homepage_breaking_news_enabled}
                    onChange={(checked) => handleChange("homepage_breaking_news_enabled", checked)}
                    label={b("Show Breaking News Ticker", "ब्रेकिंग न्यूज़ टिकर दिखाएं")}
                  />
                  <ToggleSwitch
                    checked={settings.homepage_featured_enabled}
                    onChange={(checked) => handleChange("homepage_featured_enabled", checked)}
                    label={b("Show Featured Stories Grid", "मुख्य खबर (Featured) सेक्शन")}
                  />
                  <ToggleSwitch
                    checked={settings.homepage_trending_enabled}
                    onChange={(checked) => handleChange("homepage_trending_enabled", checked)}
                    label={b("Show Trending Section", "ट्रेंडिंग समाचार सेक्शन")}
                  />
                  <ToggleSwitch
                    checked={settings.homepage_videos_enabled}
                    onChange={(checked) => handleChange("homepage_videos_enabled", checked)}
                    label={b("Show Video News Section", "वीडियो समाचार सेक्शन")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ARTICLES & LIMITS */}
          {activeTab === "articles" && (
            <div className="space-y-8">
              {/* Content Limits */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Content Limits & Pagination", "कंटेंट सीमाएं व पेजिनेशन (Content Limits)")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Articles Per Page", "प्रति पेज समाचार संख्या")}
                    </label>
                    <input
                      type="number"
                      min={4}
                      max={50}
                      value={settings.homepage_articles_per_page}
                      onChange={(e) => handleChange("homepage_articles_per_page", parseInt(e.target.value) || 12)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Trending Articles Count", "ट्रेंडिंग खबरों की संख्या")}
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={settings.homepage_trending_count}
                      onChange={(e) => handleChange("homepage_trending_count", parseInt(e.target.value) || 6)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Breaking News Count", "ब्रेकिंग टिकर आइटम संख्या")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={settings.homepage_breaking_count}
                      onChange={(e) => handleChange("homepage_breaking_count", parseInt(e.target.value) || 5)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Article Defaults & Reading */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Reading Experience & Article Defaults", "पठन अनुभव व आर्टिकल सेटिंग्स")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ToggleSwitch
                    checked={settings.comments_enabled_globally}
                    onChange={(checked) => handleChange("comments_enabled_globally", checked)}
                    label={b("Enable Comments Globally", "ग्लोबल टिप्पणी प्रणाली सक्रिय रखें")}
                  />
                  <ToggleSwitch
                    checked={settings.related_articles_enabled}
                    onChange={(checked) => handleChange("related_articles_enabled", checked)}
                    label={b("Show Related Articles", "संबंधित समाचार प्रदर्शित करें")}
                  />
                  <ToggleSwitch
                    checked={settings.reading_time_enabled}
                    onChange={(checked) => handleChange("reading_time_enabled", checked)}
                    label={b("Show Estimated Reading Time", "अनुमानित पढ़ने का समय (e.g. 2 min read)")}
                  />
                  <ToggleSwitch
                    checked={settings.author_bio_enabled}
                    onChange={(checked) => handleChange("author_bio_enabled", checked)}
                    label={b("Show Author / Reporter Byline Card", "संवाददाता / लेखक विवरण प्रदर्शित करें")}
                  />
                </div>
              </div>

              {/* Watermarking */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Image Watermarking", "फोटो वॉटरमार्किंग (Watermarking)")}</span>
                  </h2>
                </div>

                <ToggleSwitch
                  checked={settings.image_watermark_enabled}
                  onChange={(checked) => handleChange("image_watermark_enabled", checked)}
                  label={b("Enable Image Watermarks", "अपलोड की गई तस्वीरों पर ऑटो-वॉटरमार्क लगाएं")}
                />

                {settings.image_watermark_enabled && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {b("Watermark Text", "वॉटरमार्क टेक्स्ट (Watermark Text)")}
                    </label>
                    <input
                      type="text"
                      value={settings.watermark_text}
                      onChange={(e) => handleChange("watermark_text", e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: MAINTENANCE & SECURITY */}
          {activeTab === "maintenance" && (
            <div className="space-y-8">
              {/* Maintenance Mode */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Wrench size={16} className="text-rose-600 dark:text-rose-400" />
                    <span>{b("Maintenance Mode", "मेंटेनेंस मोड (Maintenance Mode)")}</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {b(
                      "When active, public visitors will see a maintenance screen. Staff with admin login can still access the console.",
                      "सक्रिय होने पर पाठकों को मेंटेनेंस संदेश दिखेगा। एडमिनिस्ट्रेटर लॉगिन जारी रख सकते हैं।"
                    )}
                  </p>
                </div>

                <ToggleSwitch
                  checked={settings.maintenance_mode}
                  onChange={(checked) => handleChange("maintenance_mode", checked)}
                  label={b("Enable Maintenance Mode", "साइट मेंटेनेंस मोड सक्रिय करें")}
                  description={b("Locks website with downtime message for scheduled updates", "शेड्यूल अपडेट्स के लिए साइट को लॉक करता है")}
                />

                {settings.maintenance_mode && (
                  <div className="space-y-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                        {b("Maintenance Notice Message", "मेंटेनेंस सूचना संदेश")}
                      </label>
                      <textarea
                        rows={3}
                        value={settings.maintenance_message}
                        onChange={(e) => handleChange("maintenance_message", e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-400 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* AI Engine & Editorial Security */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bot size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <span>{b("AI News Desk & Editorial Security", "AI न्यूज़रूम इंजन व सुरक्षा नीतियां")}</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {b("AI Provider Engine", "सक्रिय AI मॉडल इंजन")}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Google Gemini 1.5 Flash (Enterprise Newsroom Optimized)
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      ONLINE & ACTIVE
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {b("Human-in-the-Loop Gate", "मानव संपादक सत्यापन गेट")}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {b("Strict 4-point verification before news syndication", "लाइव प्रसारण से पूर्व 4-सूत्रीय अनिवार्य संपादक जांच")}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                      ENFORCED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {b("Changes take effect immediately across web, RSS and mobile APIs.", "परिवर्तन वेबसाइट, RSS और मोबाइल एपीआई पर तुरंत लागू होंगे।")}
            </div>

            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? b("Saving...", "सहेज रहा है...") : b("Save Settings", "सेटिंग्स सुरक्षित करें")}</span>
            </button>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
