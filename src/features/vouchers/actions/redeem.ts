"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import {
  maskVoucherCode,
  voucherRedemptionSchema,
  voucherResultMessage,
  type VoucherResult,
} from "@/lib/validation/voucher";
import { createAdminClient } from "@/lib/supabase/admin";
type RedemptionState = {
  ok: boolean;
  result: VoucherResult | null;
  message: string;
  maskedCode?: string;
  product?: { name: string; slug: string };
};
function isSafeSubmission(formData: FormData) {
  return (
    formData.get("website") === "" &&
    Number(formData.get("started_at") ?? 0) < Date.now() - 800
  );
}
async function rateLimitKey() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0];
  const address =
    forwarded?.trim() || requestHeaders.get("x-real-ip") || "unknown";
  return createHash("sha256").update(address).digest("hex");
}
export async function redeemVoucher(
  _: RedemptionState,
  formData: FormData,
): Promise<RedemptionState> {
  if (!isSafeSubmission(formData))
    return {
      ok: false,
      result: "error",
      message: "Please wait a moment and try again.",
    };
  const parsed = voucherRedemptionSchema.safeParse(
    Object.fromEntries(formData),
  );
  if (!parsed.success)
    return {
      ok: false,
      result: "error",
      message:
        parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("redeem_voucher", {
      p_code: parsed.data.code,
      p_customer_name: parsed.data.customer_name,
      p_phone: parsed.data.phone,
      p_location: parsed.data.location,
      p_district: parsed.data.district,
      p_dealer_name: parsed.data.dealer_name,
      p_distributor_name: parsed.data.distributor_name,
      p_rate_limit_key: await rateLimitKey(),
    });
    if (error || !data?.[0])
      return {
        ok: false,
        result: "error",
        message: voucherResultMessage("error"),
      };
    const row = data[0] as {
      result: VoucherResult;
      product_name: string | null;
      product_slug: string | null;
    };
    if (row.result !== "success")
      return {
        ok: false,
        result: row.result,
        message: voucherResultMessage(row.result),
      };
    return {
      ok: true,
      result: "success",
      message: "Voucher successfully redeemed.",
      maskedCode: maskVoucherCode(parsed.data.code),
      product:
        row.product_name && row.product_slug
          ? { name: row.product_name, slug: row.product_slug }
          : undefined,
    };
  } catch {
    return {
      ok: false,
      result: "error",
      message: voucherResultMessage("error"),
    };
  }
}
