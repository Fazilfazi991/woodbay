"use client";
import Link from "next/link";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redeemVoucher } from "../actions/redeem";
const initialState = { ok: false, result: null, message: "" };
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
export function RedeemForm({ initialCode }: { initialCode: string }) {
  const [state, action, pending] = useActionState(redeemVoucher, initialState);
  const [startedAt] = useState(() => Date.now());
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
          Your voucher {state.maskedCode} has been recorded. Keep your product
          details for future support.
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
        <Link href="/redeem" className="mt-8 inline-block">
          <Button variant="light">Verify another voucher</Button>
        </Link>
      </div>
    );
  return (
    <form action={action} className="grid gap-5" noValidate>
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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Customer Name">
          <Input required name="customer_name" autoComplete="name" />
        </Field>
        <Field label="Contact Number">
          <Input required name="phone" inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="Location">
          <Input required name="location" autoComplete="address-level3" />
        </Field>
        <Field label="District">
          <Input required name="district" autoComplete="address-level2" />
        </Field>
      </div>
      <Field label="Dealer Name">
        <Input required name="dealer_name" autoComplete="organization" />
      </Field>
      <Field label="Distributor Name (Optional)">
        <Input name="distributor_name" autoComplete="organization" />
      </Field>
      {state.message && (
        <p
          role="alert"
          aria-live="assertive"
          className="flex gap-2 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900"
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
        {pending ? "Verifying…" : "Verify & redeem voucher"}
      </Button>
    </form>
  );
}
