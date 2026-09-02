"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactEnquiry } from "./actions";

export function ContactEnquiryForm({
  subject = "General enquiry",
  message = "",
}: {
  subject?: string;
  message?: string;
}) {
  const [state, action, pending] = useActionState(submitContactEnquiry, {
    ok: false,
    message: "",
  });
  const [startedAt] = useState(() => Date.now());
  return (
    <form
      action={action}
      className="grid gap-5 bg-[#24251f] p-6 text-[color:var(--foreground-light)] sm:p-8"
    >
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      <input type="hidden" name="started_at" value={startedAt} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          <span>Name</span>
          <Input required name="name" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          <span>Phone</span>
          <Input required name="phone" inputMode="tel" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          <span>
            Email{" "}
            <span className="font-normal text-[color:var(--muted)]">
              (optional)
            </span>
          </span>
          <Input name="email" type="email" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          <span>Subject</span>
          <Input required name="subject" defaultValue={subject.slice(0, 160)} />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        <span>Enquiry</span>
        <Textarea
          required
          name="message"
          rows={message ? 12 : 5}
          defaultValue={message.slice(0, 5000)}
        />
      </label>
      {state.message && (
        <p
          role="status"
          className={state.ok ? "text-green-300" : "text-red-300"}
        >
          {state.message}
        </p>
      )}
      <Button type="submit" variant="gold" disabled={pending}>
        {pending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
