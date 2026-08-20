import { describe, expect, it } from "vitest";
import { isSupportedProductImage, productSlug, productStatusLabel } from "./admin-utils";

describe("catalogue administration helpers", () => {
  it("creates a stable safe slug and keeps public statuses clear", () => {
    expect(productSlug("  Waterfall Sink — 750 mm  ")).toBe("waterfall-sink-750-mm");
    expect(productStatusLabel("draft")).toBe("Hidden / Draft");
    expect(productStatusLabel("published")).toBe("Published");
  });

  it("accepts only supported, bounded product images", () => {
    expect(isSupportedProductImage("image/webp", 1024)).toBe(true);
    expect(isSupportedProductImage("application/pdf", 1024)).toBe(false);
    expect(isSupportedProductImage("image/jpeg", 11 * 1024 * 1024)).toBe(false);
  });
});
