"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, Clock, ShieldCheck, Mail, Phone, Lock } from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface MaintenanceModeOverlayProps {
  settings: SiteSettings;
}

export default function MaintenanceModeOverlay({ settings }: MaintenanceModeOverlayProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    if (!settings.maintenance_end_time) return;

    const targetDate = new Date(settings.maintenance_end_time).getTime();
    if (isNaN(targetDate)) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft(null);
        clearInterval(interval);
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.maintenance_end_time]);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {settings.site_logo ? (
            <img src={settings.site_logo} alt={settings.site_name} className="h-10 w-auto object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white flex items-center justify-center font-black text-xl shadow-lg">
              GZ
            </div>
          )}
          <div>
            <h1 className="font-black text-xl tracking-tight">{settings.site_name}</h1>
            <p className="text-xs text-rose-400 font-semibold">{settings.site_tagline}</p>
          </div>
        </div>

        <Link
          href="/admin/login"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Lock size={12} />
          <span>Admin Login</span>
        </Link>
      </div>

      {/* Center Hero Notice */}
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center mb-6 animate-pulse">
          <Wrench size={38} />
        </div>

        <div className="inline-flex items-center gap-2 bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-black uppercase px-3 py-1 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Scheduled System Maintenance / सिस्टम रखरखाव</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
          हम जल्द ही लौट रहे हैं
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
          {settings.maintenance_message || "We are performing scheduled maintenance to upgrade our editorial systems. We'll be back shortly."}
        </p>

        {timeLeft && (
          <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 shadow-inner">
            <Clock size={18} className="text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Estimated Service Resume In
              </div>
              <div className="text-lg font-black text-amber-400 font-mono tracking-widest">
                {timeLeft}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Support Info */}
      <div className="border-t border-slate-800/80 pt-6 max-w-4xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>{settings.watermark_text || "© Ground Zero News"} — All newsroom data safe & encrypted.</span>
        </div>

        <div className="flex items-center gap-4">
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={13} className="text-rose-400" />
              <span>{settings.contact_email}</span>
            </a>
          )}
          {settings.contact_phone && (
            <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={13} className="text-emerald-400" />
              <span>{settings.contact_phone}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
