"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CatalogueCategory } from "../types";

export function CategoryChips({ categories, active, basePath }: { categories: CatalogueCategory[]; active: string | null; basePath: string }) {
  const scroller = useRef<HTMLElement>(null);
  const scroll = (direction: number) => scroller.current?.scrollBy({ left: direction * 280, behavior: "smooth" });

  return <div className="flex items-center gap-2">
    <button type="button" aria-label="Scroll product groups left" onClick={() => scroll(-1)} className="grid size-10 shrink-0 place-items-center border border-[color:var(--border-dark)] text-[color:var(--foreground-light)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"><ArrowLeft size={18} /></button>
    <nav ref={scroller} aria-label="Subcategories" className="category-chips-scroll -mx-1 flex min-w-0 snap-x gap-2 overflow-x-auto px-1 pb-2">{categories.map((category) => <Link key={category.id} href={active === category.slug ? basePath : `${basePath}?subcategory=${category.slug}`} aria-current={active === category.slug ? "page" : undefined} className={`min-h-11 shrink-0 snap-start border px-4 py-3 text-xs font-bold uppercase tracking-[.1em] ${active === category.slug ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--background-dark)]" : "border-[color:var(--border-dark)] text-[color:var(--foreground-light)] hover:border-[color:var(--gold)]"}`}>{category.name}</Link>)}</nav>
    <button type="button" aria-label="Scroll product groups right" onClick={() => scroll(1)} className="grid size-10 shrink-0 place-items-center border border-[color:var(--border-dark)] text-[color:var(--foreground-light)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"><ArrowRight size={18} /></button>
  </div>;
}
