"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AdminLanguage = "en" | "hi";

export interface LanguageContextType {
  lang: AdminLanguage;
  setLang: (lang: AdminLanguage) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
  b: (en: string, hi: string) => string;
}

const translations: Record<string, { en: string; hi: string }> = {
  // Navigation items
  nav_dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  nav_editorial: { en: "Editorial Queue", hi: "संपादकीय समीक्षा" },
  nav_ai_newsroom: { en: "AI News Desk", hi: "एआई न्यूज़रूम" },
  nav_social: { en: "Social Command Center", hi: "सोशल मीडिया" },
  nav_live_tv: { en: "Live TV & Broadcast", hi: "लाइव टीवी" },
  nav_videos: { en: "Video Studio & Shorts", hi: "वीडियो डेस्क" },
  nav_gallery: { en: "Photo Gallery", hi: "फ़ोटो गैलरी" },
  nav_ads: { en: "Ads & Monetization", hi: "विज्ञापन डेस्क" },
  nav_notifications: { en: "Push Alerts", hi: "पुश नोटिफिकेशन" },
  nav_locations: { en: "Districts & Bureaus", hi: "ज़िले व नगर" },
  nav_assignments: { en: "Field Assignments", hi: "फील्ड रिपोर्टर" },
  nav_citizen_reports: { en: "Citizen Tips & Reports", hi: "नागरिक पत्रकारिता" },
  nav_analytics: { en: "News Intelligence", hi: "एनालिटिक्स" },
  nav_users: { en: "Staff & RBAC", hi: "टीम व अनुमतियां" },
  nav_audit_logs: { en: "Security Audit Logs", hi: "ऑडिट ट्रैकिंग" },
  nav_settings: { en: "System Settings", hi: "सिस्टम सेटिंग्स" },

  // Badges
  badge_review: { en: "Review", hi: "रिव्यू" },
  badge_ai: { en: "AI", hi: "एआई" },
  badge_ads: { en: "Ads", hi: "ऐड्स" },
  badge_push: { en: "Push", hi: "पुश" },
  badge_new: { en: "New", hi: "नया" },
  badge_rbac: { en: "RBAC", hi: "अनुमतियां" },

  // Header & Sidebar controls
  nav_title: { en: "Newsroom Navigation", hi: "न्यूज़रूम नेविगेशन" },
  nav_active: { en: "active", hi: "सक्रिय" },
  btn_write_story: { en: "Write Story", hi: "नई खबर लिखें" },
  btn_ai_news_desk: { en: "AI News Desk", hi: "AI न्यूज़रूम" },
  label_role: { en: "Role", hi: "भूमिका" },
  simulator_title: { en: "RBAC Role Simulator", hi: "भूमिका परीक्षण सिम्युलेटर" },
  btn_open_public: { en: "Open Public News Portal", hi: "पब्लिक न्यूज़ पोर्टल देखें" },
  btn_logout: { en: "Logout", hi: "लॉगआउट" },
  btn_logout_newsroom: { en: "Logout from Newsroom", hi: "न्यूज़रूम से लॉगआउट करें" },
  sidebar_expand: { en: "Expand Sidebar (Ctrl+B)", hi: "साइडबार खोलें (Ctrl+B)" },
  sidebar_collapse: { en: "Collapse Sidebar (Ctrl+B)", hi: "साइडबार सिकोड़ें (Ctrl+B)" },
  switch_to_hi: { en: "Switch to Hindi (हिंदी में बदलें)", hi: "Switch to Hindi" },
  switch_to_en: { en: "Switch to English (अंग्रेजी में बदलें)", hi: "Switch to English" },

  // Role names
  role_super_admin: { en: "Super Admin", hi: "सर्वोच्च प्रशासक" },
  role_editor_in_chief: { en: "Editor-in-Chief", hi: "प्रधान संपादक" },
  role_district_editor: { en: "District Editor (Mahendergarh)", hi: "ज़िला संपादक (महेंद्रगढ़)" },
  role_reporter: { en: "Senior Field Reporter (Narnaul)", hi: "वरिष्ठ संवाददाता (नारनौल)" },
  role_social_media_manager: { en: "Social Media Manager", hi: "सोशल मीडिया हेड" },
  role_citizen_contributor: { en: "Citizen Contributor", hi: "नागरिक पत्रकार" },

  // Role tags
  tag_all_access: { en: "All Access", hi: "पूर्ण अधिकार" },
  tag_publish_auth: { en: "Publish Authority", hi: "प्रकाशन अनुमति" },
  tag_bureau_chief: { en: "Bureau Chief", hi: "ब्यूरो चीफ" },
  tag_field_draft: { en: "Field Draft", hi: "फील्ड ड्राफ्ट" },
  tag_syndication: { en: "Syndication", hi: "सिंडिकेशन" },
  tag_tips_reports: { en: "Tips & Reports", hi: "टिप्स व रिपोर्ट्स" },

  // Common UI words
  btn_save: { en: "Save", hi: "सहेजें" },
  btn_cancel: { en: "Cancel", hi: "रद्द करें" },
  btn_delete: { en: "Delete", hi: "हटाएं" },
  btn_edit: { en: "Edit", hi: "संपादित करें" },
  btn_approve: { en: "Approve", hi: "स्वीकृत करें" },
  btn_reject: { en: "Reject", hi: "अस्वीकृत करें" },
  btn_refresh: { en: "Refresh", hi: "रिफ्रेश" },
  btn_search: { en: "Search", hi: "खोजें" },
  btn_filter: { en: "Filter", hi: "फ़िल्टर" },
  btn_create: { en: "Create", hi: "नया बनाएं" },
  btn_submit: { en: "Submit", hi: "जमा करें" },
  btn_back: { en: "Back", hi: "वापस" },
  btn_view: { en: "View", hi: "देखें" },
  btn_view_all: { en: "View All", hi: "सभी देखें" },
  btn_publish_now: { en: "Publish Now", hi: "तुरंत प्रकाशित करें" },
  loading: { en: "Loading...", hi: "लोड हो रहा है..." },
  no_records: { en: "No records found", hi: "कोई विवरण उपलब्ध नहीं है" },
  search_placeholder: { en: "Search...", hi: "खोजें..." },
  all_districts: { en: "All Districts", hi: "सभी ज़िले" },
  all_categories: { en: "All Categories", hi: "सभी श्रेणियां" },

  // Logout Modal
  logout_modal_title: { en: "Log out from Newsroom?", hi: "न्यूज़रूम से लॉगआउट करें?" },
  logout_modal_desc: { en: "You are ending the active session for", hi: "आप सत्र समाप्त कर रहे हैं:" },
  btn_confirm_logout: { en: "Yes, Log Out", hi: "हाँ, लॉगआउट करें" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AdminLanguage>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gz_admin_lang") as AdminLanguage | null;
      if (saved === "en" || saved === "hi") {
        setLangState(saved);
      }
    } catch {}
  }, []);

  const setLang = (newLang: AdminLanguage) => {
    setLangState(newLang);
    try {
      localStorage.setItem("gz_admin_lang", newLang);
      document.documentElement.setAttribute("data-admin-lang", newLang);
    } catch {}
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "hi" : "en");
  };

  const t = (key: string, fallback?: string): string => {
    const item = translations[key];
    if (item && item[lang]) {
      return item[lang];
    }
    return fallback || key;
  };

  const b = (en: string, hi: string): string => {
    return lang === "hi" ? hi : en;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, b }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if used outside of LanguageProvider
    return {
      lang: "en",
      setLang: () => {},
      toggleLang: () => {},
      t: (key: string, fallback?: string) => fallback || key,
      b: (en: string, hi: string) => en,
    };
  }
  return context;
}
