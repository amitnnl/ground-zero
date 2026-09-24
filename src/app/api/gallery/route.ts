import { NextRequest, NextResponse } from "next/server";
import {
  getPhotoAlbums,
  getPhotoAlbumBySlug,
  createPhotoAlbum,
  deletePhotoAlbum,
  addAuditLog,
} from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const album = await getPhotoAlbumBySlug(slug);
      if (!album) {
        return NextResponse.json({ success: false, error: "Album not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, album });
    }

    const albums = await getPhotoAlbums();
    return NextResponse.json({ success: true, albums });
  } catch (error) {
    console.error("Error fetching photo albums:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch photo albums" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, photographerName, location, coverImageUrl, photos } = body;

    if (!title || !coverImageUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required album fields" },
        { status: 400 }
      );
    }

    const slug = (body.slug || title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 60);

    const newAlbum = await createPhotoAlbum({
      title,
      slug,
      description: description || "",
      photographerName: photographerName || "Ground Zero Photo Desk",
      location: location || "Haryana",
      coverImageUrl,
      photos: photos || [
        {
          id: `p-${Date.now()}-1`,
          url: coverImageUrl,
          caption: title,
        },
      ],
    });

    await addAuditLog({
      userId: "usr-admin",
      userName: "Photo Desk Editor",
      userRole: "EDITOR_IN_CHIEF",
      action: "CREATE_PHOTO_ALBUM",
      entityType: "article",
      entityId: newAlbum.id,
      details: `Published photo album: ${title} (${photos?.length || 1} photos)`,
    });

    return NextResponse.json({ success: true, album: newAlbum }, { status: 201 });
  } catch (error) {
    console.error("Error creating photo album:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create photo album" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing album ID" }, { status: 400 });
    }

    const success = await deletePhotoAlbum(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting album:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete album" },
      { status: 500 }
    );
  }
}
