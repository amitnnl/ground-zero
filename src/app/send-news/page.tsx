"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Send,
  CheckCircle2,
  MapPin,
  Camera,
  FileText,
  User,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";

export default function SendNewsPage() {
  const [citizenName, setCitizenName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [district, setDistrict] = useState("महेंद्रगढ़ / Mahendergarh");
  const [locationDetails, setLocationDetails] = useState("");
  const [category, setCategory] = useState("नागरिक समस्या / इंफ्रास्ट्रक्चर");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/citizen-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenName,
          phone,
          email,
          district,
          locationDetails,
          category,
          headline,
          description,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("सूचना दर्ज करने में समस्या आई। कृपया पुनः प्रयास करें।");
      }
    } catch (err) {
      console.error(err);
      alert("नेटवर्क समस्या।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-800 dark:hover:text-white flex items-center gap-1">
          <ArrowLeft size={14} /> मुख्य पृष्ठ
        </Link>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-slate-800 dark:text-slate-200 font-bold">नागरिक पत्रकारिता (Citizen Reporter)</span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 text-white rounded-3xl p-6 sm:p-9 border border-rose-900/30 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert size={14} />
          ग्राउंड ज़ीरो नागरिक अधिकार मंच
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          अपने क्षेत्र की खबर या समस्या हमें भेजें (Send News)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          क्या आपके गांव, नगर या वार्ड में कोई घटना, प्रशासनिक अनदेखी या समस्या है? अपनी सूचना और फोटो नीचे दर्ज करें। हमारे क्षेत्रीय संवाददाता मौके पर पहुंचकर सत्यापन करेंगे और खबर प्रकाशित की जाएगी।
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            आपकी सूचना सफलतापूर्वक प्राप्त हुई!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            धन्यवाद, <strong>{citizenName}</strong>। आपकी रिपोर्ट को हमारे क्षेत्रीय जांच डेस्क को सौंप दिया गया है। आवश्यकता पड़ने पर हमारी रिपोर्टिंग टीम आपसे संपर्क करेगी।
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setHeadline("");
                setDescription("");
                setLocationDetails("");
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              दूसरी खबर भेजें
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-9 shadow-sm space-y-6 transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-rose-600 dark:text-rose-400" />
                आपका पूरा नाम: *
              </label>
              <input
                type="text"
                required
                placeholder="उदा. विकास यादव"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-rose-600 dark:text-rose-400" />
                मोबाइल नंबर (सत्यापन हेतु): *
              </label>
              <input
                type="tel"
                required
                placeholder="उदा. 98123 45678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-600 dark:text-rose-400" />
                ज़िला (District): *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900"
              >
                <option value="महेंद्रगढ़ / Mahendergarh">महेंद्रगढ़ (Mahendergarh)</option>
                <option value="नारनौल / Narnaul">नारनौल (Narnaul)</option>
                <option value="रेवाड़ी / Rewari">रेवाड़ी (Rewari)</option>
                <option value="गुरुग्राम / Gurugram">गुरुग्राम (Gurugram)</option>
                <option value="फरीदाबाद / Faridabad">फरीदाबाद (Faridabad)</option>
                <option value="नूह / Nuh">नूह - मेवात (Nuh)</option>
                <option value="पलवल / Palwal">पलवल (Palwal)</option>
                <option value="चरखी दादरी / Charkhi Dadri">चरखी दादरी (Charkhi Dadri)</option>
                <option value="झज्जर / Jhajjar">झज्जर (Jhajjar)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                सटीक स्थान / गांव / वार्ड:
              </label>
              <input
                type="text"
                placeholder="उदा. कनीना रोड, नजदीक सिहमा मोड़"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              समाचार का मुख्य शीर्षक / विषय: *
            </label>
            <input
              type="text"
              required
              placeholder="उदा. सिहमा मोड़ के पास सड़क पर 2 फीट गहरा गड्ढा, हादसे का डर"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              विस्तृत विवरण (क्या, कब और कहाँ हुआ): *
            </label>
            <textarea
              rows={5}
              required
              placeholder="पूरी घटना, प्रभावित लोगों की संख्या और प्रशासन से आपकी मांग विस्तार से लिखें..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
            <Camera size={24} className="text-slate-400 mx-auto" />
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">तस्वीरें या वीडियो लिंक (वैकल्पिक)</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              फोटो या वीडियो फाइलें हमारे WhatsApp डेस्क (+91 98123 45678) पर भी भेजी जा सकती हैं।
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-rose-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} />
              {loading ? "भेजा जा रहा है..." : "सूचना व समाचार सबमिट करें"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
