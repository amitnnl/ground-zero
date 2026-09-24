"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Globe, Shield, Bot, Tv, Bell, Database } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import { useLanguage } from "@/lib/languageContext";

export default function AdminSettingsPage() {
  const { b } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  // Form states
  const [siteName, setSiteName] = useState("Ground Zero News | ग्राउंड ज़ीरो न्यूज़");
  const [tagline, setTagline] = useState("South Haryana's premier & most trusted regional digital news network");
  const [aiProvider, setAiProvider] = useState("Google Gemini (gemini-1.5-flash)");
  const [autoEditorialCheck, setAutoEditorialCheck] = useState(true);
  const [liveStreamAutoPlay, setLiveStreamAutoPlay] = useState(false);
  const [citizenSubmissionsActive, setCitizenSubmissionsActive] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PermissionGuard permission="MANAGE_SETTINGS">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="text-slate-500 dark:text-slate-400" />
            {b("Platform & Newsroom Settings", "प्लेटफ़ॉर्म व न्यूज़रूम सेटिंग्स")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {b(
              "Branding, AI engine configuration, editorial security policies, broadcast streams and syndication controls",
              "ब्रैंडिंग, AI इंजन चयन, संपादकीय सुरक्षा नीतियां, लाइव ब्रॉडकास्ट व सोशल सिंडिकेशन विन्यास"
            )}
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          {b("Settings saved successfully!", "सेटिंग्स सफलतापूर्वक सहेजी गईं!")}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "general"
              ? "bg-rose-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Globe size={13} /> {b("General & Branding", "सामान्य व ब्रैंडिंग")}
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "ai"
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bot size={13} /> {b("AI News Desk Engine", "AI न्यूज़ डेस्क इंजन")}
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "security"
              ? "bg-cyan-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Shield size={13} /> {b("Editorial Security Policies", "संपादकीय सुरक्षा नीतियां")}
        </button>
      </div>

      {/* Settings Form */}
      <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <form onSubmit={handleSave} className="space-y-5 text-xs max-w-2xl">
          {activeTab === "general" && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Portal / Website Name:", "वेबसाइट का नाम (Portal Name):")}
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Tagline / Slogan:", "टैगलाइन / स्लोगन:")}
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("HQ & Primary Coverage Zone:", "मुख्यालय एवं प्राथमिक कवरेज क्षेत्र:")}
                </label>
                <input
                  type="text"
                  defaultValue={b(
                    "South Haryana (Mahendragarh, Rewari, Gurugram, Faridabad, Nuh, Palwal, Jhajjar, Charkhi Dadri)",
                    "साउथ हरियाणा (महेंद्रगढ़, रेवाड़ी, गुरुग्राम, फरीदाबाद, नूह, पलवल, झज्जर, चरखी दादरी)"
                  )}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={citizenSubmissionsActive}
                    onChange={(e) => setCitizenSubmissionsActive(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 focus:ring-0"
                  />
                  {b(
                    "Enable Citizen Journalism ('Send News / खबर भेजें') Intake Desk",
                    "नागरिक पत्रकारिता ('Send News') पोर्टल को सक्रिय रखें"
                  )}
                </label>
              </div>
            </>
          )}

          {activeTab === "ai" && (
            <>
              <div>
                <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1">
                  {b("Primary AI Intelligence Engine:", "प्राथमिक AI मॉडल इंजन:")}
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  <option value="Google Gemini (gemini-1.5-flash)">
                    Google Gemini (gemini-1.5-flash) - {b("Default & Recommended", "डिफ़ॉल्ट")}
                  </option>
                  <option value="OpenAI (GPT-4o-mini)">OpenAI (GPT-4o-mini)</option>
                  <option value="Anthropic (Claude 3.5 Sonnet)">Anthropic (Claude 3.5 Sonnet)</option>
                  <option value="Local Regional Offline Generator">
                    Regional Fallback Engine ({b("Offline Local Mode", "ऑफलाइन मोड")})
                  </option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  {b(
                    "If cloud API keys are not supplied, the newsroom automatically falls back to the deterministic regional Hindi/English NLP engine.",
                    "यदि API कुंजी अनुपलब्ध हो, तो स्थानीय उच्च-सटीकता क्षेत्रीय इंजन स्वतः कार्य करता है।"
                  )}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                <div className="text-indigo-700 dark:text-indigo-300 font-bold">
                  {b("AI Editorial Safety Mandate:", "AI न्यूज़ रूम नीति:")}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {b(
                    "Per newsroom policy rule 66, no AI-assisted dispatch can publish publicly without a designated desk editor completing human fact verification. All drafts must carry the 'AI Generated Draft — Human Verification Required' watermark.",
                    "मास्टर प्रॉम्प्ट नियम 66 के अनुसार, AI द्वारा तैयार कोई भी समाचार मानव संपादक के सत्यापन और स्वीकृति के बिना स्वतः प्रकाशित नहीं हो सकता। सभी ड्राफ्ट्स पर 'AI Generated Draft — Human Verification Required' वाटरमार्क अनिवार्य है।"
                  )}
                </p>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={autoEditorialCheck}
                    onChange={(e) => setAutoEditorialCheck(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 focus:ring-0"
                  />
                  {b(
                    "Enforce Senior Editor Approval before any Public Release",
                    "संपादक स्वीकृति अनिवार्य (Human Editor Approval Required Before Public Release)"
                  )}
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-rose-600 focus:ring-0"
                  />
                  {b(
                    "Maintain Immutable Tamper-Proof Audit Trail for all Operations",
                    "सभी संपादकीय व प्रकाशित गतिविधियों को ऑडिट लॉग में सुरक्षित रखें"
                  )}
                </label>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              {b("Save Newsroom Settings", "सेटिंग्स सहेजें")}
            </button>
          </div>
        </form>
      </div>
    </div>
    </PermissionGuard>
  );
}
