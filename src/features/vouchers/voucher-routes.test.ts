import { describe, expect, it } from "vitest";
import { metadata } from "@/app/(public)/redeem/page";
import { parseVoucherPrefill } from "@/lib/validation/voucher";

describe("voucher route", () => {
  it("keeps the redemption page out of search indexing", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("supports a QR deep-link code only when it is valid", () => {
    expect(parseVoucherPrefill("WBQA0001")).toBe("WBQA0001");
    expect(parseVoucherPrefill("not a voucher")).toBe("");
  });
});
