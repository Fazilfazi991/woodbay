"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { dealer } from "@/config/dealers";
import { submitDealerApplication } from "../actions/submit";
import { dealerBusinessTypes, dealerProductInterests } from "../validation/dealer";
import Link from "next/link";

const initialState = { ok: false, message: "" };

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[color:var(--foreground-light)]">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function DealerApplicationForm() {
  const [state, action, pending] = useActionState(
    submitDealerApplication,
    initialState,
  );
  const [startedAt] = useState(() => Date.now());
  const [submissionToken] = useState(() => crypto.randomUUID());

  if (state.ok) {
    return (
      <div className="border border-[color:var(--border-gold)] bg-[#171711] p-6 sm:p-9" role="status" aria-live="polite">
        <h3 className="font-display text-4xl">Application Received</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
          Thank you for your interest in becoming a WoodBay dealer. Our team will review your business details and contact you.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/"><Button>Back to Home</Button></Link>
          <Link href="/products"><Button variant="secondary">Explore Products</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-7" noValidate>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      <input type="hidden" name="started_at" value={startedAt} />
      <input type="hidden" name="submission_token" value={submissionToken} />
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">Contact Details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input required name="contact_person" autoComplete="name" />
          </Field>
          <Field label="Business / shop name">
            <Input required name="business_name" autoComplete="organization" />
          </Field>
          <Field label="Contact number">
            <Input required name="phone" inputMode="tel" autoComplete="tel" />
          </Field>
          <Field label="WhatsApp number (if different)">
            <Input name="whatsapp" inputMode="tel" autoComplete="tel" />
          </Field>
          <Field label="Email address">
            <Input name="email" type="email" autoComplete="email" />
          </Field>
        </div>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">Location</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="State">
            <select
              required
              name="state"
              defaultValue=""
              className="min-h-12 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-[color:var(--foreground-dark)] focus:outline-2 focus:outline-[color:var(--primary)]"
            >
              <option value="" disabled>
                Select state
              </option>
              {dealer.states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </Field>
          <Field label="District">
            <Input required name="district" />
          </Field>
          <Field label="City / town">
            <Input required name="location" />
          </Field>
          <Field label="Address">
            <Textarea name="address" rows={3} autoComplete="street-address" />
          </Field>
        </div>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">Business Details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business type">
            <select required name="business_type" defaultValue="" className="min-h-12 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-[color:var(--foreground-dark)] focus:outline-2 focus:outline-[color:var(--primary)]">
              <option value="" disabled>Select business type</option>
              {dealerBusinessTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </Field>
          <Field label="Years in business (optional)">
            <Input name="years_in_business" type="number" inputMode="numeric" min="0" max="150" />
          </Field>
          <Field label="Existing showroom / store">
            <select required name="has_showroom" defaultValue="" className="min-h-12 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-[color:var(--foreground-dark)] focus:outline-2 focus:outline-[color:var(--primary)]">
              <option value="" disabled>Select an option</option>
              <option value="yes">Yes</option><option value="no">No</option>
            </select>
          </Field>
          <Field label="Areas served">
            <Input required name="areas_served" placeholder="For example: Kochi, Ernakulam" />
          </Field>
        </div>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">Products You&apos;re Interested In</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {dealerProductInterests.map((interest) => (
            <label key={interest} className="flex min-h-12 items-center gap-3 border border-[color:var(--border-dark)] px-4 text-sm">
              <input type="checkbox" name="product_interests" value={interest} className="size-4 accent-[color:var(--gold)]" />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Additional information (optional)"><Textarea name="message" rows={4} /></Field>
      <label className="flex items-start gap-3 text-sm leading-6 text-[color:var(--muted)]">
        <input required type="checkbox" name="consent" className="mt-1 size-4 shrink-0 accent-[color:var(--gold)]" />
        <span>I agree that WoodBay may contact me about this dealership enquiry.</span>
      </label>
      {state.message && (
        <p
          role="status"
          className={state.ok ? "text-green-300" : "text-red-300"}
        >
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}
