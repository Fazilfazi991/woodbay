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
      className="relative z-[41] grid gap-3.5 border border-[color:var(--border-gold)] bg-[color:var(--surface-elevated)] p-5 text-[color:var(--foreground-dark)] lg:grid-cols-[1fr_1fr_1fr_1.2fr_auto] lg:items-end lg:gap-3"
    >
      <label className="grid gap-1 text-[10px] font-bold tracking-[.12em] text-[color:var(--muted-dark)] uppercase">
        State
        <select
          aria-label="State"
          value={searchParams.get("state") ?? ""}
          onChange={(event) => update("state", event.target.value)}
          className="dealer-locator-select min-h-11 border-b border-[color:var(--border-light)] bg-transparent text-sm tracking-normal text-[color:var(--foreground-dark)] normal-case outline-none focus:border-[color:var(--gold)]"
        >
          <option value="">All states</option>
          {options.states.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[10px] font-bold tracking-[.12em] text-[color:var(--muted-dark)] uppercase">
        District
        <select
          aria-label="District"
          value={searchParams.get("district") ?? ""}
          onChange={(event) => update("district", event.target.value)}
          className="dealer-locator-select min-h-11 border-b border-[color:var(--border-light)] bg-transparent text-sm tracking-normal text-[color:var(--foreground-dark)] normal-case outline-none focus:border-[color:var(--gold)]"
        >
          <option value="">All districts</option>
          {options.districts.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[10px] font-bold tracking-[.12em] text-[color:var(--muted-dark)] uppercase">
        Area
        <select
          aria-label="Area"
          value={searchParams.get("area") ?? ""}
          onChange={(event) => update("area", event.target.value)}
          className="dealer-locator-select min-h-11 border-b border-[color:var(--border-light)] bg-transparent text-sm tracking-normal text-[color:var(--foreground-dark)] normal-case outline-none focus:border-[color:var(--gold)]"
        >
          <option value="">All areas</option>
          {options.areas.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[10px] font-bold tracking-[.12em] text-[color:var(--muted-dark)] uppercase">
        Search
        <input
          aria-label="Search dealers"
          value={searchParams.get("q") ?? ""}
          onChange={(event) => update("q", event.target.value)}
          placeholder="Dealer or area"
          className="min-h-11 border-b border-[color:var(--border-light)] bg-transparent text-sm tracking-normal text-[color:var(--foreground-dark)] normal-case outline-none placeholder:text-[#79766e] focus:border-[color:var(--gold)]"
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
