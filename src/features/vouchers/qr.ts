import { siteConfig } from "@/config/site";

export function isProductionVoucherOriginSafe(value: string) {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    !["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
    (!url.hostname.endsWith(".vercel.app") || url.hostname === "woodbay.vercel.app") &&
    !url.hostname.endsWith(".supabase.co")
  );
}

export function voucherRedemptionUrl(code: string) {
  const url = new URL("/redeem", siteConfig.url);
  if (process.env.NODE_ENV === "production" && !isProductionVoucherOriginSafe(url.origin)) {
    throw new Error("Production voucher QR generation requires a canonical HTTPS site URL.");
  }
  url.searchParams.set("code", code);
  return url.toString();
}
