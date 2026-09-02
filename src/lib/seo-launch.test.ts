import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("SEO launch configuration", () => {
  it("keeps metadata in initial HTML for deterministic crawler responses", () => {
    expect(nextConfig.htmlLimitedBots).toEqual(/.*/);
  });

  it("maps every legacy division route directly to its canonical destination", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "/products/kitchen-accessories", destination: "/products/kitchen-wardrobe-accessories", permanent: true }),
      expect.objectContaining({ source: "/products/wardrobe-accessories", destination: "/products/kitchen-wardrobe-accessories", permanent: true }),
      expect.objectContaining({ source: "/products/decor", destination: "/products/home-decor", permanent: true }),
      expect.objectContaining({ source: "/products/smart-products", destination: "/products/smart-furniture", permanent: true }),
    ]));
  });
});
