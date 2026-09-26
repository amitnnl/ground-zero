import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import { getBreakingItems, getSiteSettings } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title = settings.default_meta_title || `${settings.site_name} - ${settings.site_tagline}`;
  const description = settings.default_meta_description || settings.site_description;
  const keywords = settings.default_meta_keywords
    ? settings.default_meta_keywords.split(",").map((k) => k.trim())
    : ["Ground Zero News", "Haryana News", "Hindi News"];

  return {
    title,
    description,
    keywords,
    verification: {
      google: settings.google_search_console_verification || undefined,
      other: settings.bing_webmaster_verification
        ? { "msvalidate.01": settings.bing_webmaster_verification }
        : undefined,
    },
    openGraph: {
      title,
      description,
      siteName: settings.og_site_name || settings.site_name,
      images: settings.og_image ? [{ url: settings.og_image }] : undefined,
    },
    icons: {
      icon: settings.site_favicon || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breakingItems, settings] = await Promise.all([
    getBreakingItems(),
    getSiteSettings(),
  ]);

  return (
    <html lang="hi" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Preconnect to external image and video CDN */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://img.youtube.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />

        {/* Dynamic Brand Color Injection */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand-primary: ${settings.primary_color || "#DC2626"};
                --brand-secondary: ${settings.secondary_color || "#1F2937"};
                --brand-accent: ${settings.accent_color || "#F59E0B"};
              }
            `,
          }}
        />

        {/* Theme Initialization Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('gz_theme');
                var defaultDark = ${JSON.stringify(Boolean(settings.dark_mode_default))};
                var isDark = saved === 'dark' || (!saved && defaultDark) || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
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
        {/* Google Tag Manager (Non-blocking Next.js Script) */}
        {settings.gtm_id && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer',${JSON.stringify(settings.gtm_id)});
              `,
            }}
          />
        )}

        {/* Google Analytics 4 */}
        {settings.ga4_id && (
          <>
            <Script
              id="ga4-src"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4_id}`}
            />
            <Script
              id="ga4-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', ${JSON.stringify(settings.ga4_id)});
                `,
              }}
            />
          </>
        )}

        {/* Microsoft Clarity */}
        {settings.clarity_id && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", ${JSON.stringify(settings.clarity_id)});
              `,
            }}
          />
        )}

        {/* Meta / Facebook Pixel */}
        {settings.facebook_pixel_id && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', ${JSON.stringify(settings.facebook_pixel_id)});
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* Google AdSense Script */}
        {settings.adsense_enabled && settings.adsense_publisher_id && (
          <Script
            id="adsense-script"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsense_publisher_id}`}
            crossOrigin="anonymous"
          />
        )}

        {/* OneSignal Web Push SDK */}
        {settings.onesignal_enabled && settings.onesignal_app_id && (
          <>
            <Script
              id="onesignal-sdk"
              strategy="afterInteractive"
              src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
            />
            <Script
              id="onesignal-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.OneSignalDeferred = window.OneSignalDeferred || [];
                  OneSignalDeferred.push(async function(OneSignal) {
                    await OneSignal.init({
                      appId: ${JSON.stringify(settings.onesignal_app_id)},
                    });
                  });
                `,
              }}
            />
          </>
        )}
        {/* Google Tag Manager (noscript fallback) */}
        {settings.gtm_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.gtm_id}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {/* Facebook Pixel (noscript fallback) */}
        {settings.facebook_pixel_id && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${settings.facebook_pixel_id}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        <AppProviders initialSettings={settings}>
          <SiteLayoutWrapper breakingItems={breakingItems} settings={settings}>
            {children}
          </SiteLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
