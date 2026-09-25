import { MetadataRoute } from "next";
import { getArticles, getCategories, getLocations, getSiteSettings } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  if (settings.sitemap_enabled === false) {
    return [];
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://groundzeronews.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/live-tv`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/e-paper`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/send-news`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Articles routes
  const articles = await getArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/article/${art.slug || art.id}`,
    lastModified: new Date(art.createdAt),
    changeFrequency: "hourly",
    priority: art.isBreaking ? 0.95 : 0.85,
  }));

  // Category routes
  const categories = await getCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  // Location routes (Districts & Tehsils)
  const locations = await getLocations();
  const locationRoutes: MetadataRoute.Sitemap = locations
    .filter((loc) => loc.type === "district" || loc.type === "city" || loc.type === "tehsil")
    .map((loc) => ({
      url: `${baseUrl}/location/${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.75,
    }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes, ...locationRoutes];
}
