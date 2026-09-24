import { NextRequest, NextResponse } from "next/server";
import { getArticles, getCategories, getBreakingItems } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district") || undefined;
    const categorySlug = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    const [allArticles, categories, breakingItems] = await Promise.all([
      getArticles({ district, categorySlug }),
      getCategories(),
      getBreakingItems(),
    ]);

    const startIndex = (page - 1) * limit;
    const paginatedArticles = allArticles.slice(startIndex, startIndex + limit);

    const heroStories = page === 1 && !categorySlug ? allArticles.slice(0, 3) : [];

    return NextResponse.json({
      success: true,
      api_version: "v1.0.0",
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        limit,
        total_items: allArticles.length,
        has_more: startIndex + limit < allArticles.length,
      },
      breaking_news: breakingItems.filter((b) => b.isLive),
      hero_carousel: heroStories.map((art) => ({
        id: art.id,
        title: art.title,
        excerpt: art.excerpt,
        image_url: art.imageUrl,
        category: art.category,
        district: art.district,
        published_at: art.createdAt,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        name_hi: c.nameHi,
        slug: c.slug,
      })),
      feed: paginatedArticles.map((art) => ({
        id: art.id,
        slug: art.slug,
        title: art.title,
        excerpt: art.excerpt,
        image_url: art.imageUrl,
        category: art.category,
        category_slug: art.categorySlug,
        district: art.district,
        views: art.views,
        is_breaking: Boolean(art.isBreaking),
        has_video: Boolean(art.youtubeId),
        published_at: art.createdAt,
        share_url: `https://groundzero.media/article/${art.slug || art.id}`,
      })),
    });
  } catch (error) {
    console.error("Error generating mobile feed API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate mobile feed" },
      { status: 500 }
    );
  }
}
