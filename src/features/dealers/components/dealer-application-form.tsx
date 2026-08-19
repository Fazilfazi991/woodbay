"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { dealer } from "@/config/dealers";
import { submitDealerApplication } from "../actions/submit";

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

  return (
    <form action={action} className="grid gap-7" noValidate>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      <input type="hidden" name="started_at" value={startedAt} />
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">Business</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business name">
            <Input required name="business_name" autoComplete="organization" />
          </Field>
          <Field label="Contact person">
            <Input required name="contact_person" autoComplete="name" />
          </Field>
        </div>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <Input required name="phone" inputMode="tel" autoComplete="tel" />
          </Field>
          <Field label="Email">
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
              className="min-h-11 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-[color:var(--foreground-dark)] focus:outline-2 focus:outline-[color:var(--primary)]"
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
          <Field label="Location / area">
            <Input required name="location" />
          </Field>
          <Field label="Full address">
            <Input name="address" autoComplete="street-address" />
          </Field>
        </div>
      </fieldset>
      <Field label="Tell us briefly about your business">
        <Textarea name="message" rows={4} />
      </Field>
      {state.message && (
        <p
          role="status"
          className={state.ok ? "text-green-300" : "text-red-300"}
        >
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Apply to become a dealer"}
      </Button>
    </form>
  );
}
