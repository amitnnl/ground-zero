import { NextRequest, NextResponse } from "next/server";
import {
  getAds,
  getActiveAdsByPlacement,
  createAd,
  updateAd,
  deleteAd,
  trackAdImpression,
  trackAdClick,
  addAuditLog,
} from "@/lib/db";
import { AdCampaign } from "@/lib/types";
import { requirePermission } from "@/lib/serverAuth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement") as AdCampaign["placement"] | null;
    const district = searchParams.get("district") || undefined;
    const activeOnly = searchParams.get("activeOnly") === "true";

    if (placement) {
      const activeAds = await getActiveAdsByPlacement(placement, district);
      return NextResponse.json({ success: true, ads: activeAds });
    }

    const allAds = await getAds();
    const filtered = activeOnly
      ? allAds.filter((a) => a.status === "active")
      : allAds;

    return NextResponse.json({ success: true, ads: filtered });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check for tracking actions
    if (body.action === "track_impression" && body.adId) {
      await trackAdImpression(body.adId);
      return NextResponse.json({ success: true, tracked: "impression" });
    }

    if (body.action === "track_click" && body.adId) {
      await trackAdClick(body.adId);
      return NextResponse.json({ success: true, tracked: "click" });
    }

    // Otherwise creation requires MANAGE_ADS
    const auth = await requirePermission(request, "MANAGE_ADS");
    if (!auth.authorized) return auth.errorResponse!;

    const { advertiserName, campaignTitle, placement, imageUrl, targetUrl, startDate, endDate, districtTarget } = body;
    if (!advertiserName || !campaignTitle || !placement || !imageUrl || !targetUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required ad fields" },
        { status: 400 }
      );
    }

    const newAd = await createAd({
      advertiserName,
      campaignTitle,
      placement,
      imageUrl,
      targetUrl,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "active",
      districtTarget: districtTarget || "Haryana",
    });

    await addAuditLog({
      userId: auth.user.id,
      userName: auth.user.name,
      userRole: auth.user.role,
      action: "CREATE_AD_CAMPAIGN",
      entityType: "setting",
      entityId: newAd.id,
      details: `Created campaign '${campaignTitle}' for '${advertiserName}' [${placement}]`,
    });

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });
  } catch (error) {
    console.error("Error handling ad POST:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process ad request" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requirePermission(request, "MANAGE_ADS");
    if (!auth.authorized) return auth.errorResponse!;

    const body = await request.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ad ID" }, { status: 400 });
    }

    const updated = await updateAd(id, data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ad: updated });
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json({ success: false, error: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requirePermission(request, "MANAGE_ADS");
    if (!auth.authorized) return auth.errorResponse!;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ad ID" }, { status: 400 });
    }

    const success = await deleteAd(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ success: false, error: "Failed to delete ad" }, { status: 500 });
  }
}
