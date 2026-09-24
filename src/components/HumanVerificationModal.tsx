"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Share2,
  Send,
  AlertTriangle,
  Layers,
  Sparkles,
  Link2,
  FileText,
  Clock,
  X,
} from "lucide-react";
import { Article } from "@/lib/types";
import { useAuth } from "@/lib/authContext";
import { useLanguage } from "@/lib/languageContext";

interface Props {
  article: Article;
  onClose: () => void;
  onDistributed: () => void;
}

export default function HumanVerificationModal({
  article,
  onClose,
  onDistributed,
}: Props) {
  const { currentUser } = useAuth();
  const { b } = useLanguage();

  // Verification Checklist State
  const [checklist, setChecklist] = useState([
    {
      en: "Independent verification of event date, location, and core timeline",
      hi: "स्थान, तिथि एवं मूल घटनाक्रम की स्वतंत्र पुष्टि (Event Date & Location Verified)",
      claim: "स्थान, तिथि एवं मूल घटनाक्रम की स्वतंत्र पुष्टि (Event Date & Location Verified)",
      verified: false,
    },
    {
      en: "Official source / government order / police statement attached",
      hi: "आधिकारिक स्रोत / सरकारी आदेश / पुलिस बयान संलग्न (Official Order / Source Attached)",
      claim: "आधिकारिक स्रोत / सरकारी आदेश / पुलिस बयान संलग्न (Official Order / Source Attached)",
      verified: false,
    },
    {
      en: "Factual confirmation of figures, names, and designations",
      hi: "आंकड़ों, नामों और पदों की तथ्यात्मक पुष्टि (Names, Designations & Figures Confirmed)",
      claim: "आंकड़ों, नामों और पदों की तथ्यात्मक पुष्टि (Names, Designations & Figures Confirmed)",
      verified: false,
    },
    {
      en: "Legal compliance, fairness, and anti-defamation bias check passed",
      hi: "कानूनी, निष्पक्षता एवं मानहानि संबंधी पूर्वाग्रह जांच पास (Fairness & Defamation Check Passed)",
      claim: "कानूनी, निष्पक्षता एवं मानहानि संबंधी पूर्वाग्रह जांच पास (Fairness & Defamation Check Passed)",
      verified: false,
    },
  ]);

  const [evidenceNotes, setEvidenceNotes] = useState(
    "उपायुक्त कार्यालय आदेश संख्या DDM/2026/412 एवं ग्राउंड रिपोर्टर की प्रत्यक्ष पुष्टि।"
  );

  // Selected distribution channels
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "website",
    "facebook",
    "twitter",
    "whatsapp",
    "telegram",
  ]);

  const [isDistributing, setIsDistributing] = useState(false);
  const [distributeResults, setDistributeResults] = useState<any[] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const allVerified = checklist.every((item) => item.verified);

  const toggleChecklist = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, verified: !item.verified } : item))
    );
  };

  const togglePlatform = (plat: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(plat) ? prev.filter((p) => p !== plat) : [...prev, plat]
    );
  };

  const handleExecuteDistribution = async () => {
    if (!allVerified) {
      setErrorMessage(b("Please verify all 4 mandatory checklist items before distributing.", "कृपया पहले सभी 4 अनिवार्य सत्यापन चेकबॉक्सेस को सत्यापित करें।"));
      return;
    }

    setIsDistributing(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/editorial/distribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          verifiedBy: currentUser.name,
          checklist,
          evidenceNotes,
          platforms: selectedPlatforms,
          articleData: article,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setErrorMessage(b("Distribution error. Invalid server response.", "वितरण में त्रुटि। अमान्य सर्वर प्रतिक्रिया।"));
        return;
      }

      const json = await res.json();
      if (res.ok && json.success) {
        setDistributeResults(json.distributionRecords);
        setTimeout(() => {
          onDistributed();
        }, 2200);
      } else {
        setErrorMessage(json.error || b("Distribution error.", "वितरण में त्रुटि।"));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(b("Network error.", "नेटवर्क त्रुटि।"));
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                <ShieldCheck size={18} />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Human-in-the-Loop Pipeline
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {b("Human Verification & Multi-Platform Distribution Gateway", "मानव सत्यापन व स्वचालित बहु-प्लेटफ़ॉर्म वितरण गेट")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 6-Step Visual Workflow Stepper */}
        <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            {b("Editorial Pipeline Lifecycle:", "प्रकाशन पाइपलाइन स्थिति (Editorial Pipeline Lifecycle):")}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold">
            <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              {b("1. Tip / Pitch ✓", "1. विषय / टिप ✓")}
            </div>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60">
              {b("2. AI Draft ✓", "2. AI ड्राफ्ट ✓")}
            </div>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60">
              {b("3. Evidence ✓", "3. साक्ष्य संलग्न ✓")}
            </div>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 ring-1 ring-amber-400">
              {b("4. Verification", "4. मानव सत्यापन")}
            </div>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
              {b("5. Sign-off", "5. संपादक हस्ताक्षर")}
            </div>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
              {b("6. Auto Publish", "6. ऑटो वितरण")}
            </div>
          </div>
        </div>

        {/* Article Summary Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{b("News Headline:", "समाचार शीर्षक:")}</div>
          <div className="text-slate-900 dark:text-white font-bold text-sm">{article.title}</div>
          <div className="text-slate-500 dark:text-slate-400 text-[11px] pt-1">
            {b("Category:", "श्रेणी:")} <span className="text-rose-600 dark:text-rose-400 font-semibold">{article.category}</span> • {b("Region:", "क्षेत्र:")}{" "}
            <span className="text-slate-900 dark:text-white">{article.district || b("Haryana", "हरियाणा")}</span> • {b("Author:", "लेखक:")}{" "}
            <span className="text-slate-700 dark:text-slate-300">{article.author}</span>
          </div>
        </div>

        {/* Step 3: Evidence & Sources Vault */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText size={14} className="text-blue-500 dark:text-blue-400" />
            {b("3. Official Evidence / Reference Notes (Source Evidence):", "3. आधिकारिक साक्ष्य / संदर्भ नोट (Source Evidence):")}
          </label>
          <input
            type="text"
            value={evidenceNotes}
            onChange={(e) => setEvidenceNotes(e.target.value)}
            placeholder={b("Order number, spokesperson name, press release or FIR reference...", "आदेश संख्या, प्रवक्ता का नाम, प्रेस रिलीज या FIR संदर्भ...")}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        {/* Step 4: Mandatory Human Verification Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-500 dark:text-amber-400" />
              {b("4. Human Editor Verification Checklist (Mandatory):", "4. मानव संपादक सत्यापन चेकलिस्ट (सत्यापन अनिवार्य है):")}
            </label>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                allVerified
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
              }`}
            >
              {allVerified ? b("All 4/4 Verified", "सभी 4/4 सत्यापित") : b("Incomplete (0/4)", "अपूर्ण (0/4)")}
            </span>
          </div>

          <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            {checklist.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition select-none"
              >
                <input
                  type="checkbox"
                  checked={item.verified}
                  onChange={() => toggleChecklist(idx)}
                  className="mt-0.5 rounded border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-950 text-emerald-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className={item.verified ? "text-emerald-700 dark:text-emerald-300 font-medium" : "text-slate-700 dark:text-slate-300"}>
                  {b(item.en, item.hi)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 6: Target Distribution Platforms Selection */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Share2 size={14} className="text-emerald-500 dark:text-emerald-400" />
            {b("6. Target Distribution Platforms (Auto-posts upon approval):", "6. स्वचालित वितरण लक्ष्य (स्वीकृति उपरांत स्वतः पोस्ट होंगे):")}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "website", label: "Ground Zero Website Portal" },
              { id: "facebook", label: "Facebook Page (420K)" },
              { id: "twitter", label: "X / Twitter (95K)" },
              { id: "whatsapp", label: "WhatsApp Channel (78K)" },
              { id: "telegram", label: "Telegram Alert" },
              { id: "instagram", label: "Instagram Caption" },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                  selectedPlatforms.includes(p.id)
                    ? "bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-400"
                }`}
              >
                {selectedPlatforms.includes(p.id) && <CheckCircle2 size={12} />}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-600 dark:text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Live Distribution Progress animation */}
        {distributeResults && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2 animate-in fade-in">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={15} />
              {b("Verified & Multi-Platform Distribution Complete!", "सत्यापित व बहु-प्लेटफ़ॉर्म वितरण पूर्ण!")}
            </div>
            <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300 font-mono">
              {distributeResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>✓ {r.platform}: {b("Published", "प्रकाशित")}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">SUCCESS</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition cursor-pointer"
          >
            {b("Cancel", "रद्द करें")}
          </button>

          <button
            type="button"
            disabled={!allVerified || isDistributing}
            onClick={handleExecuteDistribution}
            className={`px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 ${
              allVerified && !isDistributing
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer shadow-emerald-900/40"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700"
            }`}
          >
            <ShieldCheck size={16} />
            {isDistributing
              ? b("Distribution in progress...", "वितरण प्रक्रिया चल रही है...")
              : b("Certify Human Verification & Auto-Publish to Platforms", "मानव सत्यापन प्रमाणित करें एवं 5 प्लेटफ़ॉर्म पर स्वचालित पोस्ट करें")}
          </button>
        </div>
      </div>
    </div>
  );
}
