import { NextRequest, NextResponse } from "next/server";
import { getSocialPosts, createSocialPost } from "@/lib/db";

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
