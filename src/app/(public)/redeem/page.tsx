import type { Metadata } from "next";
import { RedeemPage } from "@/features/vouchers/components/redeem-page";
import { parseVoucherPrefill } from "@/lib/validation/voucher";
import { getVoucherOptions } from "@/features/vouchers/options";
export const metadata: Metadata = {
  title: "Verify Your Woodbay Voucher",
  description:
    "Verify and redeem the voucher code supplied with your Woodbay product.",
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string | string[] }>;
}) {
  const params = await searchParams;
  const options = await getVoucherOptions();
  return <RedeemPage initialCode={parseVoucherPrefill(params.code)} {...options} />;
}
