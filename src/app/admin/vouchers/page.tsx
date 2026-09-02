import { redirect } from "next/navigation";
import { getActiveAdmin } from "@/lib/auth/admin";
import { listVouchers } from "@/features/vouchers/admin";
import { VoucherDashboard } from "@/features/vouchers/components/voucher-dashboard";
import { getVoucherOptions } from "@/features/vouchers/options";
export default async function VouchersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const p = await searchParams;
  const [data, options] = await Promise.all([listVouchers(p), getVoucherOptions()]);
  const exportUrl = `/admin/vouchers/export?q=${encodeURIComponent(p.q ?? "")}&status=${encodeURIComponent(p.status ?? "all")}&product=${encodeURIComponent(p.product ?? "")}&dealer=${encodeURIComponent(p.dealer ?? "")}`;
  return (
    <VoucherDashboard data={data} search={p.q ?? ""} status={p.status ?? "all"} productFilter={p.product ?? ""} dealerFilter={p.dealer ?? ""} exportUrl={exportUrl} {...options} />
  );
}
