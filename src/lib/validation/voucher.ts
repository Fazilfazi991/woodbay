import { z } from "zod";
import { phoneSchema } from "@/lib/validation/common";

export const voucherStatusSchema = z.enum([
  "available",
  "redeemed",
  "disabled",
]);
export type VoucherStatus = z.infer<typeof voucherStatusSchema>;

export const voucherCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .min(4, "Enter a valid voucher code.")
  .max(32, "Enter a valid voucher code.")
  .regex(/^[A-Z0-9-]+$/, "Enter a valid voucher code.");
const requiredText = (label: string, max: number) =>
  z.string().trim().min(2, `Enter your ${label}.`).max(max);
export const voucherRedemptionSchema = z.object({
  code: voucherCodeSchema,
  customer_name: requiredText("name", 120),
  phone: phoneSchema,
  location: requiredText("location", 160),
  district: requiredText("district", 120),
  dealer_name: requiredText("dealer name", 160),
  distributor_name: z
    .string()
    .trim()
    .max(160, "Distributor name is too long.")
    .transform((value) => value || null),
});
export type VoucherRedemption = z.infer<typeof voucherRedemptionSchema>;
export type VoucherResult =
  | "success"
  | "invalid"
  | "already_redeemed"
  | "disabled"
  | "rate_limited"
  | "error";
export function canRedeemVoucher(status: VoucherStatus) {
  return status === "available";
}
export function maskVoucherCode(code: string) {
  const normalized = voucherCodeSchema.safeParse(code);
  if (!normalized.success) return "Voucher code";
  const value = normalized.data;
  return value.length <= 5
    ? `${value.slice(0, 1)}•••`
    : `${value.slice(0, 2)}•••${value.slice(-3)}`;
}
export function parseVoucherPrefill(value: string | string[] | undefined) {
  if (Array.isArray(value)) return "";
  const parsed = voucherCodeSchema.safeParse(value ?? "");
  return parsed.success ? parsed.data : "";
}
export function voucherResultMessage(result: VoucherResult) {
  switch (result) {
    case "invalid":
      return "Invalid voucher code. Please check the code and try again.";
    case "already_redeemed":
      return "This voucher has already been redeemed.";
    case "disabled":
      return "This voucher cannot currently be redeemed. Please contact Woodbay support.";
    case "rate_limited":
      return "Too many attempts. Please wait a while before trying again.";
    default:
      return "We could not verify this voucher right now. Please try again.";
  }
}
