import { NextResponse } from "next/server";
import { getArticles } from "@/lib/db";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://groundzero.media";
  const articles = await getArticles();
  const latestArticles = articles.slice(0, 50);

  const rssItems = latestArticles
    .map((art) => {
      const pubDate = new Date(art.createdAt).toUTCString();
      const articleUrl = `${baseUrl}/article/${art.slug || art.id}`;
      const escapedTitle = (art.title || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const escapedExcerpt = (art.excerpt || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `
    <item>
      <title>${escapedTitle}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapedExcerpt}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${art.category}</category>
      <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${art.author || "ग्राउंड ज़ीरो रिपोर्टर"}</dc:creator>
      ${art.imageUrl ? `<enclosure url="${art.imageUrl}" type="image/jpeg" length="102400" />` : ""}
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>GROUND ZERO NEWS (ग्राउंड ज़ीरो न्यूज़)</title>
    <link>${baseUrl}</link>
    <description>दक्षिण हरियाणा एवं राष्ट्रीय समाचार - निष्पक्ष, निर्भीक, सटीक</description>
    <language>hi-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>GROUND ZERO NEWS</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
