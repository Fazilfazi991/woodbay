"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  disableVoucher,
  generateVouchers,
  type GenerationActionState,
  type VoucherRow,
} from "@/features/vouchers/admin";
import { effectiveVoucherStatus } from "@/features/vouchers/admin-utils";
import type { VoucherOption } from "@/features/vouchers/options";

type Props = {
  data: { rows: VoucherRow[]; count: number; filters: { page: number } };
  search: string;
  status: string;
  exportUrl: string;
  products: VoucherOption[];
  dealers: VoucherOption[];
  productFilter: string;
  dealerFilter: string;
};

const initialGenerationState: GenerationActionState = {};

function statusLabel(voucher: VoucherRow) {
  const status = effectiveVoucherStatus(voucher.status, voucher.expiresAt);
  return status === "available" ? "Active" : status[0].toUpperCase() + status.slice(1);
}

function dateLabel(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

function CopyCode({ code, label = "Copy" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="text-sm text-[color:var(--gold)] hover:text-[color:var(--gold-hover)]"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function VoucherActions({ voucher }: { voucher: VoucherRow }) {
  const effectiveStatus = effectiveVoucherStatus(voucher.status, voucher.expiresAt);
  return (
    <div className="flex items-center gap-3 whitespace-nowrap text-sm">
      <Link className="text-[color:var(--gold)] hover:text-[color:var(--gold-hover)]" href={`/admin/vouchers/${voucher.id}`}>
        View
      </Link>
      {effectiveStatus === "available" && <CopyCode code={voucher.code} />}
      {effectiveStatus === "available" && (
        <form action={disableVoucher} onSubmit={(event) => { if (!window.confirm("Disable this voucher? This cannot be undone.")) event.preventDefault(); }}>
          <input type="hidden" name="id" value={voucher.id} />
          <button className="text-sm text-[color:var(--muted)] hover:text-[color:var(--foreground-dark)]" type="submit">Disable</button>
        </form>
      )}
    </div>
  );
}

function CreateVoucherModal({ onClose, products, dealers }: { onClose: () => void; products: VoucherOption[]; dealers: VoucherOption[] }) {
  const [state, formAction, pending] = useActionState(generateVouchers, initialGenerationState);
  const [idempotency] = useState(() => crypto.randomUUID());

  return (
    <div className="fixed inset-0 z-[1000] isolate grid place-items-center bg-black/70 p-4" role="presentation">
      <section aria-modal="true" aria-labelledby="create-voucher-title" className="relative z-[1001] w-full max-w-md rounded-[3px] border border-[color:var(--gold)] bg-[#f5f1e8] p-6 shadow-2xl" role="dialog">
        {state.codes ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[.14em] text-[color:var(--gold)]">Voucher created</p>
              <h2 id="create-voucher-title" className="mt-2 text-2xl font-semibold">
                {state.quantity === 1 ? "Your voucher is ready" : `${state.quantity} vouchers created successfully`}
              </h2>
            </div>
            {state.quantity === 1 ? <p className="font-mono text-xl">{state.codes[0]}</p> : <p className="text-sm text-[color:var(--muted)]">Your new vouchers are now in the inventory and ready to export.</p>}
            <div className="flex flex-wrap gap-3">
              {state.quantity === 1 && <CopyCode code={state.codes[0]} label="Copy code" />}
              {state.quantity === 1 && state.voucherId ? <Link className="woodbay-button group inline-flex min-h-12 items-center justify-center rounded-[3px] border border-[color:var(--gold)] bg-[color:var(--gold)] px-6 py-3 text-[11px] font-medium uppercase tracking-[.14em] text-[color:var(--background-dark)] transition-colors duration-250 hover:bg-[color:var(--background-dark)] hover:text-[color:var(--gold)]" href={`/admin/vouchers/${state.voucherId}`}>View voucher</Link> : <Button type="button" onClick={onClose}>View vouchers</Button>}
            </div>
          </div>
        ) : (
          <form action={formAction} className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[.14em] text-[color:var(--gold)]">New voucher</p>
                <h2 id="create-voucher-title" className="mt-2 text-2xl font-semibold">Create voucher</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Close create voucher" className="text-2xl leading-none text-[color:var(--muted)]">×</button>
            </div>
            <label className="block text-sm">
              <span className="mb-2 block">Quantity</span>
              <input name="quantity" type="number" min="1" max="100" defaultValue="1" required className="min-h-11 w-full border border-[color:var(--border-dark)] bg-transparent px-3" />
              <span className="mt-1 block text-xs text-[color:var(--muted)]">Up to 100 vouchers at a time.</span>
            </label>
            <label className="block text-sm"><span className="mb-2 block">Product <span className="text-[color:var(--muted)]">(optional assignment)</span></span><select name="product_id" className="min-h-11 w-full border border-[color:var(--border-dark)] bg-transparent px-3"><option value="">Customer selects at registration</option>{products.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label className="block text-sm"><span className="mb-2 block">Dealer <span className="text-[color:var(--muted)]">(optional assignment)</span></span><select name="dealer_id" className="min-h-11 w-full border border-[color:var(--border-dark)] bg-transparent px-3"><option value="">Customer selects at registration</option>{dealers.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label className="block text-sm">
              <span className="mb-2 block">Expiry date <span className="text-[color:var(--muted)]">(optional)</span></span>
              <input name="expiry" type="date" className="min-h-11 w-full border border-[color:var(--border-dark)] bg-transparent px-3" />
            </label>
            <input type="hidden" name="idempotency" value={idempotency} />
            {state.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="light" onClick={onClose}>Cancel</Button>
              <Button disabled={pending}>{pending ? "Generating…" : "Generate voucher"}</Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

export function VoucherDashboard({ data, search, status, productFilter, dealerFilter, exportUrl, products, dealers }: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const query = (page: number) => `?q=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&product=${encodeURIComponent(productFilter)}&dealer=${encodeURIComponent(dealerFilter)}&page=${page}`;
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Vouchers</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Create and manage one-time WoodBay vouchers.</p>
        </div>
        <div className="flex items-center gap-3">
          <a className="text-sm text-[color:var(--muted)] underline underline-offset-4 hover:text-[color:var(--foreground-dark)]" href={exportUrl}>Export CSV</a>
          <Button onClick={() => setCreateOpen(true)}>+ Create voucher</Button>
        </div>
      </div>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input name="q" placeholder="Search voucher code" defaultValue={search} className="min-h-11 flex-1 border border-[color:var(--border-dark)] bg-transparent px-3" />
        <select name="status" defaultValue={status} className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3 sm:w-44">
          <option value="all">All</option>
          <option value="available">Active</option>
          <option value="redeemed">Redeemed</option>
          <option value="disabled">Disabled</option>
          <option value="expired">Expired</option>
        </select>
        <select name="product" defaultValue={productFilter} aria-label="Filter by product" className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3 sm:max-w-52"><option value="">All products</option>{products.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <select name="dealer" defaultValue={dealerFilter} aria-label="Filter by dealer" className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3 sm:max-w-52"><option value="">All dealers</option>{dealers.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
        <Button type="submit" variant="light">Search</Button>
      </form>

      <div className="mt-8 space-y-3 md:hidden">
        {data.rows.map((voucher) => (
          <article key={voucher.id} className="border border-[color:var(--border-dark)] p-4">
            <div className="flex items-start justify-between gap-3">
              <b className="font-mono text-base">{voucher.code}</b>
              <span className="text-sm text-[color:var(--gold)]">{statusLabel(voucher)}</span>
            </div>
            <p className="mt-3 text-sm text-[color:var(--muted)]">Created {dateLabel(voucher.createdAt)}</p>
            <p className="mt-2 text-sm">{voucher.product?.name ?? "Unassigned product"} · {voucher.dealer?.businessName ?? "Unassigned dealer"}</p>
            {voucher.customerName && <p className="mt-1 text-sm text-[color:var(--muted)]">Registered to {voucher.customerName}</p>}
            <p className="text-sm text-[color:var(--muted)]">Expires {dateLabel(voucher.expiresAt)}</p>
            <div className="mt-4"><VoucherActions voucher={voucher} /></div>
          </article>
        ))}
        {data.rows.length === 0 && <p className="py-12 text-center text-sm text-[color:var(--muted)]">No vouchers found.</p>}
      </div>

      <div className="mt-8 hidden md:block">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-[color:var(--border-dark)] text-xs uppercase tracking-[.12em] text-[color:var(--muted)]"><th className="py-3">Code</th><th className="py-3">Status</th><th className="py-3">Product</th><th className="py-3">Dealer / registration</th><th className="py-3">Created</th><th className="py-3">Redeemed</th><th className="py-3">Action</th></tr></thead>
          <tbody>
            {data.rows.map((voucher) => <tr key={voucher.id} className="border-b border-[color:var(--border-dark)] align-top"><td className="py-4 font-mono"><Link href={`/admin/vouchers/${voucher.id}`}>{voucher.code}</Link></td><td className="py-4">{statusLabel(voucher)}</td><td className="max-w-40 py-4">{voucher.product?.name ?? "—"}</td><td className="max-w-48 py-4"><span className="block">{voucher.dealer?.businessName ?? "—"}</span>{voucher.customerName && <span className="mt-1 block text-xs text-[color:var(--muted)]">{voucher.customerName}</span>}</td><td className="py-4">{dateLabel(voucher.createdAt)}</td><td className="py-4">{dateLabel(voucher.redeemedAt)}</td><td className="py-4"><VoucherActions voucher={voucher} /></td></tr>)}
          </tbody>
        </table>
        {data.rows.length === 0 && <p className="py-12 text-center text-sm text-[color:var(--muted)]">No vouchers found.</p>}
      </div>

      {data.count > 20 && <nav className="mt-6 flex items-center justify-between text-sm"><Link href={query(Math.max(1, data.filters.page - 1))} aria-disabled={data.filters.page === 1} className="text-[color:var(--gold)] aria-disabled:pointer-events-none aria-disabled:opacity-40">Previous</Link><span className="text-[color:var(--muted)]">Page {data.filters.page}</span><Link href={query(data.filters.page + 1)} className="text-[color:var(--gold)]">Next</Link></nav>}
      {createOpen && <CreateVoucherModal onClose={() => setCreateOpen(false)} products={products} dealers={dealers} />}
    </main>
  );
}
