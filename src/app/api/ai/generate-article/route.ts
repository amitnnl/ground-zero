import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  topic?: string;
  sourceText?: string;
  city?: string;
  categorySlug?: string;
  mode?: "topic" | "source_text" | "notes" | "url" | "audio";
}

const THEME_IMAGES: Record<string, { url: string; caption: string }> = {
  infrastructure: {
    url: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    caption: "निर्माण स्थल पर विकास कार्यों का निरीक्षण करते अधिकारी व तकनीकी टीम",
  },
  politics: {
    url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80",
    caption: "जनसंवाद कार्यक्रम के दौरान उपस्थित नागरिक एवं जनसमूह",
  },
  agriculture: {
    url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80",
    caption: "खेतों में फसलों की स्थिति और मंडी व्यवस्था का जायजा लेते किसान व अधिकारी",
  },
  festival: {
    url: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80",
    caption: "मेला व उत्सव के दौरान श्रद्धालुओं की भारी भीड़ व सुरक्षा प्रबंध",
  },
  health: {
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    caption: "अस्पताल व स्वास्थ्य केंद्र में व्यवस्थाओं का जायजा लेते वरिष्ठ चिकित्सक",
  },
  sports: {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    caption: "खेल प्रतियोगिता में शानदार प्रदर्शन के बाद पदक हासिल करते खिलाड़ी",
  },
  general: {
    url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
    caption: "जिला मुख्यालय में आयोजित प्रशासनिक बैठक का दृश्य",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const inputContent = body.sourceText || body.topic || "";
    const city = body.city || "महेंद्रगढ़";

    if (!inputContent.trim()) {
      return NextResponse.json(
        { success: false, error: "कृपया समाचार का विषय या स्रोत सामग्री दर्ज करें।" },
        { status: 400 }
      );
    }

    const cleanInput = inputContent.trim();
    const lowerInput = cleanInput.toLowerCase();

    // Determine district / location tags
    let districtName = "Mahendergarh";
    let districtHi = "महेंद्रगढ़";
    let matchedCategory = "साउथ हरियाणा";
    let matchedCatSlug = "south-haryana";
    let themeKey = "general";

    if (lowerInput.includes("नारनौल") || lowerInput.includes("narnaul")) {
      districtName = "Mahendergarh";
      districtHi = "नारनौल/महेंद्रगढ़";
      matchedCategory = "महेंद्रगढ़";
      matchedCatSlug = "mahendergarh";
    } else if (lowerInput.includes("रेवाड़ी") || lowerInput.includes("rewari")) {
      districtName = "Rewari";
      districtHi = "रेवाड़ी";
      matchedCategory = "साउथ हरियाणा";
      matchedCatSlug = "south-haryana";
    } else if (lowerInput.includes("गुरुग्राम") || lowerInput.includes("gurugram") || lowerInput.includes("मानेसर") || lowerInput.includes("manesar")) {
      districtName = "Gurugram";
      districtHi = "गुरुग्राम";
      matchedCategory = "गुरुग्राम / मानेसर";
      matchedCatSlug = "gurugram";
    } else if (lowerInput.includes("फरीदाबाद") || lowerInput.includes("faridabad") || lowerInput.includes("बल्लभगढ़")) {
      districtName = "Faridabad";
      districtHi = "फरीदाबाद";
      matchedCategory = "फरीदाबाद / बल्लभगढ़";
      matchedCatSlug = "faridabad";
    } else if (lowerInput.includes("नूह") || lowerInput.includes("nuh") || lowerInput.includes("मेवात") || lowerInput.includes("तावडू")) {
      districtName = "Nuh";
      districtHi = "नूह (मेवात)";
      matchedCategory = "नूह (मेवात)";
      matchedCatSlug = "nuh";
    } else if (lowerInput.includes("पलवल") || lowerInput.includes("palwal") || lowerInput.includes("होडल")) {
      districtName = "Palwal";
      districtHi = "पलवल";
      matchedCategory = "पलवल / होडल";
      matchedCatSlug = "palwal";
    } else if (lowerInput.includes("झज्जर") || lowerInput.includes("jhajjar") || lowerInput.includes("बहादुरगढ़")) {
      districtName = "Jhajjar";
      districtHi = "झज्जर";
      matchedCategory = "झज्जर / बहादुरगढ़";
      matchedCatSlug = "jhajjar";
    } else if (lowerInput.includes("दादरी") || lowerInput.includes("dadri")) {
      districtName = "Charkhi Dadri";
      districtHi = "चरखी दादरी";
      matchedCategory = "चरखी दादरी / बाढड़ा";
      matchedCatSlug = "charkhi-dadri";
    }

    // Determine theme
    if (lowerInput.includes("सड़क") || lowerInput.includes("पुल") || lowerInput.includes("सीवरेज") || lowerInput.includes("विकास") || lowerInput.includes("बाईपास")) {
      themeKey = "infrastructure";
      matchedCategory = "साउथ हरियाणा";
      matchedCatSlug = "south-haryana";
    } else if (lowerInput.includes("किसान") || lowerInput.includes("फसल") || lowerInput.includes("बाजरा") || lowerInput.includes("मंडी") || lowerInput.includes("कृषि")) {
      themeKey = "agriculture";
      matchedCategory = "कृषि / किसान";
      matchedCatSlug = "agriculture";
    } else if (lowerInput.includes("अस्पताल") || lowerInput.includes("स्वास्थ्य") || lowerInput.includes("डॉक्टर") || lowerInput.includes("शिक्षा") || lowerInput.includes("स्कूल")) {
      themeKey = "health";
      matchedCategory = "शिक्षा एवं स्वास्थ्य";
      matchedCatSlug = "education";
    } else if (lowerInput.includes("खेल") || lowerInput.includes("कुश्ती") || lowerInput.includes("मेडल")) {
      themeKey = "sports";
      matchedCategory = "खेल";
      matchedCatSlug = "sports";
    } else {
      themeKey = "politics";
    }

    // Headline Engine (7 Variants)
    const hook = cleanInput.length > 50 ? cleanInput.substring(0, 50) + "..." : cleanInput;
    const headlineVariants = {
      standard: `${districtName} News | ${hook} : प्रशासनिक स्तर पर बड़ा फैसला`,
      breaking: `BREAKING: ${districtHi} में ${hook} | तुरंत पढ़ें पूरी रिपोर्ट`,
      seo: `${districtName} Latest News Today - ${cleanInput.substring(0, 45)} Updates`,
      mobile: `${districtHi}: ${hook}`,
      social: `🚨 ${districtHi} से बड़ी खबर: ${hook}! जानिए क्या है पूरा मामला और क्या बोले अधिकारी 👉`,
      youtube: `${districtName} Breaking | ${hook} | ग्राउंड ज़ीरो न्यूज़ पड़ताल`,
      push: `🔴 अलर्ट: ${districtHi} में ${hook}`,
    };

    const title = headlineVariants.standard;
    const subtitle = `प्रशासन व संबंधित विभाग ने लिया त्वरित संज्ञान, स्थानीय नागरिकों को मिलेगा सीधा लाभ`;

    const excerpt = `${districtHi} में ${cleanInput} को लेकर प्रशासनिक हलचल तेज हो गई है। संबंधित विभाग द्वारा समीक्षा बैठक कर आवश्यक दिशा-निर्देश जारी किए गए हैं।`;

    const content = `${districtHi} (ग्राउंड ज़ीरो ब्यूरो): क्षेत्र में ${cleanInput} के संदर्भ में आज एक उच्चस्तरीय प्रशासनिक समीक्षा की गई। बैठक में जनसुविधाओं, बुनियादी ढांचे और त्वरित समाधान पर विशेष बल दिया गया।

वरिष्ठ प्रशासनिक अधिकारियों ने स्पष्ट किया कि विकास कार्यों एवं सार्वजनिक सेवाओं में किसी भी प्रकार की लापरवाही बर्दाश्त नहीं की जाएगी। संबंधित एजेंसियों को तय समय-सीमा के भीतर कार्य पूरा करने और गुणवत्ता मानकों का कड़ाई से पालन करने का निर्देश दिया गया है।

स्थानीय नागरिकों व सामाजिक प्रतिनिधियों ने इस फैसले पर संतोष व्यक्त करते हुए कहा कि इससे क्षेत्र की पुरानी समस्या का समाधान होगा। ग्राउंड ज़ीरो न्यूज़ की टीम लगातार इस मामले पर नज़र बनाए हुए है।`;

    const keyPoints = [
      `${districtHi} में ${hook} को लेकर आदेश जारी।`,
      "गुणवत्ता व समय-सीमा की निगरानी हेतु विशेष दल गठित।",
      "नागरिकों को अनावश्यक परेशानी से बचाने के लिए पुख्ता प्रबंध।",
      "ग्राउंड ज़ीरो न्यूज़ पर एक्सक्लूसिव कवरेज।",
    ];

    const seoMetadata = {
      title: headlineVariants.seo,
      description: excerpt,
      keywords: [districtName, districtHi, "Haryana News", "Ground Zero News", "Breaking News Hindi"],
      canonicalSlug: title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").substring(0, 50),
    };

    // Multi-platform tailored social content
    const socialVariants = {
      facebook: `📢 ${districtHi} न्यूज़ अपडेट:\n\n${headlineVariants.standard}\n\n${excerpt}\n\nपूरी खबर पढ़ें: https://groundzero.media/article/${seoMetadata.canonicalSlug}\n\n#${districtName} #${districtHi} #HaryanaNews #GroundZero`,
      instagram: `${headlineVariants.mobile}\n\n👉 ${excerpt}\n\nलिंक बायो में उपलब्ध है।\n.\n.\n#${districtName} #Haryana #NewsAlert #GroundZeroNews`,
      twitter: `🚨 ${headlineVariants.breaking}\n\nविस्तृत रिपोर्ट: groundzero.media/article/${seoMetadata.canonicalSlug} #${districtName}News #Haryana`,
      whatsapp: `📢 *ग्राउंड ज़ीरो न्यूज़ अलर्ट*\n\n*${headlineVariants.mobile}*\n\n${excerpt}\n\nविस्तार से पढ़ें 👇\nhttps://groundzero.media/article/${seoMetadata.canonicalSlug}`,
      telegram: `🔴 **${headlineVariants.standard}**\n\n${excerpt}\n\nस्रोत: ग्राउंड ज़ीरो न्यूज़ रूम\nलिंक: https://groundzero.media/article/${seoMetadata.canonicalSlug}`,
      linkedin: `Haryana Regional Development Update: ${cleanInput}. Read comprehensive ground report on Ground Zero News Network.`,
      youtube: {
        title: headlineVariants.youtube,
        description: `${headlineVariants.standard}\n\n${content}\n\nSubscribe to Ground Zero News for 24x7 South Haryana coverage.`,
        tags: [districtName, "Haryana News", "Breaking News", "Ground Zero"],
      },
    };

    // Video & Reel Scripts
    const scripts = {
      videoScript60s: `[00:00 - 00:10] (एंकर विजुअल - स्टूडियो): नमस्कार, ग्राउंड ज़ीरो न्यूज़ में आपका स्वागत है। बड़ी खबर ${districtHi} से आ रही है जहां ${hook}।\n\n[00:10 - 00:35] (ग्राउंड विजुअल्स): आज प्रशासनिक अधिकारियों की मौजूदगी में महत्वपूर्ण फैसला लिया गया। अधिकारियों ने स्पष्ट किया कि समय-सीमा में कार्य पूरा कराया जाएगा।\n\n[00:35 - 00:50] (बाइट / आधिकारिक प्रतिक्रिया): स्थानीय नागरिकों का कहना है कि यह लंबे समय से प्रतीक्षित कदम था।\n\n[00:50 - 01:00] (आउट्रो): पल-पल की ताज़ा खबरों के लिए ग्राउंड ज़ीरो न्यूज़ को सब्सक्राइब करें।`,
      reelScript30s: `(हुक - 0 से 5 सेकंड): क्या आप जानते हैं ${districtHi} में क्या बड़ा बदलाव हुआ है?\n(बॉडी - 5 से 20 सेकंड): ${cleanInput} पर प्रशासन ने लगा दी है मुहर। अब काम होगा तेज़।\n(सीटीए - 20 से 30 सेकंड): ऐसी ही ताज़ा खबरों के लिए फॉलो करें ग्राउंड ज़ीरो न्यूज़!`,
      thumbnailCopy: `${districtHi} में बड़ा एक्शन!`,
    };

    // Fact-check & Claim Verification Assistant
    const factCheckAssistant = {
      extractedClaims: [
        `स्थान: ${districtHi} में घटना/विषय की पुष्टि।`,
        "आधिकारिक बैठक व आदेश का संदर्भ।",
        "समय-सीमा एवं नागरिक सुविधा का दावा।",
      ],
      requiresVerification: [
        "संबंधित अधिकारी का नाम एवं आधिकारिक अधिसूचना संख्या की पुष्टि करें।",
        "स्थानीय प्रत्यक्षदर्शियों या प्रतिनिधियों का प्रत्यक्ष बयान शामिल करें।",
      ],
      confidenceScore: 88,
      sourceType: body.mode || "topic",
      verificationBadge: "AI Generated Draft — Human Verification Required",
    };

    // Translations
    const translations = {
      englishHeadline: `${districtName} News: Administrative Action and Policy Decisions on ${cleanInput.substring(0, 40)}`,
      englishSummary: `Official review conducted in ${districtName}, Haryana regarding ${cleanInput.substring(0, 60)}. Key directives issued for public welfare.`,
    };

    const selectedImage = THEME_IMAGES[themeKey] || THEME_IMAGES.general;

    return NextResponse.json({
      success: true,
      data: {
        title,
        subtitle,
        category: matchedCategory,
        categorySlug: matchedCatSlug,
        district: districtName,
        state: "Haryana",
        excerpt,
        content,
        author: `AI News Desk (AI Newsroom Draft)`,
        imageUrl: selectedImage.url,
        imageCaption: selectedImage.caption,
        tags: [districtName, districtHi, "हरियाणा समाचार", "ग्राउंड ज़ीरो"],
        isBreaking: false,
        isLeadStory: false,
        aiGenerated: true,
        aiDraftPrompt: cleanInput,
        needsVerification: true,
        keyPoints,
        headlineVariants,
        seoMetadata,
        socialVariants,
        scripts,
        factCheckAssistant,
        translations,
      },
    });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      { success: false, error: "AI ड्राफ्ट तैयार करने में तकनीकी समस्या आई।" },
      { status: 500 }
    );
  }
}
