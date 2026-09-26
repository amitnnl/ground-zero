import { NextRequest, NextResponse } from "next/server";
import { getSocialPosts, createSocialPost, deleteSocialPost } from "@/lib/db";

export async function GET() {
  try {
    const posts = await getSocialPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("GET /api/social/posts error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch social posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.platform || !body.content) {
      return NextResponse.json({ success: false, error: "Platform and content are required" }, { status: 400 });
    }

    const newPost = await createSocialPost(body);
    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error) {
    console.error("POST /api/social/posts error:", error);
    return NextResponse.json({ success: false, error: "Failed to create social post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Post ID is required" }, { status: 400 });
    }

    const success = await deleteSocialPost(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/social/posts error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete social post" }, { status: 500 });
  }
}
