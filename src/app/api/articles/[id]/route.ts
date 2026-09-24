import { NextRequest, NextResponse } from "next/server";
import { getArticleByIdOrSlug, updateArticle, deleteArticle, incrementArticleViews } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await getArticleByIdOrSlug(id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    // Increment view count asynchronously
    incrementArticleViews(article.id).catch(console.error);

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("API GET /api/articles/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

import { requirePermission } from "@/lib/serverAuth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const requiredPerm = body.status === "PUBLISHED" ? "PUBLISH_NEWS" : "CREATE_NEWS";
    const auth = await requirePermission(request, requiredPerm);
    if (!auth.authorized) return auth.errorResponse!;

    const updated = await updateArticle(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Article not found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error("API PUT /api/articles/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requirePermission(request, "DELETE_NEWS");
    if (!auth.authorized) return auth.errorResponse!;

    const { id } = await params;
    const deleted = await deleteArticle(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Article not found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    console.error("API DELETE /api/articles/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
