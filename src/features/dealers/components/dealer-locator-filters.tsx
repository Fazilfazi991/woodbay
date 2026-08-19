"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Options = { states: string[]; districts: string[]; areas: string[] };

export function DealerLocatorFilters({ options }: { options: Options }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "state") {
      params.delete("district");
      params.delete("area");
    }
    if (key === "district") params.delete("area");
    router.push(`/dealers${params.size ? `?${params}` : ""}`);
  };
  const active = [...searchParams.keys()].some((key) =>
    ["state", "district", "area", "q"].includes(key),
  );
  return (
    <div
      id="dealer-locator"
      className="grid gap-3 border border-[color:var(--border-gold)] bg-[color:var(--surface-dark)] p-4 text-[color:var(--foreground-light)] lg:grid-cols-[1fr_1fr_1fr_1.2fr_auto]"
    >
      <label className="grid gap-1 text-xs font-bold tracking-[.1em] uppercase">
        State
        <select
          aria-label="State"
          value={searchParams.get("state") ?? ""}
          onChange={(event) => update("state", event.target.value)}
          className="min-h-11 bg-transparent text-sm tracking-normal normal-case"
        >
          <option value="">All states</option>
          {options.states.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-bold tracking-[.1em] uppercase">
        District
        <select
          aria-label="District"
          value={searchParams.get("district") ?? ""}
          onChange={(event) => update("district", event.target.value)}
          className="min-h-11 bg-transparent text-sm tracking-normal normal-case"
        >
          <option value="">All districts</option>
          {options.districts.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-bold tracking-[.1em] uppercase">
        Area
        <select
          aria-label="Area"
          value={searchParams.get("area") ?? ""}
          onChange={(event) => update("area", event.target.value)}
          className="min-h-11 bg-transparent text-sm tracking-normal normal-case"
        >
          <option value="">All areas</option>
          {options.areas.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-bold tracking-[.1em] uppercase">
        Search
        <input
          aria-label="Search dealers"
          value={searchParams.get("q") ?? ""}
          onChange={(event) => update("q", event.target.value)}
          placeholder="Dealer or area"
          className="min-h-11 border-b border-[color:var(--border-gold)] bg-transparent text-sm tracking-normal normal-case outline-none"
        />
      </label>
      {active && (
        <Button variant="secondary" onClick={() => router.push("/dealers")}>
          <X size={15} /> Clear
        </Button>
      )}
    </div>
  );
}
