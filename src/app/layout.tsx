import type { Metadata } from "next";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import { getBreakingItems } from "@/lib/db";

export const metadata: Metadata = {
  title: "Ground Zero News - South Haryana's #1 Hyperlocal News Network | दक्षिण हरियाणा न्यूज़",
  description:
    "ग्राउंड ज़ीरो न्यूज़ - दक्षिण हरियाणा (महेंद्रगढ़, नारनौल, रेवाड़ी, गुरुग्राम, फरीदाबाद, नूह, पलवल) की निष्पक्ष, ज़मीनी और सबसे तेज़ हिंदी खबरें।",
  keywords: [
    "Ground Zero News",
    "South Haryana News",
    "दक्षिण हरियाणा समाचार",
    "Mahendergarh News",
    "Narnaul News",
    "Rewari News",
    "Gurugram News",
    "Faridabad News",
    "Nuh Mewat News",
    "Palwal News",
    "Ahirwal News",
    "Mandi Bhav South Haryana",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breakingItems = await getBreakingItems();

  return (
    <html lang="hi" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Preconnect to external image CDN for rapid parallel image loading */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://img.youtube.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('gz_theme');
                var isDark = saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <AppProviders>
          <SiteLayoutWrapper breakingItems={breakingItems}>
            {children}
          </SiteLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}

