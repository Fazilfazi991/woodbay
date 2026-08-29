import { describe, expect, it } from "vitest";
import {
  PAGE_SIZE,
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
