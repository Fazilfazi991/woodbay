import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveAdmin } from "@/lib/auth/admin";
import { listVouchers } from "@/features/vouchers/admin";
import { VoucherDashboard } from "@/features/vouchers/components/voucher-dashboard";
export default async function VouchersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const p = await searchParams;
  const data = await listVouchers(p);
  const exportUrl = `/admin/vouchers/export?q=${encodeURIComponent(p.q ?? "")}&status=${encodeURIComponent(p.status ?? "all")}`;
  return (
    <VoucherDashboard data={data} search={p.q ?? ""} status={p.status ?? "all"} exportUrl={exportUrl} />
  );
}
