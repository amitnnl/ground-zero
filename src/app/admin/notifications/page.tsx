"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BellRing,
  Send,
  Users,
  Flame,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import { PushAlert } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";
import { useSettings } from "@/lib/settingsContext";
import PermissionGuard from "@/components/PermissionGuard";

export default function AdminNotificationsPage() {
  const { lang, b } = useLanguage();
  const { settings } = useSettings();
  const [alerts, setAlerts] = useState<PushAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetUrl: "/",
    category: "ब्रेकिंग",
    district: "हरियाणा",
    isBreaking: true,
  });

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data?.success) {
            setAlerts(data.alerts);
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
    fetchAlerts();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) {
        alert("नोटिफिकेशन प्रसारित करने में विफल");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setNotification(`पुश नोटिफिकेशन सफलतापूर्वक ${data.alert.deliveredCount.toLocaleString()} पाठकों को प्रसारित किया गया!`);
        setFormData({
          title: "",
          message: "",
          targetUrl: "/",
          category: "ब्रेकिंग",
          district: "हरियाणा",
          isBreaking: true,
        });
        fetchAlerts();
      } else {
        alert(data.error || "नोटिफिकेशन भेजने में त्रुटि");
      }
    } catch (err) {
      console.error(err);
      alert("सर्वर से संपर्क करने में असमर्थ");
    } finally {
      setSubmitting(false);
    }
  };

  const totalDelivered = alerts.reduce((sum, a) => sum + (a.deliveredCount || 0), 0);

  return (
    <PermissionGuard permission="MANAGE_NOTIFICATIONS">
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                <BellRing className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  {b("Push Broadcast & Breaking Alerts", "पुश नोटिफिकेशन एवं ब्रेकिंग अलर्ट्स (Push Alerts)")}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/40">
                    Instant Dispatch
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {b(
                    "Broadcast breaking news flashes and community advisories to thousands of readers instantly",
                    "लाखों पंजीकृत मोबाइल व वेब पाठकों तक एक सेकंड में ब्रेकिंग न्यूज़ अलर्ट्स पहुंचाएं"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

      {!settings.web_push_enabled && !settings.onesignal_enabled && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              {b(
                "Push Notifications are currently disabled globally in Site Settings. Dispatch will only save logs.",
                "साइट सेटिंग्स में पुश नोटिफिकेशन वर्तमान में निष्क्रिय (Disabled) हैं। अलर्ट केवल डेटाबेस लॉग में सुरक्षित होंगे।"
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Active Subscribers", "सक्रिय सब्सक्राइबर्स")}</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">45,280</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">Web + Android PWA</p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Total Alerts Sent", "कुल प्रसारित अलर्ट्स")}</span>
            <BellRing className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400 mt-2">{alerts.length}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">{b("High-Priority Broadcast", "हाई-प्रायोरिटी ब्रॉडकास्ट")}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Total Delivered", "कुल डिलीवर अलर्ट्स")}</span>
            <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {totalDelivered.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">{b("99.4% Delivery Rate", "99.4% डिलीवरी दर")}</p>
        </div>

        <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs font-semibold">
            <span>{b("Avg CTR (Open Rate)", "औसत ओपन रेट (CTR)")}</span>
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">24.8%</div>
          <p className="text-[11px] text-slate-500 mt-1 font-semibold">{b("Benchmark: 8.2%", "उद्योग मानक: 8.2%")}</p>
        </div>
      </div>

      {/* Main Grid: Form + Live Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Compose Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Send className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              {b("Dispatch Instant Push Notification", "तत्काल पुश नोटिफिकेशन प्रसारित करें (Dispatch Alert)")}
            </h2>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {b("Notification Title *", "अलर्ट शीर्षक (Notification Title) *")}
              </label>
              <input
                type="text"
                required
                placeholder={b("e.g. Weather Alert: High wind speeds in Narnaul and Rewari", "उदा. मौसम अलर्ट: नारनौल और रेवाड़ी में अगले 3 घंटों में तेज आंधी")}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {b("Body Message *", "अलर्ट संदेश (Body Message) *")}
              </label>
              <textarea
                rows={2}
                required
                placeholder={b("e.g. Weather department warns of 60 km/h squall across South Haryana...", "उदा. मौसम विभाग ने दक्षिण हरियाणा में 60 किमी/घंटा की रफ्तार से हवाएं चलने की चेतावनी दी है।")}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Category", "श्रेणी (Category)")}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                >
                  <option value="ब्रेकिंग">{b("Breaking", "ब्रेकिंग")}</option>
                  <option value="मौसम">{b("Weather", "मौसम")}</option>
                  <option value="ट्रैफिक">{b("Traffic", "ट्रैफिक")}</option>
                  <option value="क्राइम">{b("Crime", "क्राइम")}</option>
                  <option value="राजनीति">{b("Politics", "राजनीति")}</option>
                  <option value="स्वास्थ्य">{b("Health", "स्वास्थ्य")}</option>
                  <option value="खेल">{b("Sports", "खेल")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("District Target", "ज़िला लक्ष्य (District)")}
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                >
                  <option value="साउथ हरियाणा">{b("All South Haryana", "संपूर्ण साउथ हरियाणा (All)")}</option>
                  <option value="महेंद्रगढ़">{b("Mahendergarh / Narnaul", "महेंद्रगढ़ / नारनौल")}</option>
                  <option value="रेवाड़ी">{b("Rewari / Bawal", "रेवाड़ी / बावल")}</option>
                  <option value="गुरुग्राम">{b("Gurugram / Manesar", "गुरुग्राम / मानेसर")}</option>
                  <option value="फरीदाबाद">{b("Faridabad / Ballabhgarh", "फरीदाबाद / बल्लभगढ़")}</option>
                  <option value="नूह">{b("Nuh / Mewat", "नूह / मेवात")}</option>
                  <option value="पलवल">{b("Palwal / Hodal", "पलवल / होडल")}</option>
                  <option value="झज्जर">{b("Jhajjar / Bahadurgarh", "झज्जर / बहादुरगढ़")}</option>
                  <option value="चरखी दादरी">{b("Charkhi Dadri", "चरखी दादरी")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {b("Target URL", "टारगेट लिंक (Target URL)")}
                </label>
                <input
                  type="text"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                  placeholder="/article/..."
                />
              </div>
            </div>

            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {b("High-Priority Breaking Flash (Urgent Alert)", "हाई-प्रायोरिटी ब्रेकिंग फ्लैश (Urgent Alert)")}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {b("Triggers sound & vibration on subscriber lockscreens", "उपयोगकर्ताओं के मोबाइल स्क्रीन पर साउंड व वाइब्रेशन के साथ प्रदर्शित होगा")}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.isBreaking}
                onChange={(e) => setFormData({ ...formData, isBreaking: e.target.checked })}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? b("Broadcasting...", "प्रसारित हो रहा है...") : b("Send Broadcast to All Subscribers", "सभी सब्सक्राइबर्स को भेजें (Send Broadcast)")}</span>
            </button>
          </form>
        </div>

        {/* Right: Real-time Device Preview */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Smartphone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {b("Live Mobile Preview", "लाइव डिवाइस प्रिव्यू (Mobile Preview)")}
              </h3>
            </div>

            {/* Simulated Phone Lockscreen Notification */}
            <div className="bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700/80 rounded-2xl p-4 shadow-xl space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  {settings.site_logo ? (
                    <img
                      src={settings.site_logo}
                      alt={settings.site_name}
                      className="w-4 h-4 rounded-md object-contain bg-white shrink-0"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: settings.primary_color || "#DC2626" }}
                      className="w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-black text-white shrink-0"
                    >
                      {settings.site_name ? settings.site_name.slice(0, 2).toUpperCase() : "GZ"}
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 truncate max-w-[150px]">
                    {(settings.site_name || "GROUND ZERO NEWS").toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{b("now", "अभी (now)")}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {formData.title || b("Alert headline appears here...", "अलर्ट का शीर्षक यहां दिखेगा...")}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {formData.message || b("Notification text displays on the mobile lockscreen...", "सूचना का विवरण मोबाइल स्क्रीन पर इस तरह प्रदर्शित होगा...")}
              </p>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200 dark:border-slate-800/80">
                <span>{b("Target:", "टारगेट:")} {formData.district}</span>
                <span className="text-red-500 dark:text-red-400 font-semibold">{b("Tap to read ›", "टैप करके पढ़ें ›")}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
            <span>{b("Automatically handled by Browser & Android PWA Background Service Workers.", "ब्राउज़र एवं Android PWA बैकग्राउंड सर्विस वर्कर द्वारा ऑटोमैटिक हैंडल होगा।")}</span>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500 dark:text-red-400" />
            {b("Recent Alert Broadcast History", "हालिया प्रसारित अलर्ट इतिहास")} ({alerts.length})
          </h3>
          <span className="text-xs text-slate-500">Live Delivery Ledger</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">{b("Loading...", "लोड हो रहा है...")}</div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            {b("No alert history found.", "कोई अलर्ट इतिहास नहीं है।")}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
            {alerts.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.isBreaking && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">
                        BREAKING
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3 h-3" />
                      {item.district}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{b("Delivered", "डिलीवर")}</div>
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {item.deliveredCount.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">{b("Time", "समय")}</div>
                    <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                      {new Date(item.sentAt).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <Link
                    href={item.targetUrl || "/"}
                    target="_blank"
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title={b("View Target Link", "टारगेट लिंक देखें")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </PermissionGuard>
  );
}
