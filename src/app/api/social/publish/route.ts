import { NextRequest, NextResponse } from "next/server";
import { formatAllSocialPosts } from "@/lib/socialFormatter";
import { Article } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { article, channels = ["facebook", "instagram", "youtube", "whatsapp", "twitter"], webhookUrl } = body;

    if (!article || !article.title) {
      return NextResponse.json(
        { success: false, error: "Article data is required for social publishing." },
        { status: 400 }
      );
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const formattedPosts = formatAllSocialPosts(article as Article, baseUrl);

    // Filter to requested channels
    const selectedPosts: Record<string, unknown> = {};
    for (const ch of channels) {
      if ((formattedPosts as Record<string, unknown>)[ch]) {
        selectedPosts[ch] = (formattedPosts as Record<string, unknown>)[ch];
      }
    }

    // Optional automated webhook dispatch (Make.com, Zapier, n8n, Buffer, Meta Graph API)
    const targetWebhook = webhookUrl || process.env.SOCIAL_WEBHOOK_URL;
    let webhookStatus = "not_configured";

    if (targetWebhook) {
      try {
        const webhookRes = await fetch(targetWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "article.published",
            article: {
              id: article.id,
              title: article.title,
              category: article.category,
              url: `${baseUrl}/article/${article.slug}`,
            },
            socialPosts: selectedPosts,
            publishedAt: new Date().toISOString(),
          }),
        });

        webhookStatus = webhookRes.ok ? "dispatched_successfully" : `dispatch_failed_${webhookRes.status}`;
      } catch (err) {
        console.error("Webhook dispatch error:", err);
        webhookStatus = "dispatch_network_error";
      }
    }

    return NextResponse.json({
      success: true,
      message: "Social posts formatted and prepared successfully",
      posts: selectedPosts,
      webhookStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Social publish API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process social syndication" },
      { status: 500 }
    );
  }
}
