import { describe, expect, it } from "vitest";
import { getProductContent } from "./content";
import type { ProductDetail } from "../types";

function product(overrides: Partial<ProductDetail>): ProductDetail {
  return {
    name: "Product",
    slug: "product",
    category: null,
    parentCategory: null,
    description: null,
    short_description: null,
    features: [],
    variants: [],
    images: [],
    ...overrides,
  } as ProductDetail;
}

describe("getProductContent", () => {
  it.each([
    ["glass-pantry", "Pantry systems"],
    ["soft-close-hinge", "Cabinet hinges"],
    ["wardrobe-lift", "Wardrobe accessories"],
    ["waterfall-sink", "Kitchen sinks"],
    ["smart-wifi-side-table", "Smart furniture"],
    ["wallpaper", "Interior finishes"],
    ["gola-profile", "Aluminium profiles"],
  ])("maps %s to %s", (slug, family) => {
    expect(getProductContent(product({ slug, name: slug })).family).toBe(
      family,
    );
  });

  it("preserves substantial product copy and real features", () => {
    const description = "Existing catalogue copy ".repeat(8).trim();
    const content = getProductContent(
      product({ description, features: ["Recorded feature"] }),
    );
    expect(content.overview).toBe(description);
    expect(content.features).toEqual(["Recorded feature"]);
  });

  it("keeps short product-specific copy before the family fallback", () => {
    const content = getProductContent(
      product({
        slug: "soft-close-hinge",
        description: "Official hinge copy.",
      }),
    );
    expect(content.overview.startsWith("Official hinge copy.")).toBe(true);
    expect(content.overview.length).toBeGreaterThan(120);
  });
});
