"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Globe, PhoneCall, Send, ShieldCheck, CheckCircle2, MapPin, Smartphone, Download } from "lucide-react";
import { useSettings } from "@/lib/settingsContext";

export default function Footer() {
  const { settings } = useSettings();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-[#0B0F19] text-slate-300 mt-16 pb-16 md:pb-0 border-t-4 border-[#E11D48]">
      {/* 1. Newsletter / VIP Community Strip */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-950/40">
        <div className="container mx-auto px-4 max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
              <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                दैनिक समाचार ब्रीफिंग
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              हर सुबह साउथ हरियाणा की सबसे निष्पक्ष और ताज़ा खबरें
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              बिना किसी विज्ञापन या स्पैम के — सीधे आपके इनबॉक्स या WhatsApp पर
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs font-semibold">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>धन्यवाद! आप दैनिक समाचार ब्रीफिंग से जुड़ चुके हैं।</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="w-full md:w-auto flex items-center gap-2 max-w-md"
            >
              <input
                key="footer-newsletter-input"
                name="newsletterEmail"
                type="email"
                required
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="अपना ईमेल दर्ज करें..."
                className="px-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E11D48] grow"
              />
              <button
                type="submit"
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <span>सब्सक्राइब</span>
                <Send size={12} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 2. Main Footer Link Grid */}
      <div className="container mx-auto px-4 py-12 max-w-[1440px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10">
          {/* Brand & Editorial Mission */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              {settings.site_logo ? (
                <img src={settings.site_logo} alt={settings.site_name} className="h-9 w-auto object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white flex items-center justify-center font-black text-lg shadow-md">
                  GZ
                </div>
              )}
              <span className="font-black text-lg text-white tracking-tight">
                {settings.site_name || "GROUND ZERO NEWS"}
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              {settings.site_description || "साउथ हरियाणा का अग्रणी डिजिटल मीडिया नेटवर्क। निर्भीक पत्रकारिता, ज़मीनी रिपोर्टिंग और जनसरोकारों की विश्वसनीय आवाज़।"}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>डिजिटल समाचार मानकों के अनुरूप</span>
            </div>
          </div>

          {/* Regional Sections */}
          <div>
            <h4 className="text-white font-extrabold mb-4 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              साउथ हरियाणा कवरेज
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/category/mahendergarh" className="text-slate-400 hover:text-white transition-colors">
                  महेंद्रगढ़ / नारनौल
                </Link>
              </li>
              <li>
                <Link href="/category/rewari" className="text-slate-400 hover:text-white transition-colors">
                  रेवाड़ी / बावल / धारूहेड़ा
                </Link>
              </li>
              <li>
                <Link href="/category/gurugram" className="text-slate-400 hover:text-white transition-colors">
                  गुरुग्राम / मानेसर / सोहना
                </Link>
              </li>
              <li>
                <Link href="/category/faridabad" className="text-slate-400 hover:text-white transition-colors">
                  फरीदाबाद / बल्लभगढ़
                </Link>
              </li>
              <li>
                <Link href="/category/nuh" className="text-slate-400 hover:text-white transition-colors">
                  नूह (मेवात)
                </Link>
              </li>
              <li>
                <Link href="/category/palwal" className="text-slate-400 hover:text-white transition-colors">
                  पलवल / होडल
                </Link>
              </li>
              <li>
                <Link href="/category/jhajjar" className="text-slate-400 hover:text-white transition-colors">
                  झज्जर / बहादुरगढ़
                </Link>
              </li>
              <li>
                <Link href="/category/charkhi-dadri" className="text-slate-400 hover:text-white transition-colors">
                  चरखी दादरी
                </Link>
              </li>
              <li>
                <Link href="/category/mandi-bhav" className="text-slate-400 hover:text-white transition-colors">
                  कृषि एवं मंडी भाव
                </Link>
              </li>
              <li>
                <Link href="/e-paper" className="text-slate-400 hover:text-white transition-colors">
                  साउथ हरियाणा ई-पेपर
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Legal Governance */}
          <div>
            <h4 className="text-white font-extrabold mb-4 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              संपादकीय नीतियां (Governance)
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#editorial" className="hover:text-white transition-colors">
                  Editorial Policy
                </a>
              </li>
              <li>
                <a href="#correction" className="hover:text-white transition-colors">
                  Correction Policy
                </a>
              </li>
              <li>
                <a href="#ethics" className="hover:text-white transition-colors">
                  Code of Ethics
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Social Channels & Mobile Apps */}
          <div>
            <h4 className="text-white font-extrabold mb-4 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              जुड़ें (Social Hub)
            </h4>
            <div className="flex flex-wrap gap-2.5 mb-4">
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M 23.498 6.186 a 3.016 3.016 0 0 0 -2.122 -2.136 C 19.505 3.545 12 3.545 12 3.545 s -7.505 0 -9.377 0.505 A 3.017 3.017 0 0 0 0.502 6.186 C 0 8.07 0 12 0 12 s 0 3.93 0.502 5.814 a 3.016 3.016 0 0 0 2.122 2.136 c 1.871 0.505 9.376 0.505 9.376 0.505 s 7.505 0 9.377 -0.505 a 3.015 3.015 0 0 0 2.122 -2.136 C 24 15.93 24 12 24 12 s 0 -3.93 -0.502 -5.814 z M 9.545 15.568 V 8.432 L 15.818 12 l -6.273 3.568 z" />
                  </svg>
                </a>
              )}

              {settings.whatsapp_channel_url && (
                <a
                  href={settings.whatsapp_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp"
                  className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                </a>
              )}

              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="X (Twitter)"
                  className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 hover:bg-white hover:text-black flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 512 512">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                  </svg>
                </a>
              )}

              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 320 512">
                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                  </svg>
                </a>
              )}

              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="w-8 h-8 rounded-xl bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {settings.telegram_url && (
                <a
                  href={settings.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram"
                  className="w-8 h-8 rounded-xl bg-sky-600/20 text-sky-400 hover:bg-sky-600 hover:text-white flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.942z"/>
                  </svg>
                </a>
              )}
            </div>

            {/* Mobile App Download Badges */}
            {(settings.play_store_url || settings.app_store_url) && (
              <div className="mb-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  मोबाइल ऐप डाउनलोड करें:
                </span>
                <div className="flex flex-col gap-1.5">
                  {settings.play_store_url && (
                    <a
                      href={settings.play_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-2 transition-colors"
                    >
                      <Download size={12} className="text-[#E11D48]" />
                      <span>Google Play Store</span>
                    </a>
                  )}
                  {settings.app_store_url && (
                    <a
                      href={settings.app_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-2 transition-colors"
                    >
                      <Download size={12} className="text-[#E11D48]" />
                      <span>Apple App Store</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              ब्यूरो नेटवर्क: नारनौल • रेवाड़ी • गुरुग्राम • फरीदाबाद • नूह • पलवल • झज्जर • दादरी
            </p>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-extrabold mb-4 uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              संपर्क (Desk)
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {settings.contact_email && (
                <li className="flex items-center gap-2">
                  <Mail size={13} className="text-[#E11D48] shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white truncate">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_phone && (
                <li className="flex items-center gap-2">
                  <PhoneCall size={13} className="text-[#E11D48] shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_address && (
                <li className="flex items-start gap-2">
                  <MapPin size={13} className="text-[#E11D48] shrink-0 mt-0.5" />
                  <span className="leading-snug">{settings.contact_address}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Globe size={13} className="text-[#E11D48] shrink-0" />
                <span className="text-slate-400">साउथ हरियाणा समाचार डेस्क</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="border-t border-slate-800/80 pt-7 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>{settings.watermark_text || `© ${new Date().getFullYear()} ${settings.site_name || "Ground Zero News"}. All rights reserved.`}</p>
          <p className="text-slate-400">
            {settings.site_tagline || "South Haryana Leading Digital News Network | Battle For Truth"}
          </p>
        </div>
      </div>
    </footer>
  );
}
