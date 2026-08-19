import { describe, expect, it } from "vitest";
import {
  canRedeemVoucher,
  maskVoucherCode,
  parseVoucherPrefill,
  voucherCodeSchema,
  voucherRedemptionSchema,
  voucherResultMessage,
  voucherStatusSchema,
} from "./voucher";
describe("voucher status", () => {
  it("only allows available vouchers to be redeemed", () => {
    expect(canRedeemVoucher("available")).toBe(true);
    expect(canRedeemVoucher("redeemed")).toBe(false);
  });
  it("rejects unsupported statuses", () =>
    expect(() => voucherStatusSchema.parse("pending")).toThrow());
});
describe("voucher redemption validation", () => {
  it("normalizes a case-insensitive code", () =>
    expect(voucherCodeSchema.parse(" wbqa-0001 ")).toBe("WBQA-0001"));
  it("rejects malformed and long codes", () => {
    expect(voucherCodeSchema.safeParse("WB 123").success).toBe(false);
    expect(voucherCodeSchema.safeParse("W".repeat(33)).success).toBe(false);
  });
  it("requires the required customer details while permitting no distributor", () => {
    const result = voucherRedemptionSchema.parse({
      code: "wbqa0001",
      customer_name: "Test Customer",
      phone: "+91 90000 00000",
      location: "Kochi",
      district: "Ernakulam",
      dealer_name: "QA Dealer",
      distributor_name: "",
    });
    expect(result.code).toBe("WBQA0001");
    expect(result.distributor_name).toBeNull();
  });
});
describe("safe public voucher helpers", () => {
  it("masks codes and parses only a safe QR prefill", () => {
    expect(maskVoucherCode("WBQA0001")).toBe("WB•••001");
    expect(parseVoucherPrefill(" wbqa0001 ")).toBe("WBQA0001");
    expect(parseVoucherPrefill(["WBQA0001", "WBQA0002"])).toBe("");
  });
  it("maps internal result states to safe messages", () => {
    expect(voucherResultMessage("invalid")).toMatch(/Invalid voucher code/);
    expect(voucherResultMessage("already_redeemed")).not.toMatch(/customer/i);
    expect(voucherResultMessage("disabled")).toMatch(/contact Woodbay support/);
  });
});
