import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("catalogue product-card commerce policy", () => {
  const source = readFileSync(new URL("./catalogue-ui.tsx", import.meta.url), "utf8");

  it("keeps listing cards detail-only", () => {
    expect(source).toContain("View details");
    expect(source).not.toContain("AddToCartButton");
    expect(source).not.toContain("Choose options");
  });
});
