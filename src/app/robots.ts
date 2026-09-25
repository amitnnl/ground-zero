import { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/db";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://groundzeronews.com";

  if (!settings.robots_txt || settings.robots_txt.trim() === "") {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
      ],
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  // Parse custom robots_txt from site settings
  const lines = settings.robots_txt.split("\n");
  const sitemaps: string[] = [];
  let currentUserAgent = "*";
  const userAgentRulesMap: Record<string, { allow: string[]; disallow: string[] }> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...rest] = trimmed.split(":");
    const value = rest.join(":").trim();
    const lowerKey = key.toLowerCase().trim();

    if (lowerKey === "user-agent") {
      currentUserAgent = value;
      if (!userAgentRulesMap[currentUserAgent]) {
        userAgentRulesMap[currentUserAgent] = { allow: [], disallow: [] };
      }
    } else if (lowerKey === "allow") {
      if (!userAgentRulesMap[currentUserAgent]) {
        userAgentRulesMap[currentUserAgent] = { allow: [], disallow: [] };
      }
      userAgentRulesMap[currentUserAgent].allow.push(value);
    } else if (lowerKey === "disallow") {
      if (!userAgentRulesMap[currentUserAgent]) {
        userAgentRulesMap[currentUserAgent] = { allow: [], disallow: [] };
      }
      userAgentRulesMap[currentUserAgent].disallow.push(value);
    } else if (lowerKey === "sitemap") {
      sitemaps.push(value);
    }
  }

  const rules = Object.entries(userAgentRulesMap).map(([userAgent, r]) => ({
    userAgent,
    allow: r.allow.length > 0 ? (r.allow.length === 1 ? r.allow[0] : r.allow) : undefined,
    disallow: r.disallow.length > 0 ? (r.disallow.length === 1 ? r.disallow[0] : r.disallow) : undefined,
  }));

  return {
    rules: rules.length > 0 ? rules : [{ userAgent: "*", allow: "/" }],
    sitemap: sitemaps.length > 0 ? (sitemaps.length === 1 ? sitemaps[0] : sitemaps) : `${baseUrl}/sitemap.xml`,
  };
}
