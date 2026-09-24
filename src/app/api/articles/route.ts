import { NextRequest, NextResponse } from "next/server";
import { getArticles, createArticle } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("q") || undefined;
    const isBreaking = searchParams.get("breaking") === "true" ? true : undefined;

    const articles = await getArticles({
      categorySlug: category,
      search,
      isBreaking,
    });

    return NextResponse.json({ success: true, count: articles.length, articles });
  } catch (error) {
    console.error("API GET /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

import { requirePermission } from "@/lib/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const auth = await requirePermission(request, "CREATE_NEWS");
    if (!auth.authorized) return auth.errorResponse!;

    const body = await request.json();

    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { success: false, error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    const newArticle = await createArticle({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || body.content.substring(0, 160) + "...",
      content: body.content,
      category: body.category,
      categorySlug: body.categorySlug || "haryana",
      imageUrl:
        body.imageUrl ||
        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
      imageCaption: body.imageCaption || "",
      youtubeId: body.youtubeId || undefined,
      isBreaking: Boolean(body.isBreaking),
      isLeadStory: Boolean(body.isLeadStory),
      author: body.author || "ग्राउंड ज़ीरो रिपोर्टर",
      tags: body.tags || [],
    });

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    console.error("API POST /api/articles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create article" },
      { status: 500 }
    );
  }
}
