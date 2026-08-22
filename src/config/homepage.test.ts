import { describe, expect, it } from "vitest";
import { homepage } from "./homepage";

describe("homepage configuration", () => {
  it("uses internal destinations for homepage categories", () =>
    expect(
      homepage.categories.every((category) => category.href.startsWith("/products")),
    ).toBe(true));

  it("sends each featured range card to its own product page", () => {
    const destinations = homepage.featured.map((item) => item.href);

    expect(destinations.every((href) => href.includes("/product/"))).toBe(true);
    expect(new Set(destinations)).toHaveLength(homepage.featured.length);
  });

  it("does not publish unverified numeric capability claims", () =>
    expect(homepage.capabilityLabels.every((label) => !/\d/.test(label))).toBe(
      true,
    ));
});
