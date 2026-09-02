import { describe, expect, it } from "vitest";
import { buildWhatsAppEnquiryUrl } from "./enquiry";

describe("buildWhatsAppEnquiryUrl", () => {
  it("uses the configured WhatsApp URL and includes product and category context", () => {
    const url = buildWhatsAppEnquiryUrl("https://wa.me/971500000000", {
      name: "Glass Pantry & Organiser",
      slug: "glass-pantry-organiser",
      category: { name: "Kitchen & Wardrobe" },
    });
    const parsed = new URL(url);

    expect(`${parsed.origin}${parsed.pathname}`).toBe(
      "https://wa.me/971500000000",
    );
    expect(parsed.searchParams.get("text")).toBe(
      "Hi WoodBay, I’m interested in Glass Pantry & Organiser from Kitchen & Wardrobe. Please share more details.",
    );
    expect(url).toContain("%26");
  });

  it("preserves existing query parameters and includes selected details", () => {
    const url = buildWhatsAppEnquiryUrl(
      "https://example.test/send?phone=971500000000",
      { name: "Glass Pantry", slug: "glass-pantry" },
      { variant: "450 mm", finish: "Champagne Gold" },
    );
    const parsed = new URL(url);

    expect(parsed.searchParams.get("phone")).toBe("971500000000");
    expect(parsed.searchParams.get("text")).toBe(
      "Hi WoodBay, I’m interested in Glass Pantry — 450 mm — Champagne Gold. Please share more details.",
    );
  });

  it("includes a product link when supplied", () => {
    const url = buildWhatsAppEnquiryUrl(
      "https://wa.me/971500000000",
      { name: "Glass Pantry", slug: "glass-pantry" },
      { link: "https://woodbay.example/products/glass-pantry" },
    );
    expect(new URL(url).searchParams.get("text")).toContain(
      "Product: https://woodbay.example/products/glass-pantry",
    );
  });
});
