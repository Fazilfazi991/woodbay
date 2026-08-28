"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  submitVerificationRequest,
  type VerificationRequestState,
} from "../verification-request";

const initialState: VerificationRequestState = {};
const inputClass =
  "mt-1 min-h-11 w-full border border-[color:var(--border-dark)] bg-transparent px-3";

export function VerificationRequestForm() {
  const [state, action, pending] = useActionState(
    submitVerificationRequest,
    initialState,
  );
  if (state.ok)
    return (
      <div
        role="status"
        className="border border-[color:var(--border-gold)] p-8"
      >
        <h2 className="font-display text-4xl">Request received.</h2>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Woodbay will review the supplied product and purchase information.
        </p>
      </div>
    );
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label>
        Product Name
        <input required name="product_name" className={inputClass} />
      </label>
      <label>
        Product Code, if known
        <input name="product_code" className={inputClass} />
      </label>
      <label>
        Dealer Name
        <input required name="dealer_name" className={inputClass} />
      </label>
      <label>
        Customer Name
        <input required name="customer_name" className={inputClass} />
      </label>
      <label>
        Contact Number
        <input
          required
          name="contact_number"
          type="tel"
          className={inputClass}
        />
      </label>
      <label>
        Purchase Date
        <input name="purchase_date" type="date" className={inputClass} />
      </label>
      <label className="sm:col-span-2">
        Customer / Dealer Address
        <textarea
          required
          name="address"
          rows={3}
          className={`${inputClass} py-3`}
        />
      </label>
      <label className="sm:col-span-2">
        Voucher / Invoice Number
        <input
          required
          name="voucher_or_invoice_number"
          className={inputClass}
        />
      </label>
      <label className="sm:col-span-2">
        Additional Information
        <textarea
          name="additional_information"
          rows={4}
          className={`${inputClass} py-3`}
        />
      </label>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {state.error && (
        <p
          role="alert"
          className="text-sm font-medium text-red-700 sm:col-span-2"
        >
          {state.error}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button disabled={pending}>
          {pending ? "Submitting…" : "Submit verification request"}
        </Button>
      </div>
    </form>
  );
}
