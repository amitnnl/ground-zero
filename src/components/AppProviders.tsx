"use client";

import React from "react";
import { AuthProvider } from "@/lib/authContext";
import { ThemeProvider } from "@/lib/themeContext";
import { LanguageProvider } from "@/lib/languageContext";
import { SettingsProvider } from "@/lib/settingsContext";
import { SiteSettings } from "@/lib/types";

interface AppProvidersProps {
  children: React.ReactNode;
  initialSettings?: SiteSettings;
}

export default function AppProviders({ children, initialSettings }: AppProvidersProps) {
  return (
    <SettingsProvider initialSettings={initialSettings}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
