import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { productDivisions } from "@/features/products/data/taxonomy";
import { getSitemapCatalogueEntries } from "@/features/products/data/catalogue";

const staticPaths = ["", "/about", "/products", "/furniture", "/projects", "/dealers", "/dealers/become-a-dealer", "/contact", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    ...staticPaths.map((path, index) => ({ url: `${siteConfig.url}${path}`, lastModified: now, changeFrequency: index < 3 ? "weekly" as const : "monthly" as const, priority: index === 0 ? 1 : index < 3 ? .9 : .6 })),
    ...productDivisions.map((division) => ({ url: `${siteConfig.url}/products/${division.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: .8 })),
  ];
  try {
    return [...base, ...(await getSitemapCatalogueEntries()).map((entry) => ({ ...entry, url: `${siteConfig.url}${entry.url}` }))];
  } catch {
    return base;
  }
}
