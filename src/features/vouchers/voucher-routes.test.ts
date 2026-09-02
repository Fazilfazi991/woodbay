import { describe, expect, it } from "vitest";
import { metadata } from "@/app/(public)/redeem/page";
import { parseVoucherPrefill } from "@/lib/validation/voucher";
import { isProductionVoucherOriginSafe, voucherRedemptionUrl } from "./qr";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PNG } from "pngjs";

describe("voucher route", () => {
  it("keeps the redemption page out of search indexing", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("supports a QR deep-link code only when it is valid", () => {
    expect(parseVoucherPrefill("WBQA0001")).toBe("WBQA0001");
    expect(parseVoucherPrefill("not a voucher")).toBe("");
  });

  it("builds a canonical QR deep link", () => {
    const url = new URL(voucherRedemptionUrl("WB-ABC123"));
    expect(url.origin).toBe("https://woodbay.vercel.app");
    expect(url.pathname).toBe("/redeem");
    expect(url.searchParams.get("code")).toBe("WB-ABC123");
  });

  it("rejects local, preview, and raw Supabase QR origins", () => {
    expect(isProductionVoucherOriginSafe("https://woodbay.vercel.app")).toBe(true);
    expect(isProductionVoucherOriginSafe("http://localhost:3000")).toBe(false);
    expect(isProductionVoucherOriginSafe("https://woodbay-preview.vercel.app")).toBe(false);
    expect(isProductionVoucherOriginSafe("https://project.supabase.co")).toBe(false);
  });

  it("round-trips a printed-style QR into the redeem URL", async () => {
    const expected = voucherRedemptionUrl("WB-SCAN123");
    const image = await QRCode.toBuffer(expected, { errorCorrectionLevel: "H", margin: 4, width: 768 });
    const png = PNG.sync.read(image);
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    expect(decoded?.data).toBe(expected);
    expect(new URL(decoded!.data).searchParams.get("code")).toBe("WB-SCAN123");
  });
});
