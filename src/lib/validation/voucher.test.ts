import { describe, expect, it } from "vitest";
import { canRedeemVoucher, voucherStatusSchema } from "./voucher";
describe("voucher status", () => { it("only allows available vouchers to be redeemed", () => { expect(canRedeemVoucher("available")).toBe(true); expect(canRedeemVoucher("redeemed")).toBe(false); }); it("rejects unsupported statuses", () => expect(() => voucherStatusSchema.parse("pending")).toThrow()); });
