import { NextResponse } from "next/server";
import { getLiveStream, getEPaperEditions } from "@/lib/db";

export async function GET() {
  try {
    const [liveStream, editions] = await Promise.all([
      getLiveStream(),
      getEPaperEditions(),
    ]);

    return NextResponse.json({
      success: true,
      api_version: "v1.0.0",
      app_config: {
        app_name: "GROUND ZERO NEWS",
        app_name_hi: "ग्राउंड ज़ीरो न्यूज़",
        current_version: "2.4.0",
        min_supported_version: "1.0.0",
        force_update: false,
        update_url: "https://play.google.com/store/apps/details?id=media.groundzero.news",
      },
      live_tv: {
        is_live: liveStream.isLive,
        stream_url: liveStream.streamUrl,
        current_program: liveStream.currentProgram,
        crawl_ticker: liveStream.crawlTickerText,
      },
      epaper_editions: editions.map((e) => ({
        id: e.id,
        edition_name: e.editionName,
        district: e.district,
        date: e.date,
        total_pages: e.pages.length,
      })),
      support: {
        whatsapp_tipline: "+91 94160 12345",
        citizen_desk_email: "news@groundzero.media",
      },
    });
  } catch (error) {
    console.error("Error generating mobile app config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate mobile config" },
      { status: 500 }
    );
  }
}
