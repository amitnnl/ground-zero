"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  Flame,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Volume2,
} from "lucide-react";
import { PushAlert } from "@/lib/types";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<PushAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return;
        const data = await res.json();
        if (data?.success && data?.alerts) {
          setAlerts(data.alerts);
          // Check local storage for read state
          const readIds = JSON.parse(localStorage.getItem("read_alerts") || "[]");
          const unread = data.alerts.filter((a: PushAlert) => !readIds.includes(a.id)).length;
          setUnreadCount(unread);
        }
      } catch {
        // silent fail
      }
    }

    // Defer loading notifications until after initial interactive paint
    const timer = setTimeout(() => {
      loadAlerts();
    }, 1200);

    // Check notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setSubscribed(true);
      }
    }

    // Outside click listener
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleRequestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("यह ब्राउज़र वेब नोटिफिकेशन का समर्थन नहीं करता है।");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setSubscribed(true);
        // Register endpoint
        fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "subscribe",
            endpoint: `https://fcm.googleapis.com/fcm/send/groundzero-sub-${Date.now()}`,
          }),
        }).catch(() => {});

        new Notification("GROUND ZERO NEWS", {
          body: "धन्यवाद! अब आपको दक्षिण हरियाणा की हर बड़ी ब्रेकिंग खबर सबसे पहले मिलेगी।",
          icon: "/favicon.ico",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = alerts.map((a) => a.id);
    localStorage.setItem("read_alerts", JSON.stringify(allIds));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            handleMarkAllRead();
          }
        }}
        className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
        title="ब्रेकिंग न्यूज़ अलर्ट्स"
      >
        {unreadCount > 0 ? (
          <BellRing size={16} className="text-red-500 animate-bounce" />
        ) : (
          <Bell size={16} />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {/* Drawer Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                ताज़ा ब्रेकिंग अलर्ट्स
              </h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-slate-500 hover:text-red-600 font-semibold"
              >
                सभी पढ़े गए मार्क करें
              </button>
            )}
          </div>

          {/* Web Push Subscription Banner */}
          {!subscribed && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900 flex items-center justify-between gap-3">
              <div className="text-[11px] text-red-800 dark:text-red-300">
                <strong>लाइव अलर्ट:</strong> हर बड़ी घटना सीधे स्क्रीन पर पाएं
              </div>
              <button
                onClick={handleRequestPermission}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg shrink-0 shadow-xs"
              >
                चालू करें
              </button>
            </div>
          )}

          {/* Alerts List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                कोई नया अलर्ट नहीं है।
              </div>
            ) : (
              alerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={alert.targetUrl || "/"}
                  onClick={() => setIsOpen(false)}
                  className="block p-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      {alert.isBreaking && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-red-600 text-white">
                          BREAKING
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {alert.category}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(alert.sentAt).toLocaleTimeString("hi-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-red-400" />
                      {alert.district || "हरियाणा"}
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-0.5">
                      <span>विस्तार</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              href="/live-tv"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              24x7 लाइव टीवी बुलेटिन देखें ›
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
