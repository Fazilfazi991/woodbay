export type ProductDivision = {
  slug: string;
  name: string;
  description: string;
  image: string;
  sourceCategorySlugs: readonly string[];
};

export const productDivisions: readonly ProductDivision[] = [
  {
    slug: "kitchen-wardrobe-accessories",
    name: "Kitchen & Wardrobe Accessories",
    description:
      "Pantry, pullout, corner, sink and wardrobe systems from the Woodbay catalogue.",
    image: "/images/products/glass-pantry-with-bidding.webp",
    sourceCategorySlugs: [
      "kitchen-wardrobe-accessories",
      "kitchen-accessories",
      "wardrobe-accessories",
    ],
  },
  {
    slug: "hardware-fittings",
    name: "Hardware Fittings & Aluminium Profiles",
    description:
      "Hinges, lift-up systems, furniture hardware, handles and aluminium profiles.",
    image: "/images/products/five-hole-ss-3d-hydraulic-hinge-premium.webp",
    sourceCategorySlugs: ["hardware-fittings"],
  },
  {
    slug: "smart-furniture",
    name: "Smart Furniture",
    description:
      "Connected side tables, adaptable desks and lift-up furniture from the Woodbay catalogue.",
    image: "/images/products/smart-wifi-side-table.webp",
    sourceCategorySlugs: ["smart-furniture", "smart-products"],
  },
  {
    slug: "home-decor",
    name: "Home Decor",
    description:
      "Wallpaper, architectural surfaces, wall treatments, lighting and decor products.",
    image: "/images/products/wallpaper.webp",
    sourceCategorySlugs: ["home-decor", "decor", "decor-products"],
  },
] as const;

export const divisionSubcategorySlugs = {
  "kitchen-wardrobe-accessories": [
    "pantry-solutions",
    "pullout-solutions",
    "corner-solutions",
    "tandem-attachments",
    "wicker-baskets",
    "rolling-shutters",
    "pulldown-solutions",
    "dish-racks",
    "wardrobe-series",
    "wardrobe-lifters",
    "trouser-racks",
    "shoe-racks",
    "smart-kitchen-waterfall-sinks",
  ],
  "hardware-fittings": [
    "lift-up-solutions",
    "general-hardware-fittings",
    "cabinet-hinges",
    "tandem-box",
    "bins-waste-management",
    "furniture-legs",
    "rolling-wheels",
    "shelf-brackets",
    "cabinet-hanging-hardware",
    "aluminium-frame-accessories",
    "aluminium-profiles",
    "gola-profiles",
    "handles",
    "glass-frame-profiles",
  ],
  "smart-furniture": [],
  "home-decor": [
    "decor",
    "wallpaper",
    "pu-stone-panels",
    "glass-mosaic-tiles",
    "3d-pvc-panels",
    "pu-feather-panels",
    "charcoal-louvers",
    "metallic-sheets-louvers",
    "metallic-sheets",
    "uv-marble-sheets",
    "crystal-acrylic-paintings",
    "pocket-spring-mattresses",
    "blinds",
    "artificial-vertical-gardens",
    "water-fountains",
    "ceiling-lights",
    "decorative-lighting",
  ],
} as const;

export function getProductDivision(slug: string) {
  return productDivisions.find((division) => division.slug === slug) ?? null;
}

export function divisionSlugForCategory(categorySlug?: string | null) {
  if (!categorySlug) return "kitchen-wardrobe-accessories";
  for (const [divisionSlug, slugs] of Object.entries(
    divisionSubcategorySlugs,
  )) {
    if ((slugs as readonly string[]).includes(categorySlug))
      return divisionSlug;
  }
  const division = productDivisions.find((item) =>
    item.sourceCategorySlugs.includes(categorySlug),
  );
  return division?.slug ?? "kitchen-wardrobe-accessories";
}
