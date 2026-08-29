"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CatalogueCategory } from "../types";

export function CategoryChips({
  categories,
  active,
  basePath,
}: {
  categories: CatalogueCategory[];
  active: string | null;
  basePath: string;
}) {
  const scroller = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = () => {
    const rail = scroller.current;
    if (!rail) return;
    setEdges({
      start: rail.scrollLeft <= 2,
      end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
    });
  };
  useEffect(() => {
    const rail = scroller.current;
    if (!rail) return;
    updateEdges();
    rail.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [categories]);
  const scroll = (direction: number) =>
    scroller.current?.scrollBy({
      left: direction * Math.max(220, scroller.current.clientWidth * 0.75),
      behavior: "smooth",
    });

  return (
    <div className="min-w-0 sm:grid sm:grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] sm:items-center sm:gap-2">
      <p className="mb-3 text-[10px] font-bold tracking-[.14em] text-[color:var(--gold)] uppercase sm:hidden">
        Browse categories
      </p>
      <button
        type="button"
        aria-label="Scroll product groups left"
        disabled={edges.start}
        onClick={() => scroll(-1)}
        className="hidden size-11 place-items-center border border-[color:var(--border-dark)] text-[color:var(--foreground-light)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:cursor-default disabled:opacity-30 sm:grid"
      >
        <ArrowLeft size={18} />
      </button>
      <nav
        ref={scroller}
        aria-label="Subcategories"
        className="category-chips-scroll flex min-w-0 touch-pan-x snap-x snap-mandatory gap-2 overflow-x-auto pr-5 pb-2"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={
              active === category.slug
                ? basePath
                : `${basePath}?subcategory=${category.slug}`
            }
            aria-current={active === category.slug ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 snap-start items-center border px-4 py-2.5 text-xs font-bold tracking-[.1em] uppercase ${active === category.slug ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--background-dark)]" : "border-[color:var(--border-dark)] text-[color:var(--foreground-light)] hover:border-[color:var(--gold)]"}`}
          >
            {category.name}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        aria-label="Scroll product groups right"
        disabled={edges.end}
        onClick={() => scroll(1)}
        className="hidden size-11 place-items-center border border-[color:var(--border-dark)] text-[color:var(--foreground-light)] hover:border-[color:var(--gold)] hover:text-[color:var(--gold)] disabled:cursor-default disabled:opacity-30 sm:grid"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
