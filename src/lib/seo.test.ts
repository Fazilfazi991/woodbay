import { describe, expect, it } from "vitest";
import { absoluteUrl, divisionSeo, jsonLd, pageMetadata, productSeoText } from "./seo";

describe("SEO foundations", () => {
  it("uses the production origin for canonical resources", () => {
    expect(absoluteUrl("/products")).toBe("https://woodbay.vercel.app/products");
  });

  it("builds indexable metadata with canonical and social fields", () => {
    const metadata = pageMetadata({ title: "Test", description: "Description", path: "/test" });
    expect(metadata.alternates).toEqual({ canonical: "/test" });
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({ title: "Test", url: "/test" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("defines unique Kollam intent for every public product division", () => {
    expect(Object.keys(divisionSeo)).toHaveLength(4);
    expect(new Set(Object.values(divisionSeo).map((entry) => entry.title)).size).toBe(4);
    Object.values(divisionSeo).forEach((entry) => expect(`${entry.title} ${entry.description}`).toContain("Kollam"));
  });

  it("escapes markup-significant content in JSON-LD", () => {
    expect(jsonLd({ name: "<script>" })).not.toContain("<script>");
  });

  it("creates bounded, local product metadata without a duplicate brand suffix", () => {
    const seo = productSeoText({ name: "Aluminium Profile", short_description: "A furniture profile.", seo_title: "Aluminium Profile | WoodBay", category: { name: "Aluminium Profiles" } });
    expect(seo.title).toBe("Aluminium Profile");
    expect(seo.description).toContain("Kollam");
    expect(seo.description.length).toBeLessThanOrEqual(161);
  });
});
