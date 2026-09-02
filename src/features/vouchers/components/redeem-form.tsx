"use client";
import Link from "next/link";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redeemVoucher } from "../actions/redeem";
import type { VoucherOption } from "../options";
import { SearchableVoucherField } from "./searchable-voucher-field";
const initialState = { ok: false, result: null, message: "" };
export function isSearchFieldImplicitSubmit(submitter: HTMLElement | null, activeElement: Element | null) {
  return !submitter && Boolean(activeElement?.matches("input[list]"));
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[color:var(--foreground-dark)]">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function RedeemForm({ initialCode, products, dealers }: { initialCode: string; products: VoucherOption[]; dealers: VoucherOption[] }) {
  const [state, action, pending] = useActionState(redeemVoucher, initialState);
  const [startedAt] = useState(() => Date.now());
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  if (state.ok)
    return (
      <div
        className="border border-[color:var(--gold)] bg-[#fbf8f0] p-7 sm:p-10"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2
          size={36}
          className="text-[color:var(--gold)]"
          aria-hidden="true"
        />
        <p className="mt-6 text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
          Verified Woodbay Product Code
        </p>
        <h2 className="font-display mt-3 text-4xl text-[color:var(--foreground-dark)]">
          Voucher successfully redeemed.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted-dark)]">
          Your voucher {state.maskedCode} has been registered successfully. Keep these details for future support.
        </p>
        {state.product && (
          <div className="mt-7 border-t border-[#d7cebf] pt-5">
            <p className="text-xs font-bold tracking-[.12em] text-[color:var(--muted-dark)] uppercase">
              Product
            </p>
            <Link
              href={`/products/${state.product.slug}`}
              className="mt-2 inline-block font-semibold text-[color:var(--foreground-dark)] underline decoration-[color:var(--gold)] underline-offset-4"
            >
              {state.product.name}
            </Link>
          </div>
        )}
        {state.dealer && <div className="mt-5"><p className="text-xs font-bold tracking-[.12em] text-[color:var(--muted-dark)] uppercase">Dealer</p><p className="mt-2 font-semibold">{state.dealer.name}</p></div>}
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/"><Button>Back to home</Button></Link><Link href="/products"><Button variant="light">Explore products</Button></Link></div>
      </div>
    );
  return (
    <form
      action={action}
      className="grid gap-5"
      noValidate
      onSubmit={(event) => {
        const submitEvent = event.nativeEvent as SubmitEvent;
        const activeElement = event.currentTarget.ownerDocument.activeElement;

        if (isSearchFieldImplicitSubmit(submitEvent.submitter, activeElement)) {
          event.preventDefault();
        }
      }}
    >
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      <input type="hidden" name="started_at" value={startedAt} />
      <Field label="Voucher Code">
        <Input
          required
          name="code"
          defaultValue={initialCode}
          maxLength={32}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
        />
      </Field>
      <SearchableVoucherField label="Dealer" name="dealer_slug" options={dealers} placeholder="Search by dealer or location" />
      <SearchableVoucherField label="Product" name="product_slug" options={products} placeholder="Search by product or category" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Customer Name">
          <Input required name="customer_name" autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
        </Field>
        <Field label="Contact Number">
          <Input required name="phone" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </Field>
      </div>
      <Field label="Address / Location"><textarea required name="address" maxLength={240} autoComplete="street-address" rows={3} value={address} onChange={(event) => setAddress(event.target.value)} className="w-full resize-y rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-base focus:outline-2 focus:outline-[color:var(--primary)]" /></Field>
      {state.message && (
        <p
          role="alert"
          aria-live="assertive"
          className="flex gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900"
        >
          <ShieldAlert
            size={18}
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Registering…" : "Register voucher"}
      </Button>
    </form>
  );
}
