import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Fallback SVG placeholder image when an uploaded media file is missing on disk
const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" fill="none">
  <rect width="800" height="450" fill="#1E293B"/>
  <rect x="20" y="20" width="760" height="410" rx="16" fill="#0F172A" stroke="#334155" stroke-width="2"/>
  <circle cx="400" cy="190" r="45" fill="#334155" fill-opacity="0.5"/>
  <path d="M380 205L395 185L405 198L415 185L425 205H380Z" fill="#94A3B8"/>
  <text x="400" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#F8FAFC" text-anchor="middle">GROUND ZERO NEWS</text>
  <text x="400" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#94A3B8" text-anchor="middle">डिजिटल न्यूज़ नेटवर्क • साउथ हरियाणा</text>
</svg>`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  if (fs.existsSync(filePath)) {
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
      };
      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Fall through to fallback SVG
    }
  }

  // Graceful fallback: return placeholder SVG instead of a 404 error
  return new NextResponse(FALLBACK_SVG, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-cache",
    },
  });
}
