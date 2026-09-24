import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GROUND ZERO NEWS (ग्राउंड ज़ीरो न्यूज़)",
    short_name: "Ground Zero",
    description: "दक्षिण हरियाणा का अग्रणी डिजिटल मीडिया नेटवर्क - निष्पक्ष, निर्भीक, सटीक",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#E11D48",
    lang: "hi",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
