import { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/db";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();

  return {
    name: settings.site_name
      ? `${settings.site_name}${settings.site_tagline ? ` (${settings.site_tagline})` : ""}`
      : "GROUND ZERO NEWS",
    short_name: settings.site_name || "Ground Zero",
    description: settings.site_description || "दक्षिण हरियाणा का अग्रणी डिजिटल मीडिया नेटवर्क",
    start_url: "/",
    display: "standalone",
    background_color: settings.secondary_color || "#020617",
    theme_color: settings.primary_color || "#E11D48",
    lang: "hi",
    icons: [
      {
        src: settings.site_favicon || "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
