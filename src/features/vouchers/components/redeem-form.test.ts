import { describe, expect, it } from "vitest";
import { shouldPreventSearchFieldSubmit } from "./searchable-voucher-field";

describe("shouldPreventSearchFieldSubmit", () => {
  it("blocks Enter before a searchable datalist field can submit its form", () => {
    expect(shouldPreventSearchFieldSubmit("Enter")).toBe(true);
  });

  it("allows non-submit navigation and editing keys", () => {
    expect(shouldPreventSearchFieldSubmit("ArrowDown")).toBe(false);
    expect(shouldPreventSearchFieldSubmit("Tab")).toBe(false);
    expect(shouldPreventSearchFieldSubmit("Escape")).toBe(false);
  });
});
