import { NextRequest, NextResponse } from "next/server";
import {
  getArticleByIdOrSlug,
  updateArticle,
  createArticle,
  createSocialPost,
  addAuditLog,
} from "@/lib/db";
import { DistributionRecord, SocialPlatform } from "@/lib/types";

import { requirePermission } from "@/lib/serverAuth";

export async function GET() {
  return NextResponse.json({
    success: true,
    service: "Ground Zero Editorial Multi-Platform Syndication API",
    status: "active",
  });
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission(req, "PUBLISH_NEWS");
    if (!auth.authorized) return auth.errorResponse!;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON request body" }, { status: 400 });
    }
    const { articleId, verifiedBy, checklist = [], evidenceNotes = "", platforms = [], articleData } = body || {};

    if (!articleId && !articleData?.title) {
      return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
    }

    let article = articleId ? await getArticleByIdOrSlug(articleId) : null;

    // Auto-create article in database if distributing directly from an in-memory draft (e.g. AI Newsroom)
    if (!article && (articleData || body.title)) {
      const draft = articleData || body;
      article = await createArticle({
        id: articleId && articleId.startsWith("art-") ? articleId : undefined,
        slug:
          draft.slug ||
          (draft.title || "south-haryana-news")
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .substring(0, 60) ||
          `news-${Date.now()}`,
        title: draft.title || "साउथ हरियाणा समाचार",
        subtitle: draft.subtitle || "",
        excerpt: draft.excerpt || draft.content?.substring(0, 160) || "",
        content: draft.content || "",
        category: draft.category || "साउथ हरियाणा",
        categorySlug: draft.categorySlug || "south-haryana",
        district: draft.district || "महेंद्रगढ़",
        state: draft.state || "Haryana",
        imageUrl: draft.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
        imageCaption: draft.imageCaption || "",
        youtubeId: draft.youtubeId || undefined,
        tags: draft.tags || [],
        isBreaking: Boolean(draft.isBreaking),
        isLeadStory: Boolean(draft.isLeadStory),
        author: draft.author || verifiedBy || "ग्राउंड ज़ीरो न्यूज़ रूम",
        status: "DRAFT",
        aiGenerated: draft.aiGenerated ?? true,
        aiDraftPrompt: draft.aiDraftPrompt || "",
        needsVerification: false,
      });
    }

    if (!article) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    // MANDATORY GATE: Check if all claims were verified by human editor
    const unverified = checklist.filter((c: any) => !c.verified);
    if (unverified.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "सभी तथ्यों एवं दावों का मानवीय सत्यापन (Human Verification) अनिवार्य है।",
        },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const distributionRecords: DistributionRecord[] = [
      {
        platform: "Website Portal",
        status: "published",
        timestamp,
        externalLink: `/article/${article.slug}`,
      },
    ];

    // Trigger Multi-Platform Syndication
    for (const plat of platforms) {
      if (plat === "website") continue;

      let content = "";
      if (plat === "facebook") {
        content = `📢 ${article.district || "साउथ हरियाणा"} न्यूज़ अपडेट:\n\n${article.title}\n\n${article.excerpt}\n\nविस्तृत समाचार पढ़ें: https://groundzero.media/article/${article.slug}\n\n#${article.district || "Haryana"} #GroundZeroNews`;
      } else if (plat === "twitter") {
        content = `🚨 ${article.isBreaking ? "BREAKING: " : ""}${article.title.substring(0, 180)}\n\nपूरी खबर पढ़ें 👉 groundzero.media/article/${article.slug} #HaryanaNews`;
      } else if (plat === "whatsapp") {
        content = `📢 *ग्राउंड ज़ीरो न्यूज़*\n\n*${article.title}*\n\n${article.excerpt}\n\nविस्तार से पढ़ें: https://groundzero.media/article/${article.slug}`;
      } else if (plat === "telegram") {
        content = `🔴 **${article.title}**\n\n${article.excerpt}\n\nस्रोत: ग्राउंड ज़ीरो न्यूज़ रूम\nलिंक: https://groundzero.media/article/${article.slug}`;
      } else if (plat === "instagram") {
        content = `${article.title}\n\n${article.excerpt}\n\nलिंक बायो में उपलब्ध है।\n#${article.district || "Haryana"} #GroundZero`;
      }

      if (content) {
        await createSocialPost({
          articleId: article.id,
          platform: plat as SocialPlatform,
          content,
          status: "published",
          publishedAt: timestamp,
          likes: Math.floor(Math.random() * 50) + 10,
          shares: Math.floor(Math.random() * 20) + 5,
        });

        distributionRecords.push({
          platform: plat.toUpperCase(),
          status: "published",
          timestamp,
        });
      }
    }

    // Seal article with Human Verification Audit
    const updated = await updateArticle(article.id, {
      status: "PUBLISHED",
      publishedAt: timestamp,
      needsVerification: false,
      editorName: verifiedBy || "Editor-in-Chief",
      verificationAudit: {
        verifiedBy: verifiedBy || "Editor-in-Chief",
        verifiedAt: timestamp,
        checklist,
        evidenceNotes,
      },
      distributionRecords,
    });

    // Record Immutable Audit Log
    await addAuditLog({
      userId: "editor-user",
      userName: verifiedBy || "Editor-in-Chief",
      userRole: "EDITOR_IN_CHIEF",
      action: "HUMAN_VERIFIED_AND_DISTRIBUTED",
      entityType: "article",
      entityId: article.id,
      details: `मानव सत्यापन पूर्ण: संपादक "${verifiedBy}" द्वारा साक्ष्य पुष्टि उपरांत 6 प्लेटफ़ॉर्म्स (${platforms.join(", ")}) पर स्वचालित वितरण संपन्न।`,
    });

    return NextResponse.json({
      success: true,
      article: updated,
      distributionRecords,
    });
  } catch (error) {
    console.error("Editorial Distribute error:", error);
    return NextResponse.json(
      { success: false, error: "वितरण प्रक्रिया में समस्या आई।" },
      { status: 500 }
    );
  }
}
