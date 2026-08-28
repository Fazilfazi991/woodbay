import { describe, expect, it } from "vitest";
import {
  divisionSlugForCategory,
  divisionSubcategorySlugs,
  productDivisions,
} from "./taxonomy";

describe("canonical product taxonomy", () => {
  it("exposes exactly the four approved public divisions", () => {
    expect(productDivisions.map(({ name, slug }) => ({ name, slug }))).toEqual([
      {
        name: "Kitchen & Wardrobe Accessories",
        slug: "kitchen-wardrobe-accessories",
      },
      {
        name: "Hardware Fittings & Aluminium Profiles",
        slug: "hardware-fittings",
      },
      { name: "Smart Furniture", slug: "smart-furniture" },
      { name: "Home Decor", slug: "home-decor" },
    ]);
  });

  it("keeps waterfall sinks with smart kitchen and wallpaper with home decor", () => {
    expect(divisionSlugForCategory("smart-kitchen-waterfall-sinks")).toBe(
      "kitchen-wardrobe-accessories",
    );
    expect(divisionSlugForCategory("wallpaper")).toBe("home-decor");
  });

  it("supports the approved kitchen, wardrobe and hardware groups", () => {
    expect(divisionSubcategorySlugs["kitchen-wardrobe-accessories"]).toContain(
      "wardrobe-series",
    );
    expect(divisionSubcategorySlugs["hardware-fittings"]).toEqual(
      expect.arrayContaining([
        "aluminium-profiles",
        "gola-profiles",
        "glass-frame-profiles",
      ]),
    );
  });
});
