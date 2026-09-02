"use client";

import { useId, useState } from "react";
import type { VoucherOption } from "../options";

export function SearchableVoucherField({
  label,
  name,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  options: VoucherOption[];
  placeholder: string;
}) {
  const listId = useId();
  const [value, setValue] = useState("");
  const selected = options.find((option) => option.label === value);
  return (
    <label className="grid gap-2 text-sm font-semibold text-[color:var(--foreground-dark)]">
      <span>{label}</span>
      <input
        required
        list={listId}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-12 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-base focus:outline-2 focus:outline-[color:var(--primary)]"
      />
      <input type="hidden" name={name} value={selected?.slug ?? ""} />
      <datalist id={listId}>
        {options.map((option) => <option key={option.id} value={option.label} />)}
      </datalist>
      <span className="text-xs font-normal text-[color:var(--muted-dark)]">Type to search, then choose a listed option.</span>
    </label>
  );
}
