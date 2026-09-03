"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { globalSearchResultsPath } from "../data/search";

type Results = {
  products: Array<{
    name: string;
    code: string | null;
    category: string;
    href: string;
    image: string | null;
    alt: string;
  }>;
  categories: Array<{ name: string; href: string }>;
  total: number;
  error?: string;
};

const emptyResults: Results = { products: [], categories: [], total: 0 };

export function GlobalSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>(emptyResults);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      window.clearTimeout(timer);
      returnFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/catalogue-search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as Results;
        setResults(
          response.ok
            ? payload
            : {
                ...emptyResults,
                error: payload.error ?? "Search is temporarily unavailable.",
              },
        );
      } catch (error) {
        if ((error as Error).name !== "AbortError")
          setResults({
            ...emptyResults,
            error: "Search is temporarily unavailable.",
          });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes =
        dialogRef.current.querySelectorAll<HTMLElement>("a,button,input");
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open, onClose]);

  if (!open) return null;
  const trimmed = query.trim();
  const closeAndReset = () => {
    setQuery("");
    setResults(emptyResults);
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-[90] overflow-y-auto bg-black/75 p-0 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAndReset();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-search-title"
        className="mx-auto min-h-[100dvh] w-full bg-[#11120f] px-5 py-5 text-[#f7f3eb] shadow-2xl sm:mt-10 sm:min-h-0 sm:max-w-3xl sm:border sm:border-[color:var(--border-gold)] sm:px-8 sm:py-7"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-[color:var(--gold)] uppercase">
              Woodbay catalogue
            </p>
            <h2 id="global-search-title" className="font-display mt-1 text-3xl">
              Search products
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeAndReset}
            className="grid min-h-11 min-w-11 place-items-center border border-white/20 text-[color:var(--gold)] hover:border-[color:var(--gold)]"
          >
            <X size={22} />
          </button>
        </div>
        <label className="relative mt-6 block">
          <span className="sr-only">
            Search products, categories and product codes
          </span>
          <Search
            className="absolute top-1/2 left-4 -translate-y-1/2 text-[color:var(--gold)]"
            size={20}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (value.trim().length < 2) {
                setResults(emptyResults);
                setLoading(false);
              }
            }}
            placeholder="Search products, categories, codes…"
            autoComplete="off"
            className="min-h-14 w-full border border-white/25 bg-transparent pr-14 pl-12 text-base outline-none placeholder:text-[#8d8b83] focus:border-[color:var(--gold)]"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 grid min-h-11 min-w-11 -translate-y-1/2 place-items-center text-[#d6d0c7]"
            >
              <X size={18} />
            </button>
          )}
        </label>
        <div aria-live="polite" aria-busy={loading} className="mt-5">
          {trimmed.length < 2 && (
            <p className="text-sm text-[#aaa69d]">
              Enter at least two characters to search the full catalogue.
            </p>
          )}
          {loading && (
            <p className="text-sm text-[#aaa69d]">Searching catalogue…</p>
          )}
          {results.error && (
            <p className="text-sm text-red-300">{results.error}</p>
          )}
          {!loading &&
            trimmed.length >= 2 &&
            !results.error &&
            results.total === 0 &&
            results.categories.length === 0 && (
              <p className="border border-white/15 px-4 py-6 text-sm text-[#aaa69d]">
                No matching products or categories.
              </p>
            )}
          {results.categories.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {results.categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    onClick={closeAndReset}
                    className="border border-white/20 px-3 py-2 text-sm hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {results.products.length > 0 && (
            <div className="mt-5 border-t border-white/15">
              <p className="py-3 text-xs font-bold tracking-[.16em] text-[color:var(--gold)] uppercase">
                Products
              </p>
              {results.products.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  onClick={closeAndReset}
                  className="grid grid-cols-[3.75rem_1fr] gap-3 border-t border-white/10 py-3 hover:text-[color:var(--gold)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-white/5">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-center text-xs text-[#aaa69d]">
                        Image soon
                      </span>
                    )}
                  </div>
                  <div className="self-center">
                    <p className="font-display text-xl leading-tight">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-[#aaa69d]">
                      {product.category}
                      {product.code ? ` · ${product.code}` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {results.total > 0 && (
            <Link
              href={globalSearchResultsPath(trimmed)}
              onClick={closeAndReset}
              className="mt-6 flex min-h-12 items-center justify-center border border-[color:var(--gold)] px-5 text-xs font-bold tracking-[.14em] text-[color:var(--gold)] uppercase hover:bg-[color:var(--gold)] hover:text-[#11120f]"
            >
              View all {results.total} results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
