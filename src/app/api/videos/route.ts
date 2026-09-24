import { NextRequest, NextResponse } from "next/server";
import { getVideos, getVideoById, createVideo, deleteVideo, addAuditLog } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const video = await getVideoById(id);
      if (!video) {
        return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, video });
    }

    const format = searchParams.get("format") || undefined;
    const isShortParam = searchParams.get("isShort");
    const isShort = isShortParam !== null ? isShortParam === "true" : undefined;
    const category = searchParams.get("category") || undefined;

    const videos = await getVideos({ format, isShort, category });
    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtubeId, videoUrl, thumbnailUrl, duration, category, location, format, isShort } = body;

    if (!title || !thumbnailUrl || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required video parameters" },
        { status: 400 }
      );
    }

    const newVideo = await createVideo({
      title,
      description: description || "",
      youtubeId: youtubeId || "dewccxNzJbU",
      videoUrl: videoUrl || "",
      thumbnailUrl,
      duration: duration || "03:00",
      category,
      location: location || "Haryana",
      format: format || (isShort ? "9:16" : "16:9"),
      isShort: Boolean(isShort),
    });

    await addAuditLog({
      userId: "usr-admin",
      userName: "Video Producer",
      userRole: "VIDEO_EDITOR",
      action: "PUBLISH_VIDEO",
      entityType: "article",
      entityId: newVideo.id,
      details: `Published ${newVideo.format} video: ${title}`,
    });

    return NextResponse.json({ success: true, video: newVideo }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish video" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing video ID" }, { status: 400 });
    }

    const success = await deleteVideo(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
