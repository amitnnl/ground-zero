import { Article } from "./types";

export interface SocialPostPayload {
  platform: "facebook" | "instagram" | "youtube" | "twitter" | "whatsapp";
  text: string;
  shareUrl: string;
  imageUrl?: string;
  tags: string[];
  meta: Record<string, string>;
}

export function formatForFacebook(article: Article, baseUrl: string): SocialPostPayload {
  const articleUrl = `${baseUrl}/article/${article.slug}`;
  const hashtagList = [
    "#GroundZeroNews",
    "#SouthHaryana",
    `#${article.category.replace(/\s+/g, "")}`,
    "#HaryanaNews",
    "#HindiNews",
  ].join(" ");

  const text = `🔴 ${article.title}

${article.excerpt}

📌 ग्राउंड ज़ीरो न्यूज़ (Ground Zero News) की विशेष रिपोर्ट।

👉 पूरा समाचार विस्तार से पढ़ने के लिए नीचे दिए गए लिंक पर क्लिक करें:
🔗 ${articleUrl}

${hashtagList}`;

  return {
    platform: "facebook",
    text,
    shareUrl: articleUrl,
    imageUrl: article.imageUrl,
    tags: article.tags || [],
    meta: {
      actionUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    },
  };
}

export function formatForInstagram(article: Article, baseUrl: string): SocialPostPayload {
  const articleUrl = `${baseUrl}/article/${article.slug}`;
  const hashtagCloud = [
    "#GroundZeroNews",
    "#SouthHaryana",
    "#Ahirwal",
    "#Rewari",
    "#Narnaul",
    "#Mahendergarh",
    "#Gurugram",
    "#Faridabad",
    "#Mewat",
    "#Palwal",
    "#HindiNews",
    "#BreakingNews",
    "#BattleForTruth",
    `#${article.category.replace(/\s+/g, "")}`,
  ].join(" ");

  const text = `📢 ब्रेकिंग न्यूज़ | GROUND ZERO NEWS

📍 ${article.title}

━━━━━━━━━━━━━━━━━━━━
▪️ ${article.excerpt}
━━━━━━━━━━━━━━━━━━━━

✍️ रिपोर्ट: ${article.author}
📅 तारीख: ${new Date(article.createdAt || Date.now()).toLocaleDateString("hi-IN", { dateStyle: "long" })}

🔗 पूरी खबर पढ़ने के लिए हमारे बायो (Bio) में दिए गए लिंक पर जाएं या विजिट करें:
🌐 ${baseUrl}

.
.
${hashtagCloud}`;

  return {
    platform: "instagram",
    text,
    shareUrl: articleUrl,
    imageUrl: article.imageUrl,
    tags: article.tags || [],
    meta: {
      actionUrl: "https://business.facebook.com/creatorstudio",
    },
  };
}

export function formatForYouTube(article: Article, baseUrl: string): SocialPostPayload {
  const articleUrl = `${baseUrl}/article/${article.slug}`;
  const hashtags = "#GroundZeroNews #HaryanaNews #Shorts #NewsUpdate #SouthHaryana";

  const text = `🔴 ${article.title}

ग्राउंड ज़ीरो न्यूज़ (South Haryana's Leading Digital News Network)

मुख्य बिंदु:
• ${article.excerpt}

📌 पूरी खबर पढ़ें: ${articleUrl}
🔔 निष्पक्ष और ताज़ा समाचारों के लिए हमारे चैनल को सब्सक्राइब करें: @ground_zero_news
💬 अपनी राय कमेंट बॉक्स में जरूर बताएं।

${hashtags}`;

  return {
    platform: "youtube",
    text,
    shareUrl: articleUrl,
    imageUrl: article.imageUrl,
    tags: article.tags || [],
    meta: {
      actionUrl: "https://studio.youtube.com",
    },
  };
}

export function formatForTwitter(article: Article, baseUrl: string): SocialPostPayload {
  const articleUrl = `${baseUrl}/article/${article.slug}`;
  const hashtags = "#GroundZeroNews #HaryanaNews #SouthHaryana";

  // Limit main headline to fit within 280 chars comfortably with URL
  let headline = article.title;
  if (headline.length > 180) {
    headline = headline.substring(0, 177) + "...";
  }

  const text = `🔴 ${headline}

पढ़ें ग्राउंड ज़ीरो न्यूज़ की विशेष रिपोर्ट 👇
🔗 ${articleUrl}

${hashtags}`;

  return {
    platform: "twitter",
    text,
    shareUrl: articleUrl,
    imageUrl: article.imageUrl,
    tags: article.tags || [],
    meta: {
      actionUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    },
  };
}

export function formatForWhatsApp(article: Article, baseUrl: string): SocialPostPayload {
  const articleUrl = `${baseUrl}/article/${article.slug}`;

  const text = `🔴 *${article.title}*

${article.excerpt}

📰 *ग्राउंड ज़ीरो न्यूज़ (Ground Zero News)*
साउथ हरियाणा का अग्रणी डिजिटल न्यूज़ नेटवर्क

👉 *पूरी खबर विस्तार से पढ़ें:*
${articleUrl}

_इस संदेश को अपने अन्य ग्रुप्स और मित्रों के साथ अवश्य साझा करें_`;

  return {
    platform: "whatsapp",
    text,
    shareUrl: articleUrl,
    imageUrl: article.imageUrl,
    tags: article.tags || [],
    meta: {
      actionUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
    },
  };
}

export function formatAllSocialPosts(article: Article, baseUrl: string) {
  return {
    facebook: formatForFacebook(article, baseUrl),
    instagram: formatForInstagram(article, baseUrl),
    youtube: formatForYouTube(article, baseUrl),
    twitter: formatForTwitter(article, baseUrl),
    whatsapp: formatForWhatsApp(article, baseUrl),
  };
}
