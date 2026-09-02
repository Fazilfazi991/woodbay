import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, ExternalLink } from "lucide-react";
import { getActiveAdmin } from "@/lib/auth/admin";
import { getVoucherDetail } from "@/features/vouchers/admin";
import { voucherRedemptionUrl } from "@/features/vouchers/qr";

const dateTime = (value: string | null) => value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
const related = <T,>(value: T | T[] | null): T | null => Array.isArray(value) ? (value[0] ?? null) : value;
type Product = { name: string; slug: string };
type Dealer = { business_name: string; slug: string };
type Redemption = { customer_name: string; phone: string; location: string; dealer_name: string; redeemed_at: string; products: Product | Product[] | null; dealers: Dealer | Dealer[] | null };
type Detail = { code: string; status: string; created_at: string; expires_at: string | null; products: Product | Product[] | null; dealers: Dealer | Dealer[] | null; voucher_redemptions: Redemption | Redemption[] | null };
type Audit = { action: string; created_at: string };

export default async function VoucherDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const { id } = await params;
  const { voucher, audits } = await getVoucherDetail(id);
  const v = voucher as unknown as Detail;
  const redemption = related(v.voucher_redemptions);
  const product = related(v.products) ?? related(redemption?.products ?? null);
  const dealer = related(v.dealers) ?? related(redemption?.dealers ?? null);
  const publicUrl = voucherRedemptionUrl(v.code);
  const status = v.status === "available" && v.expires_at && new Date(v.expires_at) < new Date() ? "Expired" : `${v.status[0].toUpperCase()}${v.status.slice(1)}`;
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <Link href="/admin/vouchers" className="text-sm text-[color:var(--muted-dark)] underline underline-offset-4">← Back to vouchers</Link>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--border)] pb-6"><div className="min-w-0"><h1 className="break-all font-mono text-2xl sm:text-3xl">{v.code}</h1><p className="mt-2 text-sm text-[color:var(--muted-dark)]">{status} · created {dateTime(v.created_at)}</p></div><a href={publicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[color:var(--gold)]">Open public link <ExternalLink size={16} /></a></div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <section><h2 className="text-xl font-semibold">Voucher assignment</h2><dl className="mt-5 grid gap-5 sm:grid-cols-2"><Item label="Status" value={status} /><Item label="Product" value={product?.name ?? "Selected at registration"} /><Item label="Dealer" value={dealer?.business_name ?? redemption?.dealer_name ?? "Selected at registration"} /><Item label="Expiry" value={dateTime(v.expires_at)} /></dl></section>
          <section><h2 className="text-xl font-semibold">Customer registration</h2>{redemption ? <dl className="mt-5 grid gap-5 sm:grid-cols-2"><Item label="Customer" value={redemption.customer_name} /><Item label="Phone" value={redemption.phone} /><Item label="Address / location" value={redemption.location} wide /><Item label="Registered" value={dateTime(redemption.redeemed_at)} /></dl> : <p className="mt-4 text-sm text-[color:var(--muted-dark)]">This voucher has not been registered.</p>}</section>
          <section><h2 className="text-xl font-semibold">Audit history</h2>{audits.length ? <ol className="mt-5 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)]">{(audits as unknown as Audit[]).map((audit) => <li key={`${audit.action}-${audit.created_at}`} className="flex flex-wrap justify-between gap-2 py-4 text-sm"><span>{audit.action.replaceAll("_", " ")}</span><time className="text-[color:var(--muted-dark)]">{dateTime(audit.created_at)}</time></li>)}</ol> : <p className="mt-4 text-sm text-[color:var(--muted-dark)]">No administrative events recorded.</p>}</section>
        </div>
        <aside className="h-fit border border-[color:var(--border)] bg-white p-5"><h2 className="text-lg font-semibold">Registration QR</h2><p className="mt-2 text-sm leading-6 text-[color:var(--muted-dark)]">Print this QR on the matching voucher. It opens the canonical registration URL with the code filled in.</p><div className="mt-5 bg-white p-2"><Image src={`/admin/vouchers/${id}/qr`} width={768} height={768} unoptimized loading="eager" alt={`QR code for voucher ${v.code}`} className="h-auto w-full" /></div><p className="mt-4 break-all font-mono text-xs leading-5 text-[color:var(--muted-dark)]">{publicUrl}</p><a href={`/admin/vouchers/${id}/qr?download=1`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-[color:var(--background-dark)] px-4 text-sm text-white"><Download size={16} /> Download print SVG</a></aside>
      </div>
    </main>
  );
}

function Item({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={wide ? "sm:col-span-2" : ""}><dt className="text-xs uppercase tracking-[.12em] text-[color:var(--muted-dark)]">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>;
}
