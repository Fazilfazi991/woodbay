import type { CatalogueImage } from "../types";

const localProductImages: Record<string, string> = {
  "glass-pantry": "/images/products/glass-pantry-with-bidding.webp",
  "glass-pantry-with-bidding": "/images/products/glass-pantry-with-bidding.webp",
  "tandem-box-system": "/images/products/slim-box-dark-grey.webp",
  "wardrobe-lift": "/images/products/wardrobe-lifter.webp",
  wallpaper: "/images/products/wallpaper.webp",
  "soft-close-hinge": "/images/products/five-hole-ss-3d-hydraulic-hinge-premium.webp",
  "bottle-pullout": "/images/products/glass-bpo-with-bidding.webp",
  "corner-basket": "/images/products/s-corner-white.webp",
  "wardrobe-trouser-rack": "/images/products/trouser-rack.webp",
  "wardrobe-shoe-rack": "/images/products/shoe-rack.webp",
  "magic-corner": "/images/products/universal-magic-corner-glass.webp",
  "waterfall-sink": "/images/products/waterfall-sink.webp",
  "charcoal-louvers": "/images/products/charcoal-louvers.webp",
  "glass-mosaic-tiles": "/images/products/glass-mosaic-tiles.webp",
  "smart-furniture": "/images/products/smart-wifi-side-table.webp",
};

export function localProductImage(
  slug: string,
  productName: string,
): CatalogueImage | null {
  const storageKey = localProductImages[slug];
  if (!storageKey) return null;
  return {
    storage_key: storageKey,
    alt_text: `${productName} by Woodbay`,
    sort_order: 0,
    is_primary: true,
    image_role: "primary",
  };
}
