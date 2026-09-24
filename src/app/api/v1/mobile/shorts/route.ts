import { NextRequest, NextResponse } from "next/server";
import { getVideos } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const shorts = await getVideos({ isShort: true });

    return NextResponse.json({
      success: true,
      api_version: "v1.0.0",
      total_shorts: shorts.length,
      shorts: shorts.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        youtube_id: s.youtubeId,
        video_url: s.videoUrl,
        thumbnail_url: s.thumbnailUrl,
        duration: s.duration,
        category: s.category,
        location: s.location,
        views: s.views,
        aspect_ratio: "9:16",
        published_at: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error generating mobile shorts API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate mobile shorts" },
      { status: 500 }
    );
  }
}
