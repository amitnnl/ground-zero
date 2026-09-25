import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Supported image types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "कोई फ़ाइल प्राप्त नहीं हुई (No file uploaded)." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "अमान्य फ़ाइल प्रकार। केवल JPG, PNG, WEBP, GIF, या AVIF तस्वीरें ही मान्य हैं।",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "फ़ाइल का आकार 10MB से अधिक नहीं होना चाहिए।",
        },
        { status: 400 }
      );
    }

    // Determine extension
    let ext = "jpg";
    if (file.type === "image/png") ext = "png";
    else if (file.type === "image/webp") ext = "webp";
    else if (file.type === "image/gif") ext = "gif";
    else if (file.type === "image/avif") ext = "avif";
    else if (file.type === "image/svg+xml") ext = "svg";
    else if (file.name.includes(".")) {
      const originalExt = file.name.split(".").pop()?.toLowerCase();
      if (originalExt && /^[a-z0-9]+$/.test(originalExt)) {
        ext = originalExt;
      }
    }

    const filename = `gz-img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
      message: "तस्वीर सफलतापूर्वक अपलोड हो गई!",
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: "सर्वर त्रुटि: फ़ाइल अपलोड नहीं हो सकी।" },
      { status: 500 }
    );
  }
}
