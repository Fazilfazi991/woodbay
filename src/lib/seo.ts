import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const SEO_LOCATION = "Kollam, Kerala";
export const DEFAULT_SOCIAL_IMAGE = "/images/preview/woodbay-kitchen-preview.png";

export const divisionSeo: Record<string, { title: string; description: string; intro: string }> = {
  "kitchen-wardrobe-accessories": {
    title: "Kitchen & Wardrobe Accessories in Kollam",
    description: "Explore Woodbay pantry, pull-out, corner, sink and wardrobe accessories for cabinetry projects in Kollam, Kerala.",
    intro: "Explore cabinet-integrated pantry, pull-out, corner and wardrobe solutions for homes and interior projects in Kollam. Product suitability depends on cabinet dimensions and the selected model, so Woodbay can help you identify the right option before installation.",
  },
  "hardware-fittings": {
    title: "Hardware Fittings & Aluminium Profiles in Kollam",
    description: "Explore Woodbay cabinet hinges, lift-up systems, furniture hardware, handles and aluminium profiles in Kollam, Kerala.",
    intro: "Browse hardware fittings and aluminium profiles for kitchens, wardrobes and furniture projects in Kollam. Compare the recorded model, dimensions and finish, then enquire with Woodbay for compatibility and availability.",
  },
  "smart-furniture": {
    title: "Smart Furniture in Kollam",
    description: "Explore Woodbay smart tables, adaptable desks and technology-integrated furniture in Kollam, Kerala.",
    intro: "Discover smart furniture designed to add practical technology without unnecessary visual clutter. Woodbay serves product enquiries from Kollam and can confirm the functions and options recorded for each model.",
  },
  "home-decor": {
    title: "Home Decor Products in Kollam",
    description: "Explore Woodbay wallpaper, PU panels, wall finishes, mattresses, artificial grass and decor products in Kollam, Kerala.",
    intro: "Explore wallpaper, decorative panels, architectural finishes, mattresses, vertical gardens, artificial grass and lighting for interiors in Kollam. Review each product page for available information and enquire for current availability.",
  },
};

export function pageMetadata({ title, description, path, image = DEFAULT_SOCIAL_IMAGE, noIndex = false }: {
  title: string; description: string; path: string; image?: string; noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { type: "website", siteName: siteConfig.name, locale: "en_IN", title, description, url: path, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function productSeoText(product: { name: string; short_description: string | null; seo_title?: string | null; seo_description?: string | null; category?: { name: string } | null }) {
  const category = product.category?.name ?? "Interior Product";
  const suppliedTitle = product.seo_title?.replace(/\s*\|\s*woodbay.*$/i, "").trim();
  const title = suppliedTitle || `${product.name} – ${category} in Kollam`;
  const source = product.seo_description ?? product.short_description ?? `Explore ${product.name} from Woodbay.`;
  const shortened = source.length > 96 ? `${source.slice(0, 96).replace(/\s+\S*$/, "").replace(/[,:;\s]+$/, "")}…` : source.replace(/[.\s]+$/, "");
  const local = /kollam/i.test(source) ? source : `${shortened}. Enquire with Woodbay in Kollam for product details and availability.`;
  return { title: title.slice(0, 65), description: local.slice(0, 160).replace(/\s+\S*$/, "").replace(/[,:;\s]+$/, "") + (local.length > 160 ? "…" : "") };
}
