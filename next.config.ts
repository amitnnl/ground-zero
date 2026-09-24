import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Loads images directly from CDN in parallel without slow dev server proxy/re-encoding
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Optimize server response
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

