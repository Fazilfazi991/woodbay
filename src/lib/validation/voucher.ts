import { z } from "zod";
export const voucherStatusSchema = z.enum(["available", "redeemed", "disabled"]);
export type VoucherStatus = z.infer<typeof voucherStatusSchema>;
export function canRedeemVoucher(status: VoucherStatus) { return status === "available"; }
