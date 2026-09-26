/**
 * Normalizes any YouTube URL, short link, live link, or ID into an embeddable iframe URL.
 * Automatically avoids the 'X-Frame-Options: sameorigin' block from YouTube.
 */
export function formatLiveStreamEmbedUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If already a privacy-enhanced embed URL, return it
  if (trimmed.includes("youtube-nocookie.com/embed/")) {
    return trimmed;
  }

  // Convert standard youtube.com/embed/ to privacy-enhanced youtube-nocookie.com/embed/
  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed
      .replace("https://www.youtube.com/embed/", "https://www.youtube-nocookie.com/embed/")
      .replace("https://youtube.com/embed/", "https://www.youtube-nocookie.com/embed/");
  }

  // 1. Match youtu.be/<id>
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${youtuBeMatch[1]}?rel=0&modestbranding=1`;
  }

  // 2. Match youtube.com/watch?v=<id>
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`;
  }

  // 3. Match youtube.com/live/<id>
  const liveMatch = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
  if (liveMatch && liveMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${liveMatch[1]}?rel=0&modestbranding=1`;
  }

  // 4. Match channel live stream: youtube.com/channel/<id>/live
  const channelMatch = trimmed.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]+)/);
  if (channelMatch && channelMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelMatch[1]}&rel=0&modestbranding=1`;
  }

  // 5. Match raw 11-char YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube-nocookie.com/embed/${trimmed}?rel=0&modestbranding=1`;
  }

  // Return original URL for custom HLS / iframe players
  return trimmed;
}
