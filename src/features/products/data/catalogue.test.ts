import { describe, expect, it } from "vitest";
import {
  PAGE_SIZE,
  matchesCatalogueSearch,
  normalizeCatalogueSearch,
  parseCatalogueParams,
  primaryImage,
  productDetailPath,
  productSpecifications,
} from "./catalogue";

describe("catalogue helpers", () => {
  it("parses safe URL-driven filters", () =>
    expect(
      parseCatalogueParams({
        q: "pantry",
        page: "2",
        sort: "name-desc",
        subcategory: "pantry-solutions",
      }),
    ).toEqual({
      q: "pantry",
      page: 2,
      sort: "name-desc",
      subcategory: "pantry-solutions",
    }));

  it("falls back safely for invalid pagination", () =>
    expect(parseCatalogueParams({ page: "-3" }).page).toBe(1));

  it("clears an empty category selection instead of retaining a stale filter", () =>
    expect(parseCatalogueParams({ subcategory: "  " }).subcategory).toBeNull());

  it("prefers primary images", () =>
    expect(
      primaryImage({
        images: [
          {
            storage_key: "first",
            alt_text: null,
            sort_order: 0,
            is_primary: false,
          },
          {
            storage_key: "primary",
            alt_text: null,
            sort_order: 3,
            is_primary: true,
          },
        ],
      } as never)?.storage_key,
    ).toBe("primary"));

  it("uses a scalable page size", () => expect(PAGE_SIZE).toBe(12));

  it("normalizes spacing, case, plurals and pull-out wording", () => {
    expect(normalizeCatalogueSearch("  PULL OUT units  ")).toEqual([
      "pullout",
      "unit",
    ]);
  });

  it.each([
    "pantry",
    "Pantry unit",
    "Pantry units",
    "pantry solution",
    "pantry solutions",
  ])("matches category intent for %s", (query) => {
    expect(
      matchesCatalogueSearch(query, [
        "Glass Pantry With Bidding",
        "Pantry Solutions",
      ]),
    ).toBe(true);
  });

  it("matches useful raw names and normalized partial terms", () => {
    expect(
      matchesCatalogueSearch("pull out", [
        "Glass BPO With Bidding",
        "bottle-pullout",
        { product_name: "Glass Bottle Pullout" },
      ]),
    ).toBe(true);
    expect(matchesCatalogueSearch("alum", ["Aluminium Profiles"])).toBe(true);
    expect(matchesCatalogueSearch("nonexistent", ["Pantry Solutions"])).toBe(
      false,
    );
    expect(
      matchesCatalogueSearch("pantry", [
        "Shoe Rack is a fitted wardrobe accessory for personal storage.",
      ]),
    ).toBe(false);
  });

  it("creates the hierarchical product detail route", () =>
    expect(
      productDetailPath({
        slug: "glass-pantry",
        category: { name: "Kitchen", slug: "kitchen-accessories" },
      }),
    ).toBe(
      "/products/kitchen-wardrobe-accessories/kitchen-accessories/glass-pantry",
    ));

  it("omits blank product specifications", () =>
    expect(
      productSpecifications({
        product_code: "OEM-1",
        variants: [
          { dimension: null, finish: null, metadata: { material: "Steel" } },
        ],
      } as never),
    ).toEqual([
      { label: "Product Code", value: "OEM-1" },
      { label: "Material", value: "Steel" },
    ]));

  it("preserves metadata arrays as readable specification lists", () =>
    expect(
      productSpecifications({
        product_code: null,
        variants: [
          {
            metadata: {
              features: [
                "Wireless Charging",
                "Bluetooth Speaker (Built-in)",
                "USB Charging Port",
              ],
            },
          },
        ],
      } as never),
    ).toEqual([
      {
        label: "Features",
        value: [
          "Wireless Charging",
          "Bluetooth Speaker (Built-in)",
          "USB Charging Port",
        ],
      },
    ]));

  it("normalizes JSON and escaped-newline metadata without leaking objects", () =>
    expect(
      productSpecifications({
        product_code: null,
        variants: [
          {
            metadata: {
              benefits: '["Quiet close", "Easy fitting"]',
              applications: "Kitchen\\nWardrobe",
              internal: { source: "catalogue" },
            },
          },
        ],
      } as never),
    ).toEqual([
      { label: "Benefits", value: ["Quiet close", "Easy fitting"] },
      { label: "Applications", value: ["Kitchen", "Wardrobe"] },
    ]));
});
