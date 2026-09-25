"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteSettings } from "@/lib/types";

interface SettingsContextType {
  settings: SiteSettings;
  updateSettingsState: (newSettings: Partial<SiteSettings>) => void;
  refreshSettings: () => Promise<void>;
}

// Default fallback settings
const DEFAULT_SETTINGS: SiteSettings = {
  site_name: "Ground Zero News",
  site_tagline: "हरियाणा की आवाज़",
  site_description: "South Haryana's leading digital news network. Real-time updates, breaking news, live blogs and local reporting.",
  site_logo: null,
  site_favicon: null,
  contact_email: "gznarnaul@gmail.com",
  contact_phone: "+91 9217070880",
  contact_address: "Media Tower, Nizampur Road, Narnaul, India, 123001",
  default_meta_title: "Ground Zero News - Haryana Hindi News, ब्रेकिंग न्यूज़",
  default_meta_description: "ग्राउंड ज़ीरो न्यूज़ पर पढ़ें हरियाणा, देश और दुनिया की ताज़ा हिंदी खबरें, ब्रेकिंग न्यूज़ और विश्लेषण।",
  default_meta_keywords: "ground zero news, haryana news, hindi news, breaking news haryana, ग्राउंड ज़ीरो न्यूज़, हरियाणा न्यूज़",
  google_search_console_verification: null,
  bing_webmaster_verification: null,
  og_image: null,
  og_site_name: "Ground Zero News",
  robots_txt: "User-agent: *\nAllow: /\n\nSitemap: https://www.groundzeronews.com/sitemap.xml",
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
};

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettingsState: () => {},
  refreshSettings: async () => {},
});

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: SiteSettings;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SETTINGS);

  const updateSettingsState = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
      }
    } catch {
      // Keep existing settings on network error
    }
  };

  // Sync if initialSettings changes from server
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettingsState, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
